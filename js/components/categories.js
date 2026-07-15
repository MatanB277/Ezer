const createCategoryCard = (category, selectedValue) => {
  const isSelected = category.value === selectedValue;

  const $icon = $("<img>", {
    class: "category-card__icon",
    src: isSelected ? category.selectedIcon : category.icon,
    alt: "",
    "aria-hidden": "true",
  });

  const $name = $("<span>", {
    class: "category-card__name",
    text: category.name,
  });

  return $("<button>", {
    class: `category-card${isSelected ? " category-card--selected" : ""}`,
    type: "button",
    "data-value": category.value,
    "data-icon": category.icon,
    "data-selected-icon": category.selectedIcon,
    "aria-pressed": String(isSelected),
    "aria-controls": "products-list",
  }).append($icon, $name);
};

const renderCategories = ($categoriesList, categoryItems, selectedValue) => {
  const categoryCards = categoryItems.map((category) =>
    createCategoryCard(category, selectedValue),
  );

  $categoriesList.empty().append(categoryCards);
};

const updateSelectedCategory = ($categoriesList, $selectedCard) => {
  $(".category-card", $categoriesList).each((_, card) => {
    const $card = $(card);
    const isSelected = card === $selectedCard[0];

    $card
      .toggleClass("category-card--selected", isSelected)
      .attr("aria-pressed", String(isSelected));

    $card
      .find(".category-card__icon")
      .attr(
        "src",
        isSelected
          ? $card.attr("data-selected-icon")
          : $card.attr("data-icon"),
      );
  });
};

const initCategories = ({
  selector,
  categoryItems,
  selectedValue = "",
  onCategoryChange = () => {},
}) => {
  const $categoriesList = $(selector);
  const $categories = $categoriesList.closest(".categories");
  const $scrollButtons = $categories.find(".categories__arrow");
  const $rightScrollButton = $categories.find(".categories__arrow--right");
  const $leftScrollButton = $categories.find(".categories__arrow--left");

  const updateScrollButtons = () => {
    const list = $categoriesList[0];
    const hasOverflow = list.scrollWidth > list.clientWidth + 1;

    if (!hasOverflow) {
      $scrollButtons.prop("hidden", true);
      return;
    }

    const cards = $categoriesList.find(".category-card");
    const listBounds = list.getBoundingClientRect();
    const firstCardBounds = cards[0].getBoundingClientRect();
    const lastCardBounds = cards[cards.length - 1].getBoundingClientRect();

    const canScrollRight = firstCardBounds.right > listBounds.right + 1;
    const canScrollLeft = lastCardBounds.left < listBounds.left - 1;

    $rightScrollButton.prop("hidden", !canScrollRight);
    $leftScrollButton.prop("hidden", !canScrollLeft);
  };

  renderCategories($categoriesList, categoryItems, selectedValue);
  updateScrollButtons();

  $scrollButtons.on("click", (event) => {
    const direction = $(event.currentTarget).attr("data-scroll-direction");
    const distance = $categoriesList[0].clientWidth * 0.75;

    $categoriesList[0].scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  });

  $categoriesList.on("click", ".category-card", (event) => {
    const $selectedCard = $(event.currentTarget);
    const categoryValue = $selectedCard.attr("data-value") || "";

    updateSelectedCategory($categoriesList, $selectedCard);
    updateScrollButtons();
    onCategoryChange(categoryValue);
  });

  $categoriesList.on("scroll", updateScrollButtons);
  $(window).on("resize", updateScrollButtons);
};
