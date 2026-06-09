output "website_url" {
  description = "S3 static website URL"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.frontend.bucket
}

output "bucket_arn" {
  description = "S3 bucket ARN and used by CloudFront policy"
  value       = aws_s3_bucket.frontend.arn
}

output "bucket_regional_domain" {
  description = "S3 regional domain and used as CloudFront origin"
  value       = aws_s3_bucket.frontend.bucket_regional_domain_name
}
