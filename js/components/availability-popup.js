const createAvailabilityPopup = () => {
  const $title = $("<h2>", {
    id: "availability-popup-title",
    class: "availability-popup__title",
    text: "סניפים וזמינות",
  });

  const $titleDivider = $("<span>", {
    class: "availability-popup__title-divider",
    "aria-hidden": "true",
  });

  const $productName = $("<span>", {
    id: "availability-popup-product-name",
    class: "availability-popup__product-name",
  });

  const $closeButton = $("<button>", {
    class: "availability-popup__close",
    type: "button",
    "aria-label": "סגירת חלון סניפים וזמינות",
  }).append(
    $("<img>", {
      src: "assets/icons/close-circular.svg",
      alt: "",
      "aria-hidden": "true",
    }),
  );

  const $header = $("<div>", {
    class: "availability-popup__header",
  }).append($title, $titleDivider, $productName, $closeButton);

  const $availabilityNotice = $("<div>", {
    class: "availability-popup__notice",
  }).append(
    $("<img>", {
      class: "availability-popup__notice-icon",
      src: "assets/icons/phone-brown.svg",
      alt: "",
      "aria-hidden": "true",
    }),
    $("<div>", {
      class: "availability-popup__notice-text",
    }).append(
      $("<span>", {
        class: "availability-popup__notice-label",
        text: "לפי ההגעה לסניף -",
      }),
      $("<span>", {
        class: "availability-popup__notice-message",
        text: "יש להתקשר ולוודא זמינות, המלאי אינו מעודכן בזמן אמת.",
      }),
    ),
  );

  const $branchSearch = createSearchInput({
    placeholder: "חיפוש סניף",
    controls: null,
  }).addClass("availability-popup__search");

  const $locationSelect = $("<select>", {
    class: "availability-popup__location-field",
    "aria-label": "סינון סניפים לפי אזור",
  }).append(
    locations.map((location) => $("<option>", {
      value: location.value,
      text: location.name,
    })),
  );

  const $locationArrow = $("<span>", {
    class: "availability-popup__location-arrow",
    "aria-hidden": "true",
  }).append(
    $("<img>", {
      src: "assets/icons/chevron-arrow-down.svg",
      alt: "",
    }),
  );

  const $locationSelectContainer = $("<div>", {
    class: "availability-popup__location-select",
  }).append($locationSelect, $locationArrow);

  const $filters = $("<div>", {
    class: "availability-popup__filters",
  }).append($branchSearch, $locationSelectContainer);

  const $popup = $("<div>", {
    class: "availability-popup",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "availability-popup-title availability-popup-product-name",
  }).append($header, $availabilityNotice, $filters);

  return $("<div>", {
    class: "availability-popup__backdrop",
    hidden: true,
  }).append($popup);
};

const initAvailabilityPopup = () => {
  const $backdrop = createAvailabilityPopup();
  const $popup = $backdrop.find(".availability-popup");
  const $closeButton = $backdrop.find(".availability-popup__close");
  const $productName = $backdrop.find(".availability-popup__product-name");
  let previouslyFocusedElement = null;

  const closePopup = () => {
    $backdrop.prop("hidden", true);
    $(document.body).css("overflow", "");
    previouslyFocusedElement?.focus({ preventScroll: true });
  };

  const openPopup = (product) => {
    previouslyFocusedElement = document.activeElement;
    $productName.text(product?.name ?? "");
    $backdrop.prop("hidden", false);
    $(document.body).css("overflow", "hidden");
    $closeButton[0]?.focus({ preventScroll: true });
  };

  const handleBackdropClick = (event) => {
    if (event.target === $backdrop[0]) {
      closePopup();
    }
  };

  const handlePopupKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePopup();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const $focusableElements = $popup.find(
      'button:not([disabled]):not([aria-disabled="true"]), ' +
      'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    );
    const firstElement = $focusableElements[0];
    const lastElement = $focusableElements[$focusableElements.length - 1];

    if (!firstElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  $(document.body).append($backdrop);
  $closeButton.on("click", closePopup);
  $backdrop.on("click", handleBackdropClick);
  $popup.on("keydown", handlePopupKeydown);

  return {
    open: openPopup,
    close: closePopup,
  };
};
