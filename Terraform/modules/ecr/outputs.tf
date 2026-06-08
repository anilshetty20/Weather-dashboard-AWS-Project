output "repo_url" {
  description = "ECR repository URL — used to tag and push the Docker image"
  value       = aws_ecr_repository.weather.repository_url
}

output "repo_name" {
  description = "ECR repository name"
  value       = aws_ecr_repository.weather.name
}

