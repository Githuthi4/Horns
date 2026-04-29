import { useEffect, useState } from "react";

export function CatalogView({
  categories,
  selectedCategorySlug,
  setSelectedCategorySlug,
  minPrice,
  maxPrice,
  priceBounds,
  searchTerm,
  setSearchTerm,
  saleOnly,
  setSaleOnly,
  setMinPrice,
  setMaxPrice,
  sort,
  setSort,
  products,
  productsLoading,
  getProductImage,
  formatPrice,
  handleAddToCart,
  navigateTo,
  renderFooter,
}) {
  const activeCategory = categories.find((category) => category.slug === selectedCategorySlug) || null;
  const [minDraft, setMinDraft] = useState("");
  const [maxDraft, setMaxDraft] = useState("");
  const pricePresets = [
    { id: "all", label: "Any", min: 0, max: priceBounds.max, minDraft: "", maxDraft: "" },
    { id: "budget", label: "Under 3,000", min: 0, max: Math.min(3000, priceBounds.max), minDraft: "", maxDraft: String(Math.min(3000, priceBounds.max)) },
    { id: "mid", label: "3,000-5,000", min: 3000, max: Math.min(5000, priceBounds.max), minDraft: "3000", maxDraft: String(Math.min(5000, priceBounds.max)) },
    { id: "premium", label: "Premium", min: Math.max(5000, 0), max: priceBounds.max, minDraft: String(Math.max(5000, 0)), maxDraft: "" },
  ].filter((preset) => preset.min <= preset.max);

  const syncPriceState = (nextMin, nextMax, nextMinDraft = String(nextMin), nextMaxDraft = String(nextMax)) => {
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    setMinDraft(nextMinDraft);
    setMaxDraft(nextMaxDraft);
  };

  const resetPriceRange = () => {
    syncPriceState(0, priceBounds.max, "", "");
  };

  const applyPriceDrafts = () => {
    const parsedMin = Number(minDraft.trim());
    const parsedMax = Number(maxDraft.trim());

    const nextMin = minDraft.trim() === "" || Number.isNaN(parsedMin) ? 0 : parsedMin;
    const nextMax = maxDraft.trim() === "" || Number.isNaN(parsedMax) ? priceBounds.max : parsedMax;

    const clampedMin = Math.max(nextMin, 0);
    const clampedMax = Math.min(nextMax, priceBounds.max);
    const normalizedMin = Math.min(clampedMin, clampedMax);
    const normalizedMax = Math.max(clampedMin, clampedMax);

    syncPriceState(
      normalizedMin,
      normalizedMax,
      normalizedMin === 0 ? "" : String(normalizedMin),
      normalizedMax === priceBounds.max ? "" : String(normalizedMax),
    );
  };

  const handleSidebarSearchChange = (value) => {
    setSearchTerm(value);

    if (value.trim() && selectedCategorySlug) {
      setSelectedCategorySlug("");
      navigateTo("/categories");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const resetAllFilters = () => {
    clearSearch();
    setSaleOnly(false);
    setSelectedCategorySlug("");
    setSort("featured");
    resetPriceRange();
    navigateTo("/categories");
  };

  const applyPricePreset = (preset) => {
    syncPriceState(preset.min, preset.max, preset.minDraft, preset.maxDraft);
  };

  return (
    <main>
      <section className="category-products-section">
        <div className="catalog-shell">
          <div className="catalog-page-head">
            <div className="catalog-breadcrumbs">
              <a href="/" onClick={(event) => { event.preventDefault(); navigateTo("/"); }}>Home</a>
              <span>/</span>
              <strong>Shop</strong>
              {activeCategory && (
                <>
                  <span>/</span>
                  <strong>{activeCategory.name}</strong>
                </>
              )}
            </div>

            <div className="catalog-page-copy">
              <h1>{activeCategory ? activeCategory.name : "All drinks"}</h1>
              <p>
                {activeCategory
                  ? activeCategory.description
                  : "Browse the full catalog, then narrow it down by drink type and price from the sidebar."}
              </p>
            </div>
          </div>

          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <div className="catalog-filter-card">
                <div className="catalog-filter-header">
                  <h2>Search</h2>
                  {searchTerm && (
                    <button type="button" className="catalog-clear-button" onClick={clearSearch}>
                      Clear
                    </button>
                  )}
                </div>

                <label className="catalog-search-shell">
                  <input
                    type="text"
                    aria-label="Search drinks"
                    value={searchTerm}
                    placeholder="Search drinks..."
                    onChange={(event) => handleSidebarSearchChange(event.target.value)}
                  />
                </label>
              </div>

              <div className="catalog-filter-card">
                <div className="catalog-filter-header">
                  <h2>Drink types</h2>
                  {selectedCategorySlug && (
                    <button
                      type="button"
                      className="catalog-clear-button"
                      onClick={() => {
                        setSelectedCategorySlug("");
                        navigateTo("/categories");
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="catalog-category-list">
                  <button
                    type="button"
                    className={selectedCategorySlug === "" ? "is-active" : ""}
                    onClick={() => {
                      setSelectedCategorySlug("");
                      navigateTo("/categories");
                    }}
                  >
                    All drinks
                    <span>{categories.reduce((total, category) => total + Number(category.product_count || 0), 0)}</span>
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={selectedCategorySlug === category.slug ? "is-active" : ""}
                      onClick={() => {
                        setSelectedCategorySlug(category.slug);
                        navigateTo(`/categories/${category.slug}`);
                      }}
                    >
                      {category.name}
                      <span>{category.product_count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="catalog-filter-card">
                <div className="catalog-filter-header">
                  <h2>Status</h2>
                </div>

                <label className="catalog-toggle-row">
                  <span>On sale only</span>
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(event) => setSaleOnly(event.target.checked)}
                  />
                </label>
              </div>

              <div className="catalog-filter-card">
                <div className="catalog-filter-header">
                  <h2>Price range</h2>
                  <button
                    type="button"
                    className="catalog-clear-button"
                    onClick={resetPriceRange}
                  >
                    Reset
                  </button>
                </div>

                <div className="catalog-price-inputs">
                  <label className="catalog-price-field">
                    <span>Min</span>
                    <div>
                      <strong>KES</strong>
                      <input
                        type="number"
                        min={0}
                        max={priceBounds.max}
                        step="50"
                        value={minDraft}
                        placeholder="0"
                        onChange={(event) => setMinDraft(event.target.value)}
                        onBlur={applyPriceDrafts}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            applyPriceDrafts();
                          }
                        }}
                      />
                    </div>
                  </label>

                  <label className="catalog-price-field">
                    <span>Max</span>
                    <div>
                      <strong>KES</strong>
                      <input
                        type="number"
                        min={0}
                        max={priceBounds.max}
                        step="50"
                        value={maxDraft}
                        placeholder={String(priceBounds.max)}
                        onChange={(event) => setMaxDraft(event.target.value)}
                        onBlur={applyPriceDrafts}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            applyPriceDrafts();
                          }
                        }}
                      />
                    </div>
                  </label>
                </div>

                <div className="catalog-price-presets">
                  {pricePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={minPrice === preset.min && maxPrice === preset.max ? "is-active" : ""}
                      onClick={() => applyPricePreset(preset)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="catalog-price-actions">
                  <button type="button" className="catalog-apply-button" onClick={applyPriceDrafts}>
                    Apply price
                  </button>
                </div>
              </div>

              <div className="catalog-filter-card">
                <button type="button" className="catalog-reset-all-button" onClick={resetAllFilters}>
                  Reset all filters
                </button>
              </div>
            </aside>

            <div className="catalog-results">
              <div className="category-products-toolbar">
                <p className="catalog-results-count">
                  {products.length} {products.length === 1 ? "drink" : "drinks"} shown
                </p>

                <label className="sort-shell">
                  <span>Sort</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </label>
              </div>

              {productsLoading ? (
                <div className="catalog-empty-state">
                  <p>Loading drinks...</p>
                </div>
              ) : products.length > 0 ? (
                <div className="category-products-grid">
                  {products.map((product) => (
                    <article key={product.id} className="catalog-product-card">
                      <div className="catalog-product-image-shell">
                        <img src={getProductImage(product)} alt={product.name} className="catalog-product-image" />
                      </div>
                      <div className="catalog-product-copy">
                        <span className="catalog-product-tag">{product.category_name || "Bottle"}</span>
                        <h2>{product.name}</h2>
                        <p>{product.description || "Premium bottle selected for quick delivery."}</p>
                        <div className="catalog-product-footer">
                          <strong>{formatPrice(product.price)}</strong>
                          <button type="button" onClick={() => handleAddToCart(product.id)}>
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="catalog-empty-state">
                  <p>No drinks match the current filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {renderFooter ? renderFooter() : null}
    </main>
  );
}
