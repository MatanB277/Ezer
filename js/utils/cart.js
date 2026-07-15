const calculateCartItemsTotal = (items) =>
  items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

const createCartSummary = (cartQuantities, productsById) => {
  const items = [];
  let count = 0;

  cartQuantities.forEach((quantity, productId) => {
    const product = productsById.get(productId);

    if (!product) {
      return;
    }

    count += quantity;
    
    items.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      maxQuantity: product.maxQuantity,
    });
  });

  return {
    count,
    price: calculateCartItemsTotal(items),
    items,
  };
};

const onClickOutsideCartDropdown = ({
  $cartContainer,
  isDropdownOpen,
  onOutsideClick,
}) => {
  const handlePointerDown = (event) => {
    const $clickedElement = $(event.target);
    const clickedInsideCart = $clickedElement.closest($cartContainer).length > 0;
    const clickedAddToCartButton =
      $clickedElement.closest("[data-cart-opener]").length > 0;

    if (!isDropdownOpen() || clickedInsideCart || clickedAddToCartButton) {
      return;
    }

    onOutsideClick();
  };

  $(document).on("pointerdown.cartDropdown", handlePointerDown);
};
