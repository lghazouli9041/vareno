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
    const onScroll = () => setScrolled(window.scrollY > 32);
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
          "fixed inset-x-0 top-0 z-[60] transition-[background-color,box-shadow,backdrop-filter,border-color] duration-500",
          inverted
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border/60 bg-background/80 shadow-xs backdrop-blur-xl",
        )}
      >
        {inverted && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-primary/50 to-transparent"
            aria-hidden="true"
          />
        )}

        <Container className="relative">
          <div className="flex h-[5.25rem] items-center justify-between gap-6">
            <Logo
              inverted={inverted}
              className={cn(
                inverted && "drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]",
              )}
            />

            <DesktopNav inverted={inverted} />

            <div
              className={cn(
                "flex items-center gap-0.5 sm:gap-1",
                inverted && "drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
              )}
            >
              <HeaderAuth inverted={inverted} />

              <Link
                href="/wishlist"
                className={cn(
                  "relative hidden p-2.5 transition-colors duration-300 sm:inline-flex",
                  inverted
                    ? "text-inverse-text hover:text-accent"
                    : "text-primary hover:text-accent",
                )}
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
              >
                <Heart
                  size={18}
                  strokeWidth={1.35}
                  className={cn(wishlistCount > 0 && "fill-current text-accent")}
                />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center bg-accent px-1 text-[9px] font-medium text-primary">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className={cn(
                  "relative p-2.5 transition-colors duration-300",
                  inverted
                    ? "text-inverse-text hover:text-accent"
                    : "text-primary hover:text-accent",
                )}
                aria-label={`Shopping cart${itemCount ? `, ${itemCount} items` : ""}`}
              >
                <ShoppingBag size={18} strokeWidth={1.35} />
                {itemCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center bg-accent px-1 text-[9px] font-medium text-primary">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={cn(
                  "p-2.5 transition-colors duration-300 lg:hidden",
                  inverted ? "text-inverse-text" : "text-primary",
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu size={22} strokeWidth={1.35} />
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
