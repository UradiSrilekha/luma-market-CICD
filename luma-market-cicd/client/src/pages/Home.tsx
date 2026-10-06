import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Heart,
  Headphones,
  Menu,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Category = "All" | "Furniture" | "Tech" | "Fashion" | "Wellness" | "Home";
type SortOption = "featured" | "low" | "high" | "rating";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  tag?: string;
  tagTone?: "mint" | "rose" | "ink" | "sun";
  image: string;
  color: string;
};

const imageBase = "https://images.unsplash.com";

const products: Product[] = [
  {
    id: 1,
    name: "Kanso Lounge Chair",
    category: "Furniture",
    price: 289,
    oldPrice: 349,
    rating: 4.9,
    reviews: 128,
    tag: "Best seller",
    tagTone: "mint",
    image: `${imageBase}/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=85`,
    color: "#e8efe8",
  },
  {
    id: 2,
    name: "Halo Smart Lamp",
    category: "Tech",
    price: 64,
    oldPrice: 79,
    rating: 4.8,
    reviews: 86,
    tag: "−19%",
    tagTone: "rose",
    image: `${imageBase}/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85`,
    color: "#f1ece7",
  },
  {
    id: 3,
    name: "Sora Everyday Tote",
    category: "Fashion",
    price: 92,
    rating: 4.7,
    reviews: 64,
    tag: "New drop",
    tagTone: "ink",
    image: `${imageBase}/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85`,
    color: "#ebe5df",
  },
  {
    id: 4,
    name: "Cloud Foam Slides",
    category: "Fashion",
    price: 48,
    rating: 4.6,
    reviews: 203,
    image: `${imageBase}/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85`,
    color: "#ebeef5",
  },
  {
    id: 5,
    name: "Mori Ceramic Set",
    category: "Home",
    price: 74,
    rating: 4.8,
    reviews: 51,
    tag: "Hand-finished",
    tagTone: "sun",
    image: `${imageBase}/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=900&q=85`,
    color: "#f1e9de",
  },
  {
    id: 6,
    name: "Pulse Mini Speaker",
    category: "Tech",
    price: 119,
    oldPrice: 139,
    rating: 4.9,
    reviews: 92,
    tag: "−14%",
    tagTone: "rose",
    image: `${imageBase}/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85`,
    color: "#e5e9f1",
  },
  {
    id: 7,
    name: "Cedar Ritual Kit",
    category: "Wellness",
    price: 38,
    rating: 4.7,
    reviews: 118,
    tag: "Gift ready",
    tagTone: "mint",
    image: `${imageBase}/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85`,
    color: "#ebf0e7",
  },
  {
    id: 8,
    name: "Arlo Knit Throw",
    category: "Home",
    price: 128,
    rating: 4.8,
    reviews: 37,
    image: `${imageBase}/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85`,
    color: "#ede7e1",
  },
];

const categoryCards = [
  { key: "Furniture" as Category, label: "Living spaces", count: "240+ finds", icon: "⌂", image: `${imageBase}/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85` },
  { key: "Tech" as Category, label: "Smart essentials", count: "190+ finds", icon: "⌁", image: `${imageBase}/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85` },
  { key: "Fashion" as Category, label: "The style edit", count: "310+ finds", icon: "✦", image: `${imageBase}/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85` },
  { key: "Wellness" as Category, label: "Slow wellness", count: "120+ finds", icon: "✺", image: `${imageBase}/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=85` },
];

const trustItems = [
  { icon: Truck, title: "Free shipping", copy: "On every order over $75" },
  { icon: RotateCcw, title: "Easy returns", copy: "30 days, no questions asked" },
  { icon: ShieldCheck, title: "Curated quality", copy: "Better brands, verified" },
  { icon: Headphones, title: "Here to help", copy: "Real humans, 7 days a week" },
];

const money = (value: number) => `$${value.toFixed(2)}`;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sort, setSort] = useState<SortOption>("featured");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = products.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory;
      const queryMatch = !query || `${product.name} ${product.category} ${product.tag ?? ""}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });

    return [...matches].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return a.id - b.id;
    });
  }, [activeCategory, search, sort]);

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 8;
  const total = subtotal + shipping;

  const scrollToProducts = () => {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setCategory = (category: Category) => {
    setActiveCategory(category);
    setShowAll(false);
    window.setTimeout(scrollToProducts, 40);
  };

  const addToCart = (id: number) => {
    const product = products.find((item) => item.id === id);
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    toast.success(`${product?.name ?? "Item"} added to your bag`, {
      description: "You can review it anytime from the shopping bag.",
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] ?? 0) + change);
      const updated = { ...current };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const toggleWishlist = (id: number) => {
    const product = products.find((item) => item.id === id);
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    toast(wishlist.includes(id) ? "Removed from saved items" : `${product?.name} saved for later`);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1a1b1c] selection:bg-[#d4f06f] selection:text-[#1a1b1c]">
      <div className="topline bg-[#1a1b1c] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white sm:text-xs">
        <span className="text-[#d4f06f]">Free shipping</span> on orders over $75 <span className="mx-2 text-white/30">•</span> The good stuff, delivered
      </div>

      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f8f7f4]/95 backdrop-blur-xl">
        <div className="container flex h-[72px] items-center justify-between gap-4">
          <button className="mr-1 rounded-full p-2 hover:bg-black/5 md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
          <a href="#top" className="group flex shrink-0 items-center gap-2" aria-label="Luma Market home">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#1a1b1c] text-white transition-transform group-hover:rotate-[-8deg]">
              <Sparkles size={17} fill="#d4f06f" className="text-[#d4f06f]" />
            </span>
            <span className="font-display text-xl font-black tracking-[-0.06em] sm:text-[22px]">luma<span className="text-[#778f00]">.</span></span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-black/65 lg:flex">
            <button className="transition-colors hover:text-black" onClick={() => setCategory("All")}>Shop all</button>
            <button className="transition-colors hover:text-black" onClick={() => setCategory("Furniture")}>Home</button>
            <button className="transition-colors hover:text-black" onClick={() => setCategory("Tech")}>Tech</button>
            <button className="transition-colors hover:text-black" onClick={() => setCategory("Fashion")}>Style</button>
            <button className="transition-colors hover:text-black" onClick={() => setCategory("Wellness")}>Wellness</button>
          </nav>

          <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex lg:px-9">
            <label className="relative block w-full max-w-[420px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/45" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && scrollToProducts()}
                placeholder="Search for something lovely..."
                className="h-11 w-full rounded-full border border-black/10 bg-white/80 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/35 focus:border-[#829b10] focus:ring-4 focus:ring-[#d4f06f]/30"
                aria-label="Search products"
              />
            </label>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="hidden rounded-full p-2.5 hover:bg-black/5 sm:block" aria-label="Account" onClick={() => toast("Account sign-in is coming soon")}> <CircleUserRound size={20} /> </button>
            <button className="relative rounded-full p-2.5 hover:bg-black/5" aria-label="Wishlist" onClick={() => toast(`${wishlist.length} saved item${wishlist.length === 1 ? "" : "s"}`)}>
              <Heart size={20} fill={wishlist.length ? "#ff7d7d" : "none"} className={wishlist.length ? "text-[#ff7d7d]" : ""} />
              {wishlist.length > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff7d7d] px-1 text-[9px] font-black text-white">{wishlist.length}</span>}
            </button>
            <button className="relative flex items-center gap-2 rounded-full bg-[#1a1b1c] px-3 py-2.5 text-white transition hover:bg-[#303233] active:scale-95 sm:px-4" aria-label="Open shopping bag" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={18} />
              <span className="hidden text-sm font-bold sm:inline">Bag</span>
              {cartCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#d4f06f] px-1 text-[10px] font-black text-[#1a1b1c]">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="container pb-3 md:hidden">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/45" size={17} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search something lovely..." className="h-10 w-full rounded-full border border-black/10 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#829b10]" aria-label="Search products" />
          </label>
        </div>
        {mobileMenu && (
          <div className="container border-t border-black/10 py-3 md:hidden">
            <div className="grid grid-cols-2 gap-1 pb-1 text-sm font-bold">
              {(["All", "Furniture", "Tech", "Fashion", "Wellness", "Home"] as Category[]).map((category) => (
                <button key={category} onClick={() => { setMobileMenu(false); setCategory(category); }} className="rounded-xl px-3 py-3 text-left hover:bg-white">{category === "All" ? "Shop all" : category}</button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="container pt-5 sm:pt-8">
          <div className="hero-card relative min-h-[500px] overflow-hidden rounded-[28px] bg-[#dbe9ba] sm:min-h-[560px] lg:min-h-[610px]">
            <div className="hero-grid absolute inset-0 opacity-60" />
            <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-7 sm:min-h-[560px] sm:p-12 lg:min-h-[610px] lg:p-16">
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur sm:text-xs"><Zap size={13} fill="currentColor" /> New season / 2026</div>
                <div className="hidden text-right text-xs font-semibold leading-relaxed text-black/55 sm:block">Thoughtful objects<br />for everyday rituals</div>
              </div>
              <div className="max-w-[610px] pb-2">
                <p className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#506000]"><span className="h-2 w-2 rounded-full bg-[#506000]" /> Curated for the curious</p>
                <h1 className="max-w-[640px] font-display text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.84] tracking-[-0.085em] text-[#1a1b1c]">Find your<br /><span className="relative inline-block">everyday <span className="absolute -right-4 -top-2 text-[0.35em] font-medium tracking-normal text-[#778f00]">good.</span></span></h1>
                <p className="mt-7 max-w-[390px] text-base leading-relaxed text-black/60 sm:text-lg">A brighter edit of things you’ll use, love, and keep around. Good design, no guesswork.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={scrollToProducts} className="group inline-flex items-center gap-3 rounded-full bg-[#1a1b1c] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#303233] active:scale-95">Shop the edit <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>
                  <button onClick={() => setCategory("Furniture")} className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/40 px-5 py-3.5 text-sm font-bold transition hover:bg-white/70">Explore home <ArrowUpRight size={16} /></button>
                </div>
              </div>
            </div>
            <div className="hero-product absolute bottom-[-9%] right-[-5%] h-[48%] w-[72%] max-w-[600px] rounded-tl-[90px] bg-[#c7d8a1] sm:h-[56%] sm:w-[54%] lg:h-[66%] lg:w-[46%]" />
            <img src={`${imageBase}/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1100&q=90`} alt="Curated lounge chair in a light-filled room" className="absolute bottom-[-2%] right-[-7%] z-[1] h-[53%] w-[78%] object-cover object-center mix-blend-multiply sm:bottom-[-4%] sm:right-[-3%] sm:h-[62%] sm:w-[56%] lg:h-[72%] lg:w-[48%]" />
            <div className="absolute bottom-6 right-6 z-10 hidden w-[160px] rounded-2xl border border-white/50 bg-white/55 p-3 shadow-2xl backdrop-blur-md sm:block lg:right-12 lg:bottom-10">
              <div className="mb-2 flex -space-x-2"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#e4b79f] text-[10px] font-bold">A</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#b6c8da] text-[10px] font-bold">M</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#d5d68f] text-[10px] font-bold">S</span></div>
              <p className="text-[11px] font-bold leading-snug">Loved by 12k+ bright-minded shoppers</p>
            </div>
          </div>
        </section>

        <section className="container py-7 sm:py-10">
          <div className="grid grid-cols-2 divide-x divide-black/10 rounded-2xl border-y border-black/10 bg-white/40 py-4 sm:grid-cols-4 sm:py-5">
            {[{value: "4.9/5", label: "customer love"}, {value: "24h", label: "quick dispatch"}, {value: "1%", label: "better packaging"}, {value: "0", label: "boring picks"}].map((item) => <div key={item.label} className="px-4 text-center sm:px-6"><p className="font-display text-2xl font-black tracking-[-0.05em] sm:text-3xl">{item.value}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black/45 sm:text-xs">{item.label}</p></div>)}
          </div>
        </section>

        <section className="container pb-20 sm:pb-28" aria-labelledby="category-heading">
          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
            <div><p className="eyebrow">The good categories</p><h2 id="category-heading" className="section-title">A little bit of <em>everything.</em></h2></div>
            <button onClick={() => setCategory("All")} className="hidden items-center gap-2 text-sm font-bold underline decoration-black/20 underline-offset-4 transition hover:decoration-black sm:flex">View all <ArrowRight size={15} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {categoryCards.map((card, index) => <button key={card.key} onClick={() => setCategory(card.key)} className={`category-card group relative min-h-[225px] overflow-hidden rounded-[22px] text-left sm:min-h-[310px] ${index === 1 ? "sm:translate-y-7" : ""}`}><img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" /><div className="relative flex h-full min-h-[225px] flex-col justify-between p-4 text-white sm:min-h-[310px] sm:p-5"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-lg font-bold text-[#1a1b1c] backdrop-blur">{card.icon}</span><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">{card.count}</p><h3 className="mt-1 font-display text-xl font-bold tracking-[-0.05em] sm:text-2xl">{card.label}</h3></div></div></button>)}
          </div>
        </section>

        <section id="shop" className="scroll-mt-32 bg-white py-20 sm:py-28" aria-labelledby="shop-heading">
          <div className="container">
            <div className="mb-7 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="eyebrow">Freshly picked</p><h2 id="shop-heading" className="section-title">The <em>good</em> edit.</h2><p className="mt-2 max-w-[420px] text-sm leading-relaxed text-black/50">Design-forward things for slower mornings, better desks, and the people you want to impress.</p></div>
              <div className="flex items-center gap-2 self-start sm:self-end">
                <div className="relative"><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-10 appearance-none rounded-full border border-black/10 bg-[#f8f7f4] pl-4 pr-9 text-xs font-bold outline-none focus:border-black/30"><option value="featured">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="rating">Top rated</option></select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" /></div>
                <button onClick={() => toast("More filters are coming soon")} className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-[#f8f7f4] hover:bg-black/5" aria-label="Open filters"><span className="text-sm">☷</span></button>
              </div>
            </div>
            <div className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(["All", "Furniture", "Tech", "Fashion", "Wellness", "Home"] as Category[]).map((category) => <button key={category} onClick={() => { setActiveCategory(category); setShowAll(false); }} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${activeCategory === category ? "bg-[#1a1b1c] text-white" : "bg-[#f3f2ef] text-black/55 hover:bg-[#eae9e5] hover:text-black"}`}>{category === "All" ? "All finds" : category}</button>)}
            </div>
            {filteredProducts.length > 0 ? <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">{filteredProducts.slice(0, showAll ? filteredProducts.length : 4).map((product, index) => <ProductCard key={product.id} product={product} index={index} isSaved={wishlist.includes(product.id)} onSave={() => toggleWishlist(product.id)} onAdd={() => addToCart(product.id)} />)}</div> : <div className="rounded-3xl border border-dashed border-black/15 bg-[#f8f7f4] px-5 py-16 text-center"><p className="font-display text-2xl font-bold">Nothing found yet.</p><p className="mt-2 text-sm text-black/50">Try a different search or browse all of our good finds.</p><button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-5 rounded-full bg-[#1a1b1c] px-5 py-3 text-sm font-bold text-white">Clear filters</button></div>}
            {filteredProducts.length > 4 && <div className="mt-10 flex justify-center"><button onClick={() => setShowAll(!showAll)} className="group inline-flex items-center gap-3 rounded-full border border-black/15 px-5 py-3 text-sm font-bold transition hover:bg-[#f8f7f4]">{showAll ? "Show less" : `Show all ${filteredProducts.length} finds`}<ChevronDown size={16} className={`transition-transform ${showAll ? "rotate-180" : ""}`} /></button></div>}
          </div>
        </section>

        <section className="container py-20 sm:py-28">
          <div className="grid overflow-hidden rounded-[28px] bg-[#1a1b1c] text-white lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[380px] overflow-hidden p-7 sm:min-h-[480px] sm:p-12"><div className="absolute -left-14 -top-14 h-52 w-52 rounded-full bg-[#d4f06f] blur-[1px]" /><div className="absolute bottom-[-90px] right-[-40px] h-64 w-64 rounded-full border-[28px] border-[#506000] opacity-70" /><div className="relative z-10 flex h-full flex-col justify-between"><span className="w-fit rounded-full bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.17em]">The Luma journal / 01</span><div><p className="mb-4 text-xs font-black uppercase tracking-[0.19em] text-[#d4f06f]">Small rituals, big difference</p><h2 className="max-w-[450px] font-display text-4xl font-black leading-[0.92] tracking-[-0.07em] sm:text-6xl">Make space for <em className="font-serif font-normal tracking-[-0.04em]">better.</em></h2><button onClick={() => toast("Journal stories are coming soon")} className="mt-7 inline-flex items-center gap-2 text-sm font-bold underline decoration-white/30 underline-offset-4 hover:decoration-[#d4f06f]">Read our point of view <ArrowUpRight size={16} /></button></div></div></div>
            <div className="relative min-h-[330px] overflow-hidden bg-[#e9d7c9] sm:min-h-[480px]"><img src={`${imageBase}/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1200&q=90`} alt="Sunlit, calm living room" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-r from-[#1a1b1c]/20 to-transparent" /><div className="absolute bottom-6 left-6 rounded-full bg-white/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1a1b1c] backdrop-blur sm:bottom-9 sm:left-9">A home that exhales</div></div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-[#eef1e6] py-14 sm:py-16">
          <div className="container"><div className="mb-9 flex items-center justify-between"><div><p className="eyebrow">Why luma?</p><h2 className="font-display text-2xl font-black tracking-[-0.06em] sm:text-3xl">Good shopping feels <em>easy.</em></h2></div><div className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/15 sm:flex"><ChevronRight size={17} /></div></div><div className="grid grid-cols-2 gap-x-7 gap-y-9 sm:grid-cols-4 sm:gap-8">{trustItems.map((item) => <div key={item.title}><div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-white text-[#506000]"><item.icon size={18} /></div><h3 className="text-sm font-black">{item.title}</h3><p className="mt-1 max-w-[150px] text-xs leading-relaxed text-black/50">{item.copy}</p></div>)}</div></div>
        </section>
      </main>

      <footer className="bg-[#1a1b1c] py-12 text-white sm:py-16">
        <div className="container"><div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1.3fr]"><div><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#d4f06f] text-[#1a1b1c]"><Sparkles size={17} fill="currentColor" /></span><span className="font-display text-xl font-black tracking-[-0.06em]">luma<span className="text-[#d4f06f]">.</span></span></div><p className="mt-5 max-w-[230px] text-sm leading-relaxed text-white/50">The brighter way to find the things that make everyday better.</p></div><div><p className="footer-heading">Discover</p><div className="footer-links"><button onClick={() => setCategory("All")}>Shop all</button><button onClick={() => setCategory("Furniture")}>Home</button><button onClick={() => setCategory("Fashion")}>Style</button></div></div><div><p className="footer-heading">Helpful</p><div className="footer-links"><button onClick={() => toast("About Luma is coming soon")}>About us</button><button onClick={() => toast("Shipping info is coming soon")}>Shipping & returns</button><button onClick={() => toast("Contact form is coming soon")}>Contact</button></div></div><div><p className="footer-heading">Stay in the know</p><p className="max-w-[240px] text-sm leading-relaxed text-white/50">Monthly good stuff, zero inbox clutter.</p><div className="mt-4 flex max-w-[300px] gap-2"><input placeholder="Your email address" className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-3 text-xs text-white outline-none placeholder:text-white/35 focus:bg-white/15" aria-label="Email address" /><button onClick={() => toast.success("You’re on the list", { description: "Welcome to the good stuff." })} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d4f06f] text-[#1a1b1c] transition hover:bg-white"><ArrowRight size={17} /></button></div></div></div><div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 sm:flex-row"><span>© 2026 Luma Market</span><span>Made for better everyday</span></div></div>
      </footer>

      {cartOpen && <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />}
      <aside className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-[430px] flex-col bg-[#f8f7f4] shadow-2xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`} aria-label="Shopping bag">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-7"><div><p className="eyebrow">Your edit</p><h2 className="font-display text-2xl font-black tracking-[-0.06em]">Shopping bag <span className="text-black/35">({cartCount})</span></h2></div><button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-black/10 hover:bg-white" aria-label="Close shopping bag"><X size={18} /></button></div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">{cartItems.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-[#e8edda] text-[#506000]"><ShoppingBag size={26} /></div><h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.05em]">Your bag is taking a breather.</h3><p className="mt-2 max-w-[240px] text-sm leading-relaxed text-black/50">Add something good to get things moving.</p><button onClick={() => { setCartOpen(false); scrollToProducts(); }} className="mt-6 rounded-full bg-[#1a1b1c] px-5 py-3 text-sm font-bold text-white">Start browsing</button></div> : <div className="space-y-5">{cartItems.map((product) => <div key={product.id} className="flex gap-4"><div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl" style={{ background: product.color }}><img src={product.image} alt="" className="h-full w-full object-cover mix-blend-multiply" /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-black/40">{product.category}</p><h3 className="mt-1 truncate text-sm font-bold">{product.name}</h3></div><p className="text-sm font-black">{money(product.price * (cart[product.id] ?? 0))}</p></div><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-2 py-1"><button onClick={() => updateQuantity(product.id, -1)} className="grid h-5 w-5 place-items-center rounded-full hover:bg-black/5" aria-label={`Decrease ${product.name} quantity`}><Minus size={12} /></button><span className="min-w-3 text-center text-xs font-bold">{cart[product.id]}</span><button onClick={() => updateQuantity(product.id, 1)} className="grid h-5 w-5 place-items-center rounded-full hover:bg-black/5" aria-label={`Increase ${product.name} quantity`}><Plus size={12} /></button></div><button onClick={() => updateQuantity(product.id, -(cart[product.id] ?? 0))} className="text-[10px] font-bold text-black/40 underline underline-offset-2 hover:text-black">Remove</button></div></div></div>)}</div>}
        </div>
        {cartItems.length > 0 && <div className="border-t border-black/10 bg-white/60 px-5 py-5 sm:px-7"><div className="mb-3 flex justify-between text-sm"><span className="text-black/50">Subtotal</span><span className="font-bold">{money(subtotal)}</span></div><div className="mb-4 flex justify-between text-sm"><span className="text-black/50">Shipping</span><span className="font-bold">{shipping === 0 ? "Free" : money(shipping)}</span></div><div className="mb-5 flex justify-between border-t border-black/10 pt-4"><span className="font-display text-xl font-black tracking-[-0.05em]">Total</span><span className="font-display text-xl font-black tracking-[-0.05em]">{money(total)}</span></div><button onClick={() => toast("Checkout is ready for your store connection", { description: "This frontend demo is set up for the next step." })} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1b1c] py-4 text-sm font-bold text-white transition hover:bg-[#303233] active:scale-[0.98]">Secure checkout <CreditCard size={16} /></button><p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] font-bold uppercase tracking-[0.11em] text-black/35"><ShieldCheck size={13} /> Safe & simple checkout</p></div>}
      </aside>
    </div>
  );
}

function ProductCard({ product, index, isSaved, onSave, onAdd }: { product: Product; index: number; isSaved: boolean; onSave: () => void; onAdd: () => void }) {
  return <article className="product-card group" style={{ animationDelay: `${index * 55}ms` }}><div className="relative aspect-[0.93] overflow-hidden rounded-[20px]" style={{ background: product.color }}><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-[1.04]" /><div className="absolute left-3 top-3 flex flex-wrap gap-1.5">{product.tag && <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.09em] ${product.tagTone === "rose" ? "bg-[#ffb6b6] text-[#6c2727]" : product.tagTone === "ink" ? "bg-[#1a1b1c] text-white" : product.tagTone === "sun" ? "bg-[#f1c96a] text-[#5b4300]" : "bg-[#d4f06f] text-[#415000]"}`}>{product.tag}</span>}</div><button onClick={onSave} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/75 backdrop-blur transition hover:bg-white ${isSaved ? "text-[#ff7d7d]" : "text-black/65"}`} aria-label={`${isSaved ? "Remove" : "Save"} ${product.name}`}><Heart size={16} fill={isSaved ? "currentColor" : "none"} /></button><button onClick={onAdd} className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-[#1a1b1c]/95 py-3 text-xs font-bold text-white opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">Add to bag <Plus size={14} /></button></div><div className="pt-3"><div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/40">{product.category}</p><h3 className="mt-1 text-sm font-bold tracking-[-0.02em] sm:text-[15px]">{product.name}</h3></div><div className="flex items-center gap-1 pt-0.5 text-[10px] font-bold"><Star size={12} fill="#e2ab2d" className="text-[#e2ab2d]" /> {product.rating}</div></div><div className="mt-2 flex items-center gap-2"><span className="text-sm font-black">{money(product.price)}</span>{product.oldPrice && <span className="text-xs font-medium text-black/35 line-through">{money(product.oldPrice)}</span>}<span className="text-[10px] text-black/35">({product.reviews})</span></div></div></article>;
}
