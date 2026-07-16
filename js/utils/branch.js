const filterBranches = (branchItems, filters) => {
  const searchValue = filters.search.trim().toLocaleLowerCase("he");

  return branchItems.filter((branch) => {
    const matchesLocation =
      filters.location === "" || branch.location === filters.location;

    const matchesAvailability =
      filters.availability.length === 0 ||
      filters.availability.some((availability) =>
        branch.availability.includes(availability),
      );

    const searchableText = [
      branch.name,
      branch.city,
      branch.street,
      branch.phone,
    ].join(" ").toLocaleLowerCase("he");
    const matchesSearch =
      searchValue === "" || searchableText.includes(searchValue);

    return matchesLocation && matchesAvailability && matchesSearch;
  });
};
