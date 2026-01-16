# HR Management System - Phase 1

A modern HR/Employees Management System built with SvelteKit, TypeScript, and SCSS.

![HR Management System](https://img.shields.io/badge/SvelteKit-5.x-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features (Phase 1)

### Core Features
- ✅ **Authentication System** - Mock login with protected routes
- ✅ **Dashboard** - Overview with statistics and quick actions
- ✅ **Employees Management** - List, search, and filter employees
- ✅ **Departments** - View all departments with detailed information

### Technical Features
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glassmorphism, gradients, and smooth animations
- 🔧 **TypeScript** - Full type safety across the application
- 📦 **State Management** - Svelte stores with derived stores for filtering
- 🎯 **Reusable Components** - Button, Input, Table components

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.svelte      # Navigation sidebar
│   │   │   └── Navbar.svelte       # Top navigation bar
│   │   └── ui/
│   │       ├── Button.svelte       # Reusable button component
│   │       ├── Input.svelte        # Form input component
│   │       └── Table.svelte        # Data table component
│   ├── data/
│   │   └── mockData.ts             # Mock employees & departments data
│   ├── stores/
│   │   ├── auth.ts                 # Authentication store
│   │   ├── employees.ts            # Employees store with filters
│   │   └── departments.ts          # Departments store
│   └── index.ts                    # Central exports
├── routes/
│   ├── (protected)/
│   │   ├── +layout.svelte          # Protected routes layout
│   │   ├── dashboard/+page.svelte  # Dashboard page
│   │   ├── employees/+page.svelte  # Employees listing
│   │   ├── departments/+page.svelte# Departments listing
│   │   ├── attendance/+page.svelte # Placeholder (Phase 2)
│   │   ├── leaves/+page.svelte     # Placeholder (Phase 2)
│   │   └── settings/+page.svelte   # Placeholder (Phase 2)
│   ├── login/+page.svelte          # Login page
│   ├── +layout.svelte              # Root layout
│   └── +page.svelte                # Root redirect
└── styles/
    ├── global.scss                 # Global styles & resets
    ├── variables.scss              # Design tokens & variables
    └── mixins.scss                 # SCSS mixins & utilities
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm 9+

### Steps

1. **Clone/Navigate to the project directory**
   ```bash
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 🔐 Demo Credentials

Use the following credentials to log in:

| Email | Password |
|-------|----------|
| `admin@company.com` | `admin123` |
| `manager@company.com` | `manager123` |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Svelte type checking |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

## 🎨 Design System

### Colors
- **Primary**: Indigo gradient (#6366f1 - #4f46e5)
- **Secondary**: Teal (#14b8a6)
- **Neutrals**: Zinc scale (#fafafa - #09090b)
- **Semantic**: Success (green), Warning (amber), Error (red)

### Typography
- **Font Family**: Inter (loaded from Google Fonts)
- **Sizes**: xs (12px) to 5xl (48px)

### Spacing
- Based on 4px increments (4px, 8px, 12px, 16px, etc.)

### Components
All components support:
- Multiple variants (primary, secondary, outline, ghost, danger)
- Multiple sizes (sm, md, lg)
- Loading states
- Disabled states
- Responsive behavior

## 📊 State Management

### Authentication Store (`auth.ts`)
```typescript
// Login
auth.login(email, password)

// Logout
auth.logout()

// Access current user
$currentUser  // User object or null
$isAuthenticated  // boolean
```

### Employees Store (`employees.ts`)
```typescript
// Set filters
employeesStore.setSearchQuery('john')
employeesStore.setDepartmentFilter('Engineering')
employeesStore.setStatusFilter('active')

// Reset filters
employeesStore.resetFilters()

// Access filtered data
$filteredEmployees  // Filtered employee array
$employeeStats      // { total, active, inactive, onLeave }
```

### Departments Store (`departments.ts`)
```typescript
// Search
departmentsStore.setSearchQuery('marketing')

// Access data
$filteredDepartments  // Filtered department array
$departmentStats      // { total, totalEmployees, totalBudget }
```

## 🚧 Roadmap (Future Phases)

### Phase 2
- [ ] Attendance tracking with check-in/out
- [ ] Leave management with approval workflow
- [ ] Employee detail pages with editing
- [ ] Settings and profile management

### Phase 3
- [ ] Real backend integration (API)
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Role-based access control (RBAC)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using [SvelteKit](https://kit.svelte.dev/)
