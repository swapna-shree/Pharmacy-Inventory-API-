import axios from 'axios';

const BASE_URL = 'https://pharmacy-inventory-api-ooas.onrender.com/api/medicines';

// Centralized error handler
const handleError = (error, endpoint = '') => {
    if (error.response) {
        console.error(`[${endpoint}] Response Error:`, {
            status: error.response.status,
            data: error.response.data,
        });
        throw new Error(error.response.data.message || 'Server responded with an error.');
    } else if (error.request) {
        console.error(`[${endpoint}] No Response:`, error.request);
        throw new Error('No response from the server. Please try again later.');
    } else {
        console.error(`[${endpoint}] Request Error:`, error.message);
        throw new Error('Request setup failed.');
    }
};



export const getMedicines = async () => {
    try {
        return await axios.get(BASE_URL);
    } catch (err) {
        handleError(err, 'GET /medicines');
    }
};

export const addMedicine = async (data) => {
    try {
        return await axios.post(BASE_URL, data);
    } catch (err) {
        handleError(err, 'POST /medicines');
    }
};

export const deleteMedicine = async (id) => {
    try {
        return await axios.delete(`${BASE_URL}/${id}`);
    } catch (err) {
        handleError(err, `DELETE /medicines/${id}`);
    }
};

export const updateMedicine = async (id, data) => {
    try {
        return await axios.put(`${BASE_URL}/${id}`, data);
    } catch (err) {
        handleError(err, `PUT /medicines/${id}`);
    }
};

export const getLowStock = async () => {
    try {
        return await axios.get(`${BASE_URL}/low-stock`);
    } catch (err) {
        handleError(err, 'GET /medicines/low-stock');
    }
};

export const getExpired = async () => {
    try {
        return await axios.get(`${BASE_URL}/expired`);
    } catch (err) {
        handleError(err, 'GET /medicines/expired');
    }
};
