#!/bin/bash

# Variables
AWS_ACCOUNT_ID="211125565601"
AWS_REGION="ap-south-1"
ECR_REPO="admin"
IMAGE_TAG="v0.0.9"  # e.g., v1.0.0

# Login to AWS ECR
aws ecr get-login-password --region ${AWS_REGION} --profile hub | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build the Docker image
docker build -t ${ECR_REPO}:${IMAGE_TAG} .

# Tag the Docker image for ECR
docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# Push the Docker image to ECR
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# Logout from ECR
docker logout ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
