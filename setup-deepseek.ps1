# PowerShell Setup script for DeepSeek API Key
# This script helps configure the DeepSeek API Key in your .env.local file

Write-Host "🚀 DeepSeek API Setup" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

$apiKey = "sk-cbf0812335e5413c980003410d5ed325"
$envFile = ".env.local"

# Check if .env.local exists
if (Test-Path $envFile) {
    Write-Host "✓ Found .env.local file" -ForegroundColor Green
    
    # Read current content
    $content = Get-Content $envFile -Raw
    
    # Check if DEEPSEEK_API_KEY already exists
    if ($content -match "DEEPSEEK_API_KEY") {
        Write-Host "⚠ DEEPSEEK_API_KEY already exists in .env.local" -ForegroundColor Yellow
        $response = Read-Host "Do you want to update it? (y/n)"
        if ($response -eq "y" -or $response -eq "Y") {
            # Remove old key lines
            $lines = Get-Content $envFile | Where-Object { $_ -notmatch "DEEPSEEK_API_KEY" }
            $lines | Set-Content $envFile
            # Add new key
            Add-Content $envFile "DEEPSEEK_API_KEY=$apiKey"
            Write-Host "✓ Updated DEEPSEEK_API_KEY in .env.local" -ForegroundColor Green
        } else {
            Write-Host "Keeping existing key" -ForegroundColor Yellow
        }
    } else {
        # Add the key
        Add-Content $envFile ""
        Add-Content $envFile "# DeepSeek AI API Key"
        Add-Content $envFile "DEEPSEEK_API_KEY=$apiKey"
        Write-Host "✓ Added DEEPSEEK_API_KEY to .env.local" -ForegroundColor Green
    }
} else {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    @"
# DeepSeek AI API Key
DEEPSEEK_API_KEY=$apiKey

# Supabase (if needed)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
"@ | Out-File -FilePath $envFile -Encoding utf8
    Write-Host "✓ Created .env.local file with DEEPSEEK_API_KEY" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Restart your development server: npm run dev"
Write-Host "2. The AI analysis will now use DeepSeek API"
Write-Host "3. Check the dashboard to see AI-powered insights"
Write-Host ""

