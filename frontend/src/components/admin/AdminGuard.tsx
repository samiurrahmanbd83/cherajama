import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

type AdminGuardProps = {
  children: ReactNode;
};

const AdminGuard = ({ children }: AdminGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default AdminGuard;
