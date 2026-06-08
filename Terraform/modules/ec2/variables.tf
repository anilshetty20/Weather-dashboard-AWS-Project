variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
}

variable "key_pair_name" {
  description = "EC2 key pair name for SSH"
  type        = string
}

variable "iam_profile_name" {
  description = "IAM instance profile name to attach to EC2"
  type        = string
}
