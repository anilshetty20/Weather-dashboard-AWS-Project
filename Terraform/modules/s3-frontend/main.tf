# ─────────────────────────────────────────────────────────────────
#  modules/s3-frontend/main.tf
#
#  Creates S3 bucket configured for static website hosting.
#  File upload is done manually / via CI-CD later.
# ─────────────────────────────────────────────────────────────────

# 1. S3 Bucket
resource "aws_s3_bucket" "frontend" {
  bucket = var.bucket_name

  tags = {
    Project = "WeatherDashboard"
    Purpose = "Frontend static website hosting"
  }
}

# 2. Disable block public access
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 3. Bucket policy — public read
resource "aws_s3_bucket_policy" "frontend" {
  bucket     = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.frontend.arn}/*"
    }]
  })
}

# 4. Static website hosting
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}
