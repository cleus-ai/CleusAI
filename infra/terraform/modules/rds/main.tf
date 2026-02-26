resource "aws_db_instance" "cleus_postgres" {
  identifier           = "cleus-postgres-${var.environment}"
  engine               = "postgres"
  engine_version       = "16.2"
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  storage_encrypted    = true
  db_name              = "cleus"
  username             = var.db_username
  password             = var.db_password
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  backup_retention_period = 7
  deletion_protection     = var.environment == "production"
  skip_final_snapshot     = var.environment != "production"
  tags = { Environment = var.environment, Project = "cleus" }
}
