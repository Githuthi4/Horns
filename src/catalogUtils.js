export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const dedupeProducts = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
};

export const getRouteFromLocation = () => {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/categories") {
    return { name: "categories-index" };
  }

  if (pathname.startsWith("/categories/")) {
    return {
      name: "category-detail",
      slug: decodeURIComponent(pathname.slice("/categories/".length)),
    };
  }

  return {
    name: "home",
    hash: window.location.hash,
  };
};
