import React from 'react';

const MedicineRow = ({ medicine, onDelete }) => {
    const { _id, name, brand, quantity, expiryDate } = medicine;

    const isLowStock = quantity < 10;
    const isExpired = new Date(expiryDate) < new Date();

    return (
        <tr className={`${isLowStock ? 'bg-yellow-100' : ''} ${isExpired ? 'bg-red-100 text-red-800' : ''}`}>
            <td className="border px-2 py-1">{name}</td>
            <td className="border px-2 py-1">{brand}</td>
            <td className="border px-2 py-1">{quantity}</td>
            <td className="border px-2 py-1">{new Date(expiryDate).toLocaleDateString()}</td>
            <td className="border px-2 py-1">
                <button
                    onClick={() => onDelete(_id)}
                    className="text-red-600 hover:underline text-sm"
                >
                    Delete
                </button>
            </td>
        </tr >
    );
};

export default MedicineRow;