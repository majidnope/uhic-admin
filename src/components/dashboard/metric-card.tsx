import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string | number
  change: number
  changeType: "positive" | "negative" | "neutral"
  icon: string
}

const iconMap = {
  "dollar-sign": DollarSign,
  "users": Users,
  "credit-card": CreditCard,
  "trending-up": TrendingUp
}

export function MetricCard({ label, value, change, changeType, icon }: MetricCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || DollarSign

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-600">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {label}
        </CardTitle>
        <div className="bg-blue-50 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-3">
          {change !== 0 && (
            <>
              {changeType === "positive" ? (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">
                    +{change}%
                  </span>
                </div>
              ) : changeType === "negative" ? (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">
                    {change}%
                  </span>
                </div>
              ) : null}
              <span className="text-xs text-gray-500">vs last month</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}