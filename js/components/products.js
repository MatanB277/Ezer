const createProductCard = (product) => {
  const $image = $("<img>", {
    class: "product-card__image",
    src: product.image,
    alt: product.name,
  });

  const $title = $("<h3>", {
    class: "product-card__title",
    text: product.name,
  });

  const $description = $("<p>", {
    class: "product-card__description",
    text: product.description,
  });

  const $content = $("<div>", {
    class: "product-card__content",
  }).append($title, $description);

  return $("<article>", {
    class: "product-card",
    "data-product-id": product.id,
  }).append($image, $content);
};

const initProducts = ({ selector, initialProducts = [] }) => {
  const $products = $(selector);
  const $count = $products.find(".products__count");
  const $list = $products.find(".products__list");

  const setProducts = (productItems) => {
    $count.text(`מציג ${productItems.length} מוצרים`);

    const productCards = productItems.map(createProductCard);
    $list.empty().append(productCards);
  };

  setProducts(initialProducts);

  return {
    setProducts,
  };
};
