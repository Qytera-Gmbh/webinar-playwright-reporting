provider "aws" {
  region = "us-east-1"
}

resource "aws_lambda_function" "http_basic_auth" {
  filename         = data.archive_file.http_basic_auth_zip.output_path
  function_name    = "http-basic-auth"
  role             = aws_iam_role.http_basic_auth_role.arn
  handler          = "index.handler"
  publish          = true
  source_code_hash = data.archive_file.http_basic_auth_zip.output_base64sha256
  runtime          = "nodejs18.x"
}

data "archive_file" "http_basic_auth_zip" {
  type        = "zip"
  output_path = "function.zip"
  source_dir  = "dist"
}

resource "aws_iam_role" "http_basic_auth_role" {
  name               = "lambda-http-basic-auth"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy" "secret_manager" {
  name   = "lambda-http-basic-auth-secret-manager-get-secret"
  role   = aws_iam_role.http_basic_auth_role.id
  policy = data.aws_iam_policy_document.secret_manager.json
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "secret_manager" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue"
    ]
    resources = ["arn:aws:secretsmanager:*:*:*"]
  }
}

resource "aws_secretsmanager_secret" "passphrase" {
  name = "lambda-http-basic-auth-secret"
}

resource "aws_secretsmanager_secret_version" "sversion" {
  secret_id     = aws_secretsmanager_secret.passphrase.id
  secret_string = <<EOF
   {
    "username": "dev",
    "password": "${random_password.password.result}"
   }
   EOF
}

resource "random_password" "password" {
  length  = 32
  special = true
}

output "function_arn" {
  value = aws_lambda_function.http_basic_auth.qualified_arn
}

output "secret_arn" {
  value = aws_secretsmanager_secret.passphrase.arn
}
