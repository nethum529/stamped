'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Lightbulb,
  TrendingUp,
  Globe,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ExecutiveInsightsPage() {
  // Mock AI-powered insights
  const insights = [
    {
      id: '1',
      category: 'Growth Opportunity',
      title: 'Financial Services Sector Shows High Conversion Potential',
      description:
        'Analysis of historical data shows that leads in the financial services sector have a 35% higher conversion rate compared to other industries. Consider allocating more resources to this segment.',
      impact: 'High',
      confidence: 92,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: '2',
      category: 'Risk Alert',
      title: 'Increased Regulatory Scrutiny in APAC Region',
      description:
        'Recent regulatory changes in Asia-Pacific countries may impact onboarding times and compliance requirements. Recommend updating due diligence procedures for APAC clients.',
      impact: 'Medium',
      confidence: 87,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: '3',
      category: 'Market Trend',
      title: 'Demand for AI-Powered Compliance Tools Rising',
      description:
        'Market analysis indicates a 45% YoY increase in demand for AI-driven compliance automation. Position our AI features as a key differentiator in sales conversations.',
      impact: 'High',
      confidence: 89,
      icon: Sparkles,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      id: '4',
      category: 'Operational Efficiency',
      title: 'Document Review Process Can Be Optimized',
      description:
        'Average document review time is 3.2 days, which is 40% longer than industry benchmark. Implementing batch processing could reduce this to 2 days and improve client satisfaction.',
      impact: 'Medium',
      confidence: 94,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: '5',
      category: 'Risk Prediction',
      title: 'Two Clients May Require Enhanced Due Diligence',
      description:
        'Predictive model identifies two recently onboarded clients with risk profiles that may trigger enhanced due diligence requirements within 6 months. Proactive outreach recommended.',
      impact: 'High',
      confidence: 78,
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      id: '6',
      category: 'Geographic Expansion',
      title: 'European Market Showing Strong Growth Signals',
      description:
        'Inbound leads from European markets have increased by 60% in Q4. Consider expanding sales and compliance teams to support this growth trajectory.',
      impact: 'High',
      confidence: 91,
      icon: Globe,
      color: 'text-turquoise-600',
      bgColor: 'bg-turquoise-100',
    },
  ]

  // Compliance recommendations
  const complianceRecommendations = [
    {
      id: '1',
      title: 'Update Sanctions Screening Frequency',
      description: 'Increase screening frequency from monthly to weekly for high-risk clients.',
      priority: 'High',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Enhance Adverse Media Monitoring',
      description: 'Expand monitoring to include regional news sources in APAC and LATAM.',
      priority: 'Medium',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'Standardize Document Requirements',
      description: 'Create industry-specific document checklists to reduce back-and-forth with clients.',
      priority: 'Medium',
      status: 'pending',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Strategic Insights</h1>
        <p className="mt-2 text-neutral-600">AI-powered analysis and recommendations for business growth</p>
      </div>

      {/* Insight Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Growth Opportunities</span>
            </div>
            <p className="text-3xl font-bold text-green-900">2</p>
            <p className="text-xs text-green-700 mt-1">Identified this quarter</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Risk Alerts</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">2</p>
            <p className="text-xs text-orange-700 mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="border-primary-200 bg-primary-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-primary-900">Market Trends</span>
            </div>
            <p className="text-3xl font-bold text-primary-900">2</p>
            <p className="text-xs text-primary-700 mt-1">New trends detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">AI-Powered Insights</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">
            Generated from data analysis of leads, clients, market trends, and risk factors
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-lg border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('rounded-lg p-3', insight.bgColor)}>
                      <Icon className={cn('h-6 w-6', insight.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {insight.category}
                          </Badge>
                          <h3 className="font-semibold text-lg text-neutral-900">{insight.title}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              insight.impact === 'High' && 'bg-red-100 text-red-800 border-red-300',
                              insight.impact === 'Medium' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                              insight.impact === 'Low' && 'bg-green-100 text-green-800 border-green-300'
                            )}
                          >
                            {insight.impact} Impact
                          </Badge>
                          <span className="text-xs text-neutral-600">{insight.confidence}% confidence</span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 mb-4">{insight.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Compliance Recommendations</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Suggested improvements to compliance processes</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start justify-between rounded-lg border border-neutral-200 p-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  {rec.status === 'pending' ? (
                    <div className="h-5 w-5 rounded-full border-2 border-neutral-300 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-neutral-900">{rec.title}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          rec.priority === 'High' && 'bg-red-100 text-red-800 border-red-300',
                          rec.priority === 'Medium' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                          rec.priority === 'Low' && 'bg-green-100 text-green-800 border-green-300'
                        )}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600">{rec.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {rec.status === 'pending' ? 'Implement' : 'View Progress'}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Recommended Actions</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Key steps to capitalize on insights</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary-50 border border-primary-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <p className="text-sm font-medium text-primary-900">
                  Schedule strategy meeting to discuss financial services expansion
                </p>
              </div>
              <Button size="sm">Schedule</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-medium text-orange-900">
                  Review and update APAC compliance procedures
                </p>
              </div>
              <Button size="sm" variant="outline">
                Assign Task
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-turquoise-50 border border-turquoise-200">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-turquoise-600" />
                <p className="text-sm font-medium text-turquoise-900">
                  Evaluate European market expansion feasibility
                </p>
              </div>
              <Button size="sm" variant="outline">
                Create Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

