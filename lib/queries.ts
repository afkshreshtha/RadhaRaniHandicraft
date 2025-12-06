export const getAllProductsQuery = `*[_type == "product"]{
  _id,
  name,
  slug,
  price,
  paintingStyle,
  "images": images[].asset->url,
  "mainImage": images[0].asset->url,
  category->{title, slug,"image": image.asset->url,_id},
  featured,
  description,
  actual_price,
  material->{title,slug,_id},
  createdAt,
  dimensions {
    length {
      value,
      unit->{title, symbol}
    },
    width {
      value,
      unit->{title, symbol}
    },
    height {
      value,
      unit->{title, symbol}
    }
  }
}`;

export const getProductBySlugQuery = (slug: string) => `*[_type == "product" && slug.current == "${slug}"][0]{
  _id,
  name,
  slug,
  price,
  paintingStyle,
  description,
  "images": images[].asset->url,
  "mainImage": images[0].asset->url,
  category->{title, slug, "image": image.asset->url, _id},
  featured,
  actual_price,
  material->{title, slug, _id},
  createdAt,
  dimensions {
    length {
      value,
      unit->{title, symbol}
    },
    width {
      value,
      unit->{title, symbol}
    },
    height {
      value,
      unit->{title, symbol}
    }
  }
}`;

  