const createCartButton = ({
  label = "העגלה שלי",
  price = 0,
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
    text: `${price} ₪`,
  });

  return $("<button>", {
    class: `cart-button${price === 0 ? " cart-button--empty" : ""}`,
    type: "button",
    "aria-label": `${label}, ${price} שקלים`,
  }).append($icon, $label, $price);
};

const initCartButton = ({ selector, price = 0 }) => {
  const $container = $(selector);

  $container.empty().append(createCartButton({ price }));
};
