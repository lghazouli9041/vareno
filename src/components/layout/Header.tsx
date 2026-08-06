"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CompareBar } from "@/components/compare/CompareBar";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { Container } from "@/components/layout/Container";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openCart);
  const isHome = pathname === "/";
  const inverted = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          inverted
            ? "bg-transparent"
            : "border-b border-border/80 bg-background/90 shadow-xs backdrop-blur-md",
        )}
      >
        {inverted && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/45 to-transparent"
            aria-hidden="true"
          />
        )}
        <Container className="relative">
          <div className="flex h-20 items-center justify-between gap-6">
            <Logo
              inverted={inverted}
              className={cn(
                inverted && "drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]",
              )}
            />

            <DesktopNav inverted={inverted} />

            <div
              className={cn(
                "flex items-center gap-1 sm:gap-2",
                inverted && "drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]",
              )}
            >
              <HeaderAuth inverted={inverted} />

              <Link
                href="/wishlist"
                className={cn(
                  "relative hidden p-2 transition-colors duration-300 sm:inline-flex",
                  inverted
                    ? "text-inverse-text hover:text-accent"
                    : "text-primary hover:text-accent",
                )}
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  className={cn(wishlistCount > 0 && "fill-current text-accent")}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-primary">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className={cn(
                  "relative p-2 transition-colors duration-300",
                  inverted
                    ? "text-inverse-text hover:text-accent"
                    : "text-primary hover:text-accent",
                )}
                aria-label={`Shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-primary">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={cn(
                  "p-2 transition-colors duration-300 lg:hidden",
                  inverted ? "text-inverse-text" : "text-primary",
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer />
      <CompareBar />
    </>
  );
}
