const createProductGuideLink = ({ text, icon, className = "" }) => {
  return $("<a>", {
    class: `product-guides__link ${className}`.trim(),
    href: "#",
    "aria-disabled": "true",
  }).append(
    $("<span>", {
      text,
    }),
    $("<img>", {
      class: "product-guides__icon",
      src: icon,
      alt: "",
      "aria-hidden": "true",
    }),
  );
};

const createProductGuides = () => {
  const $guides = $("<section>", {
    class: "product-guides",
    "aria-labelledby": "product-guides-title",
  }).append(
    $("<h2>", {
      id: "product-guides-title",
      class: "product-guides__title",
      text: "מדריכים ומידע נוסף",
    }),
    $("<div>", {
      class: "product-guides__links",
    }).append(
      createProductGuideLink({
        text: "מדריך בטיחות לשימוש במוצר",
        icon: "assets/icons/pdf.svg",
      }),
      createProductGuideLink({
        text: "מדריך מפורט על בחירת כיסא גלגלים מתאים",
        icon: "assets/icons/external-link.svg",
        className: "product-guides__link--external",
      }),
    ),
  );

  $guides.on("click", ".product-guides__link", (event) => {
    event.preventDefault();
  });

  return $guides;
};
