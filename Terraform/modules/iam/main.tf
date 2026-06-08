# ─────────────────────────────────────────────────────────────────
#  modules/iam/main.tf
#
#  Creates 3 things:
#    1. IAM Role       — identity EC2 can assume
#    2. IAM Policy     — permission to read/write DynamoDB
#    3. Instance Profile — wraps the role so EC2 can use it
#
#  The Docker container on EC2 inherits these permissions automatically
#  via the instance metadata service — no AWS keys in code.
# ─────────────────────────────────────────────────────────────────

# 1. IAM Role — lets EC2 assume this identity
resource "aws_iam_role" "ec2_role" {
  name = var.role_name

  # Trust policy — only EC2 service can assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = {
    Project = "weather-dashboard"
  }
}

# 2. IAM Policy — only the DynamoDB actions the backend actually needs
resource "aws_iam_role_policy" "dynamodb_policy" {
  name = "Weather-DynamoDB-Access"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:PutItem",   # saveSearch()
        "dynamodb:Scan",      # getRecentSearches()
      ]
      Resource = "*"          # fine for learning — lock to table ARN in production
    },
    {
        # ECR — pull Docker image on EC2
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ]
        Resource = "*"
      }]
  })
}

# 3. Instance Profile — the bridge between EC2 and IAM Role
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.role_name}-profile"
  role = aws_iam_role.ec2_role.name
}
