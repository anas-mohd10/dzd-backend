#!/bin/bash

# Variables
AWS_ACCOUNT_ID=""
AWS_REGION=""
ECR_REPO=""
IMAGE_TAG=""

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -a|--aws-account-id) AWS_ACCOUNT_ID="$2"; shift ;;
        -r|--aws-region) AWS_REGION="$2"; shift ;;
        -e|--ecr-repo) ECR_REPO="$2"; shift ;;
        -t|--image-tag) IMAGE_TAG="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Login to AWS ECR
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build the Docker image
docker build -t ${ECR_REPO}:${IMAGE_TAG} .

# Tag the Docker image for ECR
docker tag ${ECR_REPO}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# Push the Docker image to ECR
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}

# Logout from ECR
docker logout ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
