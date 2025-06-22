import React, { useEffect, useState } from 'react';
import { getMedicines, deleteMedicine, getLowStock, getExpired } from '../api/api';
import MedicineRow from './MedicineRow';

const MedicineList = ({ setEditingMedicine, filter, refresh, setFilter }) => {
    const [medicines, setMedicines] = useState([]);

    const fetchData = async () => {
        try {
            let res;
            if (filter === 'low-stock') res = await getLowStock();
            else if (filter === 'expired') res = await getExpired();
            else res = await getMedicines();
            setMedicines(res.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter, refresh]);

    const handleDelete = async (id) => {
        await deleteMedicine(id);
        fetchData();
    };

    return (
        <div className="bg-white text-black p-4 rounded-lg shadow w-full max-w-4xl">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Medicine List</h2>
                <div className="flex items-center space-x-2">
                    <label htmlFor="filter" className="text-sm text-gray-700">Filter:</label>
                    <select
                        id="filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="none">Show All</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>
            <table className="w-full table-auto text-sm border-collapse">
                <thead>
                    <tr className="bg-black text-white">
                        <th className="border px-2 py-1">Name</th>
                        <th className="border px-2 py-1">Brand</th>
                        <th className="border px-2 py-1">Qty</th>
                        <th className="border px-2 py-1">Expiry</th>
                        <th className="border px-2 py-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.length > 0 ? (
                        medicines.map((med) => (
                            <MedicineRow key={med._id} medicine={med} onDelete={handleDelete} onEdit={setEditingMedicine} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-3 text-gray-500">No medicines found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MedicineList;
