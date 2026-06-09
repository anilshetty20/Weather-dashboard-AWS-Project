# ─────────────────────────────────────────────────────────────────
#  modules/cloudfront/main.tf
#
#  Creates:
#    1. Origin Access Control (OAC) — secure S3 access
#    2. CloudFront Distribution    — CDN + HTTPS in front of S3
#    3. S3 Bucket Policy update    — only allow CloudFront to read
#
#  After this:
#    - S3 bucket becomes PRIVATE (no direct public access)
#    - All traffic goes through CloudFront over HTTPS
#    - URL: https://xxxx.cloudfront.net
# ─────────────────────────────────────────────────────────────────

# 1. Origin Access Control — lets CloudFront securely access private S3
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC for Weather frontend S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 2. CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"  # US, Canada, Europe — cheapest, Free Tier friendly
  comment             = "Weather frontend distribution"

  # Origin — points to S3 bucket
  origin {
    domain_name              = var.s3_bucket_regional_domain
    origin_id                = "S3-${var.s3_bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  # Default cache behavior
  default_cache_behavior {
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"  # http → https redirect
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true  # gzip compression

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    # Cache for 1 day — assets have content hash in filename so safe to cache long
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  # React Router — return index.html for all 404s so routing works
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
      restriction_type = "none"  # allow all countries
    }
  }

  # Use default CloudFront certificate — free, no domain needed
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Project = var.project_name
  }
}

# 3. Update S3 bucket policy — only allow CloudFront to read
#    This makes S3 private — direct S3 URL no longer works
resource "aws_s3_bucket_policy" "cloudfront_only" {
  bucket = var.s3_bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOnly"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${var.s3_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}
