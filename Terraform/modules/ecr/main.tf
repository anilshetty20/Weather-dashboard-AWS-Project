# ─────────────────────────────────────────────────────────────────
#  modules/ecr/main.tf
#
#  Creates an ECR private repository to store the Docker image.
#  EC2 will pull the image from here instead of Docker Hub.
# ─────────────────────────────────────────────────────────────────

resource "aws_ecr_repository" "weather" {
  name                 = var.repo_name
  image_tag_mutability = "MUTABLE"   # allows overwriting the 'latest' tag

  # Scan images for vulnerabilities on push — free and useful to learn
  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = "Weather"
  }
}

# Lifecycle policy — keeps only the last 5 images
# prevents ECR storage growing forever
resource "aws_ecr_lifecycle_policy" "weather" {
  repository = aws_ecr_repository.weather.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}
