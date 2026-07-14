const initProductHeader = ({ selector, initialText = "הכל" }) => {
  const $title = $(selector);

  const setText = (text) => {
    $title.text(text);
  };

  setText(initialText);

  return {
    setText,
  };
};
