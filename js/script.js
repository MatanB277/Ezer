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

  const productsComponent = initProducts({
    selector: ".products",
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

  initCartButton({
    selector: ".product-header__cart",
    price: 0,
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
