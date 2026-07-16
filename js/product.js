$(() => {
  const productId = Number(
    new URLSearchParams(window.location.search).get("id"),
  );
  const product = products.find((item) => item.id === productId);
  let cartButton;

  const cartDropdown = initCartDropdown({
    selector: ".product-header__cart",
    onOpenChange: (isOpen) => {
      cartButton?.setExpanded(isOpen);
    },
  });

  cartButton = initCartButton({
    selector: ".product-header__cart",
    price: 0,
    count: 0,
    onClick: () => cartDropdown.toggle(),
  });

  if (product) {
    initProductHeader({
      selector: ".product-header__title",
      initialText: product.name,
    });

    $(".product-page__description").text(product.description);

    $(".product-page__availability").append(
      createProductAvailability(product.availability),
    );
  }
});
