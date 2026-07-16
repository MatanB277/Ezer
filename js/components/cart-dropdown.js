const createCartDropdown = () => {
  const $title = $("<h2>", {
    id: "cart-dropdown-title",
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
    role: "region",
    "aria-label": "מוצרים בעגלה",
    tabindex: 0,
  });

  const $scrollbar = $("<div>", {
    class: "cart-dropdown__scrollbar",
    "aria-hidden": "true",
  }).append(
    $("<span>", {
      class: "cart-dropdown__scrollbar-thumb",
    }),
  );

  const $bodyContainer = $("<div>", {
    class: "cart-dropdown__body-container",
  }).append($body, $scrollbar);

  const $headerDivider = $("<hr>", {
    class: "cart-dropdown-header__divider",
  });

  const $totalLabel = $("<span>", {
    class: "cart-dropdown__total-label",
    text: "סה\"כ לתשלום",
  });

  const $totalPrice = $("<span>", {
    class: "cart-dropdown__total-price",
    text: "0 ₪",
  });

  const $total = $("<div>", {
    class: "cart-dropdown__total",
    role: "status",
  }).append($totalLabel, $totalPrice);

  const $checkoutButton = $("<button>", {
    class: "cart-dropdown__checkout",
    type: "button",
    text: "מעבר לתשלום",
  });

  const $footer = $("<div>", {
    class: "cart-dropdown__footer",
  }).append($checkoutButton);

  return $("<div>", {
    id: "cart-dropdown",
    class: "cart-dropdown",
    role: "dialog",
    "aria-labelledby": "cart-dropdown-title",
    hidden: true,
  }).append($header, $headerDivider, $bodyContainer, $total, $footer);
};

const createCartDropdownQuantity = (item) => {
  const $addButton = $("<button>", {
    class: "cart-dropdown__quantity-button cart-dropdown__quantity-add",
    type: "button",
    "aria-label": `הוספת יחידה: ${item.name}`,
    "aria-disabled": String(item.quantity >= item.maxQuantity),
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
    "aria-live": "polite",
    "aria-atomic": "true",
    "aria-label": `כמות: ${item.quantity}`,
  });

  const isRemoveButton = item.quantity === 1;
  const $decreaseButton = $("<button>", {
    class: `cart-dropdown__quantity-button ${isRemoveButton
      ? "cart-dropdown__quantity-remove"
      : "cart-dropdown__quantity-decrease"}`,
    type: "button",
    "aria-label": isRemoveButton
      ? `הסרה מהעגלה: ${item.name}`
      : `הפחתת יחידה: ${item.name}`,
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
    role: "group",
    "aria-label": `כמות עבור ${item.name}`,
  }).append($addButton, $quantity, $decreaseButton);
};

const createCartDropdownItem = (item) => {
  const $image = $("<img>", {
    class: "cart-dropdown__item-image",
    src: item.image,
    alt: item.name,
  });

  const $name = $("<h3>", {
    id: `cart-item-title-${item.id}`,
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

  return $("<article>", {
    class: "cart-dropdown__item",
    "data-product-id": item.id,
    "aria-labelledby": `cart-item-title-${item.id}`,
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
  const $scrollbar = $dropdown.find(".cart-dropdown__scrollbar");
  const $scrollbarThumb = $dropdown.find(".cart-dropdown__scrollbar-thumb");
  const $totalPrice = $dropdown.find(".cart-dropdown__total-price");
  let isOpen = false;

  const updateCartScrollbar = () => {
    const bodyElement = $body[0];

    $scrollbar.prop("hidden", false);

    const scrollbarHeight = $scrollbar.height();
    const thumbHeight = Math.min(74, scrollbarHeight);
    const maximumScroll = bodyElement.scrollHeight - bodyElement.clientHeight;
    const maximumThumbMovement = scrollbarHeight - thumbHeight;
    const thumbPosition = maximumScroll > 0
      ? (bodyElement.scrollTop / maximumScroll) * maximumThumbMovement
      : 0;

    $scrollbar.prop("hidden", maximumScroll <= 0);
    $scrollbarThumb.css({
      height: `${thumbHeight}px`,
      transform: `translateY(${thumbPosition}px)`,
    });
  };

  const setOpen = (nextIsOpen) => {
    isOpen = nextIsOpen;
    $dropdown.prop("hidden", !isOpen);
    onOpenChange(isOpen);

    if (isOpen) {
      requestAnimationFrame(updateCartScrollbar);
    }

    return isOpen;
  };

  const getProductIdFromEvent = (event) =>
    Number(
      $(event.currentTarget)
        .closest(".cart-dropdown__item")
        .attr("data-product-id"),
    );

  const handleCloseClick = () => {
    setOpen(false);
    $container.children(".cart-button").trigger("focus");
  };

  const handleDropdownKeydown = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    handleCloseClick();
  };

  const handleQuantityIncrease = (event) => {
    const productId = getProductIdFromEvent(event);

    onQuantityIncrease(productId);
    $dropdown
      .find(
        `[data-product-id="${productId}"] .cart-dropdown__quantity-add`,
      )
      .trigger("focus");
  };

  const handleQuantityDecrease = (event) => {
    const productId = getProductIdFromEvent(event);

    onQuantityDecrease(productId);
    $dropdown
      .find(
        `[data-product-id="${productId}"] .cart-dropdown__quantity-decrease, ` +
        `[data-product-id="${productId}"] .cart-dropdown__quantity-remove`,
      )
      .trigger("focus");
  };

  const handleProductRemove = (event) => {
    onProductRemove(getProductIdFromEvent(event));
  };

  $container.append($dropdown);

  $dropdown.on("click", ".cart-dropdown__close", handleCloseClick);
  $dropdown.on("keydown", handleDropdownKeydown);
  $dropdown.on("click", ".cart-dropdown__quantity-add", handleQuantityIncrease);
  $dropdown.on("click", ".cart-dropdown__quantity-remove", handleProductRemove);
  $dropdown.on(
    "click",
    ".cart-dropdown__quantity-decrease",
    handleQuantityDecrease,
  );
  $body.on("scroll", updateCartScrollbar);
  $(window).on("resize.cartDropdown", updateCartScrollbar);

  const setItems = (items) => {
    const content = [];
    const totalPrice = calculateCartItemsTotal(items);

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
    $totalPrice.text(`${totalPrice.toLocaleString("he-IL")} ₪`);
    requestAnimationFrame(updateCartScrollbar);
  };

  const openDropdown = () => {
    const openState = setOpen(true);
    const closeButton = $dropdown.find(".cart-dropdown__close")[0];

    closeButton?.focus({ preventScroll: true });
    return openState;
  };

  return {
    toggle: () => setOpen(!isOpen),
    open: openDropdown,
    close: () => setOpen(false),
    setItems,
  };
};
