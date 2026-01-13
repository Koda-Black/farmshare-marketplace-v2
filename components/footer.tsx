"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8282";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "footer",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || "Successfully subscribed to our newsletter!"
        );
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Sign Up CTA Section */}
      <div className="px-[30px] lg:px-[60px] py-20 lg:py-28 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Sign up to
            <br />
            <span className="text-[#f5a8a0] italic font-serif">Farmshare</span>
          </h2>
          <Button
            asChild
            size="lg"
            className="bg-[#c5d1c5] hover:bg-[#b5c1b5] text-primary font-medium text-lg px-10 py-6 rounded-full transition-all duration-300"
          >
            <Link href="/signup">Join a pool</Link>
          </Button>
        </div>
      </div>

      {/* Horizontal Rule Separator */}
      <div className="px-[30px] lg:px-[60px] max-w-[1400px] mx-auto">
        <hr className="border-white/20" />
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="px-[30px] lg:px-[60px] py-12 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-white">
                Stay Updated
              </h3>
              <p className="text-white/70">
                Get the latest pools and farming tips delivered to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubscribe}
              className="flex gap-2 w-full md:w-auto max-w-md"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent focus:ring-accent disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-white whitespace-nowrap rounded-lg shadow-lg shadow-accent/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-[30px] lg:px-[60px] py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/assets/logo/cowrie-icon-accent.svg"
                alt="Farmshare"
                width={48}
                height={48}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                farmshare
              </span>
            </Link>
            <p className="text-white/70 leading-relaxed max-w-sm">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white">
              For Vendors
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link
                  href="/become-a-vendor"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link
                  href="/verification-process"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Verification Process
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/guide"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Vendor Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor/pricing"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Pricing & Fees
                </Link>
              </li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white">
              For Buyers
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link
                  href="/buyer/marketplace"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Browse Pools
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/faq"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/buyer/support"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white">Company</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <div className="px-[30px] lg:px-[60px] pb-8 max-w-[1400px] mx-auto flex justify-end">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-12 w-12 rounded-xl bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
}
