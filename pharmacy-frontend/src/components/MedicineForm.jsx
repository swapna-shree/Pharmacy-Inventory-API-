import React, { useEffect, useState } from 'react';
import { addMedicine, updateMedicine } from '../api/api.js';

const initialState = {
    name: '',
    brand: '',
    batchNumber: '',
    quantity: '',
    price: '',
    expiryDate: '',
    category: '',
};

const MedicineForm = ({ onMedicineAdded, editingMedicine, setEditingMedicine }) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingMedicine) {
            setFormData(editingMedicine);
        }
    }, [editingMedicine]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prev) => {
            const newErrors = { ...prev };
            switch (name) {
                case 'name':
                case 'brand':
                case 'batchNumber':
                case 'category':
                    newErrors[name] = value.trim() ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
                    break;
                case 'quantity':
                    newErrors.quantity = value > 0 ? '' : 'Valid quantity required.';
                    break;
                case 'price':
                    newErrors.price = value > 0 ? '' : 'Valid price required.';
                    break;
                case 'expiryDate':
                    newErrors.expiryDate = value ? '' : 'Expiry date required.';
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.brand.trim()) newErrors.brand = 'Brand is required.';
        if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number required.';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity required.';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price required.';
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date required.';
        if (!formData.category.trim()) newErrors.category = 'Category is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (editingMedicine) {
                await updateMedicine(editingMedicine._id, formData);
                alert('Medicine updated successfully');
            } else {
                await addMedicine(formData);
                alert('Medicine added successfully');
            }

            setFormData(initialState);
            setErrors({});
            if (setEditingMedicine) setEditingMedicine(null);
            if (onMedicineAdded) onMedicineAdded();
        } catch (err) {
            console.error(err);
            alert('Error saving medicine');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white text-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8 space-y-4 transition-all duration-300"
        >
            <h2 className="text-2xl font-bold text-center text-gray-700">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-2">
                {editingMedicine ? 'Update the selected medicine details.' : 'Fill in the details to add a medicine to the inventory.'}
            </p>

            <div className="flex flex-col space-y-3 text-sm sm:text-base">
                <input
                    name="name"
                    placeholder="Name of Medicine (e.g. Paracetamol)"
                    className="p-2 border rounded w-full placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                <input
                    name="brand"
                    placeholder="Brand (e.g. Cipla)"
                    className="p-2 border rounded w-full placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.brand}
                    onChange={handleChange}
                />
                {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}

                <input
                    name="batchNumber"
                    placeholder="Batch No. (e.g. B12345)"
                    className="p-2 border rounded w-full placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.batchNumber}
                    onChange={handleChange}
                />
                {errors.batchNumber && <p className="text-red-500 text-sm">{errors.batchNumber}</p>}

                <input
                    name="quantity"
                    type="number"
                    placeholder="Quantity (e.g. 50)"
                    className="p-2 border rounded w-full placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.quantity}
                    onChange={handleChange}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}

                <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price per unit (e.g. 12.5)"
                    className="p-2 border rounded w-full placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.price}
                    onChange={handleChange}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

                <div className="relative">
                    <input
                        type="date"
                        name="expiryDate"
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="peer p-2 pt-5 border rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                        htmlFor="expiryDate"
                        className="absolute left-2 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-500 peer-focus:top-0 peer-focus:text-xs peer-valid:top-0 peer-valid:text-xs"
                    >
                        Expiry Date
                    </label>
                </div>


                <input
                    name="category"
                    placeholder="Category (e.g. Antibiotic)"
                    className="p-2 border rounded w-full placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={handleChange}
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition w-full"
            >
                {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
            </button>
        </form>
    );
};

export default MedicineForm;

