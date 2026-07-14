const createAvailabilityFilter = (availability, selectedValues) => {
  const isAllFilter = availability.value === "";
  const isSelected = isAllFilter
    ? selectedValues.length === 0
    : selectedValues.includes(availability.value);

  return $("<button>", {
    class: `availability-filter${isSelected ? " availability-filter--selected" : ""}`,
    type: "button",
    text: availability.name,
    "data-value": availability.value,
    "aria-pressed": String(isSelected),
  });
};

const renderAvailabilityFilters = (
  $availabilityList,
  availabilityItems,
  selectedValues,
) => {
  const filters = availabilityItems.map((availability) =>
    createAvailabilityFilter(availability, selectedValues),
  );

  $availabilityList.empty().append(filters);
};

const initAvailabilityFilters = ({
  selector,
  availabilityItems,
  selectedValues = [],
  onAvailabilityChange = () => {},
}) => {
  const $availabilityList = $(selector);
  let currentValues = [...selectedValues];

  const updateFilters = () => {
    renderAvailabilityFilters(
      $availabilityList,
      availabilityItems,
      currentValues,
    );
  };

  $availabilityList.on("click", ".availability-filter", (event) => {
    const value = $(event.currentTarget).attr("data-value") || "";

    if (value === "") {
      currentValues = [];
    } else if (currentValues.includes(value)) {
      currentValues = currentValues.filter(
        (selectedValue) => selectedValue !== value,
      );
    } else {
      currentValues = [...currentValues, value];
    }

    updateFilters();
    onAvailabilityChange([...currentValues]);
  });

  updateFilters();
};
