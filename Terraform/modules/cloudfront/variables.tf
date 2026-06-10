variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "skywatch"
}

variable "s3_bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "s3_bucket_arn" {
  description = "S3 bucket ARN"
  type        = string
}

variable "s3_bucket_regional_domain" {
  description = "S3 bucket regional domain name (for CloudFront origin)"
  type        = string
}

variable "ec2_public_dns" {
  description = "Public IP address of the EC2 instance"
  type        = string
}
