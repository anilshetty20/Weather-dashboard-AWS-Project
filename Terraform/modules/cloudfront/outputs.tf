output "cloudfront_url" {
  description = "CloudFront HTTPS URL — use this to access the frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "distribution_id" {
  description = "CloudFront distribution ID — needed for cache invalidation in CI/CD"
  value       = aws_cloudfront_distribution.frontend.id
}
