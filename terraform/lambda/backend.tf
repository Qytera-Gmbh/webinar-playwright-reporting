terraform {
  backend "s3" {
    bucket = "qytera-terraform-states"
    key    = "webinar-playwright-reports/functions/http-basic-auth/terraform.tfstate"
    region = "eu-central-1"
  }
}
