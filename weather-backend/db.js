// ─────────────────────────────────────────────────────────────────
//  backend/db.js
//
//  Creates and exports the DynamoDB Document Client.
//
//  On EC2: credentials come automatically from the IAM Role
//          attached to the instance — no keys in code needed.
//  Locally: credentials come from ~/.aws/credentials or env vars.
// ─────────────────────────────────────────────────────────────────

const { DynamoDBClient }          = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient }  = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

// DynamoDBDocumentClient wraps the raw client and automatically
// marshals/unmarshals JS objects to/from DynamoDB's AttributeValue format
const dynamo = DynamoDBDocumentClient.from(client)

module.exports = dynamo