const createCartDropdown = () => {
  const $title = $("<h2>", {
    class: "cart-dropdown__title",
    text: "העגלה שלי",
  });

  const $closeButton = $("<button>", {
    class: "cart-dropdown__close",
    type: "button",
    "aria-label": "סגירת העגלה",
  }).append(
    $("<img>", {
      src: "assets/icons/close.svg",
      alt: "",
      "aria-hidden": "true",
    }),
  );

  const $header = $("<div>", {
    class: "cart-dropdown__header",
  }).append($title, $closeButton);

  const $body = $("<div>", {
    class: "cart-dropdown__body",
  });

  const $headerDivider = $("<hr>", {
    class: "cart-dropdown-header__divider",
  });

  return $("<div>", {
    id: "cart-dropdown",
    class: "cart-dropdown",
    hidden: true,
  }).append($header, $headerDivider, $body);
};

const createCartDropdownQuantity = (item) => {
  const $addButton = $("<button>", {
    class: "cart-dropdown__quantity-button cart-dropdown__quantity-add",
    type: "button",
    "aria-label": "הוספת יחידה",
    disabled: item.quantity >= item.maxQuantity,
  }).append(
    $("<img>", {
      src: "assets/icons/add.svg",
      alt: "",
      "aria-hidden": "true",
    }),
  );

  const $quantity = $("<span>", {
    class: "cart-dropdown__quantity-value",
    text: item.quantity,
  });

  const isRemoveButton = item.quantity === 1;
  const $decreaseButton = $("<button>", {
    class: `cart-dropdown__quantity-button ${isRemoveButton
      ? "cart-dropdown__quantity-remove"
      : "cart-dropdown__quantity-decrease"}`,
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
    class: "cart-dropdown__quantity-control",
  }).append($addButton, $quantity, $decreaseButton);
};

const createCartDropdownItem = (item) => {
  const $image = $("<img>", {
    class: "cart-dropdown__item-image",
    src: item.image,
    alt: item.name,
  });

  const $name = $("<h3>", {
    class: "cart-dropdown__item-name",
    text: item.name,
  });

  const $quantity = createCartDropdownQuantity(item);

  const $price = $("<span>", {
    class: "cart-dropdown__item-price",
    text: `${(item.price * item.quantity).toLocaleString("he-IL")} ₪`,
  });

  const $details = $("<div>", {
    class: "cart-dropdown__item-details",
  }).append($quantity, $price);

  const $content = $("<div>", {
    class: "cart-dropdown__item-content",
  });
  $content.append($name, $details);

  return $("<div>", {
    class: "cart-dropdown__item",
    "data-product-id": item.id,
  }).append($image, $content);
};

const initCartDropdown = ({
  selector,
  onOpenChange = () => {},
  onQuantityIncrease = () => {},
  onQuantityDecrease = () => {},
  onProductRemove = () => {},
}) => {
  const $container = $(selector);
  const $dropdown = createCartDropdown();
  const $body = $dropdown.find(".cart-dropdown__body");
  let isOpen = false;

  const setOpen = (nextIsOpen) => {
    isOpen = nextIsOpen;
    $dropdown.prop("hidden", !isOpen);
    onOpenChange(isOpen);

    return isOpen;
  };

  $container.append($dropdown);

  $dropdown.on("click", ".cart-dropdown__close", () => {
    setOpen(false);
  });

  $dropdown.on("click", ".cart-dropdown__quantity-add", (event) => {
    const productId = Number(
      $(event.currentTarget)
        .closest(".cart-dropdown__item")
        .attr("data-product-id"),
    );

    onQuantityIncrease(productId);
  });

  $dropdown.on("click", ".cart-dropdown__quantity-remove", (event) => {
    const productId = Number(
      $(event.currentTarget)
        .closest(".cart-dropdown__item")
        .attr("data-product-id"),
    );

    onProductRemove(productId);
  });

  $dropdown.on("click", ".cart-dropdown__quantity-decrease", (event) => {
    const productId = Number(
      $(event.currentTarget)
        .closest(".cart-dropdown__item")
        .attr("data-product-id"),
    );

    onQuantityDecrease(productId);
  });

  const setItems = (items) => {
    const content = [];

    items.forEach((item, index) => {
      content.push(createCartDropdownItem(item));

      if (index < items.length - 1) {
        content.push(
          $("<hr>", {
            class: "cart-dropdown__divider",
          }),
        );
      }
    });

    $body.empty().append(content);
  };

  return {
    toggle: () => setOpen(!isOpen),
    close: () => setOpen(false),
    setItems,
  };
};
