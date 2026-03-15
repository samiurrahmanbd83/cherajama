import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  CreditCard,
  Users,
  Megaphone,
  Image,
  BarChart2,
  Settings,
  Shield,
  Bell,
  Search,
  Menu
} from "lucide-react";
import AdminGuard from "./AdminGuard";

const navItems = [
  { section: "MAIN", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { section: "CATALOG", label: "Products", href: "/admin/products", icon: Package },
  { section: "CATALOG", label: "Categories", href: "/admin/categories", icon: Tags },
  { section: "ORDERS", label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { section: "PAYMENTS", label: "Payments", href: "/admin/payments", icon: CreditCard },
  { section: "PAYMENTS", label: "Payment Gateways", href: "/admin/payment-gateways", icon: CreditCard },
  { section: "PAYMENTS", label: "Payment Disputes", href: "/admin/payment-disputes", icon: CreditCard },
  { section: "CUSTOMERS", label: "Reviews", href: "/admin/reviews", icon: Users },
  { section: "MARKETING", label: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { section: "MARKETING", label: "Announcement", href: "/admin/announcement", icon: Megaphone },
  { section: "MARKETING", label: "Homepage Builder", href: "/admin/homepage-builder", icon: Megaphone },
  { section: "MARKETING", label: "Menu Builder", href: "/admin/menus", icon: Megaphone },
  { section: "MARKETING", label: "SEO", href: "/admin/seo", icon: Megaphone },
  { section: "MARKETING", label: "Chat Buttons", href: "/admin/chat-buttons", icon: Megaphone },
  { section: "MARKETING", label: "Coupons", href: "/admin/coupons", icon: Megaphone },
  { section: "MEDIA", label: "Media Manager", href: "/admin/media", icon: Image },
  { section: "ANALYTICS", label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { section: "SETTINGS", label: "Website Settings", href: "/admin/settings", icon: Settings },
  { section: "SETTINGS", label: "Roles & Permissions", href: "/admin/settings", icon: Shield }
];

type AdminLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

const AdminLayout = ({ title, subtitle, children }: AdminLayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections = useMemo(() => Array.from(new Set(navItems.map((item) => item.section))), []);

  const activeLabel = navItems.find((item) => router.pathname.startsWith(item.href))?.label || "Dashboard";

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f5f6fb] text-[#111827]">
        <div className="flex min-h-screen">
          <aside
            className={`${sidebarOpen ? "w-64" : "w-16"} hidden lg:flex flex-col transition-all duration-300 border-r border-[#eef0f4] bg-white`}
            style={{ height: "100vh", position: "sticky", top: 0 }}
          >
            <div className="flex items-center gap-3 px-5 py-5 border-b border-[#eef0f4]">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                <LayoutDashboard size={18} />
              </div>
              {sidebarOpen && <span className="font-bold text-slate-800">ShopAdmin</span>}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {sections.map((section) => (
                <div key={section} className="mb-4">
                  {sidebarOpen && (
                    <p className="px-2 py-1 text-xs uppercase tracking-wider text-[#a1a8b3]">{section}</p>
                  )}
                  <div className="mt-2 grid gap-1">
                    {navItems
                      .filter((item) => item.section === section)
                      .map((item) => {
                        const active = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                              active ? "bg-indigo-500 text-white" : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <item.icon size={16} />
                            {sidebarOpen && <span>{item.label}</span>}
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-[#eef0f4]">
              <div className="rounded-xl px-3 py-3 bg-slate-50">
                <p className="text-xs text-slate-500">Admin User</p>
                {sidebarOpen && <p className="text-xs text-slate-400">admin@cherajama.com</p>}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b border-[#eef0f4] bg-white/90 backdrop-blur-sm">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"
              >
                <Menu size={18} />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title || activeLabel}</p>
                <p className="text-xs text-slate-500">{subtitle || "Welcome back, Admin"}</p>
              </div>
              <div className="flex-1" />
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-slate-50">
                <Search size={14} className="text-slate-500" />
                <input className="bg-transparent text-xs outline-none text-slate-600" placeholder="Quick search..." />
              </div>
              <button className="p-2 rounded-full border border-slate-200 text-slate-600">
                <Bell size={16} />
              </button>
            </header>

            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;
