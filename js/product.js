$(() => {
  const productId = Number(
    new URLSearchParams(window.location.search).get("id"),
  );
  const product = products.find((item) => item.id === productId);
  const cart = createCartState();
  const $productActions = $(".product-page__actions");
  const availabilityPopup = initAvailabilityPopup();
  let cartButton;

  if (product) {
    cart.registerProducts([product]);
  }

  const renderProductActions = () => {
    $productActions.empty();

    if (!product) {
      return;
    }

    $productActions.append(
      createProductActions(
        product,
        cart.getQuantity(product.id),
        { cartFirst: true },
      ),
    );
  };

  const focusProductAction = (selector) => {
    $productActions.find(selector)[0]?.focus({ preventScroll: true });
  };

  const updateCartComponents = () => {
    const cartSummary = cart.getSummary();

    if (cartSummary.count === 0) {
      cartDropdown.close();
    }

    cartDropdown.setItems(cartSummary.items);
    cartButton.setCart(cartSummary);
  };

  const increaseCartQuantity = () => {
    const cartItem = cart.increase(product.id);

    if (!cartItem) {
      return;
    }

    renderProductActions();
    updateCartComponents();
    focusProductAction(".product-card__quantity-add");
  };

  const decreaseCartQuantity = () => {
    const cartItem = cart.decrease(product.id);

    if (!cartItem) {
      return;
    }

    renderProductActions();
    updateCartComponents();
    focusProductAction(
      ".product-card__quantity-decrease, .product-card__quantity-remove",
    );
  };

  const removeProductFromCart = () => {
    const cartItem = cart.remove(product.id);

    if (!cartItem) {
      return;
    }

    renderProductActions();
    updateCartComponents();
    focusProductAction(".product-card__add-to-cart-button");
  };

  const addProductToCart = () => {
    cart.add(product);
    renderProductActions();
    updateCartComponents();
    cartDropdown.openForNewProduct(product.id);
  };

  const cartDropdown = initCartDropdown({
    selector: ".product-header__cart",
    onOpenChange: (isOpen) => {
      cartButton?.setExpanded(isOpen);
    },
    onQuantityIncrease: increaseCartQuantity,
    onQuantityDecrease: decreaseCartQuantity,
    onProductRemove: removeProductFromCart,
  });

  cartButton = initCartButton({
    selector: ".product-header__cart",
    price: 0,
    count: 0,
    onClick: () => cartDropdown.toggle(),
  });

  $productActions.on(
    "click",
    ".product-card__add-to-cart-button",
    addProductToCart,
  );
  $productActions.on(
    "click",
    ".product-card__quantity-add",
    increaseCartQuantity,
  );
  $productActions.on(
    "click",
    ".product-card__quantity-decrease",
    decreaseCartQuantity,
  );
  $productActions.on(
    "click",
    ".product-card__quantity-remove",
    removeProductFromCart,
  );
  $productActions.on("click", ".product-card__location-button", () => {
    availabilityPopup.open(product);
  });

  if (!product) {
    return;
  }

  initProductHeader({
    selector: ".product-header__title",
    initialText: product.name,
  });

  $(".product-page__description").text(product.description);
  initProductGallery({
    selector: ".product-page__gallery",
    product,
  });

  const $availabilityNotice = createAvailabilityNotice();
  setAvailabilityNoticeProduct($availabilityNotice, product);
  $(".product-page__notice").append($availabilityNotice);
  $(".product-page__price").text(
    `מחיר: ${product.price.toLocaleString("he-IL")} ₪`,
  );

  $(".product-page__availability").append(
    createProductAvailability(product.availability),
  );
  $(".product-page__technical-specifications").append(
    createTechnicalSpecifications(product.technicalSpecifications),
  );
  $(".product-page__guides").append(createProductGuides());

  renderProductActions();
});
