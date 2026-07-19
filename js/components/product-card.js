const createProductCard = (product, quantity = 0) => {
  const $image = $("<img>", {
    class: "product-card__image",
    src: product.image,
    alt: product.name,
  });

  const $title = $("<h3>", {
    id: `product-title-${product.id}`,
    class: "product-card__title",
    text: product.name,
  });

  const $description = $("<p>", {
    class: "product-card__description",
    text: product.description,
  });

  const $availability = createProductAvailability(product.availability);

  const $price = $("<p>", {
    class: "product-card__price",
    text: `${product.price} ₪`,
  });

  let $footer = null;

  if (product.isAvailable || product.isCart) {
    const $divider = $("<hr>", {
      class: "product-card__divider",
    });

    const $actions = createProductActions(product, quantity);

    $footer = $("<div>", {
      class: "product-card__footer",
    }).append($divider, $actions);
  }

  const $content = $("<div>", {
    class: "product-card__content",
  }).append($title, $description, $availability, $price);

  const $productLink = $("<a>", {
    class: "product-card__link",
    href: `product.html?id=${product.id}`,
    "aria-label": `פרטי המוצר: ${product.name}`,
  }).append($image, $content);

  return $("<article>", {
    class: "product-card",
    "data-product-id": product.id,
  }).append($productLink, $footer);
};
