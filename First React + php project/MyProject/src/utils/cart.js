// Get cart
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Save cart
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart; // 👈 important
};

// Add product
export const addToCart = (product) => {
  const cart = getCart();

  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  return saveCart(cart); // 👈 return updated cart
};

// Remove product
export const removeFromCart = (id) => {
  const cart = getCart().filter(item => item.id !== id);
  return saveCart(cart);
};

// Update quantity
export const updateQuantity = (id, quantity) => {
  const cart = getCart().map(item =>
    item.id === id ? { ...item, quantity } : item
  );
  return saveCart(cart);
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem("cart");
  return []; // important
};