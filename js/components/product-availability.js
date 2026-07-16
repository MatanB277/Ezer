const createProductAvailability = (availabilityValues = []) => {
  const tags = availabilityValues.map((value) => {
    const availabilityItem = productAvailability.find(
      (item) => item.value === value,
    );

    if (!availabilityItem) {
      return null;
    }

    return $("<span>", {
      class: `product-card__availability-tag product-card__availability-tag--${value}`,
      text: availabilityItem.name,
    });
  }).filter(Boolean);

  if (!tags.length) {
    return null;
  }

  return $("<div>", {
    class: "product-card__availability",
  }).append(tags);
};
