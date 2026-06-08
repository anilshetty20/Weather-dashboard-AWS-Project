# ─────────────────────────────────────────────────────────────────
#  bootstrap/main.tf
#
#  Run this ONCE before your main Terraform project.
#  Creates:
#    1. S3 bucket       → stores terraform.tfstate
#    2. DynamoDB table  → locks state during apply (prevents conflicts)
#
#  After this runs, copy the bucket name into your main provider.tf
# ─────────────────────────────────────────────────────────────────

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── S3 Bucket — stores the statefile ─────────────────────────────
resource "aws_s3_bucket" "terraform_state" {
  # Bucket names must be globally unique across all AWS accounts
  # The random suffix handles that
  bucket = "${var.project_name}-tfstate-${random_id.suffix.hex}"

  # Prevent accidental deletion of the bucket that holds your state
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Project = var.project_name
    Purpose = "Terraform state storage"
  }
}

# Random suffix so bucket name is globally unique
resource "random_id" "suffix" {
  byte_length = 4
}

# Block all public access — state files contain sensitive info
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning — lets you recover a previous state if something goes wrong
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption — state files can contain secrets
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ── DynamoDB Table — state locking ────────────────────────────────
# Prevents two people (or two pipelines) running terraform apply
# at the same time and corrupting the state file
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "${var.project_name}-tf-locks"
  billing_mode = "PAY_PER_REQUEST"  # Free Tier friendly

  # Terraform requires exactly this attribute name for locking
  hash_key = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Project = var.project_name
    Purpose = "Terraform state locking"
  }
}
