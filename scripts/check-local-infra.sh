#!/usr/bin/env bash

set -e

echo "Checking PostgreSQL..."
docker exec banklite-postgres pg_isready -U banklite -d banklite

echo "Checking Redis..."
docker exec banklite-redis redis-cli ping

echo "Checking RabbitMQ..."
docker exec banklite-rabbitmq rabbitmq-diagnostics ping

echo "Checking Floci..."
aws --endpoint-url http://localhost:4566 s3 ls >/dev/null

echo "Local infrastructure is healthy."