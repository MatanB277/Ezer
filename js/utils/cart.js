const calculateCartItemsTotal = (items) =>
  items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

const createCartSummary = (cartQuantities, productsById) => {
  const items = [];
  let count = 0;

  cartQuantities.forEach((quantity, productId) => {
    const product = productsById.get(productId);

    if (!product) {
      return;
    }

    count += quantity;

    items.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      maxQuantity: product.maxQuantity,
    });
  });

  return {
    count,
    price: calculateCartItemsTotal(items),
    items,
  };
};

const createCartState = () => {
  const quantities = new Map();
  const productsById = new Map();

  const registerProducts = (productItems) => {
    productItems.forEach((product) => productsById.set(product.id, product));
  };

  const add = (product) => {
    productsById.set(product.id, product);
    quantities.set(product.id, 1);

    return {
      product,
      quantity: 1,
    };
  };

  const increase = (productId) => {
    const product = productsById.get(productId);
    const currentQuantity = quantities.get(productId) || 0;

    if (!product || currentQuantity >= product.maxQuantity) {
      return null;
    }

    const quantity = currentQuantity + 1;
    quantities.set(productId, quantity);

    return {
      product,
      quantity,
    };
  };

  const decrease = (productId) => {
    const product = productsById.get(productId);
    const currentQuantity = quantities.get(productId) || 0;

    if (!product || currentQuantity <= 1) {
      return null;
    }

    const quantity = currentQuantity - 1;
    quantities.set(productId, quantity);

    return {
      product,
      quantity,
    };
  };

  const remove = (productId) => {
    const product = productsById.get(productId);

    if (!product) {
      return null;
    }

    quantities.delete(productId);

    return {
      product,
      quantity: 0,
    };
  };

  return {
    add,
    increase,
    decrease,
    remove,
    registerProducts,
    getQuantity: (productId) => quantities.get(productId) || 0,
    getSummary: () => createCartSummary(quantities, productsById),
  };
};
