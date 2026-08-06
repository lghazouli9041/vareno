import type { Metadata } from "next";
import { CompareView } from "@/components/compare/CompareView";

export const metadata: Metadata = {
  title: "Compare Products",
  description:
    "Compare VARENO faucets side by side—price, finish, material, dimensions, and more.",
  robots: { index: false, follow: false },
};

export default function ComparePage() {
  return <CompareView />;
}
