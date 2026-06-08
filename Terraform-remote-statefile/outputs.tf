# These values are printed after bootstrap apply.
# Copy them into your main terraform/provider.tf backend block.

output "state_bucket_name" {
  description = "Copy this into main provider.tf → backend bucket"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "lock_table_name" {
  description = "Copy this into main provider.tf → backend dynamodb_table"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "aws_region" {
  description = "Region — copy into main provider.tf → backend region"
  value       = var.aws_region
}

output "next_step" {
  description = "What to do after this apply"
  value       = "Copy the values above into terraform/provider.tf backend block, then run terraform init in the terraform/ folder"
}
