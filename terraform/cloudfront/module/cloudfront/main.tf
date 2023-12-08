# ================================================================================================ #
# CloudFront                                                                                       #
# ================================================================================================ #

resource "aws_cloudfront_distribution" "app" {
  origin {
    domain_name              = var.bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.app.id
    origin_id                = var.bucket.id
  }

  aliases = [var.fqdn]

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.bucket.id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    dynamic "lambda_function_association" {
      for_each = var.lambda_function_arns
      content {
        event_type = lambda_function_association.value.type
        lambda_arn = lambda_function_association.value.arn
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 3600
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    acm_certificate_arn = var.certificate_arn
    ssl_support_method  = "sni-only"
  }

}

resource "aws_cloudfront_origin_access_control" "app" {
  name                              = var.bucket.name
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ================================================================================================ #
# OUTPUT                                                                                           #
# ================================================================================================ #

output "cloudfront_arn" {
  value = aws_cloudfront_distribution.app.arn
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.app.domain_name
}

output "cloudfront_hosted_zone_id" {
  value = aws_cloudfront_distribution.app.hosted_zone_id
}
