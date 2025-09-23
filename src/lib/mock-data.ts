export interface User {
  _id?: string
  id?: string
  name: string
  email: string
  avatar?: string
  status: "active" | "inactive" | "suspended"
  plan: string
  joinDate: string
  lastLogin: string
  revenue: number
}

export interface Plan {
  _id?: string
  id?: string
  name: string
  price: number
  billing: "monthly" | "yearly"
  features: string[]
  subscribers: number
  revenue: number
  status: "active" | "inactive"
  description: string
}

export interface FinancialMetric {
  label: string
  value: string | number
  change: number
  changeType: "positive" | "negative" | "neutral"
  icon: string
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    status: "active",
    plan: "Pro",
    joinDate: "2024-01-15",
    lastLogin: "2024-09-16",
    revenue: 299
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    status: "active",
    plan: "Enterprise",
    joinDate: "2024-02-20",
    lastLogin: "2024-09-15",
    revenue: 999
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@example.com",
    status: "inactive",
    plan: "Basic",
    joinDate: "2024-03-10",
    lastLogin: "2024-09-10",
    revenue: 99
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    status: "active",
    plan: "Pro",
    joinDate: "2024-01-05",
    lastLogin: "2024-09-16",
    revenue: 299
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex@example.com",
    status: "suspended",
    plan: "Basic",
    joinDate: "2024-04-12",
    lastLogin: "2024-09-08",
    revenue: 0
  }
]

export const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Basic",
    price: 99,
    billing: "monthly",
    features: [
      "Up to 10 transactions",
      "Basic reporting",
      "Email support",
      "Mobile app access"
    ],
    subscribers: 1250,
    revenue: 123750,
    status: "active",
    description: "Perfect for individuals and small businesses getting started with financial management."
  },
  {
    id: "2",
    name: "Pro",
    price: 299,
    billing: "monthly",
    features: [
      "Unlimited transactions",
      "Advanced reporting",
      "Priority support",
      "API access",
      "Custom integrations"
    ],
    subscribers: 850,
    revenue: 254150,
    status: "active",
    description: "Ideal for growing businesses that need advanced financial tools and analytics."
  },
  {
    id: "3",
    name: "Enterprise",
    price: 999,
    billing: "monthly",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom reporting",
      "White-label options",
      "Advanced security",
      "24/7 phone support"
    ],
    subscribers: 150,
    revenue: 149850,
    status: "active",
    description: "Comprehensive solution for large organizations with complex financial needs."
  },
  {
    id: "4",
    name: "Starter",
    price: 49,
    billing: "monthly",
    features: [
      "Up to 5 transactions",
      "Basic dashboard",
      "Community support"
    ],
    subscribers: 500,
    revenue: 24500,
    status: "inactive",
    description: "Entry-level plan for testing our platform."
  }
]

export const mockFinancialMetrics: FinancialMetric[] = [
  {
    label: "Total Revenue",
    value: "$552,250",
    change: 12.5,
    changeType: "positive",
    icon: "dollar-sign"
  },
  {
    label: "Active Users",
    value: "2,250",
    change: 8.2,
    changeType: "positive",
    icon: "users"
  },
  {
    label: "Total Plans",
    value: "4",
    change: 0,
    changeType: "neutral",
    icon: "credit-card"
  },
  {
    label: "Monthly Growth",
    value: "18.4%",
    change: 3.1,
    changeType: "positive",
    icon: "trending-up"
  }
]

export const monthlyRevenueData = [
  { month: "Jan", revenue: 45000, users: 1800 },
  { month: "Feb", revenue: 48000, users: 1950 },
  { month: "Mar", revenue: 52000, users: 2100 },
  { month: "Apr", revenue: 49000, users: 2000 },
  { month: "May", revenue: 55000, users: 2200 },
  { month: "Jun", revenue: 58000, users: 2300 },
  { month: "Jul", revenue: 62000, users: 2400 },
  { month: "Aug", revenue: 59000, users: 2350 },
  { month: "Sep", revenue: 65000, users: 2500 }
]

export const recentTransactions = [
  {
    id: "1",
    user: "John Smith",
    plan: "Pro",
    amount: 299,
    date: "2024-09-16",
    status: "completed"
  },
  {
    id: "2",
    user: "Sarah Johnson",
    plan: "Enterprise",
    amount: 999,
    date: "2024-09-15",
    status: "completed"
  },
  {
    id: "3",
    user: "Mike Chen",
    plan: "Basic",
    amount: 99,
    date: "2024-09-14",
    status: "pending"
  },
  {
    id: "4",
    user: "Emily Davis",
    plan: "Pro",
    amount: 299,
    date: "2024-09-13",
    status: "completed"
  },
  {
    id: "5",
    user: "Alex Wilson",
    plan: "Basic",
    amount: 99,
    date: "2024-09-12",
    status: "failed"
  }
]