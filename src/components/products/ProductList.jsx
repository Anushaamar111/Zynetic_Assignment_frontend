import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPriceFilter, setMinPriceFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts({
        category: categoryFilter,
        minPrice: minPriceFilter,
        maxPrice: maxPriceFilter,
        search: searchQuery,
      });

      const data = response?.data;
      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];

      if (Array.isArray(productList)) {
        setProducts(productList);
        setError('');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Failed to fetch products.');
      setProducts([]);
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateClick = () => {
    navigate('/products/create');
  };

  const handleUpdateClick = (id) => {
    navigate(`/products/update/${id}`);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        setError('Failed to delete product.');
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛍️ Product List</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Filter & Search</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="border p-2 rounded"
            value={minPriceFilter}
            onChange={(e) => setMinPriceFilter(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="border p-2 rounded"
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search"
            className="border p-2 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={fetchProducts}
        >
          Apply Filters
        </button>
      </div>

      <button
        onClick={handleCreateClick}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        ➕ Create New Product
      </button>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Rating</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.rating}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleUpdateClick(product._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
