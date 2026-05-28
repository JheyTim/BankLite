#!/usr/bin/env bash

set -e

# Local AWS-compatible endpoint exposed by Floci.
AWS_ENDPOINT="http://localhost:4566"

# Creates the bucket used for KYC document uploads.
aws --endpoint-url "$AWS_ENDPOINT" s3 mb s3://banklite-kyc-documents || true

# Creates the bucket used for support-related uploads.
aws --endpoint-url "$AWS_ENDPOINT" s3 mb s3://banklite-support-documents || true

# Creates the bucket used for generated account statements.
aws --endpoint-url "$AWS_ENDPOINT" s3 mb s3://banklite-statements || true

# Lists buckets so we can confirm creation worked.
aws --endpoint-url "$AWS_ENDPOINT" s3 ls