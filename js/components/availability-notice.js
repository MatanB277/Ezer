const isLoanOnlyProduct = (product) =>
  !product?.isCart && product?.isAvailable;

const createAvailabilityNotice = () => {
  return $("<div>", {
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
      }),
      $("<span>", {
        class: "availability-popup__notice-message",
      }),
      $("<button>", {
        class: "availability-popup__request-button",
        type: "button",
        text: "להגשת בקשה למוצר",
        disabled: true,
        hidden: true,
      }),
    ),
  );
};

const setAvailabilityNoticeProduct = ($notice, product) => {
  const loanOnly = isLoanOnlyProduct(product);
  const $icon = $notice.find(".availability-popup__notice-icon");
  const $label = $notice.find(".availability-popup__notice-label");
  const $message = $notice.find(".availability-popup__notice-message");
  const $requestButton = $notice.find(
    ".availability-popup__request-button",
  );

  $notice.toggleClass("availability-popup__notice--warning", loanOnly);

  if (loanOnly) {
    $icon.attr("src", "assets/icons/warning.svg");
    $label.text("חשוב לדעת");
    $message.text(
      "השאלה מותנית בהדרכה מקצועית ובאישור המחלקה · מלאי מצומצם",
    );
    $requestButton.prop("hidden", false);
    return loanOnly;
  }

  $icon.attr("src", "assets/icons/phone-brown.svg");
  $label.text("לפי ההגעה לסניף -");
  $message.text(
    "יש להתקשר ולוודא זמינות, המלאי אינו מעודכן בזמן אמת.",
  );
  $requestButton.prop("hidden", true);

  return loanOnly;
};
