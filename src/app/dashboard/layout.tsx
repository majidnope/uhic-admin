import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className="lg:pl-64">
          <Header />
          <main className="p-6 pt-6 lg:pt-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}