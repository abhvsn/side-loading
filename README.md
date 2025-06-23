# Sample React App with Node.js Server (TypeScript)

A simple full-stack application with React frontend and Node.js backend that demonstrates API communication between two pages with route audit tracking. **Fully written in TypeScript** for enhanced type safety and developer experience.

## Features

- **Node.js Backend**: Express server with API endpoint that returns "Hello {page_name}" based on the page name parameter
- **React Frontend**: Two-page application with navigation that calls the API on page load
- **Route Audit Tracking**: Automatic logging of all route changes for audit purposes
- **TypeScript**: Full TypeScript implementation for both frontend and backend
- **Modern UI**: Beautiful gradient background with smooth animations and responsive design

## Project Structure

```
├── server/
│   ├── src/
│   │   └── server.ts         # TypeScript server
│   ├── dist/                 # Compiled JavaScript (auto-generated)
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Page1.tsx     # TypeScript React components
│       │   └── Page2.tsx
│       ├── system/
│       │   └── RouteAuditTracker.tsx
│       ├── App.tsx
│       ├── index.tsx
│       └── index.css
├── package.json
└── README.md
```

## Setup and Installation

1. **Install dependencies for both client and server:**
   ```bash
   npm run install-deps
   ```

2. **Install concurrently for running both server and client simultaneously:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode (Recommended)
Run both server and client simultaneously with TypeScript hot-reload:
```bash
npm run dev
```

This will start:
- TypeScript Node.js server with hot-reload on `http://localhost:5003`
- React TypeScript app on `http://localhost:3003`

### Build Production Version
Build both server and client for production:
```bash
npm run build
```

### Run Individually

**Server development (with TypeScript hot-reload):**
```bash
npm run server:dev
```

**Server production (build first):**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

## TypeScript Configuration

### Server TypeScript Setup
- **tsconfig.json**: Configured for Node.js with ES2020 target
- **Source**: `src/server.ts`
- **Output**: `dist/server.js` (compiled)
- **Hot-reload**: `ts-node-dev` for development

### Client TypeScript Setup
- **tsconfig.json**: Configured for React with JSX support
- **Source**: All `.tsx` and `.ts` files in `src/`
- **Built-in**: React Scripts handles TypeScript compilation

## API Endpoints

- `GET /api/page/:pageName` - Returns greeting message for the specified page
- `POST /api/audit-log` - Records route change audit logs
- `GET /api/health` - Health check endpoint

## Route Audit Tracking

The application includes automatic route audit tracking that logs every page navigation:

### How it works:
1. **RouteAuditTracker Component**: Monitors route changes using React Router's `useLocation`
2. **Automatic Logging**: Sends audit data to `/api/audit-log` on every route change
3. **User Identification**: Uses localStorage 'userId' or defaults to 'anonymous'
4. **Server Logging**: Server logs all route changes to console (can be extended to database)

### TypeScript Interfaces:
```typescript
// Client-side
interface AuditLogEntry {
  userId: string;
  path: string;
  timestamp: string;
}

// Server-side
interface AuditLogEntry {
  userId: string;
  path: string;
  timestamp: string;
}
```

### Setting a User ID:
To set a custom user ID for tracking, use localStorage:
```javascript
localStorage.setItem('userId', 'your-user-id');
```

## Usage

1. Navigate to `http://localhost:3003`
2. Use the navigation buttons to switch between Page 1 and Page 2
3. Each page will automatically call the API and display the greeting message as a centered header
4. All route changes are automatically logged to the server console

## Technologies Used

- **Backend**: Node.js, Express.js, CORS, TypeScript
- **Frontend**: React 18, React Router DOM, TypeScript
- **Styling**: Modern CSS with gradients and animations
- **Development**: Concurrently, ts-node-dev for hot-reload
- **Audit Tracking**: Custom React hooks with REST API logging
- **Type Safety**: Full TypeScript implementation with interfaces and type checking 