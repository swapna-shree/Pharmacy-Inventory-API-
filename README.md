# Pharmacy Inventory Tracker API

A full-stack pharmacy inventory app:  
- **Backend**: Node.js + Express + MongoDB  
- **Frontend**: React (Vite or CRA)
- CORS , AXIOS , Mongoose , TailwindCSS
---

##  Features

- Full **CRUD** via custom APIs
- Total 6 API endpoints across the single page and form
- Track **low-stock** and **expired** medicines
- Live deployments:
  - Backend: **Render**
  - Frontend: **Vercel**

---

##  Repo Structure

```

Pharmacy-Inventory-Tracker/
├── pharmacy-backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── medicineController.js
│   ├── models/
│   │   └── Medicine.js
│   ├── routes/
│   │   └── medicineRoutes.js
│   ├── tests/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── pharmacy-frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       │   ├── MedicineForm.jsx
│       │   ├── MedicineList.jsx
│       │   └── MedicineRow.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       ├── vite.config.js
│       ├── package.json
│       ├── package-lock.json
│       └── README.md
│
├── .gitignore
└── README.md

```

---

##  Backend Setup (pharmacy-backend)

### Install & Configure

1. `cd pharmacy-backend`
2. `npm install`

3. Create `.env`:
```

MONGO\_URI=your\_mongodb\_connection\_string

````

4. Optional: include `PORT=8080`, or let default in code handle it

###  Launch & Test

- **Start**: `npm start` (production) or `npm run dev` (with nodemon)  
- **API Base URL**: `http://localhost:8080/api/medicines`

####  Available Endpoints

| Method | URL                    | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | `/api/medicines`       | List all medicines                      |
| GET    | `/api/medicines/low-stock` | Items with quantity < 10         |
| GET    | `/api/medicines/expired`   | Expired medicines                  |
| POST   | `/api/medicines`       | Create new medicine                     |
| PUT    | `/api/medicines/:id`   | Update medicine by ID                   |
| DELETE | `/api/medicines/:id`   | Delete medicine by ID                   |

####  Sample Response

```json
[
{
 "_id": "64abbc12345fgh67890jk12",
 "name": "Paracetamol",
 "brand": "Panadol",
 "batchNumber": "B12345",
 "quantity": 100,
 "price": 12.5,
 "expiryDate": "2026-12-31T00:00:00.000Z",
 "category": "Painkiller"
}
]
````

---
##  Backend Deployment (Render)

1. Push repo to GitHub
2. In Render:

   * **Create New Web Service**
   * Root: `pharmacy-backend`
   * Start: `npm start`
   * Add env var `MONGO_URI` (value from `.env`)
3. Render deploys → copy the service URL (e.g. `https://pharmacy-backend.onrender.com`)

Ensure your API path works via:

```
https://pharmacy-backend.onrender.com/api/medicines
```

---

##  Frontend Setup (pharmacy-frontend)

### Install & Serve

1. `cd pharmacy-frontend`
2. `npm install`
3. Create `.env`:

   ```
   VITE_BACKEND_URL=http://localhost:8080/api/medicines
   ```
4. Run locally: `npm run dev`
5. Access in browser: `http://localhost:3000`

---

##  Frontend Deployment (Vercel)

1. Connect GitHub repo
2. Configure project:

   * Root directory: `pharmacy-frontend`
   * Build: `npm run build`
   * Output folder: `build` (CRA) or `dist` (Vite)
   * Env var:
   * I have used hardcoded url , u can do the following :

     ```
     VITE_BACKEND_URL=https://<your-render-backend>/api/medicines
     ```
3. Deploy & access live URL

---

##  Final Workflow

1. **Enter item** in form
2. **Request sent** via API to backend
3. **Backend acts** (DB operation, returns data)
4. **Frontend UI updates** accordingly
5. Buttons available for filtering by stock or expiry status , expired products highlighted in red and low stocks in yellow

---

##  Contribution

1. **Fork** the repo
2. `git checkout -b feature/<your-feature>`
3. Commit: `git commit -am "Feature x added"`
4. Push & Open PR

---

