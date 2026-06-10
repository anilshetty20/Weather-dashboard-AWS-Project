# ─────────────────────────────────────────────────────────────────
#  outputs.tf  (root)
#
#  Values printed after `terraform apply` — useful info you need
#  for the next steps (SSH, updating .env, frontend config).
# ─────────────────────────────────────────────────────────────────

output "elastic_ip" {
  description = "Fixed Elastic IP — use this for SSH and GitHub Secrets"
  value       = module.ec2.elastic_ip
}

output "elastic_dns" {
  description = "Elastic IP DNS — used as CloudFront origin"
  value       = module.ec2.elastic_dns
}

output "dynamodb_table_name" {
  description = "DynamoDB table name — goes in backend .env as DYNAMO_TABLE"
  value       = module.dynamodb.table_name
}

output "ecr_repo_url" {
  description = "ECR repo URL — used to tag and push Docker image"
  value       = module.ecr.repo_url
}

output "ssh_command" {
  description = "Ready-to-use SSH command"
  value       = "ssh -i ${var.key_pair_name}.pem ec2-user@${module.ec2.elastic_ip}"
}

output "api_base_url" {
  description = "Backend API URL — set this as VITE_API_BASE in frontend .env.local"
  value       = "http://${module.ec2.elastic_ip}:3000"
}

output "cloudfront_url" {
  description = "Frontend HTTPS URL via CloudFront — use this instead of S3 URL"
  value       = module.cloudfront.cloudfront_url
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — add to GitHub Secrets for cache invalidation"
  value       = module.cloudfront.distribution_id
}
