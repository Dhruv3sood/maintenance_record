# Frontend - Maintenance CRM + Sales Report CRM

React + TypeScript frontend for the Maintenance CRM and Sales Report CRM system.

## Features

- **Authentication**: Passcode-based login with role-based routing
- **Maintenance Dashboard**: Full CRUD operations for records
- **Warranty Tracking**: View warranty status, expiring soon, and out of warranty records
- **Sales Dashboard**: Read-only access to sales records and summaries
- **Export Functionality**: Export records in CSV, XLSX, and PDF formats
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **date-fns** for date formatting

## Setup

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

```bash
cd frontend
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

Make sure the backend API is running at `http://localhost:8000` (or configure `VITE_API_URL` in a `.env` file).

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

If not set, it defaults to `/api` which works with the Vite proxy configuration.

### Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   ├── ProtectedRoute.tsx
│   │   ├── RecordForm.tsx   # Create/Edit record form
│   │   ├── RecordsList.tsx  # Records list with pagination
│   │   ├── RecordFilters.tsx
│   │   ├── WarrantyReports.tsx
│   │   ├── SalesRecords.tsx
│   │   ├── SalesSummary.tsx
│   │   └── ExportButtons.tsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── MaintenanceDashboard.tsx
│   │   └── SalesDashboard.tsx
│   ├── services/            # API services
│   │   └── api.ts           # Axios instance
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features Overview

### Maintenance Dashboard

- **Records List**: View all records with search and filters
- **Create Record**: Add new maintenance records
- **Edit Record**: Update existing records
- **Delete Record**: Remove records
- **Warranty Reports**: View warranty status and reports

### Sales Dashboard

- **Sales Records**: View sales records (read-only)
- **Sales Summary**: View totals and breakdowns by zone and salesperson

### Export

- Export records to CSV
- Export records to Excel (XLSX)
- Export records to PDF

## API Integration

The frontend communicates with the FastAPI backend using Axios. All API requests include JWT tokens from localStorage for authentication.

## Styling

The app uses Tailwind CSS for styling with a custom color scheme. The primary color is blue (primary-600).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is provided as-is for the Maintenance CRM + Sales Report CRM system.
