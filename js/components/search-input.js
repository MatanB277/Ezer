const createSearchInput = ({
  placeholder = "חיפוש מוצר",
  icon = "assets/icons/search.svg",
  controls = "products-list",
}) => {
  const $icon = $("<img>", {
    class: "search-input__icon",
    src: icon,
    alt: "",
    "aria-hidden": "true",
  });

  const $input = $("<input>", {
    class: "search-input__field",
    type: "search",
    placeholder,
    "aria-label": placeholder,
    ...(controls ? { "aria-controls": controls } : {}),
    autocomplete: "off",
  });

  return $("<div>", {
    class: "search-input",
  }).append($icon, $input);
};

const initSearchInput = ({
  selector,
  onSearchChange = () => {},
}) => {
  const $container = $(selector);

  $container.empty().append(createSearchInput({}));

  $container.on("input", ".search-input__field", (event) => {
    onSearchChange($(event.currentTarget).val());
  });
};
