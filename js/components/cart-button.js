const createCartButton = ({
  label = "העגלה שלי",
  price = 0,
  count = 0,
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
    "aria-label": `${label}, ${count} מוצרים, ${price} שקלים`,
  }).append($icon, $label, $price, $count);
};

const initCartButton = ({ selector, price = 0, count = 0 }) => {
  const $container = $(selector);

  const setCart = ({ price: nextPrice, count: nextCount }) => {
    $container.empty().append(
      createCartButton({
        price: nextPrice,
        count: nextCount,
      }),
    );
  };

  setCart({ price, count });

  return {
    setCart,
  };
};
