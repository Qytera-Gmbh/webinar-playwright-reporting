provider "aws" {
  region = "eu-central-1"
  alias  = "euc1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "use1"
}

module "playwright-reports" {
  source = "./module"

  providers = {
    aws.cloudfront = aws.use1
    aws.route53    = aws.use1
    aws.s3         = aws.euc1
  }

  # Module variables.
  domain           = var.domain
  application_name = var.subdomain
  lambda_function_arns = [
    {
      type = "viewer-request"
      arn  = var.http_auth_arn
    }
  ]
}
