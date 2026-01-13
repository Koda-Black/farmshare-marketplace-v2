"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/hooks/use-admin";
import { adminService } from "@/lib/admin.service";
import {
  LayoutDashboard,
  Users,
  Package,
  AlertTriangle,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
  Wallet,
  Mail,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Verifications",
    href: "/admin/verifications",
    icon: Shield,
  },
  {
    name: "Pools",
    href: "/admin/pools",
    icon: Package,
  },
  {
    name: "Payouts",
    href: "/admin/payouts",
    icon: Wallet,
  },
  {
    name: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    name: "Disputes",
    href: "/admin/disputes",
    icon: AlertTriangle,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    adminService.adminLogout();
    window.location.href = "/admin/login";
  };

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] justify-between flex-shrink-0">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 font-semibold transition-all",
            isCollapsed && "justify-center"
          )}
        >
          <Shield className="h-6 w-6 flex-shrink-0" />
          {!isCollapsed && <span>FarmShare Admin</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <nav
          className={cn(
            "grid items-start gap-1 text-sm font-medium transition-all",
            isCollapsed ? "px-2" : "px-2 lg:px-4"
          )}
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : "transparent",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={cn("border-t p-3 flex-shrink-0", isCollapsed && "px-2")}>
        <div className="space-y-2">
          {!isCollapsed ? (
            <div className="p-2 rounded-lg bg-muted">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">
                {admin?.email}
              </p>
              <Badge variant="secondary" className="mt-1">
                {admin?.role}
              </Badge>
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-muted flex justify-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start transition-all",
              isCollapsed && "justify-center px-2"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Fixed position */}
      <div
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 h-screen border-r bg-muted/40 transition-all duration-300 z-40",
          isCollapsed ? "w-[60px]" : "w-[220px] lg:w-[280px]"
        )}
      >
        {sidebarContent}
      </div>
      {/* Spacer div to push content right */}
      <div
        className={cn(
          "hidden md:block flex-shrink-0 transition-all duration-300",
          isCollapsed ? "w-[60px]" : "w-[220px] lg:w-[280px]"
        )}
      />

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[280px]">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
