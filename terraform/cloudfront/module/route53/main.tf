# =============================================================================================== #
# ACM                                                                                             #
# =============================================================================================== #

# The root domain's certificate
data "aws_acm_certificate" "root" {
  domain   = var.domain
  statuses = ["ISSUED"]
}

# =============================================================================================== #
# Route53                                                                                         #
# =============================================================================================== #

# The root domain's existing zone.
data "aws_route53_zone" "root" {
  name = var.domain
}

resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = var.fqdn
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = true
  }
}

# =============================================================================================== #
# OUTPUT                                                                                          #
# =============================================================================================== #

output "certificate_arn" {
  value = data.aws_acm_certificate.root.arn
}
