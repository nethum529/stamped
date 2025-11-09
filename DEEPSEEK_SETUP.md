# DeepSeek AI Integration Setup

This application uses DeepSeek AI to provide comprehensive analysis of your compliance and risk management data.

## Setup Instructions

### 1. Get DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (you won't be able to see it again)

### 2. Configure Environment Variable

Create a `.env.local` file in the root directory (if it doesn't exist) and add:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**Important:** The `.env.local` file is already in `.gitignore` to keep your API key secure.

### 3. Restart Development Server

After adding the API key, restart your Next.js development server:

```bash
npm run dev
```

## Features

### Dashboard AI Analysis

The dashboard now includes an AI-powered analysis card that:

- Analyzes all leads, clients, vendors, documents, risk assessments, activities, meetings, and messages
- Provides comprehensive insights about:
  - Pipeline health
  - Compliance status
  - Risk trends
  - Growth opportunities
  - Areas of concern
- Generates actionable recommendations
- Identifies risk factors
- Provides confidence scores for analysis

### Lead Scoring

Individual leads are analyzed using DeepSeek AI when:

- Viewing lead details
- The lead has an ID (existing leads)
- Comprehensive data is available (related clients, documents, activities, etc.)

### Fallback Behavior

If the DeepSeek API key is not configured or the API is unavailable:

- The system falls back to rule-based scoring
- Basic analysis is still provided
- A warning message is shown in the insights
- All functionality continues to work

## API Route

The DeepSeek integration is handled through a server-side API route:

- **Route:** `/api/ai/analyze`
- **Method:** POST
- **Authentication:** Uses server-side API key (never exposed to client)

## Data Analyzed

The AI analyzes the following data:

1. **Leads**: Company info, industry, geography, contact quality, pipeline stage
2. **Clients**: Lifecycle stage, risk assessment, documents, compliance status
3. **Vendors**: Risk level, compliance, contracts, services
4. **Documents**: Status, type, upload dates, review status
5. **Risk Assessments**: Overall scores, risk factors, assessment history
6. **Activities**: Lead activities, timeline, interactions
7. **Meetings**: Scheduled meetings, types, attendees
8. **Messages**: Communication history, conversation context

## Analysis Types

### Lead Scoring (`lead_scoring`)
- Analyzes individual leads with comprehensive context
- Provides scores for: company size, industry, geography, contact quality, compliance readiness, risk factors, financial health
- Generates insights and recommendations

### Dashboard Insights (`dashboard_insights`)
- Analyzes entire organization data
- Provides overall health score
- Identifies trends and patterns
- Generates strategic recommendations

## Cost Considerations

DeepSeek API usage is based on tokens:

- Input tokens: Data sent to the API
- Output tokens: Analysis responses
- Pricing: Check [DeepSeek Pricing](https://platform.deepseek.com/pricing) for current rates

The system limits data sent to the API to optimize costs:
- Leads: First 50
- Clients: First 30
- Vendors: First 20
- Documents: First 50
- Activities: First 100
- Messages: First 50

## Troubleshooting

### API Key Not Working

1. Verify the API key is correct in `.env.local`
2. Check that the key has not expired
3. Ensure the key has sufficient credits
4. Restart the development server

### Analysis Not Appearing

1. Check browser console for errors
2. Verify API route is accessible: `/api/ai/analyze`
3. Check server logs for API errors
4. Ensure fallback analysis is working (should always show something)

### Slow Analysis

1. The analysis may take 10-30 seconds depending on data volume
2. Large datasets are automatically limited to optimize performance
3. Consider caching results for frequently accessed data

## Security

- API key is never exposed to the client
- All API calls are made server-side
- Environment variables are not included in client bundles
- API key is stored securely in `.env.local` (not committed to git)

## Support

For issues with:
- **DeepSeek API**: Contact [DeepSeek Support](https://platform.deepseek.com/support)
- **Integration**: Check server logs and browser console for errors
- **Setup**: Verify environment variable configuration

