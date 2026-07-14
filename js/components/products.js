const createProductAvailability = (availabilityValues = []) => {
  const tags = availabilityValues.map((value) => {
    const availabilityItem = productAvailability.find(
      (item) => item.value === value,
    );

    if (!availabilityItem) {
      return null;
    }

    return $("<span>", {
      class: `product-card__availability-tag product-card__availability-tag--${value}`,
      text: availabilityItem.name,
    });
  }).filter(Boolean);

  if (!tags.length) {
    return null;
  }

  return $("<div>", {
    class: "product-card__availability",
  }).append(tags);
};

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

  const $availability = createProductAvailability(product.availability);

  const $price = $("<p>", {
    class: "product-card__price",
    text: `${product.price} ₪`,
  });

  const $divider = $("<hr>", {
    class: "product-card__divider",
  });

  const $content = $("<div>", {
    class: "product-card__content",
  }).append($title, $description, $availability, $price, $divider);

  return $("<article>", {
    class: "product-card",
    "data-product-id": product.id,
  }).append($image, $content);
};

const createProductsSort = () => {
  const $label = $("<label>", {
    class: "products__sort-label",
    for: "products-sort",
    text: "מיון לפי",
  });

  const $select = $("<select>", {
    id: "products-sort",
    class: "products__sort-select",
    "aria-label": "מיון מוצרים",
  });

  const $measure = $("<span>", {
    class: "products__sort-measure",
    "aria-hidden": "true",
  });

  const sortOptions = [
    { value: "alphabetical", label: "א-ב" },
    { value: "price-ascending", label: "מחיר: מהנמוך לגבוה" },
    { value: "price-descending", label: "מחיר: מהגבוה לנמוך" },
  ];

  sortOptions.forEach((option) => {
    $select.append(
      $("<option>", {
        value: option.value,
        text: option.label,
      }),
    );
  });

  const $control = $("<div>", {
    class: "products__sort-control",
  }).append($select, $measure);

  return [$label, $control];
};

const sortProducts = (productItems, sortValue) => {
  const sortedProducts = [...productItems];

  if (sortValue === "price-ascending") {
    return sortedProducts.sort(
      (firstProduct, secondProduct) => firstProduct.price - secondProduct.price,
    );
  }

  if (sortValue === "price-descending") {
    return sortedProducts.sort(
      (firstProduct, secondProduct) => secondProduct.price - firstProduct.price,
    );
  }

  return sortedProducts.sort((firstProduct, secondProduct) =>
    firstProduct.name.localeCompare(secondProduct.name, "he"),
  );
};

const initProducts = ({ selector, initialProducts = [] }) => {
  const $products = $(selector);
  const $count = $products.find(".products__count");
  const $list = $products.find(".products__list");
  const $sort = $products.find(".products__sort");
  let currentProducts = [];

  $sort.append(createProductsSort());
  const $select = $sort.find(".products__sort-select");
  const $measure = $sort.find(".products__sort-measure");

  const updateSelectWidth = () => {
    const selectedText = $select.find(":selected").text();

    $measure.text(selectedText);
    const textWidth = $measure[0].getBoundingClientRect().width;

    $select.width(Math.ceil(textWidth + 14));
  };

  const renderProducts = () => {
    const sortValue = $select.val();
    const sortedProducts = sortProducts(currentProducts, sortValue);
    const productCards = sortedProducts.map(createProductCard);

    $list.empty().append(productCards);
  };

  const setProducts = (productItems) => {
    currentProducts = productItems;
    $count.text(`מציג ${productItems.length} מוצרים`);
    renderProducts();
  };

  $sort.on("change", ".products__sort-select", () => {
    updateSelectWidth();
    renderProducts();
  });

  updateSelectWidth();

  setProducts(initialProducts);

  return {
    setProducts,
  };
};
