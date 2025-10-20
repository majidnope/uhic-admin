import { apiRequest } from './config';

export interface OverviewStats {
  totalUsers: number;
  totalPlans: number;
  totalRevenue: number;
  usersByStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
  usersLast7Days?: number;
  usersLast30Days?: number;
  totalCoinsInCirculation?: number;
  activeCouponsCount?: number;
}

export interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    revenue: number;
    count: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  usersByStatus: Array<{
    _id: string;
    count: number;
  }>;
  newUsersThisMonth: number;
  userGrowthRate: number;
}

export interface PlanAnalytics {
  planStats: Array<{
    _id: string;
    name: string;
    subscribers: number;
    revenue: number;
  }>;
  approvalStats: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface ReferralAnalytics {
  totalReferrals: number;
  successfulReferrals: number;
  totalPointsAwarded: number;
  topReferrers: Array<{
    staffId: string;
    staffName: string;
    referralsCount: number;
    totalPoints: number;
  }>;
  couponStats: {
    totalCoupons: number;
    activeCoupons: number;
    expiredCoupons: number;
    totalUsage: number;
    totalPointsAwarded: number;
  };
}

export interface PendingPlan {
  id: string;
  name: string;
  price: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface RecentReferral {
  userId: string;
  userName: string;
  userEmail: string;
  referredBy: {
    _id: string;
    name: string;
    email: string;
  };
  pointsAwarded: number;
  joinDate: string;
}

export interface TopStaff {
  rank: number;
  name: string;
  email: string;
  totalPoints: number;
}

export interface RecentTransaction {
  id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  type: 'earned' | 'spent' | 'redeemed';
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: {
    _id: string;
    name: string;
  } | null;
  joinDate: string;
}

export interface PlanDistribution {
  name: string;
  users: number;
  revenue: number;
}

export interface DashboardData {
  overview: OverviewStats & { pendingPlansCount: number };
  pendingPlans: PendingPlan[];
  recentReferrals: RecentReferral[];
  topStaff: TopStaff[];
  recentTransactions: RecentTransaction[];
  recentUsers: RecentUser[];
  planDistribution: PlanDistribution[];
}

export const analyticsApi = {
  getOverview: () => apiRequest<OverviewStats>('/console/analytics/overview'),
  
  getRevenue: () => apiRequest<RevenueData>('/console/analytics/revenue'),
  
  getUserAnalytics: () => apiRequest<UserAnalytics>('/console/analytics/users'),
  
  getPlanAnalytics: () => apiRequest<PlanAnalytics>('/console/analytics/plans'),
  
  getReferralAnalytics: () => apiRequest<ReferralAnalytics>('/console/analytics/referrals'),
  
  getDashboard: () => apiRequest<DashboardData>('/console/analytics/dashboard'),
};
