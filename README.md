# CertVault — Premium Credential Workspace

CertVault is a sleek, professional, and secure document management and verification registry built with a strictly monochrome, minimal design language. Inspired by the aesthetics of Notion, Linear, and Dropbox, it offers instant discoverability, live dynamic statistics, real file previews, and a secure soft-delete archiving workflow.

---

## Technical Stack
- **Frontend:** React 19, Vite, Zustand, TailwindCSS v4, Framer Motion, Lucide Icons, PocketBase JS SDK
- **Backend:** PocketBase (Go-based single binary database, auth, and storage engine)

---

## Prerequisites
Ensure you have the following installed on your local environment:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or another package manager (Yarn, pnpm)

---

## Getting Started

### 1. Launch the Backend Server (PocketBase)
PocketBase is packaged as a standalone executable in the `backend/pocketbase` directory.

1. Navigate to the PocketBase directory:
   ```bash
   cd backend/pocketbase
   ```
2. Start the PocketBase local server:
   ```bash
   ./pocketbase serve
   ```
3. The server will start running at:
   - **Local Server API:** `http://127.0.0.1:8090`
   - **Admin Dashboard:** `http://127.0.0.1:8090/_/` (used to configure collections, review user records, and inspect files)

---

### 2. Configure Environment Variables
Create a `.env` file in your `frontend/` directory (or use `.env.local` / `.env.production`) to specify your PocketBase backend endpoint:
```env
VITE_PB_URL=http://127.0.0.1:8090
```

---

### 3. Launch the Frontend Development Server
Vite is used to provide HMR and extremely fast compiles.

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the development server:
   ```bash
   npm run dev
   ```
4. The client will start running locally at:
   - **Local URL:** `http://localhost:5173/`

---

## Project Structure
- `backend/pocketbase/`: Stores the database schemas, migration files, and structural binary.
- `frontend/src/`: Contains the complete modular application source:
  - `components/`: UI cards, badge designs, and generic structures.
  - `pages/`: Primary view routers (`Dashboard`, `Upload`, `CertificateDetails`).
  - `stores/`: Central Zustand store controlling active state selectors and filters.
  - `utils/`: Unified file handling helper methods (`fileUtils`).
  - `services/`: Low-level PocketBase API integrations.

---

## Design Directives & Constraints
CertVault maintains a highly professional, minimal monochrome theme. When contributing, respect the design guidelines:
- **Colors:** Restrict styling strictly to black, white, gray, and dark gray gradients.
- **Visuals:** Avoid flashy icons, glowing badges, or complex colorful shapes. Keep typography sharp and clear.
