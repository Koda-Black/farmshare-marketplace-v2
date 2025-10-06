"use client"

import Link from "next/link"
import { User, Leaf, Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { NotificationsPopover } from "@/components/notifications-popover"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { user, isAuthenticated, logout, theme, toggleTheme } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
      <div className="px-[30px] flex h-16 items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-primary-foreground">farmshare</span>
        </Link>

        {/* Desktop Navigation - Centered on large screens */}
        {!isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <Link
              href="/#product"
              className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              Product
            </Link>
            <Link
              href="/#pools"
              className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              Pools
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
            >
              Testimonials
            </Link>
          </nav>
        )}

        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {user?.role === "vendor" && (
              <>
                <Link
                  href="/vendor/dashboard"
                  className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/vendor/pools"
                  className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  My Pools
                </Link>
              </>
            )}
            {user?.role === "buyer" && (
              <>
                <Link
                  href="/buyer/marketplace"
                  className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="/buyer/orders"
                  className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                >
                  My Orders
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors"
              >
                Admin Console
              </Link>
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle - Always visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Desktop Auth buttons - Visible only on large screens */}
          {isAuthenticated ? (
            <>
              <NotificationsPopover />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/notifications">Notification Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
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
                className="hidden lg:flex text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="hidden lg:flex bg-accent hover:bg-accent/90 text-white rounded-full">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                {/* Navigation Links */}
                {!isAuthenticated && (
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/#product"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Product
                    </Link>
                    <Link
                      href="/#pools"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pools
                    </Link>
                    <Link
                      href="/#features"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="/#testimonials"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Testimonials
                    </Link>
                  </nav>
                )}

                {isAuthenticated && (
                  <nav className="flex flex-col gap-4">
                    {user?.role === "vendor" && (
                      <>
                        <Link
                          href="/vendor/dashboard"
                          className="text-lg font-medium hover:text-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/vendor/pools"
                          className="text-lg font-medium hover:text-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Pools
                        </Link>
                      </>
                    )}
                    {user?.role === "buyer" && (
                      <>
                        <Link
                          href="/buyer/marketplace"
                          className="text-lg font-medium hover:text-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Marketplace
                        </Link>
                        <Link
                          href="/buyer/orders"
                          className="text-lg font-medium hover:text-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                    {user?.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="text-lg font-medium hover:text-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Console
                      </Link>
                    )}
                  </nav>
                )}

                {/* Mobile & Tablet: Auth buttons in menu */}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <Button asChild variant="outline" size="lg" onClick={() => setMobileMenuOpen(false)}>
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
                {isAuthenticated && (
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <div className="flex flex-col gap-1 pb-3">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="w-fit text-xs mt-1">
                        {user?.role}
                      </Badge>
                    </div>
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
                        logout()
                        setMobileMenuOpen(false)
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
  )
}
