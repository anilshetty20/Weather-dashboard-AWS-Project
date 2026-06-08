# ─────────────────────────────────────────────────────────────────
#  modules/dynamodb/main.tf
#
#  Creates the WeatherSearches DynamoDB table.
#  Uses on-demand capacity — no provisioned throughput to manage,
#  and stays within Free Tier for small workloads.
# ─────────────────────────────────────────────────────────────────

resource "aws_dynamodb_table" "weather_searches" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"  # on-demand — Free Tier friendly

  # Partition key — matches what searchesService.js writes
  hash_key = "searchId"

  attribute {
    name = "searchId"
    type = "S"   # S = String
  }

  tags = {
    Project = "weather-dashboard"
  }
}
