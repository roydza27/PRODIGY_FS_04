import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Link } from "react-router-dom";
import { productService } from "@/features/products/services/product.service";
import type { Product } from "@/features/products/types/product.types";

import ThreeDCarousel from "./ThreeDCarousel";
import type { ThreeDCarouselItem } from "./ThreeDCarousel";

type AnyProduct = Product & {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  brand?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  coverImage?: string;
  poster?: string;
  banner?: string;
  images?: Array<string | { url?: string; secure_url?: string }>;
  media?: Array<string | { url?: string; secure_url?: string }>;
  gallery?: Array<string | { url?: string; secure_url?: string }>;
  price?: number;
  salePrice?: number;
  discountPrice?: number;
  currentPrice?: number;
  originalPrice?: number;
  mrp?: number;
  compareAtPrice?: number;
  regularPrice?: number;
  isFeatured?: boolean;
  featured?: boolean;
  category?: string;
};

type StoreHeroSectionProps = {
  products?: Product[];
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function extractProducts(res: unknown): AnyProduct[] {
  if (Array.isArray(res)) return res as AnyProduct[];

  const data = res as {
    products?: AnyProduct[];
    data?: AnyProduct[] | { products?: AnyProduct[]; data?: AnyProduct[] };
    result?: { products?: AnyProduct[]; data?: AnyProduct[] };
  };

  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result?.products)) return data.result.products;
  if (Array.isArray(data?.result?.data)) return data.result.data;

  if (data?.data && !Array.isArray(data.data)) {
    const nested = data.data as { products?: AnyProduct[]; data?: AnyProduct[] };
    if (Array.isArray(nested.products)) return nested.products;
    if (Array.isArray(nested.data)) return nested.data;
  }

  return [];
}

function pickFeaturedProduct(products: AnyProduct[]) {
  return (
    products.find((p) => p.isFeatured || p.featured) ??
    products.find((p) =>
      Boolean(p.image || p.imageUrl || p.thumbnail || p.coverImage || p.poster || p.banner)
    ) ??
    products[0] ??
    null
  );
}

function getFeaturedImage(product: AnyProduct | null) {
  if (!product) return "";

  const imageFromArray = (arr?: Array<string | { url?: string; secure_url?: string }>) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    const first = arr[0];
    if (typeof first === "string") return first;
    return first?.secure_url || first?.url || "";
  };

  return (
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.coverImage ||
    product.poster ||
    product.banner ||
    imageFromArray(product.images) ||
    imageFromArray(product.media) ||
    imageFromArray(product.gallery) ||
    ""
  );
}

function getProductName(product: AnyProduct | null) {
  if (!product) return "Featured product";
  return product.name || product.title || "Featured product";
}

function getShortProductName(product: AnyProduct | null, maxLength = 36) {
  const title = getProductName(product).trim();
  if (title.length <= maxLength) return title;

  const cut = Math.max(10, maxLength - 7);
  return `${title.slice(0, cut).trimEnd()}...more`;
}

function getCurrentPrice(product: AnyProduct | null) {
  if (!product) return "—";

  const value =
    product.salePrice ??
    product.discountPrice ??
    product.currentPrice ??
    product.price ??
    0;

  return value ? `₹${Number(value).toLocaleString("en-IN")}` : "Price on request";
}

function getOldPrice(product: AnyProduct | null) {
  if (!product) return "";

  const value =
    product.originalPrice ??
    product.mrp ??
    product.compareAtPrice ??
    product.regularPrice ??
    0;

  return value ? `₹${Number(value).toLocaleString("en-IN")}` : "";
}

const StoreHeroSection = ({ products: productsProp }: StoreHeroSectionProps) => {
  const [fetchedProducts, setFetchedProducts] = useState<AnyProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [groceriesIndex, setGroceriesIndex] = useState(0);
  const [essentialsIndex, setEssentialsIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      if (Array.isArray(productsProp) && productsProp.length > 0) {
        if (mounted) {
          setFetchedProducts(productsProp as AnyProduct[]);
          setShuffleKey(Date.now());
          setLoadingFeatured(false);
        }
        return;
      }

      try {
        const res = await productService.getAll();
        const products = extractProducts(res);

        if (mounted) {
          setFetchedProducts(products);
          setShuffleKey(Date.now());
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        if (mounted) {
          setFetchedProducts([]);
        }
      } finally {
        if (mounted) setLoadingFeatured(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [productsProp]);

  const groceriesPool = useMemo(() => {
    const pool = fetchedProducts.filter((p) => {
      const matchText = `${p.name ?? ""} ${p.title ?? ""} ${p.category ?? ""}`.toLowerCase();
      return (
        matchText.includes("grocery") ||
        matchText.includes("food") ||
        matchText.includes("fresh") ||
        matchText.includes("daily")
      );
    });

    return shuffleArray(pool.length > 0 ? pool : fetchedProducts);
  }, [fetchedProducts, shuffleKey]);

  const essentialsPool = useMemo(() => {
    const pool = fetchedProducts.filter((p) => {
      const matchText = `${p.name ?? ""} ${p.title ?? ""} ${p.category ?? ""}`.toLowerCase();
      return (
        matchText.includes("essential") ||
        matchText.includes("home") ||
        matchText.includes("living")
      );
    });

    return shuffleArray(pool.length > 0 ? pool : fetchedProducts);
  }, [fetchedProducts, shuffleKey]);

  useEffect(() => {
    setGroceriesIndex(0);
  }, [shuffleKey]);

  useEffect(() => {
    setEssentialsIndex(0);
  }, [shuffleKey]);

  useEffect(() => {
    if (groceriesPool.length <= 1) return;

    const timer = window.setInterval(() => {
      setGroceriesIndex((prev) => (prev + 1) % groceriesPool.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [groceriesPool.length]);

  useEffect(() => {
    if (essentialsPool.length <= 1) return;

    const timer = window.setInterval(() => {
      setEssentialsIndex((prev) => (prev + 1) % essentialsPool.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [essentialsPool.length]);

  const dynamicGroceriesItem = groceriesPool.length
    ? groceriesPool[groceriesIndex % groceriesPool.length]
    : null;

  const dynamicEssentialsItem = essentialsPool.length
    ? essentialsPool[essentialsIndex % essentialsPool.length]
    : null;

  const carouselItems = useMemo<ThreeDCarouselItem[]>(() => {
    if (!fetchedProducts.length) return [];

    return shuffleArray(fetchedProducts).slice(0, 5).map((p) => ({
      id: p._id ?? p.id ?? Math.random().toString(),
      title: getShortProductName(p, 34),
      brand: p.brand || p.category || "Zynta Exclusive",
      description: p.description || "Discover premium quality selections...",
      price: getCurrentPrice(p),
      oldPrice: getOldPrice(p),
      imageUrl: getFeaturedImage(p),
      link: `/products/${p._id ?? p.id}`,
    }));
  }, [fetchedProducts, shuffleKey]);

  const featuredProduct = useMemo(
    () => pickFeaturedProduct(fetchedProducts),
    [fetchedProducts]
  );

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(219,68,68,0.16),transparent_32%)]" />
          <div className="relative z-10 flex flex-col gap-8 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              <ShoppingBag className="h-3.5 w-3.5 text-[#DB4444]" />
              Zynta E-commerce Platform
            </div>

            <div className="max-w-2xl space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">
                New season arrivals
              </p>
              <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[0.98]">
                Shop smarter with a clean, premium local store experience.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                Discover curated products, fast browsing, simple cart actions, and a smooth shopping flow built for your internship project.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Search products, brands, categories..."
                  className="h-14 rounded-2xl border-white/10 bg-black/30 pl-11 text-base text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                />
              </div>
              <Link to="/products">
                <Button className="h-14 rounded-2xl bg-[#DB4444] px-6 text-white hover:bg-[#c53a3a]">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Fast checkout", value: "1-click cart flow" },
                { label: "Trusted store", value: "Quality local products" },
                { label: "Support ready", value: "Easy order help" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 my-6 relative z-10">
            {loadingFeatured ? (
              <div className="flex h-44 items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/20 text-sm text-zinc-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading item profile...
              </div>
            ) : dynamicGroceriesItem ? (
              <Link
                to={`/products/${dynamicGroceriesItem._id ?? dynamicGroceriesItem.id}`}
                className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition-all hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex flex-col-reverse items-center gap-6 md:flex-row">
                  <div className="flex-1 space-y-2 text-left">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#DB4444]">
                      In Stock Now
                    </p>
                    <h3 className="max-w-full text-xl font-semibold leading-tight text-white transition-colors group-hover:text-[#DB4444] sm:text-2xl line-clamp-2">
                      {getShortProductName(dynamicGroceriesItem, 42)}
                    </h3>
                    <p className="max-w-sm line-clamp-2 text-sm text-zinc-400">
                      {dynamicGroceriesItem.description ||
                        "Fresh selection curated directly from premium regional vendors."}
                    </p>
                    <div className="pt-2">
                      <span className="text-xl font-bold text-white">
                        {getCurrentPrice(dynamicGroceriesItem)}
                      </span>
                    </div>
                  </div>

                  <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white md:w-48">
                    {getFeaturedImage(dynamicGroceriesItem) ? (
                      <img
                        src={getFeaturedImage(dynamicGroceriesItem)}
                        alt={dynamicGroceriesItem.name || "Promo display"}
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="text-xs text-zinc-400">No Image</div>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 text-left">
                <p className="text-sm text-zinc-500">Daily use items</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Fresh groceries</h3>
                <div className="mt-5 h-28 rounded-2xl border border-dashed border-white/10 bg-black/20" />
              </div>
            )}
          </div>

          {featuredProduct ? (
            <div className="mb-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
              Featured pick: {getShortProductName(featuredProduct, 28)}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 overflow-visible text-left">
          <div className="overflow-visible rounded-[28px] border border-white/10 bg-gradient-to-b from-[#161619] to-[#0f0f11] p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="mb-6 flex items-center justify-between text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#DB4444]" />
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
                    Featured Deals
                  </p>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Trending Arrivals
                </h2>
              </div>
              <span className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs font-medium tracking-wide text-zinc-400">
                Up to 30% Off
              </span>
            </div>

            <div className="relative flex w-full items-center justify-center overflow-visible px-10">
              {loadingFeatured || carouselItems.length === 0 ? (
                <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-black/10 text-sm text-zinc-500">
                  <Loader2 className="mb-3 h-5 w-5 animate-spin text-[#DB4444]" />
                  Populating carousel deck...
                </div>
              ) : (
                <ThreeDCarousel
                  items={carouselItems}
                  isLoading={false}
                  cardHeight={550}
                  rotateInterval={4500}
                />
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
            {loadingFeatured ? (
              <div className="flex h-36 items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/25 text-xs text-zinc-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#DB4444]" />
                Loading side catalog...
              </div>
            ) : dynamicEssentialsItem ? (
              <Link
                to={`/products/${dynamicEssentialsItem._id ?? dynamicEssentialsItem.id}`}
                className="group relative block overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 shadow-lg transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-black/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#DB4444]/0 via-[#DB4444]/[0.02] to-[#DB4444]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Home Essentials
                      </p>
                      <span className="h-1 w-1 animate-pulse rounded-full bg-[#DB4444]" />
                    </div>

                    <h3 className="line-clamp-2 text-lg font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[#DB4444]">
                      {getShortProductName(dynamicEssentialsItem, 38)}
                    </h3>

                    <p className="text-xl font-semibold text-zinc-100">
                      {getCurrentPrice(dynamicEssentialsItem)}
                    </p>
                  </div>

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner">
                    {getFeaturedImage(dynamicEssentialsItem) ? (
                      <img
                        src={getFeaturedImage(dynamicEssentialsItem)}
                        alt="Essential product preview"
                        className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Item
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left">
                <p className="text-sm text-zinc-500">Useful every day</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Home essentials</h3>
                <div className="mt-5 h-28 rounded-2xl border border-dashed border-white/10 bg-black/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHeroSection;