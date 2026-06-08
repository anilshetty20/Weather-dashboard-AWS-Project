output "public_ip" {
  description = "EC2 public IP address"
  value       = aws_instance.weather.public_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.weather.id
}
