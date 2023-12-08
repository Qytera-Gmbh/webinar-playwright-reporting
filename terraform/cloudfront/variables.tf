variable "domain" {
  type        = string
  nullable    = false
  description = "The root domain name registered in your AWS account. Example: mydomain.com"
}

variable "subdomain" {
  type        = string
  nullable    = false
  description = "The subdomain name where the Playwright reports should be accessible. The value will be prepended to the root domain name. For example, domain name 'mydomain.com' and subdomain name 'playwright-reports' will result in the fully qualified domain name 'playwright-reports.mydomain.com'."
}

variable "http_auth_arn" {
  type        = string
  nullable    = false
  description = "The ARN of the lambda function used for basic authentication."
}
