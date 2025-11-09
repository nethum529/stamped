#!/bin/bash

# Setup script for DeepSeek API Key
# This script helps configure the DeepSeek API key in your .env.local file

echo "🚀 DeepSeek API Setup"
echo "====================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✓ Found .env.local file"
    
    # Check if DEEPSEEK_API_KEY already exists
    if grep -q "DEEPSEEK_API_KEY" .env.local; then
        echo "⚠ DEEPSEEK_API_KEY already exists in .env.local"
        read -p "Do you want to update it? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Remove old key
            sed -i.bak '/DEEPSEEK_API_KEY/d' .env.local
            # Add new key
            echo "DEEPSEEK_API_KEY=sk-cbf0812335e5413c980003410d5ed325" >> .env.local
            echo "✓ Updated DEEPSEEK_API_KEY in .env.local"
        else
            echo "Keeping existing key"
        fi
    else
        # Add the key
        echo "" >> .env.local
        echo "# DeepSeek AI API Key" >> .env.local
        echo "DEEPSEEK_API_KEY=sk-cbf0812335e5413c980003410d5ed325" >> .env.local
        echo "✓ Added DEEPSEEK_API_KEY to .env.local"
    fi
else
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# DeepSeek AI API Key
DEEPSEEK_API_KEY=sk-cbf0812335e5413c980003410d5ed325

# Supabase (if needed)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
    echo "✓ Created .env.local file with DEEPSEEK_API_KEY"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. The AI analysis will now use DeepSeek API"
echo "3. Check the dashboard to see AI-powered insights"
echo ""

