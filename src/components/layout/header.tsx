"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNetwork } from "@/lib/context/network-context";
import { Activity, Bot, ShieldCheck, Network, Terminal, Menu, X, ArrowLeftRight, Globe, Zap } from "lucide-react";
import { SpectraLogo } from "@/components/common/logo";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/verify", label: "Verify", icon: ShieldCheck },
  { href: "/swarms", label: "Swarms", icon: Network },
  { href: "/playground", label: "Simulator", icon: Zap },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { network, isMainnet, setNetwork, toggleNetwork, activeChain } = useNetwork();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <SpectraLogo size={34} />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground font-mono">
                SPECTRA
              </span>
              <span className="text-[10px] font-mono text-muted tracking-wider">
                0G OBSERVABILITY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors font-sans",
                    isActive
                      ? "bg-surface text-accent font-semibold border border-border"
                      : "text-muted hover:bg-surface/60 hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 0G Interactive Network Switcher Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border bg-surface p-0.5 text-xs font-mono">
            <button
              onClick={() => setNetwork("mainnet")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all",
                isMainnet
                  ? "bg-accent text-white font-semibold shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
              title="Switch to 0G Mainnet (Chain ID 56600)"
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", isMainnet ? "bg-white" : "bg-muted")} />
              <span>Mainnet</span>
            </button>

            <button
              onClick={() => setNetwork("testnet")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all",
                !isMainnet
                  ? "bg-purple-600 text-white font-semibold shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
              title="Switch to 0G Newton Testnet (Chain ID 16600)"
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", !isMainnet ? "bg-white" : "bg-muted")} />
              <span>Newton Testnet</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-md border border-border p-1.5 text-muted hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-1">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted hover:bg-background hover:text-foreground"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
