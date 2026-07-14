const createCartButton = ({
  label = "העגלה שלי",
  price = 0,
  count = 0,
  isExpanded = false,
  icon = "assets/icons/cart.svg",
}) => {
  const $icon = $("<img>", {
    class: "cart-button__icon",
    src: icon,
    alt: "",
    "aria-hidden": "true",
  });

  const $label = $("<span>", {
    class: "cart-button__label",
    text: label,
  });

  const $price = $("<span>", {
    class: "cart-button__price",
    text: `${price.toLocaleString("he-IL")} ₪`,
  });

  const $count = count > 0
    ? $("<span>", {
      class: "cart-button__count",
      text: count,
      "aria-hidden": "true",
    })
    : null;

  return $("<button>", {
    class: `cart-button${count === 0 ? " cart-button--empty" : ""}`,
    type: "button",
    disabled: count === 0,
    "aria-controls": "cart-dropdown",
    "aria-expanded": String(isExpanded),
    "aria-label": `${label}, ${count} מוצרים, ${price} שקלים`,
  }).append($icon, $label, $price, $count);
};

const initCartButton = ({
  selector,
  price = 0,
  count = 0,
  onClick = () => false,
}) => {
  const $container = $(selector);
  let isExpanded = false;

  const setCart = ({ price: nextPrice, count: nextCount }) => {
    if (nextCount === 0) {
      isExpanded = false;
    }

    $container.children(".cart-button").remove();
    $container.prepend(
      createCartButton({
        price: nextPrice,
        count: nextCount,
        isExpanded,
      }),
    );
  };

  const setExpanded = (nextIsExpanded) => {
    isExpanded = nextIsExpanded;
    $container
      .children(".cart-button")
      .attr("aria-expanded", String(isExpanded));
  };

  $container.on("click", ".cart-button", () => {
    setExpanded(onClick());
  });

  setCart({ price, count });

  return {
    setCart,
    setExpanded,
  };
};
