import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ginImage from "./assets/Gin.png";
import logoImage from "./assets/Logo.png";
import whiskeyImage from "./assets/whiskey.png";
import wineImage from "./assets/wine2.png";
import "./index.css";

const slides = [
  {
    id: "reserve",
    titleLines: ["Rare bottles", "for slow evenings."],
    text: "Small-batch pours, polished presentation, and a hero banner that moves with more intent.",
    mood: "slide-reserve",
    image: whiskeyImage,
  },
  {
    id: "rooftop",
    titleLines: ["Bright mixes", "for rooftop hours."],
    text: "A softer motion pass keeps the slide alive while the words now sweep in from the left.",
    mood: "slide-rooftop",
    image: ginImage,
  },
  {
    id: "cellar",
    titleLines: ["Dinner-ready bottles,", "framed properly."],
    text: "Three rotating scenes now sit under the navbar to make the landing page feel finished.",
    mood: "slide-cellar",
    image: wineImage,
  },
];

const bestSellers = [
  {
    name: "Midnight Barrel",
    price: "KES 4,800",
    image: whiskeyImage,
  },
  {
    name: "Citrus Bloom Gin",
    price: "KES 3,600",
    image: ginImage,
  },
  {
    name: "Velvet Cellar Red",
    price: "KES 2,950",
    image: wineImage,
  },
  {
    name: "Reserve 12 Whisky",
    price: "KES 5,200",
    image: whiskeyImage,
  },
  {
    name: "Golden Coast Gin",
    price: "KES 3,900",
    image: ginImage,
  },
  {
    name: "Rosso Night Blend",
    price: "KES 3,250",
    image: wineImage,
  },
  {
    name: "Smoked Oak Cask",
    price: "KES 5,850",
    image: whiskeyImage,
  },
  {
    name: "Garden Mist Gin",
    price: "KES 3,400",
    image: ginImage,
  },
];

const discountedProducts = [
  {
    name: "Reserve 12 Whisky",
    oldPrice: "KES 5,200",
    newPrice: "KES 4,650",
    image: whiskeyImage,
  },
  {
    name: "Golden Coast Gin",
    oldPrice: "KES 3,900",
    newPrice: "KES 3,450",
    image: ginImage,
  },
  {
    name: "Velvet Cellar Red",
    oldPrice: "KES 2,950",
    newPrice: "KES 2,550",
    image: wineImage,
  },
];

const categories = [
  {
    name: "Whisky",
    description: "Smoky reserves, smooth bourbons, and aged single malts.",
    image: whiskeyImage,
  },
  {
    name: "Gin",
    description: "Botanical pours built for tonic nights and bright cocktails.",
    image: ginImage,
  },
  {
    name: "Wine",
    description: "Dinner reds, crisp whites, and bottles for slower evenings.",
    image: wineImage,
  },
  {
    name: "Vodka",
    description: "Clean premium bottles for chilled serves and party mixes.",
    image: whiskeyImage,
  },
  {
    name: "Tequila",
    description: "Bold agave picks for shots, citrus mixes, and warmer nights.",
    image: ginImage,
  },
  {
    name: "Mixers",
    description: "Tonics, sodas, and pairings that finish the bottle run properly.",
    image: wineImage,
  },
];

const reasons = [
  {
    title: "Fast Delivery",
    stat: "25 min",
    text: "Quick dispatch for same-night plans, with a smoother path from bottle to doorstep.",
  },
  {
    title: "Authentic Bottles",
    stat: "100%",
    text: "Trusted stock and premium labels so the shelf feels reliable, not random.",
  },
  {
    title: "Easy Checkout",
    stat: "3 steps",
    text: "Less clutter, fewer clicks, and a cleaner store flow that gets customers through fast.",
  },
  {
    title: "Best Prices",
    stat: "Weekly deals",
    text: "Offers, bundles, and standout markdowns that keep the store sharp every week.",
  },
];

const testimonials = [
  {
    quote:
      "The checkout is clean, the bottle arrived fast, and the whole order felt way more premium than the usual delivery apps.",
    name: "Nadia K.",
    location: "Westlands, Nairobi",
    initials: "NK",
  },
  {
    quote:
      "I found what I wanted quickly and the discounts actually felt worth it. This now feels like a proper premium store.",
    name: "Brian M.",
    location: "Kilimani, Nairobi",
    initials: "BM",
  },
  {
    quote:
      "The interface is easy, the offers are clear, and the delivery speed makes it easy to trust for last-minute plans.",
    name: "Aisha T.",
    location: "Riverside, Nairobi",
    initials: "AT",
  },
];

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [bestSellerPage, setBestSellerPage] = useState(0);
  const [discountPage, setDiscountPage] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncCardsPerView = () => {
      if (window.innerWidth <= 640) {
        setCardsPerView(1);
        return;
      }

      if (window.innerWidth <= 980) {
        setCardsPerView(2);
        return;
      }

      setCardsPerView(4);
    };

    syncCardsPerView();
    window.addEventListener("resize", syncCardsPerView);

    return () => window.removeEventListener("resize", syncCardsPerView);
  }, []);

  const bestSellerPages = [];

  for (let index = 0; index < bestSellers.length; index += cardsPerView) {
    bestSellerPages.push(bestSellers.slice(index, index + cardsPerView));
  }

  useEffect(() => {
    if (bestSellerPages.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBestSellerPage((current) => (current + 1) % bestSellerPages.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [bestSellerPages.length]);

  const currentBestSellerPage = Math.min(bestSellerPage, bestSellerPages.length - 1);
  const discountPages = [];

  for (let index = 0; index < discountedProducts.length; index += 2) {
    discountPages.push(discountedProducts.slice(index, index + 2));
  }

  const currentDiscountPage = Math.min(discountPage, discountPages.length - 1);

  const showPreviousDiscountPage = () => {
    setDiscountPage((current) =>
      current === 0 ? discountPages.length - 1 : current - 1,
    );
  };

  const showNextDiscountPage = () => {
    setDiscountPage((current) => (current + 1) % discountPages.length);
  };

  useEffect(() => {
    if (testimonials.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, []);

  const showPreviousTestimonial = () => {
    setActiveTestimonial((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  const showNextTestimonial = () => {
    setActiveTestimonial((current) => (current + 1) % testimonials.length);
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <Navbar />

      <section className="slider-section" id="home" aria-label="Featured highlights">
        <div className="slider-shell">
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className={`hero-slide ${slide.mood} ${index === activeSlide ? "is-active" : ""}`}
              aria-hidden={index === activeSlide ? "false" : "true"}
            >
              <div
                className="slide-media"
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden="true"
              />
              <div className="slide-overlay" />
              <div className="slide-copy">
                <h2>
                  {slide.titleLines.map((line) => (
                    <span key={line} className="slide-line">
                      {line}
                    </span>
                  ))}
                </h2>
              </div>
            </article>
          ))}

          <div className="slide-indicators" aria-label="Slide indicators">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === activeSlide ? "is-current" : ""}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <main>
        <section className="best-sellers-section" id="best-sellers">
          <div className="best-sellers-header">
            <h2 className="best-sellers-title">Best Sellers</h2>
          </div>

          <div className="best-sellers-slider">
            <div
              className="best-sellers-track"
              style={{ transform: `translateX(-${currentBestSellerPage * 100}%)` }}
            >
              {bestSellerPages.map((group, groupIndex) => (
                <div
                  key={`best-sellers-${groupIndex}`}
                  className="best-sellers-page"
                  style={{ gridTemplateColumns: `repeat(${group.length}, minmax(0, 1fr))` }}
                >
                  {group.map((product) => (
                    <article key={product.name} className="best-seller-card">
                      <div className="best-seller-image-shell">
                        <img src={product.image} alt={product.name} className="best-seller-image" />
                      </div>
                      <h3>{product.name}</h3>
                      <button type="button" className="best-seller-price" aria-label={`Add ${product.name} to cart`}>
                        <span className="price-default">{product.price}</span>
                        <span className="price-hover">Add to cart</span>
                      </button>
                    </article>
                  ))}
                </div>
              ))}
            </div>

            <div className="best-seller-dots" aria-label="Best sellers slide indicators">
              {bestSellerPages.map((_, index) => (
                <span
                  key={`best-seller-dot-${index}`}
                  className={index === currentBestSellerPage ? "is-current" : ""}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className="discount-section">
            <div className="discount-products-card">
              <div className="discount-products-header">
                <h3>On Sale For You</h3>
                <div className="discount-controls" aria-label="Discount products navigation">
                  <button type="button" onClick={showPreviousDiscountPage} aria-label="Previous sale products">
                    &larr;
                  </button>
                  <button type="button" onClick={showNextDiscountPage} aria-label="Next sale products">
                    &rarr;
                  </button>
                </div>
              </div>

              <div className="discount-slider">
                <div
                  className="discount-track"
                  style={{ transform: `translateX(-${currentDiscountPage * 100}%)` }}
                >
                  {discountPages.map((group, groupIndex) => (
                    <div key={`discount-page-${groupIndex}`} className="discount-products-list">
                      {group.map((product) => (
                        <article key={product.name} className="discount-product">
                          <div className="discount-product-image-shell">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="discount-product-image"
                            />
                          </div>

                          <div className="discount-product-copy">
                            <h4>{product.name}</h4>
                            <div className="discount-product-prices">
                              <span className="discount-old-price">{product.oldPrice}</span>
                              <button
                                type="button"
                                className="discount-price-button"
                                aria-label={`Add ${product.name} to cart`}
                              >
                                <span className="discount-price-default">{product.newPrice}</span>
                                <span className="discount-price-hover">Add to cart</span>
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="discount-offer-card">
              <span className="discount-offer-tag">New customer offer</span>
              <h3>10% Off Your First Order</h3>
              <p>
                Start with a cleaner checkout and get an instant discount on your first bottle run.
              </p>
            </aside>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="categories-header">
            <h2 className="categories-title">Shop by Category</h2>
            <p>Pick a shelf first, then drill into the bottles that match the night.</p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <article key={category.name} className="category-card">
                <div className="category-image-shell">
                  <img src={category.image} alt={category.name} className="category-image" />
                </div>
                <div className="category-copy">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <a href="#home">Browse {category.name}</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="why-section" id="why-tipsy">
          <div className="why-header">
            <h2 className="why-title">Why Choose Tipsy</h2>
            <p>Fast enough for tonight, polished enough to feel premium.</p>
          </div>

          <div className="why-grid">
            {reasons.map((reason) => (
              <article key={reason.title} className="why-card">
                <span className="why-card-topline">{reason.stat}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testim" id="testimonials">
          <div className="wrap">
            <h2 className="testim-title">Testimonials</h2>

            <button
              type="button"
              id="left-arrow"
              className="arrow left"
              aria-label="Previous testimonial"
              onClick={showPreviousTestimonial}
            >
              &#10094;
            </button>

            <button
              type="button"
              id="right-arrow"
              className="arrow right"
              aria-label="Next testimonial"
              onClick={showNextTestimonial}
            >
              &#10095;
            </button>

            <div className="dots" id="testim-dots" aria-label="Testimonial navigation">
              {testimonials.map((item, index) => (
                <button
                  key={`${item.name}-dot`}
                  type="button"
                  className={`dot ${index === activeTestimonial ? "active" : ""}`}
                  aria-label={`Show testimonial ${index + 1}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>

            <div className="cont" id="testim-content">
              {testimonials.map((item, index) => (
                <div
                  key={item.name}
                  className={index === activeTestimonial ? "active" : "inactive"}
                  aria-hidden={index === activeTestimonial ? "false" : "true"}
                >
                  <div className="img">
                    <div className="testimonial-avatar" aria-hidden="true">
                      {item.initials}
                    </div>
                  </div>
                  <h2>{item.name}</h2>
                  <span className="testimonial-location">{item.location}</span>
                  <p>"{item.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section" id="cta">
          <div className="closing-shell">
            <div className="cta-card">
              <div className="cta-copy">
                <h2>Stock the night in minutes.</h2>
                <p>
                  Browse premium bottles, grab weekly offers, and get delivery lined up before the first glass is poured.
                </p>
              </div>
              <div className="cta-actions">
                <a href="#best-sellers" className="cta-primary">Shop Best Sellers</a>
                <a href="#categories" className="cta-secondary">Browse Categories</a>
              </div>
            </div>

            <>
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                  *{
                    font-family: "Geist", sans-serif;
                  }
                `}
              </style>
              <div className='bg-black pt-6 px-0'>
                <footer className="bg-[#131314] w-full text-white pt-8 lg:pt-12 px-1 sm:px-2 md:px-3 lg:px-4 rounded-tl-3xl rounded-tr-3xl overflow-hidden">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-10 lg:gap-16">
                    <div className="lg:col-span-3 space-y-6">
                      <a href="#home" className="block footer-logo-link">
                        <img src={logoImage} alt="Tipsy" className="footer-brand-image" />
                      </a>
                      <p className="text-base/7 text-neutral-300">
                        Premium whisky, gin, wine, and party-ready bottles delivered across Nairobi with a smoother
                        storefront and faster late-night ordering.
                      </p>
                      <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                        <a href="#" className="text-white hover:text-gray-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                        </a>
                        <a href="#" className="text-white hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
                          </svg>
                        </a>
                        <a href="#" className="text-white hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                          </svg>
                        </a>
                        <a href="#" className="text-white hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
                          </svg>
                        </a>
                        <a href="#" className="text-white hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 lg:gap-16 items-start">
                      <div>
                        <h3 className="font-semibold text-base mb-4">Shop</h3>
                        <ul className="space-y-3 text-base text-neutral-300">
                          <li><a href="#best-sellers" className="hover:text-neutral-400">Best Sellers</a></li>
                          <li><a href="#categories" className="hover:text-neutral-400">Categories</a></li>
                          <li><a href="#cta" className="hover:text-neutral-400">Weekly Offers</a></li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base mb-4">Explore</h3>
                        <ul className="space-y-3 text-base text-neutral-300">
                          <li><a href="#home" className="hover:text-neutral-400">Home</a></li>
                          <li><a href="#why-tipsy" className="hover:text-neutral-400">Why Tipsy</a></li>
                          <li><a href="#experience" className="hover:text-neutral-400">Store Experience</a></li>
                          <li><a href="#testimonials" className="hover:text-neutral-400">Testimonials</a></li>
                        </ul>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <h3 className="font-semibold text-base mb-4">Contact</h3>
                        <ul className="space-y-3 text-base text-neutral-300">
                          <li><a href="tel:+254700123456" className="hover:text-neutral-400">+254 700 123 456</a></li>
                          <li><a href="mailto:hello@tipsy.co.ke" className="hover:text-neutral-400">hello@tipsy.co.ke</a></li>
                          <li className="flex items-center gap-2">
                            <a href="#experience" className="hover:text-neutral-400">Late-night delivery</a>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-950 border border-orange-300 text-orange-300">LIVE</span>
                          </li>
                          <li><a href="#home" className="hover:text-neutral-400">Westlands, Kilimani, Riverside</a></li>
                          <li><a href="#cta" className="hover:text-neutral-400">Order tonight</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-7xl mx-auto mt-6 pt-3 border-t border-neutral-700 flex justify-between items-center">
                    <p className="text-neutral-400 text-base">2026 Tipsy Design</p>
                    <p className="text-base text-neutral-400">All rights reserved.</p>
                  </div>
                  <div className="relative h-8 mt-0">
                    <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-orange-glow rounded-full blur-[170px] pointer-events-none" />
                  </div>
                </footer>
              </div>
            </>
          </div>
        </section>
      </main>

    </div>
  );
}

export default App;
