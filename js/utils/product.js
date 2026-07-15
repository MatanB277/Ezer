const filterProducts = (productItems, filters) =>
  productItems.filter((product) => {
    const searchValue = filters.search.trim().toLocaleLowerCase("he");
    const matchesCategory =
      filters.category === "" || product.category === filters.category;

    const matchesAvailability =
      filters.availability.length === 0 ||
      filters.availability.some((availability) =>
        product.availability.includes(availability),
      );

    const searchableText = `${product.name} ${product.description}`;
    const matchesSearch =
      searchValue === "" || searchableText.includes(searchValue);

    return matchesCategory && matchesAvailability && matchesSearch;
  });

const sortProducts = (productItems, sortValue) => {
  const sortedProducts = [...productItems];

  if (sortValue === "price-ascending") {
    return sortedProducts.sort(
      (firstProduct, secondProduct) => firstProduct.price - secondProduct.price,
    );
  }

  if (sortValue === "price-descending") {
    return sortedProducts.sort(
      (firstProduct, secondProduct) => secondProduct.price - firstProduct.price,
    );
  }

  return sortedProducts.sort((firstProduct, secondProduct) =>
    firstProduct.name.localeCompare(secondProduct.name, "he"),
  );
};
