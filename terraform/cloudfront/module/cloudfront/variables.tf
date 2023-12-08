variable "fqdn" {
  type        = string
  nullable    = false
  description = "The target FQDN of the distribution."
}

variable "certificate_arn" {
  type        = string
  nullable    = false
  description = "The root domain certificate ARN."
}

variable "bucket" {
  type = object({
    id                          = string
    arn                         = string
    name                        = string
    bucket_regional_domain_name = string
  })
  nullable    = false
  description = "The bucket to connect the CloudFront distribution to."
}

variable "lambda_function_arns" {
  type = list(object({
    type = string
    arn  = string
  }))
  nullable    = true
  description = "The Lambda function ARNs to associate with the CloudFront distribution. Type is one of viewer-request, origin-request, viewer-response or origin-response."
}
