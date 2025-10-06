import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="px-[30px] py-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">farmshare</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering farmers and buyers through collective purchasing power.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">For Vendors</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/vendor/signup" className="hover:text-foreground transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/vendor/verification" className="hover:text-foreground transition-colors">
                  Verification Process
                </Link>
              </li>
              <li>
                <Link href="/vendor/guide" className="hover:text-foreground transition-colors">
                  Vendor Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">For Buyers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/marketplace" className="hover:text-foreground transition-colors">
                  Browse Pools
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/buyer/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FarmShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
