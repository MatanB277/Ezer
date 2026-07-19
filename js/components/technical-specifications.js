const createTechnicalSpecifications = (specifications = []) => {
  const specificationItems = specifications.map((specification) => {
    return $("<li>", {
      class: "technical-specifications__item",
    }).append(
      $("<span>", {
        class: "technical-specifications__value",
        text: specification.value,
      }),
      $("<span>", {
        class: "technical-specifications__label",
        text: specification.label,
      }),
    );
  });

  return $("<section>", {
    class: "technical-specifications",
    "aria-labelledby": "technical-specifications-title",
  }).append(
    $("<h2>", {
      id: "technical-specifications-title",
      class: "technical-specifications__title",
      text: "מפרט טכני מלא",
    }),
    $("<ul>", {
      class: "technical-specifications__list",
    }).append(specificationItems),
  );
};
