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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center space-x-2 mt-2">
          {change !== 0 && (
            <>
              {changeType === "positive" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : changeType === "negative" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <Badge
                variant={changeType === "positive" ? "success" : changeType === "negative" ? "destructive" : "secondary"}
                className="text-xs"
              >
                {change > 0 ? "+" : ""}{change}%
              </Badge>
            </>
          )}
          <span className="text-xs text-gray-500">from last month</span>
        </div>
      </CardContent>
    </Card>
  )
}