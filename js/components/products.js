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

const createAddToCartButton = () => {
  const $cartText = $("<span>", {
    class: "product-card__add-to-cart-text",
    text: "הוספה לעגלה",
  });

  return $("<button>", {
    class: "product-card__add-to-cart-button",
    type: "button",
  }).append($cartText);
};

const createQuantityControl = (product, quantity) => {
  const $addButton = $("<button>", {
    class: "product-card__quantity-button product-card__quantity-add",
    type: "button",
    "aria-label": "הוספת יחידה",
    "aria-disabled": String(quantity >= product.maxQuantity),
  }).append(
    $("<img>", {
      src: "assets/icons/add.svg",
      alt: "",
      "aria-hidden": "true",
    }),
  );

  const $quantity = $("<span>", {
    class: "product-card__quantity",
    text: quantity,
    "aria-live": "polite",
  });

  const isRemoveButton = quantity === 1;
  const $decreaseButton = $("<button>", {
    class: `product-card__quantity-button ${isRemoveButton
      ? "product-card__quantity-remove"
      : "product-card__quantity-decrease"}`,
    type: "button",
    "aria-label": isRemoveButton ? "הסרת המוצר מהעגלה" : "הפחתת יחידה",
  }).append(
    $("<img>", {
      src: isRemoveButton
        ? "assets/icons/trash.svg"
        : "assets/icons/minus.svg",
      alt: "",
      "aria-hidden": "true",
    }),
  );

  return $("<div>", {
    class: "product-card__quantity-control",
  }).append($addButton, $quantity, $decreaseButton);
};

const createProductActions = (product, quantity) => {
  const $actions = $("<div>", {
    class: "product-card__actions",
  });

  if (product.isAvailable) {
    const $locationIcon = $("<img>", {
      class: "product-card__location-icon",
      src: "assets/icons/location.svg",
      alt: "",
      "aria-hidden": "true",
    });

    const $locationText = $("<span>", {
      class: "product-card__location-text",
      text: "סניפים וזמינות",
    });

    const $locationButton = $("<button>", {
      class: "product-card__location-button",
      type: "button",
    }).append($locationIcon, $locationText);

    $actions.append($locationButton);
  }

  if (product.isCart) {
    const $cartControl = quantity > 0
      ? createQuantityControl(product, quantity)
      : createAddToCartButton();

    $actions.append($cartControl);
  }

  return $actions;
};

const createProductCard = (product, quantity = 0) => {
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
  }).append($title, $description, $availability, $price, $footer);

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

const initProducts = ({
  selector,
  initialProducts = [],
  onCartChange = () => {},
  onProductAdded = () => {},
}) => {
  const $products = $(selector);
  const $count = $products.find(".products__count");
  const $list = $products.find(".products__list");
  const $sort = $products.find(".products__sort");
  const cart = createCartState();
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

    if (!sortedProducts.length) {
      $list.empty().append(
        $("<p>", {
          class: "products__empty",
          text: "לא נמצאו מוצרים",
        }),
      );
      return;
    }

    const productCards = sortedProducts.map((product) =>
      createProductCard(product, cart.getQuantity(product.id)),
    );

    $list.empty().append(productCards);
  };

  const setProducts = (productItems) => {
    currentProducts = productItems;
    cart.registerProducts(productItems);
    $count.text(`מציג ${productItems.length} מוצרים`);
    renderProducts();
  };

  const updateCart = () => {
    onCartChange(cart.getSummary());
  };

  const getProductFromCardEvent = (event) => {
    const productId = Number(
      $(event.currentTarget).closest(".product-card").attr("data-product-id"),
    );

    return currentProducts.find((product) => product.id === productId);
  };

  const focusProductCardControl = (productId, controlSelector) => {
    $list
      .find(`[data-product-id="${productId}"]`)
      .find(controlSelector)
      .first()
      .trigger("focus");
  };

  const updateProductCartControl = (product, quantity) => {
    const $productCard = $list.find(`[data-product-id="${product.id}"]`);
    const $currentControl = $productCard.find(
      ".product-card__quantity-control, .product-card__add-to-cart-button",
    );
    const $nextControl = quantity > 0
      ? createQuantityControl(product, quantity)
      : createAddToCartButton();

    $currentControl.replaceWith($nextControl);
  };

  const addProductToCart = (product) => {
    const cartItem = cart.add(product);

    updateProductCartControl(cartItem.product, cartItem.quantity);
    updateCart();
    onProductAdded(product);
  };

  const increaseCartQuantity = (productId) => {
    const cartItem = cart.increase(productId);

    if (!cartItem) {
      return;
    }

    updateProductCartControl(cartItem.product, cartItem.quantity);
    updateCart();
  };

  const removeFromCart = (productId) => {
    const cartItem = cart.remove(productId);

    if (!cartItem) {
      return;
    }

    updateProductCartControl(cartItem.product, cartItem.quantity);
    updateCart();
  };

  const decreaseCartQuantity = (productId) => {
    const cartItem = cart.decrease(productId);

    if (!cartItem) {
      return;
    }

    updateProductCartControl(cartItem.product, cartItem.quantity);
    updateCart();
  };

  const handleSortChange = () => {
    updateSelectWidth();
    renderProducts();
  };

  const handleAddToCartClick = (event) => {
    const product = getProductFromCardEvent(event);

    if (product) {
      addProductToCart(product);
    }
  };

  const handleQuantityIncreaseClick = (event) => {
    const product = getProductFromCardEvent(event);

    if (product) {
      increaseCartQuantity(product.id);
      focusProductCardControl(product.id, ".product-card__quantity-add");
    }
  };

  const handleProductRemoveClick = (event) => {
    const product = getProductFromCardEvent(event);

    if (product) {
      removeFromCart(product.id);
    }
  };

  const handleQuantityDecreaseClick = (event) => {
    const product = getProductFromCardEvent(event);

    if (product) {
      decreaseCartQuantity(product.id);
      focusProductCardControl(
        product.id,
        ".product-card__quantity-decrease, .product-card__quantity-remove",
      );
    }
  };

  $sort.on("change", ".products__sort-select", handleSortChange);
  $list.on(
    "click",
    ".product-card__add-to-cart-button",
    handleAddToCartClick,
  );
  $list.on(
    "click",
    ".product-card__quantity-add",
    handleQuantityIncreaseClick,
  );
  $list.on(
    "click",
    ".product-card__quantity-remove",
    handleProductRemoveClick,
  );
  $list.on(
    "click",
    ".product-card__quantity-decrease",
    handleQuantityDecreaseClick,
  );

  updateSelectWidth();

  setProducts(initialProducts);

  return {
    setProducts,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  };
};
