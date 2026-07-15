const createAvailabilityPopup = () => {
  const $title = $("<h2>", {
    id: "availability-popup-title",
    class: "availability-popup__title",
    text: "סניפים וזמינות",
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
  }).append($title, $closeButton);

  const $popup = $("<div>", {
    class: "availability-popup",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "availability-popup-title",
  }).append($header);

  return $("<div>", {
    class: "availability-popup__backdrop",
    hidden: true,
  }).append($popup);
};

const initAvailabilityPopup = () => {
  const $backdrop = createAvailabilityPopup();
  const $popup = $backdrop.find(".availability-popup");
  const $closeButton = $backdrop.find(".availability-popup__close");
  let previouslyFocusedElement = null;

  const closePopup = () => {
    $backdrop.prop("hidden", true);
    $(document.body).css("overflow", "");
    previouslyFocusedElement?.focus({ preventScroll: true });
  };

  const openPopup = () => {
    previouslyFocusedElement = document.activeElement;
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
