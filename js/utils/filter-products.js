const filterProducts = (productItems, filters) =>
  productItems.filter((product) => {
    const matchesCategory =
      filters.category === "" || product.category === filters.category;

    const matchesAvailability =
      filters.availability.length === 0 ||
      filters.availability.some((availability) =>
        product.availability.includes(availability),
      );

    return matchesCategory && matchesAvailability;
  });
