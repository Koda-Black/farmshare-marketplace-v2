import Link from "next/link";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50">
      {/* Newsletter Section */}
      <div className="px-[30px] lg:px-[60px] py-12 max-w-[1400px] mx-auto border-b border-border/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground">
              Get the latest pools and farming tips delivered to your inbox.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto max-w-md">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background/50 border-border/50 focus:border-primary"
            />
            <Button className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap rounded-lg shadow-lg shadow-accent/20">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="px-[30px] lg:px-[60px] py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/25 transition-transform duration-300 group-hover:scale-110">
                <Leaf className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                farmshare
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Empowering farmers and buyers through collective purchasing power.
              Join the agricultural revolution and experience fair, transparent
              trading.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <span>hello@farmshare.ng</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-accent" />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="font-semibold text-lg mb-5">For Vendors</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/become-a-vendor"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link
                  href="/verification-process"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Verification Process
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/guide"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Vendor Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/pricing"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Pricing & Fees
                </Link>
              </li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-semibold text-lg mb-5">For Buyers</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/marketplace"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Browse Pools
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/faq"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/support"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-5">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} FarmShare. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
