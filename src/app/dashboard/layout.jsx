import DashboardAuthGuard from "@/components/shared/DashboardAuthGuard";

export default function DashboardLayout({ children }) {
  return <DashboardAuthGuard>{children}</DashboardAuthGuard>;
}
