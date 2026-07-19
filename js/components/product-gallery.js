const initProductGallery = ({ selector, product }) => {
  const $gallery = $(selector);
  const images = product.images?.length ? product.images : [product.image];

  const $mainImage = $("<img>", {
    class: "product-page__image",
    src: images[0],
    alt: product.name,
  });

  const $mainImageContainer = $("<div>", {
    class: "product-page__image-container",
  }).append($mainImage);

  const thumbnails = images.map((image, index) => {
    return $("<button>", {
      class: "product-gallery__thumbnail",
      type: "button",
      "data-image": image,
      "aria-label": `הצגת תמונה ${index + 1} של ${product.name}`,
      "aria-pressed": String(index === 0),
    }).append(
      $("<img>", {
        class: "product-gallery__thumbnail-image",
        src: image,
        alt: "",
        "aria-hidden": "true",
      }),
    );
  });

  const $thumbnails = $("<div>", {
    class: "product-gallery__thumbnails",
    "aria-label": "תמונות נוספות של המוצר",
  }).append(thumbnails);

  const handleThumbnailClick = (event) => {
    const $selectedThumbnail = $(event.currentTarget);

    $mainImage.attr("src", $selectedThumbnail.attr("data-image"));
    $thumbnails
      .find(".product-gallery__thumbnail")
      .attr("aria-pressed", "false");
    $selectedThumbnail.attr("aria-pressed", "true");
  };

  $thumbnails.on(
    "click",
    ".product-gallery__thumbnail",
    handleThumbnailClick,
  );

  $gallery.append($mainImageContainer, $thumbnails);
};
