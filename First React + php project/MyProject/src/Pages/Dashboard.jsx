import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/features/productsSlice";
import { logout } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Home/Header";
import Footer from "../Components/Home/Footer";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { user, token } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.products);

  // Local state for admin form
  const [newProduct, setNewProduct] = useState(
    {
      name: "",
      description: "",
      price: "",
      stock: "",
      image: null
    }
  );

  // Fetch products on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchProducts(token));
    }
  }, [dispatch, token]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("stock", newProduct.stock);
    
    if (newProduct.image) {
      formData.append("image", newProduct.image); // MUST be File
    } else {
      alert("Please select an image");
      return;
    }

    try {
     const response = await axios.post(
        "http://localhost/User/api/products/create.php",
        formData,
        {
          headers: {
            // Let Axios automatically set Content-Type
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ADD PRODUCT RESPONSE:", response.data);
      alert(response.data.message || "Product added successfully");
      dispatch(fetchProducts(token)); // refresh list
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  // Admin: Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.delete(
        `http://localhost/User/api/products/delete.php?id=${id}`,
        {
          data: { id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message || "Product deleted successfully!");
      dispatch(fetchProducts(token)); // refresh products
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  console.log("AUTH STATE:", {user, token})
  console.log("PRODUCT ITEMS:", items);

  return (
    <>
      <Header />
      <div className="dashboard-container p-5">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <h1 className="font-bold text-xl">
            Welcome, {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "User"}!
          </h1>
          <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
        </header>
        {/* Admin Add Product Form */}
        {user?.role === "admin" && (
          <section>
            <h2 className="font-bold my-5">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-3 items-start">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border-2 border-[#000000] rounded-md px-3 py-1 text-black"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border-2 border-[#000000] rounded-md px-3 py-1 text-black"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border-2 border-[#000000] rounded-md px-3 py-1 text-black"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="border-2 border-[#000000] rounded-md px-3 py-1 text-black"
                required
              />
              <div>
                <label htmlFor="image">Add Picture</label>
                <br />
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  className="text-black py-2 rounded"
                />
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">Add Product</button>
            </form>
          </section>
        )}
        {/* Products List */}
        {user?.role === "admin" && (
        <section>
          <h2  className="font-bold mt-10 mb-5">Products</h2>
          {loading && <p>Loading products...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            items.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <ul className="flex gap-5 flex-wrap">
                {items.map((product) => (
                  <li className="w-40" key={product.id}>
                    <h3>{product.name}</h3>
                    <strong>${product.price}</strong>
                    {product.image && (
                      <img
                      src={`http://localhost/User/api/uploads/${product.image}`}
                      alt={product.name}
                      width="100"
                      />
                    )}
                    <p>{product.description}</p>
                    {/* Admin Controls */}
                    {user?.role === "admin" && (
                      <div className="admin-controls">
                        <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        {/* Add Edit button here later */}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Dashboard