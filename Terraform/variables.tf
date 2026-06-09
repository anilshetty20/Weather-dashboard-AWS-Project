# ─────────────────────────────────────────────────────────────────
#  variables.tf  (root)
#
#  All configurable values in one place.
#  Change these to match your setup — no need to touch module files.
# ─────────────────────────────────────────────────────────────────

variable "aws_region" {
  description = "AWS region to deploy everything into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "WeatherDashboard"
}

variable "table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "WeatherSearches"
}

variable "role_name" {
  description = "IAM role name for EC2 → DynamoDB access"
  type        = string
  default     = "EC2-Weather-Role"
}

variable "instance_name" {
  description = "Name tag on the EC2 instance"
  type        = string
  default     = "weather-backend"
}

variable "repo_name" {
  description = "ECR repository name"
  type        = string
  default     = "weather-backend"
}

variable "key_pair_name" {
  description = "Name of the EC2 key pair for SSH access (must already exist in AWS)"
  type        = string
  # No default — you must set this in terraform.tfvars
}

variable "bucket_name" {
  description = "S3 bucket name for frontend — must be globally unique"
  type        = string
}
