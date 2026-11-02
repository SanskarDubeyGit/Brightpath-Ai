#!/bin/bash
# Daily PostgreSQL backup script to S3
# Retention: 30 days
# Schedule: Daily at 2 AM UTC (cron: 0 2 * * *)

set -euo pipefail

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-agency}"
DB_USER="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
S3_BUCKET="${S3_BACKUP_BUCKET:-agency-backups}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="agency_db_${TIMESTAMP}.sql"
BACKUP_PATH="/tmp/${BACKUP_FILE}"
S3_KEY="database/${BACKUP_FILE}"

echo "[$(date)] Starting PostgreSQL backup..."
echo "Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "S3 Bucket: ${S3_BUCKET}"
echo "S3 Key: ${S3_KEY}"

# Export password for pg_dump
export PGPASSWORD="${DB_PASSWORD}"

# Create backup
pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" \
    --verbose --no-password --format=custom \
    --file="${BACKUP_PATH}"

if [ $? -ne 0 ]; then
    echo "[$(date)] ERROR: pg_dump failed!"
    exit 1
fi

echo "[$(date)] Backup created: ${BACKUP_PATH} ($(stat -f%z "${BACKUP_PATH}" 2>/dev/null || stat -c%s "${BACKUP_PATH}") bytes)"

# Upload to S3
aws s3 cp "${BACKUP_PATH}" "s3://${S3_BUCKET}/${S3_KEY}" \
    --region "${AWS_REGION}" \
    --storage-class STANDARD_IA

if [ $? -ne 0 ]; then
    echo "[$(date)] ERROR: S3 upload failed!"
    exit 1
fi

echo "[$(date)] Backup uploaded to s3://${S3_BUCKET}/${S3_KEY}"

# Clean up local backup
rm -f "${BACKUP_PATH}"
echo "[$(date)] Local backup cleaned up"

# Retention cleanup: delete backups older than RETENTION_DAYS
echo "[$(date)] Cleaning up backups older than ${RETENTION_DAYS} days..."
aws s3api list-objects-v2 \
    --bucket "${S3_BUCKET}" \
    --prefix "database/" \
    --region "${AWS_REGION}" \
    --query 'Contents[?LastModified<=`'"$(date -d "-${RETENTION_DAYS} days" +%Y-%m-%dT%H:%M:%SZ)"'`].Key' \
    --output text | while read -r key; do
    if [ -n "${key}" ]; then
        aws s3 rm "s3://${S3_BUCKET}/${key}" --region "${AWS_REGION}"
        echo "[$(date)] Deleted expired backup: ${key}"
    fi
done

echo "[$(date)] Backup completed successfully"