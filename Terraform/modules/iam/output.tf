output "instance_profile_name" {
  description = "Instance profile name — attached to EC2 so it can access DynamoDB"
  value       = aws_iam_instance_profile.ec2_profile.name
}
