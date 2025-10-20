# Dashboard Real Data Integration

## Overview
The admin dashboard has been updated to use real data from the backend analytics API instead of mock data.

## Changes Made

### 1. New Analytics API Client (`src/apis/analytics.api.ts`)
Created a new API client to communicate with the backend analytics endpoints:

**Available Methods:**
- `getOverview()` - Get basic overview statistics
- `getRevenue()` - Get revenue data and monthly trends
- `getUserAnalytics()` - Get user statistics and growth metrics
- `getPlanAnalytics()` - Get plan statistics and approval stats
- `getReferralAnalytics()` - Get referral statistics
- `getDashboard()` - Get comprehensive dashboard data (used by default)

### 2. Updated Dashboard Page (`src/app/dashboard/page.tsx`)

**Key Changes:**
- Replaced mock data calculations with real API data
- Integrated `analyticsApi.getDashboard()` to fetch comprehensive dashboard data
- Updated metrics to use real statistics from backend

**New Dashboard Sections:**

1. **Financial Metrics (Top Cards)**
   - Total Revenue (from database aggregation)
   - Active Users (real-time count)
   - Total Plans (real-time count)
   - Active Rate (calculated percentage)

2. **User Status Overview**
   - Visual breakdown of active, inactive, and suspended users
   - Real-time counts with color-coded cards

3. **Pending Plans Alert**
   - Shows plans awaiting approval
   - Quick action buttons to review
   - Only displays when there are pending plans

4. **Recent Referrals**
   - Shows latest referrals with staff attribution
   - Points awarded for each referral
   - Join date timestamps

5. **Quick Actions Panel**
   - Create new plan
   - View all users
   - View analytics

6. **Top Staff Performance**
   - Ranked list of staff by referral points
   - Visual ranking badges
   - Total points displayed

7. **System Status Summary**
   - Total users count
   - Total plans count
   - Pending plans count
   - Total revenue

8. **Recent Transactions Table**
   - Displays last 10 coin transactions
   - Shows user info, transaction type (earned/spent/redeemed)
   - Amount with color coding (green for earned, red for spent/redeemed)
   - Balance after transaction
   - Timestamp with date and time
   - Interactive table with hover effects

### 3. Backend API Documentation (`UHIC-Backend/API_ROUTES.md`)

Added comprehensive documentation for analytics endpoints:

**New Endpoints:**
- `GET /console/analytics/dashboard` - Complete dashboard data (includes transactions)
- `GET /console/analytics/overview` - Basic statistics
- `GET /console/analytics/revenue` - Revenue trends
- `GET /console/analytics/users` - User analytics
- `GET /console/analytics/plans` - Plan analytics
- `GET /console/analytics/referrals` - Referral analytics

**Authentication:** All endpoints require Admin/Staff JWT with `VIEW_ANALYTICS` permission

**Recent Transactions Feature:**
- Added CoinTransaction model to analytics module
- Backend fetches last 10 transactions with user details
- Frontend displays transactions in a responsive table
- Color-coded transaction types (earned=green, spent/redeemed=red)
- Shows user info, amount, description, balance, and timestamp

## Data Flow

```
Dashboard Component
    ↓
analyticsApi.getDashboard()
    ↓
API Request to /console/analytics/dashboard
    ↓
Backend Analytics Service
    ↓
MongoDB Aggregations
    ↓
Returns Comprehensive Data:
  - Overview stats (users, plans, revenue)
  - Pending plans list
  - Recent referrals
  - Top staff by performance
```

## Benefits

1. **Real-Time Data**: Dashboard now shows actual system state
2. **Performance**: Single API call fetches all dashboard data
3. **Accuracy**: No more hardcoded mock values
4. **Scalability**: Backend handles complex aggregations
5. **Maintainability**: Separated concerns (API layer, component logic)

## Error Handling

The dashboard includes:
- Loading states with skeleton screens
- Error state management
- Toast notifications for failures
- Graceful degradation when data is missing

## Future Enhancements

Potential improvements:
1. Add data refresh interval (auto-update every X seconds)
2. Add charts/graphs for revenue trends
3. Add filtering options (date ranges, user types)
4. Add export functionality for reports
5. Add drill-down capabilities for each metric
6. Add real-time WebSocket updates for live data

## Testing

To test the updated dashboard:

1. Start the backend server:
   ```bash
   cd UHIC-Backend
   pnpm run dev
   ```

2. Start the admin frontend:
   ```bash
   cd uhic-admin
   pnpm run dev
   ```

3. Login with admin credentials
4. Navigate to the dashboard
5. Verify that real data is displayed
6. Check for pending plans, referrals, and staff rankings

## Dependencies

No new dependencies were added. The changes use existing:
- Next.js 14+
- React 18+
- Existing API infrastructure
- Existing UI components

## Permissions Required

Users must have the `VIEW_ANALYTICS` permission to access analytics data. This is enforced at both the UI level (PermissionGate component) and backend level (permissions guard).
