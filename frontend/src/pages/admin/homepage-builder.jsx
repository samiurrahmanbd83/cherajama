import { useState, useEffect } from "react";
import { getApiBase } from "../../lib/api";
import { useRouter } from "next/router";
import {
  LayoutDashboard, Package, Tags, ShoppingCart, CreditCard, Users, Megaphone,
  Image, BarChart2, Settings, ChevronDown, ChevronRight, Menu, X, Bell, Moon,
  Sun, Search, TrendingUp, ShoppingBag, DollarSign, AlertTriangle, CheckCircle,
  XCircle, Clock, Eye, Edit, Trash2, Plus, Filter, Download, Upload, Star,
  Globe, Smartphone, MessageCircle, Sliders, Shield, LogOut, User, Home,
  Layers, FileText, Link, ToggleLeft, ToggleRight, ArrowUpRight, ArrowDownRight,
  Wallet, Activity, PieChart, RefreshCw, Send, Flag, Lock, Unlock, Hash,
  Percent, Calendar, MapPin, Phone, Mail, Facebook, Youtube, Store, Zap
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e"];

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `BDT ${amount.toLocaleString("en-BD")}`;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const apiRequest = async (path, { method = "GET", body, token, isFormData = false } = {}) => {
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const request = async (url, allowCors = false) => {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      credentials: "include",
      ...(allowCors ? { mode: "cors" } : {})
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  };

  const apiBase = getApiBase();
  const url = path.startsWith("http") ? path : `${apiBase}${path}`;
  return await request(url, true);
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "MAIN" },
  {
    id: "products", label: "Products", icon: Package, section: "CATALOG",
    children: [
      { id: "all-products", label: "All Products" },
      { id: "add-product", label: "Add Product" },
      { id: "product-gallery", label: "Product Gallery" },
      { id: "product-tags", label: "Product Tags" },
    ]
  },
  {
    id: "categories", label: "Categories", icon: Tags, section: "CATALOG",
    children: [
      { id: "all-categories", label: "All Categories" },
      { id: "add-category", label: "Add Category" },
      { id: "subcategories", label: "Subcategories" },
    ]
  },
  {
    id: "orders", label: "Orders", icon: ShoppingCart, section: "ORDERS",
    children: [
      { id: "all-orders", label: "All Orders" },
      { id: "pending-orders", label: "Pending Orders" },
      { id: "processing-orders", label: "Processing" },
      { id: "shipped-orders", label: "Shipped" },
      { id: "delivered-orders", label: "Delivered" },
      { id: "cancelled-orders", label: "Cancelled" },
    ]
  },
  {
    id: "payments", label: "Payments", icon: CreditCard, section: "PAYMENTS",
    children: [
      { id: "payment-overview", label: "Overview" },
      { id: "pending-verification", label: "Pending Verification" },
      { id: "payment-logs", label: "Payment Logs" },
      { id: "suspicious-payments", label: "Suspicious" },
      { id: "risk-report", label: "Risk Report" },
      { id: "payment-disputes", label: "Disputes" },
      { id: "payment-analytics", label: "Analytics" },
      { id: "gateway-settings", label: "Gateway Settings" },
    ]
  },
  { id: "customers", label: "Customers", icon: Users, section: "CUSTOMERS" },
  { id: "reviews", label: "Reviews", icon: Star, section: "CUSTOMERS" },
  {
    id: "marketing", label: "Marketing", icon: Megaphone, section: "MARKETING",
    children: [
      { id: "coupons", label: "Coupons" },
      { id: "announcement", label: "Announcement Bar" },
      { id: "homepage-builder", label: "Homepage Builder" },
      { id: "menu-builder", label: "Menu Builder" },
      { id: "seo", label: "SEO Management" },
      { id: "integrations", label: "Integrations" },
      { id: "chat-button", label: "Chat Button" },
    ]
  },
  { id: "media", label: "Media Manager", icon: Image, section: "MEDIA" },
  { id: "analytics", label: "Analytics", icon: BarChart2, section: "ANALYTICS" },
  { id: "website-settings", label: "Website Settings", icon: Globe, section: "SETTINGS" },
  { id: "roles", label: "Roles & Permissions", icon: Shield, section: "SETTINGS" },
];
const routeToPageId = (pathname) => {
  if (!pathname) return "dashboard";
  if (pathname.startsWith("/admin/products/gallery")) return "product-gallery";
  if (pathname.startsWith("/admin/products/tags")) return "product-tags";
  if (pathname.startsWith("/admin/products/create")) return "add-product";
  if (pathname.startsWith("/admin/products/edit")) return "all-products";
  if (pathname.startsWith("/admin/products")) return "all-products";

  if (pathname.startsWith("/admin/categories/subcategories")) return "subcategories";
  if (pathname.startsWith("/admin/categories/create")) return "add-category";
  if (pathname.startsWith("/admin/categories/edit")) return "all-categories";
  if (pathname.startsWith("/admin/categories")) return "all-categories";

  if (pathname.startsWith("/admin/orders/pending")) return "pending-orders";
  if (pathname.startsWith("/admin/orders/processing")) return "processing-orders";
  if (pathname.startsWith("/admin/orders/shipped")) return "shipped-orders";
  if (pathname.startsWith("/admin/orders/delivered")) return "delivered-orders";
  if (pathname.startsWith("/admin/orders/cancelled")) return "cancelled-orders";
  if (pathname.startsWith("/admin/orders")) return "all-orders";

  if (pathname.startsWith("/admin/payments/pending")) return "pending-verification";
  if (pathname.startsWith("/admin/payments/logs")) return "payment-logs";
  if (pathname.startsWith("/admin/payments/suspicious")) return "suspicious-payments";
  if (pathname.startsWith("/admin/payments/risk")) return "risk-report";
  if (pathname.startsWith("/admin/payments/disputes")) return "payment-disputes";
  if (pathname.startsWith("/admin/payments/analytics")) return "payment-analytics";
  if (pathname.startsWith("/admin/payments")) return "payment-overview";

  if (pathname.startsWith("/admin/payment-gateways")) return "gateway-settings";
  if (pathname.startsWith("/admin/customers")) return "customers";
  if (pathname.startsWith("/admin/reviews")) return "reviews";
  if (pathname.startsWith("/admin/coupons")) return "coupons";
  if (pathname.startsWith("/admin/announcement")) return "announcement";
  if (pathname.startsWith("/admin/homepage-builder")) return "homepage-builder";
  if (pathname.startsWith("/admin/menus")) return "menu-builder";
  if (pathname.startsWith("/admin/seo")) return "seo";
  if (pathname.startsWith("/admin/marketing")) return "integrations";
  if (pathname.startsWith("/admin/chat-buttons")) return "chat-button";
  if (pathname.startsWith("/admin/media")) return "media";
  if (pathname.startsWith("/admin/analytics")) return "analytics";
  if (pathname.startsWith("/admin/settings")) return "website-settings";
  if (pathname.startsWith("/admin/roles")) return "roles";
  if (pathname === "/admin" || pathname.startsWith("/admin/dashboard")) return "dashboard";
  return "dashboard";
};

const pageIdToRoute = (id) => {
  const map = {
    "dashboard": "/admin/dashboard",
    "all-products": "/admin/products",
    "add-product": "/admin/products/create",
    "product-gallery": "/admin/products/gallery",
    "product-tags": "/admin/products/tags",
    "all-categories": "/admin/categories",
    "add-category": "/admin/categories/create",
    "subcategories": "/admin/categories/subcategories",
    "all-orders": "/admin/orders",
    "pending-orders": "/admin/orders/pending",
    "processing-orders": "/admin/orders/processing",
    "shipped-orders": "/admin/orders/shipped",
    "delivered-orders": "/admin/orders/delivered",
    "cancelled-orders": "/admin/orders/cancelled",
    "payment-overview": "/admin/payments",
    "pending-verification": "/admin/payments/pending",
    "payment-logs": "/admin/payments/logs",
    "suspicious-payments": "/admin/payments/suspicious",
    "risk-report": "/admin/payments/risk",
    "payment-disputes": "/admin/payments/disputes",
    "payment-analytics": "/admin/payments/analytics",
    "gateway-settings": "/admin/payment-gateways",
    "customers": "/admin/customers",
    "reviews": "/admin/reviews",
    "coupons": "/admin/coupons",
    "announcement": "/admin/announcement",
    "homepage-builder": "/admin/homepage-builder",
    "menu-builder": "/admin/menus",
    "seo": "/admin/seo",
    "integrations": "/admin/marketing",
    "chat-button": "/admin/chat-buttons",
    "media": "/admin/media",
    "analytics": "/admin/analytics",
    "website-settings": "/admin/settings",
    "roles": "/admin/roles"
  };

  return map[id] || "/admin/dashboard";
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
    delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    pending_verification: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    open: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    under_review: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    inactive: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${map[status] || map.inactive}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, change, color, dark }) => (
  <div className={`rounded-2xl p-5 border ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
    <div className="flex items-center justify-between mb-3">
      <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
    </div>
    <div className={`text-2xl font-bold mb-1 ${dark ? "text-white" : "text-slate-800"}`}>{value}</div>
    <div className={`flex items-center gap-1 text-xs ${change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
      {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      <span>{Math.abs(change)}% from last month</span>
    </div>
  </div>
);

//  PAGES 

function DashboardPage({ dark, token }) {
  const [stats, setStats] = useState({
    daily_sales: 0,
    monthly_revenue: 0,
    orders: 0,
    customers: 0,
    products: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [suspiciousCount, setSuspiciousCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [
          overviewRes,
          salesRes,
          revenueRes,
          topRes,
          ordersRes,
          pendingRes,
          riskRes,
          paymentAnalyticsRes
        ] = await Promise.all([
          apiRequest("/api/analytics/overview", { token }),
          apiRequest("/api/analytics/sales?days=7", { token }),
          apiRequest("/api/analytics/revenue?months=12", { token }),
          apiRequest("/api/analytics/top-products?limit=5", { token }),
          apiRequest("/api/orders", { token }),
          apiRequest("/api/payments/pending", { token }),
          apiRequest("/api/payments/risk-report?level=high", { token }),
          apiRequest("/api/payments/analytics?days=30", { token })
        ]);

        if (!active) return;

        setStats(overviewRes.data?.stats || stats);

        const salesSeries = (salesRes.data?.series || []).map((row) => ({
          day: new Date(row.day).toLocaleDateString("en-US", { weekday: "short" }),
          sales: Number(row.amount || 0)
        }));
        setSalesData(salesSeries);

        const revenueSeries = (revenueRes.data?.series || []).map((row) => ({
          month: new Date(row.month).toLocaleDateString("en-US", { month: "short" }),
          revenue: Number(row.amount || 0)
        }));
        setMonthlyRevenue(revenueSeries);

        const methods = paymentAnalyticsRes.data?.report?.payment_method_distribution || [];
        const total = methods.reduce((sum, m) => sum + Number(m.count || 0), 0) || 1;
        setPaymentMethodData(
          methods.map((m) => ({
            name: m.payment_method,
            value: Math.round((Number(m.count || 0) / total) * 100)
          }))
        );

        const orders = ordersRes.data?.orders || [];
        setRecentOrders(orders.slice(0, 5));
        setTopProducts(topRes.data?.products || []);
        setPendingCount((pendingRes.data?.payments || []).length);
        setSuspiciousCount((riskRes.data?.payments || []).length);
      } catch (err) {
        if (!active) return;
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats.monthly_revenue)} change={0} color="bg-indigo-500" dark={dark} />
        <StatCard icon={ShoppingCart} label="Orders" value={String(stats.orders)} change={0} color="bg-blue-500" dark={dark} />
        <StatCard icon={Users} label="Customers" value={String(stats.customers)} change={0} color="bg-cyan-500" dark={dark} />
        <StatCard icon={Package} label="Products" value={String(stats.products)} change={0} color="bg-violet-500" dark={dark} />
        <StatCard icon={Clock} label="Pending Pay" value={String(pendingCount)} change={0} color="bg-amber-500" dark={dark} />
        <StatCard icon={AlertTriangle} label="Suspicious" value={String(suspiciousCount)} change={0} color="bg-red-500" dark={dark} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`xl:col-span-2 rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>Weekly Sales</h3>
            <div className="flex gap-2">
              {["7d","30d","3m"].map(t => (
                <button key={t} className={`px-3 py-1 rounded-lg text-xs font-medium ${t==="7d" ? "bg-indigo-500 text-white" : dark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"} />
              <XAxis dataKey="day" tick={{ fontSize:12, fill: dark?"#94a3b8":"#64748b" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:12, fill: dark?"#94a3b8":"#64748b" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: dark?"#1e293b":"#fff", border:"none", borderRadius:12, fontSize:12 }} />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2.5} fill="url(#sg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>Payment Methods</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RPieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: dark?"#1e293b":"#fff", border:"none", borderRadius:12, fontSize:12 }} />
            </RPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentMethodData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className={dark ? "text-slate-300" : "text-slate-600"}>{item.name}</span>
                </div>
                <span className={`font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>Recent Orders</h3>
            <button className="text-xs text-indigo-500 font-medium">View all -&gt;</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"} border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
                  <th className="text-left pb-2 font-medium">Order ID</th>
                  <th className="text-left pb-2 font-medium">Customer</th>
                  <th className="text-left pb-2 font-medium">Amount</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={i} className={`border-b ${dark ? "border-slate-700/50" : "border-slate-50"}`}>
                    <td className={`py-2.5 font-mono text-xs font-medium ${dark ? "text-indigo-400" : "text-indigo-600"}`}>{o.order_number || o.id}</td>
                    <td className={`py-2.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>{o.customer_name || o.customer_email || "Customer"}</td>
                    <td className={`py-2.5 font-medium ${dark ? "text-slate-200" : "text-slate-800"}`}>{formatCurrency(o.total)}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>Monthly Revenue</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyRevenue.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"} />
              <XAxis dataKey="month" tick={{ fontSize:12, fill: dark?"#94a3b8":"#64748b" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill: dark?"#94a3b8":"#64748b" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background: dark?"#1e293b":"#fff", border:"none", borderRadius:12, fontSize:12 }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"} border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
                  <th className="text-left pb-2 font-medium">Product</th>
                  <th className="text-left pb-2 font-medium">Units</th>
                  <th className="text-left pb-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className={`border-b ${dark ? "border-slate-700/50" : "border-slate-50"}`}>
                    <td className={`py-2.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>{p.product_name}</td>
                    <td className={`py-2.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.units_sold}</td>
                    <td className={`py-2.5 font-medium ${dark ? "text-slate-200" : "text-slate-800"}`}>{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>Status</h3>
          <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{loading ? "Loading dashboard metrics..." : "Dashboard data synced from backend."}</div>
        </div>
      </div>
    </div>
  );
}

function ProductsPage({ dark, token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest("/api/products", { token });
      setProducts(res.data?.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE", token });
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-48 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <Search size={15} className={dark ? "text-slate-400" : "text-slate-400"} />
          <input placeholder="Search products..." className={`bg-transparent outline-none text-sm flex-1 ${dark ? "text-slate-200 placeholder-slate-500" : "text-slate-700 placeholder-slate-400"}`} />
        </div>
        <button className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}>
          <Filter size={14} /> Filter
        </button>
        <button onClick={() => { window.location.href = "/admin/products/create"; }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <table className="w-full text-sm">
          <thead className={`${dark ? "bg-slate-700/50 text-slate-400" : "bg-slate-50 text-slate-500"} text-xs`}>
            <tr>
              {["Product","Category","Price","Sale Price","Stock","Status","Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id || i} className={`border-t ${dark ? "border-slate-700 hover:bg-slate-700/30" : "border-slate-50 hover:bg-slate-50"} transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${dark ? "bg-slate-700" : "bg-slate-100"}`}>IMG</div>
                    <span className={`font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{p.name}</span>
                  </div>
                </td>
                <td className={`px-4 py-3 ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.category_id || "-"}</td>
                <td className={`px-4 py-3 font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{formatCurrency(p.price)}</td>
                <td className={`px-4 py-3 text-emerald-500 font-medium`}>{p.sale_price ? formatCurrency(p.sale_price) : "-"}</td>
                <td className={`px-4 py-3 ${Number(p.stock) === 0 ? "text-red-500 font-medium" : dark ? "text-slate-300" : "text-slate-600"}`}>{Number(p.stock) === 0 ? "Out of stock" : p.stock}</td>
                <td className="px-4 py-3"><StatusBadge status={Number(p.stock) === 0 ? "inactive" : "active"} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"><Eye size={14}/></button>
                    <button className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Edit size={14}/></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={7} className={`px-4 py-6 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersPage({ dark, token, page }) {
  const [tab, setTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const map = {
      "pending-orders": "pending",
      "processing-orders": "processing",
      "shipped-orders": "shipped",
      "delivered-orders": "delivered",
      "cancelled-orders": "cancelled"
    };
    if (map[page]) setTab(map[page]);
  }, [page]);

  useEffect(() => {
    if (!token) return;
    const loadOrders = async () => {
      try {
        const res = await apiRequest("/api/orders", { token });
        setOrders(res.data?.orders || []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      }
    };
    loadOrders();
  }, [token]);

  const tabs = ["all","pending","processing","shipped","delivered","cancelled"];
  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab===t ? "bg-indigo-500 text-white" : dark ? "bg-slate-800 border border-slate-700 text-slate-300" : "bg-white border border-slate-200 text-slate-600"}`}>{t}</button>
        ))}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <table className="w-full text-sm">
          <thead className={`${dark ? "bg-slate-700/50 text-slate-400" : "bg-slate-50 text-slate-500"} text-xs`}>
            <tr>
              {["Order ID","Customer","Date","Items","Total","Payment","Status","Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id || i} className={`border-t ${dark ? "border-slate-700 hover:bg-slate-700/30" : "border-slate-50 hover:bg-slate-50"} transition-colors`}>
                <td className={`px-4 py-3 font-mono text-xs font-semibold ${dark ? "text-indigo-400" : "text-indigo-600"}`}>{o.order_number || o.id}</td>
                <td className={`px-4 py-3 font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{o.customer_name || o.customer_email || "Customer"}</td>
                <td className={`px-4 py-3 ${dark ? "text-slate-400" : "text-slate-500"}`}>{formatDate(o.created_at)}</td>
                <td className={`px-4 py-3 ${dark ? "text-slate-300" : "text-slate-600"}`}>{o.items_count || "-"}</td>
                <td className={`px-4 py-3 font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>{formatCurrency(o.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.payment_status || "pending"} /></td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"><Eye size={14}/></button>
                    <button className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Edit size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={8} className={`px-4 py-6 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentVerificationPage({ dark, token }) {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ total_received: 0, pending: 0, failed: 0, suspicious: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [pendingRes, analyticsRes, riskRes] = await Promise.all([
          apiRequest("/api/payments/pending", { token }),
          apiRequest("/api/payments/analytics?days=30", { token }),
          apiRequest("/api/payments/risk-report", { token })
        ]);
        const pendingPayments = pendingRes.data?.payments || [];
        setPayments(pendingPayments);

        const report = analyticsRes.data?.report || {};
        const statusDist = report.payment_status_distribution || [];
        const failed = statusDist.find((s) => s.payment_status === "failed")?.count || 0;
        const pendingCount = statusDist.find((s) => s.payment_status === "pending_verification")?.count || pendingPayments.length;
        const monthlyRevenue = report.monthly_revenue || [];
        const totalReceived = monthlyRevenue.reduce((sum, row) => sum + Number(row.amount || 0), 0);
        const suspicious = (riskRes.data?.payments || []).length;

        setStats({
          total_received: totalReceived,
          pending: pendingCount,
          failed,
          suspicious
        });
      } catch (err) {
        setError(err.message || "Failed to load payments");
      }
    };
    load();
  }, [token]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Received", value:formatCurrency(stats.total_received), icon:CheckCircle, color:"text-emerald-500" },
          { label:"Pending", value:String(stats.pending), icon:Clock, color:"text-amber-500" },
          { label:"Failed", value:String(stats.failed), icon:XCircle, color:"text-red-500" },
          { label:"Suspicious", value:String(stats.suspicious), icon:AlertTriangle, color:"text-orange-500" },
        ].map((s,i) => (
          <div key={i} className={`rounded-2xl border p-4 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
            <s.icon size={20} className={s.color + " mb-2"} />
            <div className={`text-xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>{s.value}</div>
            <div className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{s.label}</div>
          </div>
        ))}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <div className={`px-5 py-4 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
          <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>Pending Verification</h3>
        </div>
        <table className="w-full text-sm">
          <thead className={`${dark ? "bg-slate-700/50 text-slate-400" : "bg-slate-50 text-slate-500"} text-xs`}>
            <tr>
              {["Order ID","Customer","Phone","Method","Txn ID","Amount","Risk","Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p.order_id || i} className={`border-t ${p.risk_level==="high" ? dark?"border-red-900/50 bg-red-900/10":"border-red-50 bg-red-50/50" : dark?"border-slate-700 hover:bg-slate-700/30":"border-slate-50 hover:bg-slate-50"} transition-colors`}>
                <td className={`px-4 py-3 font-mono text-xs font-semibold ${dark ? "text-indigo-400" : "text-indigo-600"}`}>{p.order_number || p.order_id}</td>
                <td className={`px-4 py-3 font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{p.customer_name || p.customer_email || "Customer"}</td>
                <td className={`px-4 py-3 font-mono text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.sender_phone || "-"}</td>
                <td className={`px-4 py-3 ${dark ? "text-slate-300" : "text-slate-600"}`}>{p.payment_method}</td>
                <td className={`px-4 py-3 font-mono text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.transaction_id}</td>
                <td className={`px-4 py-3 font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>{formatCurrency(p.amount || p.paid_amount || 0)}</td>
                <td className="px-4 py-3"><StatusBadge status={p.risk_level || "low"} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => apiRequest(`/api/payments/verify/${p.order_id}`, { method: "PUT", token })} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs">Approve</button>
                    <button onClick={() => apiRequest(`/api/payments/reject/${p.order_id}`, { method: "PUT", token })} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {!payments.length && (
              <tr>
                <td colSpan={8} className={`px-4 py-6 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  No pending payments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GatewaySettingsPage({ dark, token }) {
  const [gateways, setGateways] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = async () => {
    try {
      const res = await apiRequest("/api/payment-gateways", { token });
      setGateways(res.data?.gateways || []);
    } catch (err) {
      setError(err.message || "Failed to load gateways");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const toggleGateway = async (gateway) => {
    try {
      await apiRequest(`/api/payment-gateways/${gateway.id}/toggle`, {
        method: "PUT",
        body: { is_active: !gateway.is_active },
        token
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to update gateway");
    }
  };

  const enableAll = async (value) => {
    try {
      await Promise.all(
        gateways.map((g) =>
          apiRequest(`/api/payment-gateways/${g.id}/toggle`, {
            method: "PUT",
            body: { is_active: value },
            token
          })
        )
      );
      setSaved(true);
      await load();
      setTimeout(() => setSaved(false), 1200);
    } catch (err) {
      setError(err.message || "Failed to update gateways");
    }
  };

  const activeCount = gateways.filter((g) => g.is_active).length;
  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => enableAll(true)} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium">Enable All</button>
        <button onClick={() => enableAll(false)} className={`px-4 py-2 rounded-xl text-sm font-medium ${dark ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-white text-slate-600 border border-slate-200"}`}>Disable All</button>
        <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{activeCount} active</span>
        {saved && <span className="text-xs text-emerald-500">Saved!</span>}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {gateways.map((g) => (
          <div key={g.id} className={`rounded-2xl border p-5 ${card} shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>{g.name}</div>
                <div className={`text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>{g.gateway_code}</div>
              </div>
              <button onClick={() => toggleGateway(g)} className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${g.is_active ? "bg-emerald-500" : dark ? "bg-slate-600" : "bg-slate-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${g.is_active ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentAnalyticsPage({ dark, token, mode }) {
  const [report, setReport] = useState({
    daily_revenue: [],
    monthly_revenue: [],
    payment_method_distribution: [],
    payment_status_distribution: [],
    fraud_report: []
  });
  const [riskPayments, setRiskPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const analyticsRes = await apiRequest("/api/payments/analytics?days=30", { token });
        setReport(analyticsRes.data?.report || report);
        if (mode === "risk") {
          const riskRes = await apiRequest("/api/payments/risk-report", { token });
          setRiskPayments(riskRes.data?.payments || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      }
    };
    load();
  }, [token, mode]);

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const monthlySeries = report.monthly_revenue.map((row) => ({
    month: new Date(row.month).toLocaleDateString("en-US", { month: "short" }),
    amount: Number(row.amount || 0)
  }));

  const methodSeries = report.payment_method_distribution.map((row) => ({
    name: row.payment_method,
    value: Number(row.count || 0)
  }));

  if (mode === "risk") {
    const totalRisk = report.fraud_report.reduce((sum, r) => sum + Number(r.count || 0), 0) || 1;
    const riskPie = report.fraud_report.map((r) => ({
      name: r.risk_level,
      value: Math.round((Number(r.count || 0) / totalRisk) * 100)
    }));

    return (
      <div className="space-y-5">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className={`rounded-2xl border p-5 ${card} shadow-sm`}>
          <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RPieChart>
              <Pie data={riskPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {riskPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: dark?"#1e293b":"#fff", border:"none", borderRadius:12, fontSize:12 }} />
            </RPieChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
          <div className={`px-5 py-4 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
            <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-800"}`}>High Risk Payments</h3>
          </div>
          <table className="w-full text-sm">
            <thead className={`${dark ? "bg-slate-700/50 text-slate-400" : "bg-slate-50 text-slate-500"} text-xs`}>
              <tr>{["Order ID","Customer","Method","Risk","Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {riskPayments.map((p, i) => (
                <tr key={p.order_id || i} className={`border-t ${dark ? "border-slate-700" : "border-slate-50"}`}>
                  <td className={`px-4 py-3 font-mono text-xs ${dark ? "text-indigo-400" : "text-indigo-600"}`}>{p.order_number || p.order_id}</td>
                  <td className={`px-4 py-3 ${dark ? "text-slate-300" : "text-slate-600"}`}>{p.customer_name || p.customer_email || "Customer"}</td>
                  <td className={`px-4 py-3 ${dark ? "text-slate-300" : "text-slate-600"}`}>{p.payment_method}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.risk_level || "low"} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.payment_status || "pending"} /></td>
                </tr>
              ))}
              {!riskPayments.length && (
                <tr>
                  <td colSpan={5} className={`px-4 py-6 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    No high risk payments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Daily Revenue", value:formatCurrency(report.daily_revenue.reduce((s,r)=>s+Number(r.amount||0),0)), sub:"Today" },
          { label:"Monthly Revenue", value:formatCurrency(report.monthly_revenue.reduce((s,r)=>s+Number(r.amount||0),0)), sub:"This year" },
          { label:"Success Rate", value:report.payment_status_distribution.length ? `${Math.round((report.payment_status_distribution.find(s=>s.payment_status==="paid")?.count || 0) / Math.max(1, report.payment_status_distribution.reduce((a,b)=>a+Number(b.count||0),0)) * 100)}%` : "0%", sub:"Paid" },
          { label:"Fraud Rate", value:`${report.fraud_report.reduce((s,r)=>s+Number(r.count||0),0)}`, sub:"Suspicious" },
        ].map((s,i) => (
          <div key={i} className={`rounded-2xl border p-4 ${card} shadow-sm`}>
            <div className={`text-xl font-bold ${dark ? "text-white" : "text-slate-800"}`}>{s.value}</div>
            <div className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-5 ${card} shadow-sm`}>
        <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlySeries}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark?"#334155":"#f1f5f9"} />
            <XAxis dataKey="month" tick={{ fontSize:12, fill: dark?"#94a3b8":"#64748b" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11, fill: dark?"#94a3b8":"#64748b" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background: dark?"#1e293b":"#fff", border:"none", borderRadius:12, fontSize:12 }} />
            <Bar dataKey="amount" fill="#6366f1" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`rounded-2xl border p-5 ${card} shadow-sm`}>
        <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-800"}`}>Payment Methods</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RPieChart>
            <Pie data={methodSeries} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {methodSeries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: dark?"#1e293b":"#fff", border:"none", borderRadius:12, fontSize:12 }} />
          </RPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomersPage({ dark, token, mode }) {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/admin/users", { token });
      setCustomers(res.data?.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const updateRole = async (id, role) => {
    try {
      await apiRequest(`/api/admin/users/${id}/role`, {
        method: "PUT",
        body: { role },
        token
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to update role");
    }
  };

  const removeUser = async (id) => {
    try {
      await apiRequest(`/api/admin/users/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message || "Failed to remove user");
    }
  };

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";

  return (
    <div className="space-y-5">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
        <table className="w-full text-sm">
          <thead className={`${dark?"bg-slate-700/50 text-slate-400":"bg-slate-50 text-slate-500"} text-xs`}>
            <tr>
              {["Name","Email","Phone","Orders","Total Spent","Role","Joined","Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id || i} className={`border-t ${dark?"border-slate-700 hover:bg-slate-700/30":"border-slate-50 hover:bg-slate-50"}`}>
                <td className={`px-4 py-3 font-medium ${dark?"text-slate-200":"text-slate-700"}`}>{`${c.first_name} ${c.last_name}`}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-400":"text-slate-500"}`}>{c.email}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-400":"text-slate-500"}`}>{c.phone || "-"}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{c.orders || 0}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{formatCurrency(c.total_spent || 0)}</td>
                <td className="px-4 py-3">
                  {mode === "roles" ? (
                    <select value={c.role} onChange={(e) => updateRole(c.id, e.target.value)} className={`px-2 py-1 rounded-lg text-xs ${dark?"bg-slate-700 text-slate-200":"bg-white border border-slate-200 text-slate-700"}`}>
                      {['admin','staff','customer'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <StatusBadge status={c.role} />
                  )}
                </td>
                <td className={`px-4 py-3 text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{formatDate(c.created_at)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => removeUser(c.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={13}/></button>
                </td>
              </tr>
            ))}
            {!customers.length && (
              <tr>
                <td colSpan={8} className={`px-4 py-6 text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CouponsPage({ dark, token }) {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/coupons", { token });
      setCoupons(res.data?.coupons || []);
    } catch (err) {
      setError(err.message || "Failed to load coupons");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const removeCoupon = async (id) => {
    try {
      await apiRequest(`/api/coupons/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-5">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <table className="w-full text-sm">
          <thead className={`${dark?"bg-slate-700/50 text-slate-400":"bg-slate-50 text-slate-500"} text-xs`}>
            <tr>{["Code","Type","Discount","Min Order","Expiry","Status","Actions"].map(h=> (
              <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <tr key={c.id || i} className={`border-t ${dark?"border-slate-700 hover:bg-slate-700/30":"border-slate-50 hover:bg-slate-50"}`}>
                <td className={`px-4 py-3 font-mono text-xs ${dark?"text-indigo-400":"text-indigo-600"}`}>{c.code}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{c.discount_type}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{c.discount_value}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{c.minimum_order || 0}</td>
                <td className={`px-4 py-3 text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{formatDate(c.expiry_date)}</td>
                <td className="px-4 py-3"><StatusBadge status={c.is_active ? "active" : "inactive"} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => removeCoupon(c.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={13}/></button>
                </td>
              </tr>
            ))}
            {!coupons.length && (
              <tr>
                <td colSpan={7} className={`px-4 py-6 text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnnouncementPage({ dark, token }) {
  const [form, setForm] = useState({ message:"", link:"", bg:"#6366f1", color:"#ffffff", active:false, id:null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/api/announcement", { token });
        const data = res.data?.announcement;
        if (data) {
          setForm({
            id: data.id,
            message: data.message || "",
            link: data.link_url || "",
            bg: data.background_color || "#6366f1",
            color: data.text_color || "#ffffff",
            active: data.is_active
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load announcement");
      }
    };
    load();
  }, [token]);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      if (form.id) {
        await apiRequest(`/api/announcement/${form.id}`, {
          method: "PUT",
          body: {
            message: form.message,
            link_url: form.link,
            background_color: form.bg,
            text_color: form.color,
            is_active: form.active
          },
          token
        });
      } else {
        const res = await apiRequest("/api/announcement", {
          method: "POST",
          body: {
            message: form.message,
            link_url: form.link,
            background_color: form.bg,
            text_color: form.color,
            is_active: form.active
          },
          token
        });
        const data = res.data?.announcement;
        if (data) setForm((prev) => ({ ...prev, id: data.id }));
      }
    } catch (err) {
      setError(err.message || "Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 w-[42rem]">
      <div style={{ background: form.active ? form.bg : "#e2e8f0", color: form.active ? form.color : "#94a3b8" }} className="rounded-xl px-4 py-3 text-sm font-medium text-center transition-all">
        {form.active ? form.message || "Your announcement message will appear here" : "Announcement bar is disabled"}
        {form.link && form.active && <span className="ml-2 underline cursor-pointer">Learn more -&gt;</span>}
      </div>
      <div className={`rounded-2xl border p-6 space-y-4 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Message</label>
        <input value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`} />
        <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Link URL</label>
        <input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Background</label>
            <input type="color" value={form.bg} onChange={e=>setForm({...form,bg:e.target.value})} className="w-full h-10 rounded-lg" />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Text</label>
            <input type="color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="w-full h-10 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>Enabled</span>
          <button onClick={() => setForm({...form,active:!form.active})} className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.active?"bg-indigo-500":dark?"bg-slate-600":"bg-slate-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.active?"translate-x-6":"translate-x-0.5"}`} />
          </button>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button onClick={save} disabled={saving} className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-medium text-sm hover:bg-indigo-600 transition-colors">{saving ? "Saving..." : "Save Announcement"}</button>
      </div>
    </div>
  );
}

function MediaPage({ dark, token }) {
  const [media, setMedia] = useState([]);
  const [tab, setTab] = useState("all");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/media", { token });
      setMedia(res.data?.media || []);
    } catch (err) {
      setError(err.message || "Failed to load media");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const handleUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("media", file));
    try {
      await apiRequest("/api/media/upload", { method: "POST", body: formData, token, isFormData: true });
      await load();
    } catch (err) {
      setError(err.message || "Upload failed");
    }
  };

  const removeItem = async (id) => {
    try {
      await apiRequest(`/api/media/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const filtered = tab === "all" ? media : media.filter((m) => (tab === "images" ? m.type?.startsWith("image") : m.type?.startsWith("video")));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium cursor-pointer">
          <Upload size={14} /> Upload Media
          <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </label>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
      <div className="flex gap-2">
        {["all", "images", "videos"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab===t ? "bg-indigo-500 text-white" : dark?"bg-slate-800 text-slate-300":"bg-slate-100 text-slate-600"}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map((item, i) => (
          <div key={item.id || i} className={`rounded-xl border overflow-hidden ${dark?"bg-slate-800 border-slate-700":"bg-white border-slate-100"}`}>
            <div className={`w-full h-28 ${dark?"bg-slate-700":"bg-slate-100"}`}>
              {item.url ? (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Preview</div>
              )}
            </div>
            <div className="p-2 flex justify-between items-center text-xs">
              <span className={dark?"text-slate-300":"text-slate-600"}>{item.type || "file"}</span>
              <button onClick={() => removeItem(item.id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className={`col-span-full text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>No media found.</div>
        )}
      </div>
    </div>
  );
}

function WebsiteSettingsPage({ dark, token }) {
  const [form, setForm] = useState({
    siteName:"", email:"", phone:"", footer:"",
    facebook:"", instagram:"", youtube:"", tiktok:""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/api/settings", { token });
        const data = res.data?.settings;
        if (data) {
          setForm({
            siteName: data.site_name || "",
            email: data.contact_email || "",
            phone: data.phone || "",
            footer: data.footer_text || "",
            facebook: data.facebook_url || "",
            instagram: data.instagram_url || "",
            youtube: data.youtube_url || "",
            tiktok: data.tiktok_url || ""
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load settings");
      }
    };
    load();
  }, [token]);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/settings", {
        method: "PUT",
        body: {
          site_name: form.siteName,
          contact_email: form.email,
          phone: form.phone,
          footer_text: form.footer,
          facebook_url: form.facebook,
          instagram_url: form.instagram,
          youtube_url: form.youtube,
          tiktok_url: form.tiktok
        },
        token
      });
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type="text", placeholder="") => (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})} placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"}`} />
    </div>
  );

  return (
    <div className="space-y-5 w-[42rem]">
      <div className={`rounded-2xl border p-6 space-y-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <h3 className={`font-semibold text-base ${dark ? "text-white" : "text-slate-800"}`}>General Settings</h3>
        {field("Site Name","siteName","text","Enter site name")}
        {field("Contact Email","email","email","admin@example.com")}
        {field("Phone Number","phone","tel")}
        {field("Footer Text","footer")}
      </div>
      <div className={`rounded-2xl border p-6 space-y-4 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <h3 className={`font-semibold text-base ${dark ? "text-white" : "text-slate-800"}`}>Social Links</h3>
        {[
          {label:"Facebook", key:"facebook"},
          {label:"Instagram", key:"instagram"},
          {label:"YouTube", key:"youtube"},
          {label:"TikTok", key:"tiktok"},
        ].map(s => (
          <div key={s.key}>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>{s.label}</label>
            <input value={form[s.key]} onChange={e => setForm({...form, [s.key]: e.target.value})} placeholder={`${s.label} URL`} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"}`} />
          </div>
        ))}
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button onClick={save} className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-medium text-sm hover:bg-indigo-600 transition-colors">{saving ? "Saving..." : "Save Settings"}</button>
      </div>
    </div>
  );
}
function CategoriesPage({ dark, token }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/categories", { token });
      setCategories(res.data?.categories || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const removeCategory = async (id) => {
    try {
      await apiRequest(`/api/categories/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  return (
    <div className="space-y-5">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
        <table className="w-full text-sm">
          <thead className={`${dark?"bg-slate-700/50 text-slate-400":"bg-slate-50 text-slate-500"} text-xs`}>
            <tr>{["Category","Slug","Subcategories","Products","Status","Actions"].map(h=>(
              <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {categories.map((c,i)=>(
              <tr key={c.id || i} className={`border-t ${dark?"border-slate-700 hover:bg-slate-700/30":"border-slate-50 hover:bg-slate-50"} transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${dark?"bg-slate-700":"bg-slate-100"}`}>IMG</div>
                    <span className={`font-semibold ${dark?"text-slate-200":"text-slate-700"}`}>{c.name}</span>
                  </div>
                </td>
                <td className={`px-4 py-3 font-mono text-xs ${dark?"text-slate-400":"text-slate-500"}`}>/{c.slug}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-400":"text-slate-500"}`}>{c.parent_id ? "Sub" : "-"}</td>
                <td className={`px-4 py-3 font-medium ${dark?"text-slate-300":"text-slate-600"}`}>-</td>
                <td className="px-4 py-3"><StatusBadge status={"active"} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"><Eye size={14}/></button>
                    <button className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30"><Edit size={14}/></button>
                    <button onClick={() => removeCategory(c.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {!categories.length && (
              <tr>
                <td colSpan={6} className={`px-4 py-6 text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HomepageBuilderPage({ dark, token }) {
  const [sections, setSections] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/homepage", { token });
      const items = res.data?.sections || [];
      setSections(items.map((s, index) => ({
        id: s.id,
        name: s.type,
        enabled: s.is_active,
        desc: s.title || s.content || ""
      })));
    } catch (err) {
      setError(err.message || "Failed to load sections");
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const toggle = async (id) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      await apiRequest(`/api/admin/homepage/${id}`, {
        method: "PUT",
        body: { is_active: !section.enabled },
        token
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to update section");
    }
  };

  const onDragStart = (e, id) => { setDragging(id); e.dataTransfer.effectAllowed="move"; };
  const onDragOver = (e, id) => { e.preventDefault(); setDragOver(id); };
  const onDrop = async (e, targetId) => {
    e.preventDefault();
    if (dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const arr = [...sections];
    const fromIdx = arr.findIndex(s => s.id===dragging);
    const toIdx = arr.findIndex(s => s.id===targetId);
    const [removed] = arr.splice(fromIdx,1);
    arr.splice(toIdx,0,removed);
    setSections(arr);
    setDragging(null); setDragOver(null);
  };

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  return (
    <div className="flex gap-5 w-[64rem]">
      <div className="flex-1 space-y-3">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className={`rounded-2xl border p-4 ${card} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>Page Sections</h3>
            <span className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>Drag to reorder</span>
          </div>
          <div className="space-y-2">
            {sections.map(sec => (
              <div key={sec.id}
                draggable
                onDragStart={e => onDragStart(e, sec.id)}
                onDragOver={e => onDragOver(e, sec.id)}
                onDrop={e => onDrop(e, sec.id)}
                onDragEnd={() => { setDragging(null); setDragOver(null); }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-150
                  ${dragOver===sec.id ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : dark?"border-slate-700 hover:border-slate-600":"border-slate-100 hover:border-slate-200"}
                  ${dragging===sec.id ? "opacity-40" : "opacity-100"}`}
              >
                <div className={`p-1 rounded-lg cursor-grab ${dark?"text-slate-500":"text-slate-400"}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                    <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                    <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${dark?"text-slate-200":"text-slate-700"}`}>{sec.name}</div>
                  <div className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{sec.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${sec.enabled ? "text-emerald-500" : dark?"text-slate-500":"text-slate-400"}`}>
                    {sec.enabled ? "Visible" : "Hidden"}
                  </span>
                  <button onClick={() => toggle(sec.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${sec.enabled ? "bg-indigo-500" : dark?"bg-slate-600":"bg-slate-300"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${sec.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            ))}
            {!sections.length && (
              <div className={`text-sm ${dark?"text-slate-400":"text-slate-500"}`}>No sections available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuBuilderPage({ dark, token }) {
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/menus", { token });
      const menus = res.data?.menus || [];
      let selected = menus[0];
      if (!selected) {
        const created = await apiRequest("/api/menus", { method: "POST", body: { name: "Main Menu", slug: "main-menu" }, token });
        selected = created.data?.menu;
      }
      if (selected) {
        const itemsRes = await apiRequest(`/api/menus/${selected.slug}`, { token });
        setMenu(selected);
        setItems(itemsRes.data?.menu?.items || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load menu");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const addItem = async () => {
    if (!menu) return;
    try {
      const label = "New Item";
      const url = "/";
      await apiRequest(`/api/menus/${menu.id}/items`, {
        method: "POST",
        body: { label, url },
        token
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to add item");
    }
  };

  const removeItem = async (id) => {
    try {
      await apiRequest(`/api/menus/items/${id}`, { method: "DELETE", token });
      await load();
    } catch (err) {
      setError(err.message || "Failed to remove item");
    }
  };

  const saveOrder = async () => {
    if (!menu) return;
    try {
      await apiRequest(`/api/menus/${menu.id}/items/reorder`, {
        method: "PUT",
        body: { items: items.map((i) => i.id) },
        token
      });
    } catch (err) {
      setError(err.message || "Failed to reorder menu");
    }
  };

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  return (
    <div className="flex gap-5 w-[56rem]">
      <div className="flex-1 space-y-3">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className={`rounded-2xl border p-5 ${card} shadow-sm`}>
          <h3 className={`font-semibold mb-4 ${dark?"text-white":"text-slate-800"}`}>Navigation Menu Items</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl border ${dark?"border-slate-700":"border-slate-100"}`}>
                <div>
                  <div className={`text-sm font-medium ${dark?"text-slate-200":"text-slate-700"}`}>{item.label}</div>
                  <div className={`text-xs ${dark?"text-slate-500":"text-slate-400"}`}>{item.url}</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs">Delete</button>
              </div>
            ))}
            {!items.length && <div className={`text-sm ${dark?"text-slate-400":"text-slate-500"}`}>No menu items.</div>}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addItem} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium">Add Item</button>
            <button onClick={saveOrder} className={`px-4 py-2 rounded-xl text-sm font-medium ${dark?"bg-slate-700 text-slate-300":"bg-slate-100 text-slate-600"}`}>Save Menu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SEOPage({ dark, token }) {
  const [form, setForm] = useState({ title:"", desc:"", keywords:"" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/api/seo/site", { token });
        const site = res.data?.seo || res.data?.site;
        if (site) {
          setForm({
            title: site.seo_title || "",
            desc: site.meta_description || "",
            keywords: site.meta_keywords || ""
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load SEO settings");
      }
    };
    load();
  }, [token]);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/seo/site", {
        method: "PUT",
        body: {
          seo_title: form.title,
          meta_description: form.desc,
          meta_keywords: form.keywords
        },
        token
      });
    } catch (err) {
      setError(err.message || "Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  return (
    <div className="space-y-5 w-[64rem]">
      <div className={`rounded-2xl border p-5 ${card} shadow-sm`}>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark?"text-slate-300":"text-slate-700"}`}>SEO Title</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark?"bg-slate-700 border-slate-600 text-slate-200":"bg-white border-slate-200 text-slate-700"}`} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark?"text-slate-300":"text-slate-700"}`}>Meta Keywords</label>
            <input value={form.keywords} onChange={e=>setForm({...form,keywords:e.target.value})} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark?"bg-slate-700 border-slate-600 text-slate-200":"bg-white border-slate-200 text-slate-700"}`} />
          </div>
        </div>
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${dark?"text-slate-300":"text-slate-700"}`}>Meta Description</label>
          <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={3} className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark?"bg-slate-700 border-slate-600 text-slate-200":"bg-white border-slate-200 text-slate-700"}`} />
        </div>
        <div className="mt-4">
          <h3 className={`font-semibold mb-3 text-sm ${dark?"text-white":"text-slate-800"}`}>Google Search Preview</h3>
          <div className={`p-4 rounded-xl ${dark?"bg-slate-900":"bg-white border border-slate-100"}`}>
            <div className="text-indigo-600 text-sm font-medium truncate">{form.title || "Page Title"}</div>
            <div className="text-green-700 text-xs my-0.5">yourshop.com/page</div>
            <div className={`text-xs ${dark?"text-slate-400":"text-slate-600"} line-clamp-2`}>{form.desc || "Meta description will appear here..."}</div>
          </div>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
          <button onClick={save} className="mt-3 w-full py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors">{saving ? "Saving..." : "Save SEO Settings"}</button>
        </div>
      </div>
    </div>
  );
}

function ReviewsPage({ dark, token }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/admin/reviews", { token });
      setReviews(res.data?.reviews || []);
    } catch (err) {
      setError(err.message || "Failed to load reviews");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const toggleApproval = async (id, approved) => {
    try {
      await apiRequest(`/api/admin/reviews/${id}`, { method: "PUT", body: { is_approved: approved }, token });
      await load();
    } catch (err) {
      setError(err.message || "Failed to update review");
    }
  };

  const Stars = ({n}) => <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} size={12} className={i<=n?"text-amber-400 fill-amber-400":"text-slate-300"} />)}</div>;
  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  return (
    <div className="space-y-5">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
        <table className="w-full text-sm">
          <thead className={`${dark?"bg-slate-700/50 text-slate-400":"bg-slate-50 text-slate-500"} text-xs`}>
            <tr>{["Customer","Product","Rating","Comment","Date","Status","Actions"].map(h=>(
              <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {reviews.map((r,i)=>(
              <tr key={r.id || i} className={`border-t ${dark?"border-slate-700 hover:bg-slate-700/30":"border-slate-50 hover:bg-slate-50"} transition-colors`}>
                <td className={`px-4 py-3 font-medium ${dark?"text-slate-200":"text-slate-700"}`}>{`${r.first_name || ""} ${r.last_name || ""}`.trim() || r.email}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-400":"text-slate-500"} w-32 truncate`}>{r.product_name}</td>
                <td className="px-4 py-3"><Stars n={r.rating}/></td>
                <td className={`px-4 py-3 ${dark?"text-slate-400":"text-slate-500"} w-48`}><span className="line-clamp-2 text-xs">{r.body || r.title}</span></td>
                <td className={`px-4 py-3 text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{formatDate(r.created_at)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.is_approved?"active":"pending"}/></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {!r.is_approved && <button onClick={() => toggleApproval(r.id, true)} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"><CheckCircle size={13}/></button>}
                    <button onClick={() => toggleApproval(r.id, false)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {!reviews.length && (
              <tr>
                <td colSpan={7} className={`px-4 py-6 text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentLogsPage({ dark, token, mode }) {
  const [logs, setLogs] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        if (mode === "disputes") {
          const res = await apiRequest("/api/payments/disputes", { token });
          setDisputes(res.data?.disputes || []);
        } else {
          const res = await apiRequest("/api/payments/logs", { token });
          setLogs(res.data?.logs || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load payment logs");
      }
    };
    load();
  }, [token, mode]);

  const riskColor = (r) => r>=71 ? "text-red-500" : r>=31 ? "text-orange-500" : "text-emerald-500";
  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";

  if (mode === "disputes") {
    return (
      <div className="space-y-4">
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
          <div className={`px-5 py-4 border-b ${dark?"border-slate-700":"border-slate-100"}`}>
            <h3 className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>Payment Disputes</h3>
          </div>
          <table className="w-full text-sm">
            <thead className={`${dark?"bg-slate-700/50 text-slate-400":"bg-slate-50 text-slate-500"} text-xs`}>
              <tr>{["Order ID","Method","Txn ID","Description","Status","Actions"].map(h=>(
                <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {disputes.map((d,i)=>(
                <tr key={d.id || i} className={`border-t ${dark?"border-slate-700":"border-slate-50"}`}>
                  <td className={`px-4 py-3 font-mono text-xs ${dark?"text-indigo-400":"text-indigo-600"}`}>{d.order_id}</td>
                  <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{d.payment_method}</td>
                  <td className={`px-4 py-3 font-mono text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{d.transaction_id}</td>
                  <td className={`px-4 py-3 ${dark?"text-slate-400":"text-slate-500"}`}>{d.description}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => apiRequest(`/api/payments/disputes/${d.id}`, { method: "PUT", body: { status: "under_review" }, token })} className="text-xs text-indigo-500">Review</button>
                      <button onClick={() => apiRequest(`/api/payments/disputes/${d.id}`, { method: "PUT", body: { status: "resolved" }, token })} className="text-xs text-emerald-500">Resolve</button>
                      <button onClick={() => apiRequest(`/api/payments/disputes/${d.id}`, { method: "PUT", body: { status: "rejected" }, token })} className="text-xs text-red-500">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!disputes.length && (
                <tr>
                  <td colSpan={6} className={`px-4 py-6 text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>
                    No disputes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const filteredLogs = mode === "suspicious" ? logs.filter((l) => Number(l.risk_score || 0) >= 31) : logs;

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${card} shadow-sm`}>
        <div className={`px-5 py-4 border-b flex items-center justify-between ${dark?"border-slate-700":"border-slate-100"}`}>
          <h3 className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>Payment Logs</h3>
          <button className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${dark?"border-slate-600 text-slate-300":"border-slate-200 text-slate-600"}`}>
            <Download size={12}/> Export CSV
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className={`${dark?"bg-slate-700/50 text-slate-400":"bg-slate-50 text-slate-500"} text-xs`}>
            <tr>{["Order ID","Customer","Method","Phone","Txn ID","Amount","Status","Risk Score","Date"].map(h=>(
              <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filteredLogs.map((l,i)=>(
              <tr key={l.id || i} className={`border-t ${Number(l.risk_score) >= 71 ? dark?"border-red-900/40 bg-red-900/10":"border-red-50 bg-red-50/50" : dark?"border-slate-700 hover:bg-slate-700/30":"border-slate-50 hover:bg-slate-50"}`}>
                <td className={`px-4 py-3 font-mono font-semibold text-xs ${dark?"text-indigo-400":"text-indigo-600"}`}>{l.order_id}</td>
                <td className={`px-4 py-3 font-medium ${dark?"text-slate-200":"text-slate-700"}`}>{l.customer_id || "Customer"}</td>
                <td className={`px-4 py-3 ${dark?"text-slate-300":"text-slate-600"}`}>{l.payment_method}</td>
                <td className={`px-4 py-3 font-mono text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{l.sender_phone}</td>
                <td className={`px-4 py-3 font-mono text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{l.transaction_id}</td>
                <td className={`px-4 py-3 font-semibold ${dark?"text-slate-200":"text-slate-700"}`}>{formatCurrency(l.amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={l.payment_status} /></td>
                <td className={`px-4 py-3 font-bold text-sm ${riskColor(Number(l.risk_score || 0))}`}>{l.risk_score || 0}</td>
                <td className={`px-4 py-3 text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{formatDate(l.created_at)}</td>
              </tr>
            ))}
            {!filteredLogs.length && (
              <tr>
                <td colSpan={9} className={`px-4 py-6 text-center text-sm ${dark?"text-slate-400":"text-slate-500"}`}>
                  No payment logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChatButtonPage({ dark, token }) {
  const [wa, setWa] = useState({ number:"", message:"", enabled:false });
  const [fb, setFb] = useState({ username:"", enabled:false });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/api/chat", { token });
        const data = res.data?.settings;
        if (data) {
          setWa({
            number: data.whatsapp_number || "",
            message: data.whatsapp_message || "",
            enabled: data.whatsapp_enabled
          });
          setFb({
            username: data.messenger_username || "",
            enabled: data.messenger_enabled
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load chat settings");
      }
    };
    load();
  }, [token]);

  const save = async () => {
    try {
      await apiRequest("/api/chat", {
        method: "PUT",
        body: {
          whatsapp_number: wa.number,
          whatsapp_message: wa.message,
          whatsapp_enabled: wa.enabled,
          messenger_username: fb.username,
          messenger_enabled: fb.enabled
        },
        token
      });
    } catch (err) {
      setError(err.message || "Failed to save settings");
    }
  };

  const card = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const inp = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark?"bg-slate-700 border-slate-600 text-slate-200":"bg-white border-slate-200 text-slate-700"}`;
  return (
    <div className="space-y-5 w-[42rem]">
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className={`rounded-2xl border p-6 space-y-4 ${card} shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center"><MessageCircle size={18} className="text-white"/></div>
            <div>
              <div className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>WhatsApp Button</div>
              <div className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>Floating chat button</div>
            </div>
          </div>
          <button onClick={() => setWa(w=>({...w,enabled:!w.enabled}))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${wa.enabled?"bg-emerald-500":dark?"bg-slate-600":"bg-slate-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${wa.enabled?"translate-x-6":"translate-x-0.5"}`}/>
          </button>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${dark?"text-slate-300":"text-slate-700"}`}>WhatsApp Number</label>
          <input value={wa.number} onChange={e=>setWa({...wa,number:e.target.value})} className={inp} placeholder="01XXXXXXXXX"/>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${dark?"text-slate-300":"text-slate-700"}`}>Default Message</label>
          <textarea value={wa.message} onChange={e=>setWa({...wa,message:e.target.value})} rows={2} className={inp+" resize-none"} placeholder="Hello! I need help..."/>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 space-y-4 ${card} shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center"><MessageCircle size={18} className="text-white"/></div>
            <div>
              <div className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>Messenger Button</div>
              <div className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>Floating chat button</div>
            </div>
          </div>
          <button onClick={() => setFb(f=>({...f,enabled:!f.enabled}))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${fb.enabled?"bg-indigo-500":dark?"bg-slate-600":"bg-slate-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${fb.enabled?"translate-x-6":"translate-x-0.5"}`}/>
          </button>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1.5 ${dark?"text-slate-300":"text-slate-700"}`}>Messenger Username</label>
          <input value={fb.username} onChange={e=>setFb({...fb,username:e.target.value})} className={inp} placeholder="myshopbd"/>
        </div>
      </div>

      <button onClick={save} className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-medium text-sm hover:bg-indigo-600 transition-colors">Save Settings</button>
    </div>
  );
}

function IntegrationsPage({ dark, token }) {
  const [pixels, setPixels] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await apiRequest("/api/marketing", { token });
      setPixels(res.data?.integrations || []);
    } catch (err) {
      setError(err.message || "Failed to load integrations");
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const update = async (provider, updatePayload) => {
    try {
      await apiRequest(`/api/marketing/${provider}`, {
        method: "PUT",
        body: updatePayload,
        token
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to update integration");
    }
  };

  return (
    <div className="space-y-4 w-[42rem]">
      {error && <div className="text-sm text-red-500">{error}</div>}
      {pixels.map((p, i) => (
        <div key={p.provider || i} className={`rounded-2xl border p-5 ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center"><Globe size={18} className="text-white"/></div>
              <div>
                <div className={`font-semibold ${dark?"text-white":"text-slate-800"}`}>{p.provider}</div>
                <div className={`text-xs ${dark?"text-slate-400":"text-slate-500"}`}>{p.is_enabled ? "Enabled" : "Disabled"}</div>
              </div>
            </div>
            <button onClick={() => update(p.provider, { is_enabled: !p.is_enabled, tracking_id: p.tracking_id || "" })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${p.is_enabled?"bg-indigo-500":dark?"bg-slate-600":"bg-slate-300"}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${p.is_enabled?"translate-x-6":"translate-x-0.5"}`} />
            </button>
          </div>
          <input value={p.tracking_id || ""} onChange={(e) => {
              const val = e.target.value;
              setPixels(prev => prev.map((x) => x.provider === p.provider ? { ...x, tracking_id: val } : x));
            }}
            placeholder="Tracking ID"
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 ${dark ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400"}`} />
          <button onClick={() => update(p.provider, { tracking_id: p.tracking_id || "", is_enabled: p.is_enabled })}
            className={`mt-3 px-4 py-2 rounded-xl text-xs font-medium ${dark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} transition-colors`}>Save</button>
        </div>
      ))}
    </div>
  );
}

//  MAIN COMPONENT  

export default function AdminDashboard() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState(() => routeToPageId(router.pathname));
  const [expanded, setExpanded] = useState({ products:true, payments:true });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    setAdminToken(stored);
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    setActivePage(routeToPageId(router.pathname));
  }, [router.pathname]);
  const [notifications, setNotifications] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!authChecked) {
    return <div className="min-h-screen w-full bg-slate-50" />;
  }

  const pageTitle = () => {
    const flat = navItems.flatMap(n => n.children ? [n, ...n.children] : [n]);
    const found = flat.find(n => n.id === activePage);
    return found?.label || "Dashboard";
  };

  const renderPage = () => {
    const map = {
      dashboard: <DashboardPage dark={dark} token={adminToken} />,
      "all-products": <ProductsPage dark={dark} token={adminToken} />,
      "add-product": <ProductsPage dark={dark} token={adminToken} />,
      "product-gallery": <MediaPage dark={dark} token={adminToken} />,
      "product-tags": <ProductsPage dark={dark} token={adminToken} />,
      "all-categories": <CategoriesPage dark={dark} token={adminToken} />,
      "add-category": <CategoriesPage dark={dark} token={adminToken} />,
      subcategories: <CategoriesPage dark={dark} token={adminToken} />,
      "all-orders": <OrdersPage dark={dark} token={adminToken} page={activePage} />,
      "pending-orders": <OrdersPage dark={dark} token={adminToken} page={activePage} />,
      "processing-orders": <OrdersPage dark={dark} token={adminToken} page={activePage} />,
      "shipped-orders": <OrdersPage dark={dark} token={adminToken} page={activePage} />,
      "delivered-orders": <OrdersPage dark={dark} token={adminToken} page={activePage} />,
      "cancelled-orders": <OrdersPage dark={dark} token={adminToken} page={activePage} />,
      "payment-overview": <PaymentVerificationPage dark={dark} token={adminToken} />,
      "pending-verification": <PaymentVerificationPage dark={dark} token={adminToken} />,
      "payment-logs": <PaymentLogsPage dark={dark} token={adminToken} />,
      "suspicious-payments": <PaymentLogsPage dark={dark} token={adminToken} mode="suspicious" />,
      "risk-report": <PaymentAnalyticsPage dark={dark} token={adminToken} mode="risk" />,
      "payment-disputes": <PaymentLogsPage dark={dark} token={adminToken} mode="disputes" />,
      "payment-analytics": <PaymentAnalyticsPage dark={dark} token={adminToken} />,
      "gateway-settings": <GatewaySettingsPage dark={dark} token={adminToken} />,
      customers: <CustomersPage dark={dark} token={adminToken} />,
      reviews: <ReviewsPage dark={dark} token={adminToken} />,
      coupons: <CouponsPage dark={dark} token={adminToken} />,
      announcement: <AnnouncementPage dark={dark} token={adminToken} />,
      "homepage-builder": <HomepageBuilderPage dark={dark} token={adminToken} />,
      "menu-builder": <MenuBuilderPage dark={dark} token={adminToken} />,
      seo: <SEOPage dark={dark} token={adminToken} />,
      integrations: <IntegrationsPage dark={dark} token={adminToken} />,
      "chat-button": <ChatButtonPage dark={dark} token={adminToken} />,
      media: <MediaPage dark={dark} token={adminToken} />,
      analytics: <PaymentAnalyticsPage dark={dark} token={adminToken} />,
      "website-settings": <WebsiteSettingsPage dark={dark} token={adminToken} />,
      roles: <CustomersPage dark={dark} token={adminToken} mode="roles" />,
    };
    return map[activePage] || (
      <div className={`rounded-2xl border p-12 text-center ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} shadow-sm`}>
        <div className="text-5xl mb-4"></div>
        <div className={`text-lg font-semibold mb-2 ${dark ? "text-slate-200" : "text-slate-700"}`}>{pageTitle()}</div>
        <div className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Click any sidebar menu item to navigate.</div>
      </div>
    );
  };

  const navSections = [...new Set(navItems.map(n => n.section))];

  return (
    <div className={`min-h-screen w-full flex text-sm font-sans ${dark ? "bg-slate-900" : "bg-slate-50"}`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 transition-all duration-300 flex flex-col ${dark ? "bg-slate-800 border-r border-slate-700" : "bg-white border-r border-slate-100"} shadow-sm overflow-hidden`} style={{ height:"100vh", position:"sticky", top:0 }}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <Store size={16} className="text-white" />
          </div>
          {sidebarOpen && <span className={`font-bold text-base tracking-tight ${dark ? "text-white" : "text-slate-800"}`}>ShopAdmin</span>}
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin">
          {navSections.map(section => {
            const items = navItems.filter(n => n.section === section);
            return (
              <div key={section} className="mb-2">
                {sidebarOpen && <div className={`px-2 py-1.5 text-xs font-semibold tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{section}</div>}
                {items.map(item => {
                  const isActive = activePage === item.id || (item.children && item.children.some(c => c.id === activePage));
                  const isExpanded = expanded[item.id];
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (item.children) {
                            setExpanded(e => ({ ...e, [item.id]: !e[item.id] }));
                          } else {
                            setActivePage(item.id);
                          }
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all duration-150 ${isActive ? "bg-indigo-500 text-white" : dark ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}
                      >
                        <item.icon size={16} className="flex-shrink-0" />
                        {sidebarOpen && <>
                          <span className="flex-1 text-left font-medium text-xs">{item.label}</span>
                          {item.children && <ChevronDown size={13} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />}
                        </>}
                      </button>
                      {sidebarOpen && item.children && isExpanded && (
                        <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 pl-3 mb-1 border-indigo-200 dark:border-slate-700">
                          {item.children.map(child => (
                            <button
                              key={child.id}
                              onClick={() => { const next = pageIdToRoute(child.id); setActivePage(child.id); if (next) router.push(next); }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${activePage === child.id ? "text-indigo-500 font-semibold" : dark ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}
                            >{child.label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
        {/* User */}
        <div className={`p-3 border-t ${dark ? "border-slate-700" : "border-slate-100"}`}>
          <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl ${dark ? "hover:bg-slate-700" : "hover:bg-slate-50"} cursor-pointer transition-colors`}>
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold truncate ${dark ? "text-slate-200" : "text-slate-700"}`}>Admin User</div>
                <div className={`text-xs truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>admin@shop.com</div>
              </div>
            )}
            {sidebarOpen && <LogOut size={13} className={dark ? "text-slate-500" : "text-slate-400"} />}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 w-full flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className={`sticky top-0 z-10 flex items-center gap-4 px-5 py-3.5 border-b ${dark ? "bg-slate-800/90 border-slate-700" : "bg-white/90 border-slate-100"} backdrop-blur-sm shadow-sm`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-xl ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}>
            <Menu size={18} />
          </button>
          <div>
            <h1 className={`font-bold text-base ${dark ? "text-white" : "text-slate-800"}`}>{pageTitle()}</h1>
            <div className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Welcome back, Admin</div>
          </div>
          <div className="flex-1" />
          {/* Search */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border w-56 ${dark ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"}`}>
            <Search size={14} className={dark ? "text-slate-400" : "text-slate-400"} />
            <input placeholder="Quick search..." className={`bg-transparent outline-none text-xs flex-1 ${dark ? "text-slate-300 placeholder-slate-500" : "text-slate-600 placeholder-slate-400"}`} />
          </div>
          {/* Notif */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className={`relative p-2 rounded-xl ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}>
              <Bell size={18} />
              {notifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            {notifOpen && (
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-xl z-20 overflow-hidden ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className={`px-4 py-3 border-b font-semibold text-sm ${dark ? "border-slate-700 text-slate-200" : "border-slate-100 text-slate-700"}`}>Notifications</div>
                {[
                  { icon:"", msg:"New payment received - BDT 2,400", time:"2 min ago", dot:"bg-indigo-500" },
                  { icon:"", msg:"Suspicious transaction detected", time:"15 min ago", dot:"bg-red-500" },
                  { icon:"", msg:"Order #1042 has been delivered", time:"1 hr ago", dot:"bg-emerald-500" },
                  { icon:"", msg:"New customer registered", time:"2 hr ago", dot:"bg-blue-500" },
                ].map((n,i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 border-b ${dark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-50 hover:bg-slate-50"} cursor-pointer transition-colors`}>
                    <span className="text-lg flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{n.msg}</div>
                      <div className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{n.time}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  </div>
                ))}
                <div className="px-4 py-2.5">
                  <button onClick={() => { setNotifications(false); setNotifOpen(false); }} className="w-full text-xs text-indigo-500 font-medium">Mark all as read</button>
                </div>
              </div>
            )}
          </div>
          {/* Dark mode */}
          <button onClick={() => setDark(!dark)} className={`p-2 rounded-xl ${dark ? "hover:bg-slate-700 text-amber-400" : "hover:bg-slate-100 text-slate-500"} transition-colors`}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full p-5 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}


