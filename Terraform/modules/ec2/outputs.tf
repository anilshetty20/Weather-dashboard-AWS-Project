output "public_ip" {
  description = "EC2 public IP address"
  value       = aws_instance.weather.public_ip
}

output "public_dns" {
  description = "EC2 public DNS hostname — used as CloudFront origin"
  value       = aws_instance.weather.public_dns
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.weather.id
}
