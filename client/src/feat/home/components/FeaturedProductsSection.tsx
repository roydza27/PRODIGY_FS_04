import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import type { Product } from "@/features/products/types/product.types";

// 1. Import your dynamic, feature-rich ProductCard component
import ProductCard from "@/features/products/components/ProductCard"; // Adjust this relative import path to match your folder structure

interface FeaturedProductsSectionProps {
  products?: Product[];
}

const FeaturedProductsSection = ({ products = [] }: FeaturedProductsSectionProps) => {
  
  // Grab a slice of designated featured inventory, or fall back to a section catalogue slice
  const displayProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Filter items based on your unified runtime schema layout flags
    const targets = products.filter((p: any) => p.isFeatured || p.featured);
    return targets.length > 0 ? targets.slice(0, 4) : products.slice(0, 4);
  }, [products]);

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 text-left">
        
        {/* Section Header Row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-400">
              Featured Products
            </div>
            <div className="space-y-2">
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Handpicked items for your local store.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-zinc-400">
                Build a polished storefront with clean product cards, clear pricing, and strong add-to-cart actions.
              </p>
            </div>
          </div>

          <Link to="/products">
            <Button className="w-fit rounded-2xl bg-[#DB4444] px-5 py-6 text-white hover:bg-[#c53a3a]">
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Modular Products Grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {displayProducts.map((product) => (
            // 2. Map structural components directly without breaking layout flows
            <div key={product._id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProductsSection;