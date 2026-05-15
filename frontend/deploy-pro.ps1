# Load env vars from .env.local
Get-Content .env.local | ForEach-Object { 
    if ($_ -match '^([^#=]+)=(.*)$') { 
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, 'Process') 
    } 
}

$PROJECT_ID = "mediflow-nexus-2026"
$IMAGE_NAME = "mediflow-nexus-frontend"
$TAG = "v-gpt4o"
$GCR_IMAGE = "gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}"

Write-Host "Building Docker image: $GCR_IMAGE" -ForegroundColor Cyan

# Build the image with build args for Next.js static generation
docker build --platform linux/amd64 `
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$env:NEXT_PUBLIC_SUPABASE_URL" `
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$env:NEXT_PUBLIC_SUPABASE_ANON_KEY" `
  --build-arg OPENAI_API_KEY="$env:OPENAI_API_KEY" `
  --build-arg ELEVENLABS_API_KEY="$env:ELEVENLABS_API_KEY" `
  --build-arg GROQ_API_KEY="$env:GROQ_API_KEY" `
  -t $GCR_IMAGE .

if ($LASTEXITCODE -ne 0) { Write-Error "Docker build failed"; exit $LASTEXITCODE }

Write-Host "Pushing to GCR..." -ForegroundColor Cyan
docker push $GCR_IMAGE

if ($LASTEXITCODE -ne 0) { Write-Error "Docker push failed"; exit $LASTEXITCODE }

Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $IMAGE_NAME `
  --image $GCR_IMAGE `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY,OPENAI_API_KEY=$env:OPENAI_API_KEY,ELEVENLABS_API_KEY=$env:ELEVENLABS_API_KEY,GROQ_API_KEY=$env:GROQ_API_KEY,RESEND_API_KEY=$env:RESEND_API_KEY"

Write-Host "Deployment Complete!" -ForegroundColor Green
