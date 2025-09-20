import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { recentTransactions } from "@/lib/mock-data"

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {transaction.user.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.user}
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.plan} Plan • {transaction.date}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900">
                ${transaction.amount}
              </span>
              <Badge
                variant={
                  transaction.status === "completed"
                    ? "success"
                    : transaction.status === "pending"
                    ? "warning"
                    : "destructive"
                }
              >
                {transaction.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}