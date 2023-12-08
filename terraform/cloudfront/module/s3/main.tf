# ================================================================================================ #
# S3                                                                                               #
# ================================================================================================ #

# The bucket where the website will be hosted.
resource "aws_s3_bucket" "app" {
  bucket = var.bucket_name
}

# Block all public access, because the application will be served through CloudFront.
resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "app" {
  bucket = aws_s3_bucket.app.id

  policy = <<POLICY
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowCloudFrontServicePrincipalReadOnly",
          "Effect": "Allow",
          "Principal": {
            "Service": "cloudfront.amazonaws.com"
          },
          "Action": "s3:GetObject",
          "Resource": "${aws_s3_bucket.app.arn}/*",
          "Condition": {
            "StringEquals": {
              "AWS:SourceArn": "${var.cloudfront_distribution_arn}"
            }
          }
        },
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "cloudfront.amazonaws.com"
          },
          "Action": [
              "s3:ListBucket"
          ],
          "Resource": "${aws_s3_bucket.app.arn}",
          "Condition": {
            "StringEquals": {
              "AWS:SourceArn": "${var.cloudfront_distribution_arn}"
            }
          }
        }
      ]
    }
    POLICY
}

# ================================================================================================ #
# OUTPUT                                                                                           #
# ================================================================================================ #

output "bucket" {
  value = {
    id                          = aws_s3_bucket.app.id
    arn                         = aws_s3_bucket.app.arn
    bucket_regional_domain_name = aws_s3_bucket.app.bucket_regional_domain_name
  }
}
