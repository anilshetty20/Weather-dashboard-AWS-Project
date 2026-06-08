output "table_name" {
  description = "DynamoDB table name — pass to backend .env as DYNAMO_TABLE"
  value       = aws_dynamodb_table.weather_searches.name
}

output "table_arn" {
  description = "DynamoDB table ARN — used by IAM policy"
  value       = aws_dynamodb_table.weather_searches.arn
}
