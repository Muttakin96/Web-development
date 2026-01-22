import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCart } from "../../utils/cart";

function Header() {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const [cart, setCart] = useState(getCart());

  // keep cart in sync
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    window.addEventListener("cart-updated", syncCart);
    return () => window.removeEventListener("cart-updated", syncCart);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleProfile() {
    navigate(token ? "/dashboard" : "/login");
  }

  function gotoCart() {
    navigate("/cart");
  }

  return (
    <div className="flex items-center justify-between p-5 border-b-2 border-black bg-gray-200 fixed top-0 w-full z-50">
      <nav className="flex gap-5 items-center">
        {/* <img src="/src/assets/lines.svg" alt="" /> */}
        {/* <img src="/src/assets/logo.png" alt="logo" width={40} className="border-2 border-black rounded-[50%]" /> */}
        <img src="/src/assets/240.jpg" alt="logo" width={45} className="rounded-[50%]" />
        <a href="/" className="hover:text-green-500 hover:border-b-2 hover:border-green-500">Home</a>
        <a href="#" className="hover:text-green-500 hover:border-b-2 hover:border-green-500">Collection</a>
        <a href="#" className="hover:text-green-500 hover:border-b-2 hover:border-green-500">New</a>
      </nav>

      <div className="flex gap-5">
        <button
          onClick={gotoCart}
          className="bg-black hover:bg-white hover:text-black text-white px-2 py-1 rounded-full flex gap-2 items-center"
        >
          Cart
          {cartCount > 0 ? (
            <span className="bg-white text-black hover:bg-black hover:text-white rounded-full px-3 py-1">
              {cartCount}
            </span>
          ) : (
            <img src="/src/assets/cart.svg" alt="" />
          )}
        </button>

        <button onClick={handleProfile}>
          <img
            className="bg-black hover:bg-green-500 p-4 rounded-full"
            src="/src/assets/profile.svg"
            alt=""
          />
        </button>
      </div>
    </div>
  );
}

export default Header