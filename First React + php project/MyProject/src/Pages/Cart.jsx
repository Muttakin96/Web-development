import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCart, removeFromCart, updateQuantity, clearCart } from "../utils/cart";
import axios from "axios";
import Header from "../Components/Home/Header";
import Footer from "../Components/Home/Footer";

function Cart() {
  const [cart, setCart] = useState([]);
  const userId = useSelector(state => state.auth.user?.id); // get user id from Redux

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleQuantity = (id, quantity) => {
    updateQuantity(id, Number(quantity));
    setCart(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/User/api/cart/purchase.php",
        { user_id: userId, cart },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message || "Purchase Successful!");
      clearCart();
      setCart([]);
    } catch (error) {
      console.error("Purchase error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Purchase failed!");
    }
  };

  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  return (
    <>
      <Header />
      <div className="p-5">
        <h1 className="font-bold">Your Cart</h1>
        {cart.length === 0 && <p>Cart is empty</p>}
        {cart.map(item => (
          <div key={item.id} className="mb-3 flex items-center gap-3">
            {item.image && (
              <div className="w-[50px] h-[50px] overflow-hidden">
                <img
                  src={`http://localhost/User/api/uploads/${item.image}`}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="object-cover object-center w-full h-full rounded"
                />
              </div>
            )}
            <div>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantity(item.id, e.target.value)}
                className="border px-1 py-0.5 w-16"
              />
              <button
                onClick={() => handleRemove(item.id)}
                className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {cart.length > 0 && (
          <>
            <h2>Total: ${total.toFixed(2)}</h2>
            <button
              onClick={handlePurchase}
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Purchase
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded ml-2"
            >
              Clear Cart
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Cart;