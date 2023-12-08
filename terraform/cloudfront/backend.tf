terraform {
  backend "s3" {
    bucket = "qytera-terraform-states"
    key    = "webinar-playwright-reports/terraform.tfstate"
    region = "eu-central-1"
  }
}
