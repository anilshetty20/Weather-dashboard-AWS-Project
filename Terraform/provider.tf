# ─────────────────────────────────────────────────────────────────
#  provider.tf  (root)
#
#  Configures the AWS provider and Terraform version requirements.
#  Credentials come from ~/.aws/credentials or environment variables.
# ─────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # ── Remote backend ──────────────────────────────────────────────
  # Fill these in with the outputs from bootstrap/
  #
  # bucket         → state_bucket_name output
  # dynamodb_table → lock_table_name output
  # ───────────────────────────────────────────────────────────────
  backend "s3" {
    bucket         = "weather-remote-tfstate-8b19b641"   # ← replace with your bucket name
    key            = "weather-remote/terraform.tfstate"   # path inside the bucket
    region         = "us-east-1"
    dynamodb_table = "weather-remote-tf-locks"            # ← replace with your table name
    encrypt        = true
  }
}
provider "aws" {
  region = var.aws_region
}
