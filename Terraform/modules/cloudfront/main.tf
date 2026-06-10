# ─────────────────────────────────────────────────────────────────
#  modules/cloudfront/main.tf
#
#  Single CloudFront distribution with TWO origins:
#    1. S3  → serves frontend (default /*)
#    2. EC2 → serves backend API (/weather*, /searches*, /health*)
# ─────────────────────────────────────────────────────────────────

resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC for SkyWatch frontend S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"
  comment             = "SkyWatch - frontend (S3) + backend (EC2)"

  # ── Origin 1: S3 Frontend ──────────────────────────────────────
  origin {
    domain_name              = var.s3_bucket_regional_domain
    origin_id                = "S3-Frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  # ── Origin 2: EC2 Backend ──────────────────────────────────────
  origin {
    domain_name = var.ec2_public_dns
    origin_id   = "EC2-Backend"

    custom_origin_config {
      http_port              = 3000
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # ── /weather* → EC2 ───────────────────────────────────────────
  ordered_cache_behavior {
    path_pattern           = "/weather*"
    target_origin_id       = "EC2-Backend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # ── /searches* → EC2 ──────────────────────────────────────────
  ordered_cache_behavior {
    path_pattern           = "/searches*"
    target_origin_id       = "EC2-Backend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # ── /health* → EC2 ────────────────────────────────────────────
  ordered_cache_behavior {
    path_pattern           = "/health*"
    target_origin_id       = "EC2-Backend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # ── Default: /* → S3 Frontend ─────────────────────────────────
  default_cache_behavior {
    target_origin_id       = "S3-Frontend"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Project = var.project_name
  }
}

# S3 bucket policy — only CloudFront can read
resource "aws_s3_bucket_policy" "cloudfront_only" {
  bucket = var.s3_bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOnly"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${var.s3_bucket_arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
        }
      }
    }]
  })
}
