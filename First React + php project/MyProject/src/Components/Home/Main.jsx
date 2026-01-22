import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchProducts } from "../../redux/features/productsSlice";
import { addToCart } from "../../utils/cart";
import { useState } from "react";
import { motion } from "framer-motion";

function Main() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.products);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  const showButton = items.length > 8;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const addItemToCart = (product) => {
    addToCart(product);
    window.dispatchEvent(new Event("cart-updated")); // 🔥 notify Header
    alert("Added to cart!");
  };

  return (
    <div className="py-5 px-10">
      <h1 className="mb-5 text-xl font-limelight">New Collections</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <motion.div
        ref={containerRef}
        initial={{ height: 460 }}
        animate={{ height: expanded ? 'auto' : 460 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="flex gap-8 flex-wrap">
          {items.map(product => (
            <div key={product.id} className="product-card flex flex-col gap-3">
              <div className="w-56 h-72 overflow-hidden relative rounded-tl-3xl rounded-br-3xl border-2 border-black">
                <img
                  src={`http://localhost/User/api/uploads/${product.image}`}
                  alt={product.name}
                  width="200"
                  className="object-cover object-center h-full w-full"
                />
              <button className="absolute left-0 bottom-0" onClick={() => addItemToCart(product)}>
                <img src="/src/assets/add.png" alt="" />
              </button>
              </div>
              <strong>Price: ${product.price}</strong>
              <h3 className="font-limelight">{product.name}</h3>
              <p className="text-gray-800 font-rubik">{product.description}</p>
              <button className="bg-black border-2 border-black hover:bg-white hover:text-black hover:border-2 hover:border-black text-white px-4 py-2 rounded-tl-xl rounded-br-xl" onClick={() => addItemToCart(product)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </motion.div>

        <div className="flex justify-center">
          <button
          onClick={() => setExpanded(prev => !prev)}
          className="flex flex-col mt-5 px-4 py-1"
          >
            <span>{expanded ? "Show less" : "Show more"}</span>
            <span className={`text-2xl transform transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}>⌄</span>
          </button>
        </div>

    </div>
  );
}

export default Main