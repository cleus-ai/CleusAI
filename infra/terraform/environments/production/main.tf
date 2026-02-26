terraform {
  required_version = ">= 1.7"
  backend "s3" { bucket = "cleus-terraform-state"; key = "production/terraform.tfstate"; region = "us-east-1"; encrypt = true; }
  required_providers { aws = { source = "hashicorp/aws"; version = "~> 5.0" } }
}

provider "aws" { region = var.aws_region }

module "rds" {
  source         = "../../modules/rds"
  environment    = "production"
  instance_class = "db.t3.medium"
  allocated_storage = 100
  db_username    = var.db_username
  db_password    = var.db_password
}

module "redis" {
  source      = "../../modules/redis"
  environment = "production"
  node_type   = "cache.t3.small"
}
