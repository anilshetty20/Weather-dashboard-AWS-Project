# ─────────────────────────────────────────────────────────────────
#  modules/ec2/main.tf
#
#  Creates:
#    1. Security Group  — SSH (22) + API port (3000)
#    2. EC2 Instance    — t2.micro Ubuntu 24.04 LTS with Docker
# ─────────────────────────────────────────────────────────────────

# Fetch the latest Ubuntu 24.04 LTS AMI automatically
# Owner 099720109477 is Canonical (official Ubuntu publisher on AWS)
data "aws_ami" "ubuntu_24" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical official

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

# 1. Security Group
resource "aws_security_group" "weather_sg" {
  name        = "weather-sg"
  description = "Weather backend SSH and API"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Weather API"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Project = "Weather"
  }
}

# 2. EC2 Instance — Ubuntu 24.04 LTS
resource "aws_instance" "weather" {
  ami                    = data.aws_ami.ubuntu_24.id
  instance_type          = "t3.small"
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.weather_sg.id]
  iam_instance_profile   = var.iam_profile_name

  # user_data runs once on first boot
  # Ubuntu uses apt instead of yum
  # Default user on Ubuntu EC2 is 'ubuntu' (not ec2-user)
  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg

    # Add Docker's official GPG key and repo
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io

    # Start Docker and enable on boot
    systemctl start docker
    systemctl enable docker

    # Add ubuntu user to docker group so no sudo needed
    usermod -aG docker ubuntu
  EOF

  tags = {
    Name    = var.instance_name
    Project = "Weather"
    OS      = "Ubuntu-24.04-LTS"
  }
}

# Elastic IP — static IP that survives EC2 stop/start
resource "aws_eip" "weather" {
  instance = aws_instance.weather.id
  domain   = "vpc"

  tags = {
    Project = "Weather"
  }
}
