---
title: Components, Data Layers, and the Adapter Pattern
createdAt: 2025-11-29
updatedAt: 2026-03-21
---

## Rambling Thesis Statement

Recently I've been thinking about the importance of Component Design with regard to React/NextJS projects. But I think conceptually, this extends to any project that is component based. When you are developing components for an app, there is almost always some data layer that is providing you content. _Usually_ This comes in the form of some REST API request that returns you some JSON shape that you then plug into a component. What I have very recently conceptually considered, with respect to this relationship, is the Adapter Pattern. This should, in my opinion, ALWAYS come into play when building in this fashion. You should always be thinking of the props of your component as a public interface. The props should describe what the component can do, the component should not be altered to accommodate the props. There should be a layer between the data coming in and the component itself that should be doing the job of making the data fit the component. This is the Adapter Pattern.

## The Adapter Pattern

Instead of giving an in depth explanation on my own, I encourage you to dig into this article instead that does a fantastic job of explaining the Adapter Pattern: [Geeks For Geeks: Adapter Design Pattern](https://www.geeksforgeeks.org/system-design/adapter-pattern/).

## Example

**Q: This all sounds like you know a whole lot about tech Donny. But what the fuck are you talking about?**

I'm glad I asked! I captured this thought so that I would later elaborate on it and now I am just 5 short months later. Let's organize the problem a bit more and hopefully make more sense of this word soup.

## The Problem

It is really easy to take the type of an API response and plug it directly into a given component as the props:

```ts
// ❌ BEFORE: Component tightly coupled to the API response shape

// The API response — you don't own this, it can change
type ApiProduct = {
  product_id: string;
  display_name: string;
  base_price_cents: number;
  discount_bps: number;        // basis points, e.g. 500 = 5%
  media: { src: string; alt_text: string }[];
  inventory: { in_stock: boolean; qty_remaining: number };
};

// The component consumes the API shape directly — now they're glued together
function ProductBanner({ product_id, display_name, base_price_cents, discount_bps, media, inventory }: ApiProduct) {
  const price = (base_price_cents / 100).toFixed(2);
  const discount = (discount_bps / 100).toFixed(0);
  const image = media[0];

  return (
    <div>
      <img src={image.src} alt={image.alt_text} />
      <h2>{display_name}</h2>
      <p>${price} — {discount}% off</p>
      {!inventory.in_stock && <span>Out of stock</span>}
    </div>
  );
}

// The problem: if the API renames `display_name` to `title`, or changes
// `base_price_cents` to `price_usd`, your component breaks. The business
// logic (cents → dollars, basis points → %) is also leaking into the UI.
```

As outlined, this is bad because we have a contract in our codebase that relies on code that we don't maintain. This is a gigantic red flag. Instead, we should implement the Adapter Pattern, add a mutation layer to our code, and create a solid interface that describes our component as we expect it to be used.

```ts
// ✅ AFTER: Adapter pattern decouples the API from the component

// 1. The API contract — models exactly what the API returns
type ApiProduct = {
  product_id: string;
  display_name: string;
  base_price_cents: number;
  discount_bps: number;
  media: { src: string; alt_text: string }[];
  inventory: { in_stock: boolean; qty_remaining: number };
};

// 2. The component contract — models what the UI actually needs
type ProductBannerProps = {
  id: string;
  name: string;
  formattedPrice: string;       // "$49.99"
  discountPercent: number;      // 5
  image: { src: string; alt: string };
  availability: "in_stock" | "out_of_stock";
};

// 3. The adapter — owns the mutation logic between the two contracts
function adaptApiProductToBannerProps(product: ApiProduct): ProductBannerProps {
  return {
    id: product.product_id,
    name: product.display_name,
    formattedPrice: `$${(product.base_price_cents / 100).toFixed(2)}`,
    discountPercent: product.discount_bps / 100,
    image: {
      src: product.media[0].src,
      alt: product.media[0].alt_text,
    },
    availability: product.inventory.in_stock ? "in_stock" : "out_of_stock",
  };
}

// 4. The component — clean, readable, knows nothing about the API
function ProductBanner({ name, formattedPrice, discountPercent, image, availability }: ProductBannerProps) {
  return (
    <div>
      <img src={image.src} alt={image.alt} />
      <h2>{name}</h2>
      <p>{formattedPrice} — {discountPercent}% off</p>
      {availability === "out_of_stock" && <span>Out of stock</span>}
    </div>
  );
}

// 5. The call site — adapter runs at the boundary, right after the fetch
async function Page() {
  const data: ApiProduct = await fetch("/api/products/1").then(r => r.json());
  const props = adaptApiProductToBannerProps(data);
  return <ProductBanner {...props} />;
}
```
