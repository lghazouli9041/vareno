import type { WishlistEntry } from "@/store/wishlist";

export async function shareWishlist(entries: WishlistEntry[]): Promise<{
  method: "native" | "clipboard" | "failed";
}> {
  if (typeof window === "undefined") {
    return { method: "failed" };
  }

  const slugs = [...new Set(entries.map((item) => item.slug))];
  const url = new URL("/wishlist", window.location.origin);
  if (slugs.length) {
    url.searchParams.set("share", slugs.join(","));
  }

  const title = "My VARENO Wishlist";
  const text =
    slugs.length === 0
      ? "Explore the VARENO collection."
      : `I've saved ${slugs.length} VARENO ${slugs.length === 1 ? "piece" : "pieces"} for my interior.`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text, url: url.toString() });
      return { method: "native" };
    } catch {
      // User cancelled or share failed — try clipboard fallback.
    }
  }

  try {
    await navigator.clipboard.writeText(url.toString());
    return { method: "clipboard" };
  } catch {
    return { method: "failed" };
  }
}
