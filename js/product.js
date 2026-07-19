$(() => {
  const productId = Number(
    new URLSearchParams(window.location.search).get("id"),
  );
  const product = products.find((item) => item.id === productId);
  const relatedProducts = products.slice(0, 4);
  const cart = createCartState();
  const $productActions = $(".product-page__actions");
  const $relatedProductsList = $(".related-products__list");
  const availabilityPopup = initAvailabilityPopup();
  let cartButton;

  cart.registerProducts(products);

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

  const renderRelatedProducts = () => {
    const productCards = relatedProducts.map((relatedProduct) => {
      return createProductCard(
        relatedProduct,
        cart.getQuantity(relatedProduct.id),
      );
    });

    $relatedProductsList.empty().append(productCards);
  };

  const updateRelatedProductCartControl = (updatedProduct) => {
    const $productCard = $relatedProductsList.find(
      `[data-product-id="${updatedProduct.id}"]`,
    );
    const $currentControl = $productCard.find(
      ".product-card__quantity-control, .product-card__add-to-cart-button",
    );

    if (!$currentControl.length) {
      return;
    }

    const quantity = cart.getQuantity(updatedProduct.id);
    const $nextControl = quantity > 0
      ? createQuantityControl(updatedProduct, quantity)
      : createAddToCartButton(updatedProduct);

    $currentControl.replaceWith($nextControl);
  };

  const updateProductCartControls = (updatedProduct) => {
    if (product?.id === updatedProduct.id) {
      renderProductActions();
    }

    updateRelatedProductCartControl(updatedProduct);
  };

  const focusProductControl = ($container, selector) => {
    $container.find(selector)[0]?.focus({ preventScroll: true });
  };

  const updateCartComponents = () => {
    const cartSummary = cart.getSummary();

    if (cartSummary.count === 0) {
      cartDropdown.close();
    }

    cartDropdown.setItems(cartSummary.items);
    cartButton.setCart(cartSummary);
  };

  const addProductToCart = (productToAdd) => {
    cart.add(productToAdd);
    updateProductCartControls(productToAdd);
    updateCartComponents();
    cartDropdown.openForNewProduct(productToAdd.id);
  };

  const increaseCartQuantity = (productToIncrease, $focusContainer) => {
    const cartItem = cart.increase(productToIncrease.id);

    if (!cartItem) {
      return;
    }

    updateProductCartControls(productToIncrease);
    updateCartComponents();

    if ($focusContainer) {
      focusProductControl($focusContainer, ".product-card__quantity-add");
    }
  };

  const decreaseCartQuantity = (productToDecrease, $focusContainer) => {
    const cartItem = cart.decrease(productToDecrease.id);

    if (!cartItem) {
      return;
    }

    updateProductCartControls(productToDecrease);
    updateCartComponents();

    if ($focusContainer) {
      focusProductControl(
        $focusContainer,
        ".product-card__quantity-decrease, .product-card__quantity-remove",
      );
    }
  };

  const removeProductFromCart = (productToRemove, $focusContainer) => {
    const cartItem = cart.remove(productToRemove.id);

    if (!cartItem) {
      return;
    }

    updateProductCartControls(productToRemove);
    updateCartComponents();

    if ($focusContainer) {
      focusProductControl(
        $focusContainer,
        ".product-card__add-to-cart-button",
      );
    }
  };

  const getProductById = (id) =>
    products.find((productItem) => productItem.id === id);

  const getProductFromCardEvent = (event) => {
    const id = Number(
      $(event.currentTarget)
        .closest(".product-card")
        .attr("data-product-id"),
    );

    return getProductById(id);
  };

  const cartDropdown = initCartDropdown({
    selector: ".product-header__cart",
    onOpenChange: (isOpen) => {
      cartButton?.setExpanded(isOpen);
    },
    onQuantityIncrease: (id) => {
      const cartProduct = getProductById(id);

      if (cartProduct) {
        increaseCartQuantity(cartProduct);
      }
    },
    onQuantityDecrease: (id) => {
      const cartProduct = getProductById(id);

      if (cartProduct) {
        decreaseCartQuantity(cartProduct);
      }
    },
    onProductRemove: (id) => {
      const cartProduct = getProductById(id);

      if (cartProduct) {
        removeProductFromCart(cartProduct);
      }
    },
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
    () => addProductToCart(product),
  );
  $productActions.on("click", ".product-card__quantity-add", () => {
    increaseCartQuantity(product, $productActions);
  });
  $productActions.on("click", ".product-card__quantity-decrease", () => {
    decreaseCartQuantity(product, $productActions);
  });
  $productActions.on("click", ".product-card__quantity-remove", () => {
    removeProductFromCart(product, $productActions);
  });
  $productActions.on("click", ".product-card__location-button", () => {
    availabilityPopup.open(product);
  });

  $relatedProductsList.on(
    "click",
    ".product-card__add-to-cart-button",
    (event) => {
      const relatedProduct = getProductFromCardEvent(event);

      if (relatedProduct) {
        addProductToCart(relatedProduct);
      }
    },
  );
  $relatedProductsList.on("click", ".product-card__quantity-add", (event) => {
    const relatedProduct = getProductFromCardEvent(event);

    if (relatedProduct) {
      increaseCartQuantity(
        relatedProduct,
        $(event.currentTarget).closest(".product-card"),
      );
    }
  });
  $relatedProductsList.on(
    "click",
    ".product-card__quantity-decrease",
    (event) => {
      const relatedProduct = getProductFromCardEvent(event);

      if (relatedProduct) {
        decreaseCartQuantity(
          relatedProduct,
          $(event.currentTarget).closest(".product-card"),
        );
      }
    },
  );
  $relatedProductsList.on(
    "click",
    ".product-card__quantity-remove",
    (event) => {
      const relatedProduct = getProductFromCardEvent(event);

      if (relatedProduct) {
        removeProductFromCart(
          relatedProduct,
          $(event.currentTarget).closest(".product-card"),
        );
      }
    },
  );
  $relatedProductsList.on(
    "click",
    ".product-card__location-button",
    (event) => {
      const relatedProduct = getProductFromCardEvent(event);

      if (relatedProduct) {
        availabilityPopup.open(relatedProduct);
      }
    },
  );

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
  renderRelatedProducts();
});
