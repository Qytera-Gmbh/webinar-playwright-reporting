variable "bucket_name" {
  type        = string
  nullable    = false
  description = "The bucket name."
}

variable "cloudfront_distribution_arn" {
  type        = string
  nullable    = false
  description = "The ARN of a CloundFront distribution which will be granted bucket access."
}
