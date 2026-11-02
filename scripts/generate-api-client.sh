#!/bin/bash
# Generate TypeScript API client from OpenAPI spec
# Run this whenever the OpenAPI spec changes to keep frontend types in sync

set -euo pipefail

OPENAPI_SPEC="apps/api/src/main/resources/openapi/openapi.yaml"
OUTPUT_DIR="apps/web/src/lib/api-client"
GENERATOR_VERSION="7.11.0"

echo "Generating TypeScript API client from OpenAPI spec..."

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Run OpenAPI Generator via Docker
docker run --rm \
  -v "$(pwd)/$OPENAPI_SPEC:/spec/openapi.yaml:ro" \
  -v "$(pwd)/$OUTPUT_DIR:/out" \
  openapitools/openapi-generator-cli:v$GENERATOR_VERSION \
  generate \
  -i /spec/openapi.yaml \
  -g typescript-axios \
  -o /out \
  --additional-properties=modelPropertyNaming=camelcode,withInterfaces=true,supportsES6=true,enumClassPrefix=true

echo "TypeScript client generated at $OUTPUT_DIR"
echo "Next steps:"
echo "1. Review generated files for breaking changes"
echo "2. Update imports in frontend code to use generated client"
echo "3. Run pnpm typecheck to verify compatibility"