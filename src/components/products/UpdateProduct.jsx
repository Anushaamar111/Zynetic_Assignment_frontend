import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/api';

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await getProductById(id);
            if (response && response.data) {
                setName(response.data.name || '');
                setDescription(response.data.description || '');
                setCategory(response.data.category || '');
                setPrice(response.data.price || '');
                setRating(response.data.rating || '');
            } else {
                setError('Product not found.');
            }
        } catch (error) {
            setError('Failed to fetch product details.');
            console.error('Error fetching product details:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const productData = { name, description, category, price: parseFloat(price), rating: parseFloat(rating) };
            await updateProduct(id, productData);
            navigate('/products');
        } catch (error) {
            setError('Failed to update product.');
            console.error('Error updating product:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div>
            <h2>Update Product</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <button type="submit">Update Product</button>
                <button onClick={() => navigate('/products')}>Cancel</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
