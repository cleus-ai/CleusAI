resource "aws_elasticache_cluster" "cleus_redis" {
  cluster_id           = "cleus-redis-${var.environment}"
  engine               = "redis"
  engine_version       = "7.2"
  node_type            = var.node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis_sg.id]
  tags = { Environment = var.environment, Project = "cleus" }
}
