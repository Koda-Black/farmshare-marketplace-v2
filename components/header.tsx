"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Moon, Sun, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useAdminAuth } from "@/hooks/use-admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { NotificationsPopover } from "@/components/notifications-popover";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { user, isAuthenticated, logout, theme, toggleTheme } = useStore();
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAnyAuthenticated = isAuthenticated || isAdminAuthenticated;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = () => {
    if (user?.role === "vendor") {
      router.push("/vendor/dashboard");
    } else if (user?.role === "buyer") {
      router.push("/buyer/dashboard");
    } else {
      router.push("/profile");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg shadow-primary/10"
          : "bg-primary"
      } text-primary-foreground`}
    >
      <div className="px-[30px] lg:px-[60px] flex h-16 items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo - Using new icon from farmshare */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <Image
            src="/assets/logo/cowrie-icon-accent.svg"
            alt="Farmshare"
            width={40}
            height={40}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-lg font-bold text-primary-foreground tracking-tight">
            farmshare
          </span>
        </Link>

        {/* Desktop Navigation - Enhanced with hover effects */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {[
            { href: "/#product", label: "Products" },
            { href: "/#pools", label: "Pools" },
            { href: "/#features", label: "Features" },
            { href: "/#testimonials", label: "Testimonials" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-primary-foreground/85 hover:text-primary-foreground transition-colors duration-200 rounded-full hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions - Enhanced */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle - Enhanced */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-primary-foreground hover:bg-white/10 rounded-full transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
            ) : (
              <Sun className="h-4 w-4 transition-transform duration-200 hover:rotate-45" />
            )}
          </Button>

          {/* Desktop Auth buttons - Enhanced */}
          {isAnyAuthenticated ? (
            <>
              <NotificationsPopover />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-primary-foreground hover:bg-white/10 rounded-full transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 animate-fade-in"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDashboardClick}
                    className="cursor-pointer"
                  >
                    Dashboard
                  </DropdownMenuItem>
                  {user?.role === "vendor" && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendor/pools">My Pools</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/buyer/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/notifications">
                      Notification Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive cursor-pointer focus:text-destructive"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden lg:flex text-primary-foreground hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                asChild
                className="hidden lg:flex bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/signup" className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sign up
                </Link>
              </Button>
            </>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary-foreground hover:bg-white/10 lg:hidden rounded-full transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Navigation Links */}
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/#product"
                    className="text-lg font-medium hover:text-accent transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/#pools"
                    className="text-lg font-medium hover:text-accent transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pools
                  </Link>
                  <Link
                    href="/#features"
                    className="text-lg font-medium hover:text-accent transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/#testimonials"
                    className="text-lg font-medium hover:text-accent transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                </nav>

                {/* Mobile & Tablet: Auth buttons in menu */}
                {!isAnyAuthenticated && (
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}

                {/* Authenticated user menu items for mobile/tablet */}
                {isAnyAuthenticated && (
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <div className="flex flex-col gap-1 pb-3">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {user?.role}
                      </Badge>
                    </div>
                    <Link
                      href={
                        user?.role === "vendor"
                          ? "/vendor/dashboard"
                          : "/buyer/dashboard"
                      }
                      className="text-base hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user?.role === "vendor" && (
                      <Link
                        href="/vendor/pools"
                        className="text-base hover:text-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Pools
                      </Link>
                    )}
                    <Link
                      href="/buyer/orders"
                      className="text-base hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/profile"
                      className="text-base hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/notifications"
                      className="text-base hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Notifications
                    </Link>
                    <Link
                      href="/settings/notifications"
                      className="text-base hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Notification Settings
                    </Link>
                    <Button
                      variant="destructive"
                      className="mt-2"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
