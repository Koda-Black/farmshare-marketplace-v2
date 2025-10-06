"use client"

import Link from "next/link"
import { User, Leaf, Moon, Sun } from "lucide-react"
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

export function Header() {
  const { user, isAuthenticated, logout, theme, toggleTheme } = useStore()

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
      <div className="px-[30px] flex h-16 items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-primary-foreground">farmshare</span>
          </Link>

          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
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
            <nav className="hidden md:flex items-center gap-6">
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/10"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

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
              <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
