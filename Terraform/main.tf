# ─────────────────────────────────────────────────────────────────
#  main.tf  (root)
#
#  Entry point — calls each module in order:
#    1. dynamodb  → creates the WeatherSearches table
#    2. iam       → creates the EC2 IAM role to access DynamoDB
#    3. ec2       → launches the t2.micro instance
# ─────────────────────────────────────────────────────────────────

module "dynamodb" {
  source     = "./modules/dynamodb"
  table_name = var.table_name
}

module "iam" {
  source     = "./modules/iam"
  role_name  = var.role_name
}

module "ecr" {
  source    = "./modules/ecr"
  repo_name = var.repo_name
}

module "ec2" {
  source          = "./modules/ec2"
  instance_name   = var.instance_name
  key_pair_name   = var.key_pair_name
  iam_profile_name = module.iam.instance_profile_name
}

module "s3" {
  source      = "./modules/s3-frontend"
  bucket_name = var.bucket_name
}

module "cloudfront" {
  source                    = "./modules/cloudfront"
  project_name              = var.project_name
  s3_bucket_name            = module.s3.bucket_name
  s3_bucket_arn             = module.s3.bucket_arn
  s3_bucket_regional_domain = module.s3.bucket_regional_domain
  ec2_public_dns            = module.ec2.elastic_dns   # use elastic DNS
}
