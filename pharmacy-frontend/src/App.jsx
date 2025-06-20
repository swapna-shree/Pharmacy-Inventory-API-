import { useState } from 'react';
import MedicineForm from './components/MedicineForm';
import MedicineList from './components/MedicineList';
import './index.css';

function App() {
  const [showList, setShowList] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const toggleList = () => setShowList(prev => !prev);
  const handleMedicineAdded = () => setRefreshList(prev => !prev);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-center">Pharmacy Inventory Tracker</h1>

      <MedicineForm onMedicineAdded={handleMedicineAdded} />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition mt-4"
        onClick={toggleList}
      >
        {showList ? 'Hide Medicines' : 'Show Medicines'}
      </button>

      {showList && <MedicineList refreshFlag={refreshList} />}
    </div>
  );
}

export default App;

