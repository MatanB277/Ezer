const createAddToCartButton = (product) => {
  const $cartText = $("<span>", {
    class: "product-card__add-to-cart-text",
    text: "הוספה לעגלה",
  });

  return $("<button>", {
    class: "product-card__add-to-cart-button",
    type: "button",
    "aria-label": `הוספה לעגלה: ${product.name}`,
  }).append($cartText);
};

const createQuantityControl = (product, quantity) => {
  const $addButton = $("<button>", {
    class: "product-card__quantity-button product-card__quantity-add",
    type: "button",
    "aria-label": `הוספת יחידה: ${product.name}`,
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
    "aria-atomic": "true",
    "aria-label": `כמות: ${quantity}`,
  });

  const isRemoveButton = quantity === 1;
  const $decreaseButton = $("<button>", {
    class: `product-card__quantity-button ${isRemoveButton
      ? "product-card__quantity-remove"
      : "product-card__quantity-decrease"}`,
    type: "button",
    "aria-label": isRemoveButton
      ? `הסרה מהעגלה: ${product.name}`
      : `הפחתת יחידה: ${product.name}`,
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
    role: "group",
    "aria-label": `כמות עבור ${product.name}`,
  }).append($addButton, $quantity, $decreaseButton);
};

const createProductActions = (
  product,
  quantity,
  { cartFirst = false } = {},
) => {
  const $actions = $("<div>", {
    class: "product-card__actions",
  });
  let $locationButton = null;
  let $cartControl = null;

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

    $locationButton = $("<button>", {
      class: "product-card__location-button",
      type: "button",
      "aria-label": `סניפים וזמינות: ${product.name}`,
    }).append($locationIcon, $locationText);
  }

  if (product.isCart) {
    $cartControl = quantity > 0
      ? createQuantityControl(product, quantity)
      : createAddToCartButton(product);
  }

  const controls = cartFirst
    ? [$cartControl, $locationButton]
    : [$locationButton, $cartControl];

  $actions.append(controls.filter(Boolean));

  return $actions;
};
