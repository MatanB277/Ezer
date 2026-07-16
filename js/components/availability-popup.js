const createBranchCard = (branch) => {
  const branchAddress = `${branch.street}, ${branch.city}`;
  const phoneLink = branch.phone.replaceAll("-", "");

  const $details = $("<div>", {
    class: "branch-card__details",
  }).append(
    $("<span>", {
      class: "branch-card__city",
      text: branch.city,
    }),
    $("<span>", {
      class: "branch-card__street",
      text: branch.street,
    }),
  );

  const $availability = createProductAvailability(branch.availability);
  $availability?.addClass("branch-card__availability");

  const $wazeLink = $("<a>", {
    class: "branch-card__waze",
    href: `https://www.waze.com/ul?q=${encodeURIComponent(branchAddress)}`,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": `ניווט ב-Waze אל ${branch.name}`,
  }).append(
    $("<img>", {
      src: "assets/icons/waze.svg",
      alt: "",
      "aria-hidden": "true",
    }),
  );

  const $contactDivider = $("<span>", {
    class: "branch-card__contact-divider",
    "aria-hidden": "true",
  });

  const $phoneLink = $("<a>", {
    class: "branch-card__phone",
    href: `tel:${phoneLink}`,
    "aria-label": `התקשרות אל ${branch.name}, ${branch.phone}`,
  }).append(
    $("<img>", {
      src: "assets/icons/phone.svg",
      alt: "",
      "aria-hidden": "true",
    }),
    $("<span>", {
      class: "branch-card__phone-number",
      text: branch.phone,
    }),
  );

  const $contact = $("<div>", {
    class: "branch-card__contact",
  }).append($wazeLink, $contactDivider, $phoneLink);

  return $("<article>", {
    class: "branch-card",
  }).append($details, $availability, $contact);
};

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
    controls: "availability-popup-branches-list",
  }).addClass("availability-popup__search");

  const $locationSelect = $("<select>", {
    class: "availability-popup__location-field",
    "aria-label": "סינון סניפים לפי אזור",
    "aria-controls": "availability-popup-branches-list",
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

  const $availabilityFilters = $("<section>", {
    class: "availability-filters availability-popup__availability-filters",
    "aria-labelledby": "availability-popup-filters-title",
  }).append(
    $("<h2>", {
      id: "availability-popup-filters-title",
      class: "availability-filters__title",
      text: "זמינות מוצרים",
    }),
    $("<div>", {
      class: "availability-filters__list availability-popup__availability-list",
    }),
  );

  const $branchesList = $("<div>", {
    id: "availability-popup-branches-list",
    class: "availability-popup__branches-list",
    tabindex: "0",
    role: "region",
    "aria-label": "רשימת סניפים",
  });

  const $branchesScrollbar = $("<div>", {
    class: "availability-popup__scrollbar",
    "aria-hidden": "true",
  }).append(
    $("<span>", {
      class: "availability-popup__scrollbar-thumb",
    }),
  );

  const $branchesScrollArea = $("<div>", {
    class: "availability-popup__branches-scroll-area",
  }).append($branchesList);

  const $branchesContainer = $("<section>", {
    class: "availability-popup__branches",
    "aria-label": "סניפים",
  }).append(
    $("<p>", {
      class: "availability-popup__branches-count",
      text: `נמצאו ${branches.length} סניפים`,
      "aria-live": "polite",
      "aria-atomic": "true",
    }),
    $branchesScrollArea,
    $branchesScrollbar,
  );

  const $popupContent = $("<div>", {
    class: "availability-popup__content",
  }).append(
    $header,
    $availabilityNotice,
    $filters,
    $availabilityFilters,
  );

  const $popup = $("<div>", {
    class: "availability-popup",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "availability-popup-title availability-popup-product-name",
  }).append($popupContent, $branchesContainer);

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
  const $branchesCount = $backdrop.find(".availability-popup__branches-count");
  const $branchesList = $backdrop.find(".availability-popup__branches-list");
  const $branchesScrollbar = $backdrop.find(".availability-popup__scrollbar");
  const $branchesScrollbarThumb = $backdrop.find(
    ".availability-popup__scrollbar-thumb",
  );
  const branchFilters = {
    search: "",
    location: "",
    availability: [],
  };
  let previouslyFocusedElement = null;

  const updateBranchesScrollbar = () => {
    const listElement = $branchesList[0];

    $branchesScrollbar.prop("hidden", false);

    const scrollbarHeight = $branchesScrollbar.height();
    const thumbHeight = Math.min(198, scrollbarHeight);
    const maximumScroll = listElement.scrollHeight - listElement.clientHeight;
    const maximumThumbMovement = scrollbarHeight - thumbHeight;
    const thumbPosition = maximumScroll > 0
      ? (listElement.scrollTop / maximumScroll) * maximumThumbMovement
      : 0;

    $branchesScrollbar.prop("hidden", maximumScroll <= 0);
    $branchesScrollbarThumb.css({
      height: `${thumbHeight}px`,
      transform: `translateY(${thumbPosition}px)`,
    });
  };

  const renderBranches = () => {
    const filteredBranches = filterBranches(branches, branchFilters);
    const hasBranches = filteredBranches.length > 0;

    $branchesCount.text(
      hasBranches
        ? `נמצאו ${filteredBranches.length} סניפים`
        : "לא נמצאו סניפים",
    );
    $branchesList
      .empty()
      .append(filteredBranches.map(createBranchCard))
      .scrollTop(0);

    requestAnimationFrame(updateBranchesScrollbar);
  };

  const handleBranchSearchInput = (event) => {
    branchFilters.search = $(event.currentTarget).val();
    renderBranches();
  };

  const handleLocationChange = (event) => {
    branchFilters.location = $(event.currentTarget).val();
    renderBranches();
  };

  const handleBranchAvailabilityChange = (availabilityValues) => {
    branchFilters.availability = availabilityValues;
    renderBranches();
  };

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
    requestAnimationFrame(updateBranchesScrollbar);
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
  initAvailabilityFilters({
    selector: $backdrop.find(".availability-popup__availability-list"),
    availabilityItems: productAvailability,
    controls: "availability-popup-branches-list",
    onAvailabilityChange: handleBranchAvailabilityChange,
  });
  renderBranches();
  $closeButton.on("click", closePopup);
  $backdrop.on("click", handleBackdropClick);
  $popup.on("keydown", handlePopupKeydown);
  $backdrop.on(
    "input",
    ".availability-popup__search .search-input__field",
    handleBranchSearchInput,
  );
  $backdrop.on(
    "change",
    ".availability-popup__location-field",
    handleLocationChange,
  );
  $branchesList.on("scroll", updateBranchesScrollbar);
  $(window).on("resize.availabilityPopup", updateBranchesScrollbar);

  return {
    open: openPopup,
    close: closePopup,
  };
};
