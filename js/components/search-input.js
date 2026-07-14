const createSearchInput = ({
  placeholder = "חיפוש מוצר",
  icon = "assets/icons/search.svg",
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
    autocomplete: "off",
  });

  return $("<div>", {
    class: "search-input",
  }).append($icon, $input);
};

const initSearchInput = ({ selector }) => {
  const $container = $(selector);

  $container.empty().append(createSearchInput({}));
};
