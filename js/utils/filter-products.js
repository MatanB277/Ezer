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
