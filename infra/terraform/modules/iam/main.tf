resource "aws_iam_role" "cleus_app" {
  name = "cleus-app-${var.environment}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
  tags = { Environment = var.environment }
}

resource "aws_iam_policy" "cleus_s3" {
  name = "cleus-s3-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
      Resource = "arn:aws:s3:::cleus-${var.environment}-assets/*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cleus_s3_attach" {
  role       = aws_iam_role.cleus_app.name
  policy_arn = aws_iam_policy.cleus_s3.arn
}
