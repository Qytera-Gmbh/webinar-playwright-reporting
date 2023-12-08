variable "domain" {
  type        = string
  nullable    = false
  description = "The root domain to register the application under."
}

variable "cloudfront_domain_name" {
  type        = string
  nullable    = false
  description = "The domain name of the corresponding CloudFront distribution."
}

variable "cloudfront_hosted_zone_id" {
  type        = string
  nullable    = false
  description = "The hosted zone ID of the corresponding CloudFront distribution."
}

variable "fqdn" {
  type        = string
  nullable    = false
  description = "The FQDN of the created CloudFront subdomain."
}
