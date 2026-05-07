#!/bin/bash
# ============================================================
# MediFlow Nexus — Cloud Run Deployment Script
# Deploys the Next.js frontend to GCP Cloud Run
# Usage: bash deploy-cloudrun.sh
# ============================================================

set -e

# ── Config ──────────────────────────────────────────────────
PROJECT_ID="mediflow-nexus-2026"
REGION="us-central1"
SERVICE_NAME="mediflow-nexus-frontend"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# ── Validate required env vars ───────────────────────────────
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo ""
  echo "❌  Missing required environment variables:"
  echo "    NEXT_PUBLIC_SUPABASE_URL"
  echo "    NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo ""
  echo "    Export them before running this script:"
  echo "    export NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co"
  echo "    export NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
  echo ""
  exit 1
fi

GEMINI_KEY="${GEMINI_API_KEY:-}"
ELEVENLABS_KEY="${ELEVENLABS_API_KEY:-}"

echo ""
echo "🚀  MediFlow Nexus — Cloud Run Deployment"
echo "    Project  : $PROJECT_ID"
echo "    Region   : $REGION"
echo "    Service  : $SERVICE_NAME"
echo "    Image    : $IMAGE"
echo ""

# ── Step 1: Set GCP project ──────────────────────────────────
echo "▶  Setting GCP project..."
gcloud config set project "$PROJECT_ID"

# ── Step 2: Enable required APIs ────────────────────────────
echo "▶  Enabling Cloud Run & Container Registry APIs..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com --quiet

# ── Step 3: Authenticate Docker with GCR ────────────────────
echo "▶  Configuring Docker for GCR..."
gcloud auth configure-docker --quiet

# ── Step 4: Build Docker image ───────────────────────────────
echo "▶  Building Docker image..."
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  -t "${IMAGE}:latest" \
  -t "${IMAGE}:$(date +%Y%m%d-%H%M%S)" \
  .

# ── Step 5: Push image to GCR ────────────────────────────────
echo "▶  Pushing image to Google Container Registry..."
docker push "${IMAGE}:latest"

# ── Step 6: Deploy to Cloud Run ──────────────────────────────
echo "▶  Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}:latest" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL},NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}${GEMINI_KEY:+,GEMINI_API_KEY=${GEMINI_KEY}}${ELEVENLABS_KEY:+,ELEVENLABS_API_KEY=${ELEVENLABS_KEY}}" \
  --quiet

# ── Step 7: Get service URL ──────────────────────────────────
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --platform managed \
  --region "${REGION}" \
  --format "value(status.url)")

echo ""
echo "✅  Deployment complete!"
echo "    🌐  URL: ${SERVICE_URL}"
echo ""
