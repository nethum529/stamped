'use client'

import React, { useState } from 'react'
import { AIScoreBreakdown } from '@/lib/types/lead'
import { TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface AIScoreBadgeProps {
  score: number
  breakdown?: AIScoreBreakdown
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
}

export default function AIScoreBadge({
  score,
  breakdown,
  size = 'md',
  showTooltip = true,
}: AIScoreBadgeProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  const getScoreColor = () => {
    if (score >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    if (score >= 65) return 'bg-gradient-to-r from-primary-500 to-turquoise-600 text-white'
    if (score >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
    return 'bg-gradient-to-r from-red-400 to-red-600 text-white'
  }

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent'
    if (score >= 65) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Low'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer',
          getScoreColor(),
          sizeClasses[size]
        )}
        onMouseEnter={() => showTooltip && setShowBreakdown(true)}
        onMouseLeave={() => showTooltip && setShowBreakdown(false)}
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        <TrendingUp className={cn(
          'animate-pulse',
          size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
        )} />
        <span>{score}</span>
        <span className="opacity-80">/ 100</span>
        {breakdown && <Info className={cn(
          size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
        )} />}
      </div>

      <AnimatePresence>
        {showBreakdown && breakdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-72 rounded-lg border border-neutral-200 bg-white p-4 shadow-2xl"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h4 className="font-sans font-semibold text-neutral-900">AI Score Breakdown</h4>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-bold',
                  getScoreColor()
                )}>
                  {getScoreLabel()}
                </span>
              </div>

              <div className="space-y-2">
                <ScoreBreakdownItem
                  label="Company Size"
                  score={breakdown.companySize}
                  icon="🏢"
                />
                <ScoreBreakdownItem
                  label="Industry Fit"
                  score={breakdown.industry}
                  icon="🎯"
                />
                <ScoreBreakdownItem
                  label="Geography"
                  score={breakdown.geography}
                  icon="🌍"
                />
                <ScoreBreakdownItem
                  label="Contact Quality"
                  score={breakdown.contactQuality}
                  icon="📧"
                />
              </div>

              <div className="border-t border-neutral-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">Overall Score</span>
                  <span className="text-lg font-bold text-primary-600">{breakdown.overall}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScoreBreakdownItem({ label, score, icon }: { label: string; score: number; icon: string }) {
  const getBarColor = () => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 65) return 'bg-primary-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-neutral-700">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="font-semibold text-neutral-900">{score}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full', getBarColor())}
        />
      </div>
    </div>
  )
}

