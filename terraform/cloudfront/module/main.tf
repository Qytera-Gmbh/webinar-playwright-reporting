locals {
  fqdn        = "${replace(lower(var.application_name), "/[^a-zA-Z0-9-]/", "")}.${var.domain}"
  bucket_name = replace(lower(local.fqdn), "/\\./", "-")
}

module "cloudfront" {
  source = "./cloudfront"

  providers = {
    aws = aws.cloudfront
  }

  # Module variables.
  fqdn            = local.fqdn
  certificate_arn = module.route53.certificate_arn
  bucket = {
    id                          = module.s3.bucket.id
    arn                         = module.s3.bucket.arn
    name                        = local.bucket_name
    bucket_regional_domain_name = module.s3.bucket.bucket_regional_domain_name
  }
  lambda_function_arns = var.lambda_function_arns
}

module "route53" {
  source = "./route53"

  providers = {
    aws = aws.route53
  }

  # Module variables.
  domain                    = var.domain
  cloudfront_domain_name    = module.cloudfront.cloudfront_domain_name
  cloudfront_hosted_zone_id = module.cloudfront.cloudfront_hosted_zone_id
  fqdn                      = local.fqdn
}

module "s3" {
  source = "./s3"

  providers = {
    aws = aws.s3
  }

  # Module variables.
  bucket_name                 = local.bucket_name
  cloudfront_distribution_arn = module.cloudfront.cloudfront_arn
}
