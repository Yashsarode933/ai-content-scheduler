'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { mockAnalytics } from '@/lib/mockData'

interface AnalyticsProps {
  projectId: string
}

export function Analytics({ projectId }: AnalyticsProps) {
  const chartData = mockAnalytics.map(analytics => ({
    platform: analytics.platform,
    views: analytics.views,
    likes: analytics.likes,
    shares: analytics.shares,
    engagement: analytics.engagement_rate,
  }))

  const timeSeriesData = [
    { date: 'Mon', engagement: 8.5 },
    { date: 'Tue', engagement: 9.2 },
    { date: 'Wed', engagement: 7.8 },
    { date: 'Thu', engagement: 9.5 },
    { date: 'Fri', engagement: 8.9 },
    { date: 'Sat', engagement: 7.2 },
    { date: 'Sun', engagement: 6.8 },
  ]

  const totalViews = mockAnalytics.reduce((sum, a) => sum + a.views, 0)
  const totalLikes = mockAnalytics.reduce((sum, a) => sum + a.likes, 0)
  const avgEngagement = mockAnalytics.reduce((sum, a) => sum + a.engagement_rate, 0) / mockAnalytics.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Track your content performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgEngagement.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Platform</CardTitle>
          <CardDescription>Views, likes, and shares across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" />
              <Bar dataKey="likes" fill="#82ca9d" />
              <Bar dataKey="shares" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Rate Trend</CardTitle>
          <CardDescription>7-day engagement rate overview</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

