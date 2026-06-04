import StoreHeroSection from "@/features/home/components/StoreHeroSection";
import CategorySection from "@/features/home/components/CategorySection";
import FeaturedProductsSection from "@/features/home/components/FeaturedProductsSection";
import PromoBannerSection from "@/features/home/components/PromoBannerSection";
import StoreHighlightsSection from "@/features/home/components/StoreHighlightsSection";
import CTASection from "@/features/home/components/CTASection";

import { useProducts } from "@/features/products/hooks/useProducts";

const HomePage = () => {
  const { products, loading, error } = useProducts();

  return (
    <div className="min-h-screen bg-[#111113] text-zinc-100">
      <main className="flex flex-col overflow-hidden">
        <section id="hero" className="pt-4 scroll-mt-24">
          {/* PASS PROPS HERE */}
          <StoreHeroSection products={products} isLoading={loading} />
        </section>

        <section id="categories" className="pt-24 md:pt-32 scroll-mt-24">
          <CategorySection />
        </section>

        <section id="featured-products" className="pt-24 md:pt-32 scroll-mt-24">
          <FeaturedProductsSection products={products} />
        </section>

        <section id="promo-banner" className="pt-24 md:pt-32 scroll-mt-24">
          <PromoBannerSection />
        </section>

        <section id="highlights" className="pt-24 md:pt-32 scroll-mt-24">
          <StoreHighlightsSection />
        </section>

        <section id="cta" className="pt-24 pb-20 md:pt-32 md:pb-28 scroll-mt-24">
          <CTASection />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
