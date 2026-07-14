$(() => {
  const categoryFromUrl = getUrlParameter("category");
  const isValidCategory = categories.some(
    (category) => category.value === categoryFromUrl,
  );

  const filters = {
    category: isValidCategory ? categoryFromUrl : "",
    availability: [],
    search: "",
  };

  let cartComponent;
  let productsComponent;

  const cartDropdown = initCartDropdown({
    selector: ".product-header__cart",
    onOpenChange: (isOpen) => {
      cartComponent?.setExpanded(isOpen);
    },
    onQuantityIncrease: (productId) => {
      productsComponent?.increaseCartQuantity(productId);
    },
    onQuantityDecrease: (productId) => {
      productsComponent?.decreaseCartQuantity(productId);
    },
    onProductRemove: (productId) => {
      productsComponent?.removeFromCart(productId);
    },
  });

  cartComponent = initCartButton({
    selector: ".product-header__cart",
    price: 0,
    count: 0,
    onClick: () => cartDropdown.toggle(),
  });

  productsComponent = initProducts({
    selector: ".products",
    onCartChange: ({ price, count, items }) => {
      if (count === 0) {
        cartDropdown.close();
      }

      cartDropdown.setItems(items);
      cartComponent.setCart({ price, count });
    },
  });

  const updateProducts = () => {
    const filteredProducts = filterProducts(products, filters);

    productsComponent.setProducts(filteredProducts);
  };

  const initialCategory = categories.find(
    (category) => category.value === filters.category,
  );

  const productHeader = initProductHeader({
    selector: ".product-header__title",
    initialText: initialCategory?.name || "הכל",
  });

  initSearchInput({
    selector: ".product-header__search",
    onSearchChange: (searchValue) => {
      filters.search = searchValue;
      updateProducts();
    },
  });

  initCategories({
    selector: ".categories__list",
    categoryItems: categories,
    selectedValue: filters.category,
    onCategoryChange: (categoryValue) => {
      filters.category = categoryValue;
      setUrlParameter("category", categoryValue);

      const selectedCategory = categories.find(
        (category) => category.value === categoryValue,
      );

      productHeader.setText(selectedCategory?.name || "הכל");
      updateProducts();
    },
  });

  initAvailabilityFilters({
    selector: ".availability-filters__list",
    availabilityItems: productAvailability,
    selectedValues: filters.availability,
    onAvailabilityChange: (availabilityValues) => {
      filters.availability = availabilityValues;
      updateProducts();
    },
  });

  updateProducts();
});
