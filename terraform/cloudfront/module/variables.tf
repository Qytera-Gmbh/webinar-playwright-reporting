variable "domain" {
  type        = string
  nullable    = false
  description = "The domain name to register the application under."
}

variable "application_name" {
  type        = string
  nullable    = false
  description = "The application name."
}

variable "lambda_function_arns" {
  type = list(object({
    type = string
    arn  = string
  }))
  nullable    = true
  description = "The Lambda function ARNs to associate with the CloudFront distribution. Type is one of viewer-request, origin-request, viewer-response or origin-response."
}
