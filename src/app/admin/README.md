# Admin Theme System - Dazzling Tours

A comprehensive, consistent theme system for all admin pages using your global brand colors and design patterns.

## 🎨 Theme Architecture

### Global Theme Integration

The admin theme system is built on top of your global theme variables from `globals.css`:

```css
:root {
  --primary: #fd7d02; /* Orange brand color */
  --primary-light: #ffb366; /* Light orange */
  --primary-dark: #cc5f00; /* Dark orange */
  --complementary: #026df7; /* Blue complementary */
  --accent: #ffc107; /* Yellow accent */
  --neutral-dark: #1a1a1a; /* Dark neutral */
  --neutral-light: #f8f9fa; /* Light neutral */
  --background: #ffffff; /* White background */
  --foreground: #171717; /* Dark text */
}
```

### Admin Theme Variables

The admin system extends these with admin-specific variables:

```css
:root {
  --admin-primary: var(--primary);
  --admin-primary-hover: var(--primary-dark);
  --admin-primary-light: var(--primary-light);
  --admin-secondary: var(--complementary);
  --admin-accent: var(--accent);
  --admin-success: #10b981;
  --admin-warning: var(--accent);
  --admin-error: #ef4444;
  /* ... more variables */
}
```

## 📁 File Structure

```
src/app/admin/
├── styles/
│   └── admin-theme.css          # Global admin theme
├── components/
│   ├── AdminComponents.tsx      # Core admin components
│   ├── AdminPageLayout.tsx       # Page layout template
│   └── index.ts                 # Component exports
└── login/
    ├── styles/
    │   └── login-theme.css      # Login-specific theme (extends admin)
    └── components/
        └── LoginComponents.tsx  # Login components
```

## 🧩 Component Library

### Layout Components

#### `AdminLayout`

Main container for admin pages:

```tsx
<AdminLayout>{/* Your admin content */}</AdminLayout>
```

#### `AdminCard`

Card container with consistent styling:

```tsx
<AdminCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</AdminCard>
```

#### `AdminPageLayout`

Complete page layout with sidebar and navigation:

```tsx
<AdminPageLayout
  title="Dashboard"
  subtitle="Overview of your tours"
  currentPath="/admin"
>
  <div>Your page content</div>
</AdminPageLayout>
```

### Form Components

#### `AdminFormControl`

Enhanced input with validation:

```tsx
<AdminFormControl
  type="text"
  placeholder="Enter tour name"
  value={tourName}
  onChange={(e) => setTourName(e.target.value)}
  error={!!error}
  errorMessage={error}
  size="lg"
/>
```

#### `AdminButton`

Consistent button styling:

```tsx
<AdminButton
  variant="primary"
  size="lg"
  fullWidth
  isLoading={isLoading}
  loadingText="Saving..."
>
  Save Tour
</AdminButton>
```

### Navigation Components

#### `AdminSidebar`

Left sidebar navigation:

```tsx
<AdminSidebar>
  <AdminSidebarItem href="/admin/tours" active>
    Tours
  </AdminSidebarItem>
  <AdminSidebarItem href="/admin/testimonials">Testimonials</AdminSidebarItem>
</AdminSidebar>
```

#### `AdminNav`

Top navigation bar:

```tsx
<AdminNav>
  <AdminNavItem href="/admin/profile">Profile</AdminNavItem>
  <AdminNavItem href="/admin/logout">Logout</AdminNavItem>
</AdminNav>
```

### Alert Components

#### `AdminAlert`

Consistent alert styling:

```tsx
<AdminAlert type="success" message="Tour saved successfully!" />
<AdminAlert type="error" message="Failed to save tour" />
<AdminAlert type="warning" message="Please check your input" />
<AdminAlert type="info" message="New feature available" />
```

### Modal Components

#### `AdminModal`

Consistent modal dialogs:

```tsx
<AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <AdminModalHeader>
    <h3>Confirm Delete</h3>
  </AdminModalHeader>
  <AdminModalBody>
    <p>Are you sure you want to delete this tour?</p>
  </AdminModalBody>
  <AdminModalFooter>
    <AdminButton variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </AdminButton>
    <AdminButton variant="primary" onClick={handleDelete}>
      Delete
    </AdminButton>
  </AdminModalFooter>
</AdminModal>
```

## 🎯 Usage Examples

### Basic Admin Page

```tsx
import { AdminPageLayout, AdminCard, AdminHeader } from "./components";

const ToursPage = () => {
  return (
    <AdminPageLayout
      title="Tours Management"
      subtitle="Manage your tour packages"
      currentPath="/admin/tours"
    >
      <AdminHeader title="All Tours" subtitle="View and manage tours" />

      <AdminCard>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Tours List</h4>
          <AdminButton variant="primary">Add New Tour</AdminButton>
        </div>

        {/* Tours content */}
      </AdminCard>
    </AdminPageLayout>
  );
};
```

### Form Page

```tsx
import {
  AdminPageLayout,
  AdminCard,
  AdminFormGroup,
  AdminFormLabel,
  AdminFormControl,
  AdminButton,
} from "./components";

const CreateTourPage = () => {
  const [tourName, setTourName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminPageLayout
      title="Create New Tour"
      subtitle="Add a new tour package"
      currentPath="/admin/tours"
    >
      <AdminCard>
        <form onSubmit={handleSubmit}>
          <AdminFormGroup>
            <AdminFormLabel htmlFor="tourName" required>
              Tour Name
            </AdminFormLabel>
            <AdminFormControl
              id="tourName"
              type="text"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              placeholder="Enter tour name"
              size="lg"
            />
          </AdminFormGroup>

          <AdminButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            loadingText="Creating..."
          >
            Create Tour
          </AdminButton>
        </form>
      </AdminCard>
    </AdminPageLayout>
  );
};
```

## 🎨 Customization

### Color Customization

Update the global theme variables in `globals.css`:

```css
:root {
  --primary: #your-brand-color;
  --primary-light: #your-light-color;
  --primary-dark: #your-dark-color;
  --complementary: #your-secondary-color;
  --accent: #your-accent-color;
}
```

### Component Customization

Override admin theme variables:

```css
:root {
  --admin-primary: #custom-color;
  --admin-spacing-lg: 2rem;
  --admin-radius-lg: 1rem;
}
```

### Custom Components

Extend the admin components:

```tsx
import { AdminCard } from "./components";

const CustomCard = ({ children, ...props }) => {
  return (
    <AdminCard className="custom-card" {...props}>
      <div className="custom-header">{/* Custom header */}</div>
      {children}
    </AdminCard>
  );
};
```

## 📱 Responsive Design

The admin theme includes responsive design:

- **Mobile**: Sidebar collapses, cards stack vertically
- **Tablet**: Optimized spacing and layout
- **Desktop**: Full sidebar and multi-column layouts

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant
- **Reduced Motion**: Respects user preferences

## 🚀 Performance

- **CSS Variables**: Efficient theming without JavaScript
- **Component Optimization**: Minimal re-renders
- **Tree Shaking**: Only import what you need
- **Lazy Loading**: Components loaded on demand

## 🔄 State Management

The admin components work with any state management solution:

```tsx
// With React hooks
const [tours, setTours] = useState([]);
const [isLoading, setIsLoading] = useState(false);

// With Redux
const tours = useSelector((state) => state.tours);
const dispatch = useDispatch();

// With Zustand
const { tours, fetchTours } = useTourStore();
```

## 🧪 Testing

Test admin components easily:

```tsx
import { render, screen } from "@testing-library/react";
import { AdminPageLayout } from "./components";

test("renders admin layout", () => {
  render(
    <AdminPageLayout title="Test Page">
      <div>Test Content</div>
    </AdminPageLayout>
  );

  expect(screen.getByText("Test Page")).toBeInTheDocument();
  expect(screen.getByText("Test Content")).toBeInTheDocument();
});
```

## 📝 Best Practices

1. **Consistent Usage**: Always use admin components for consistency
2. **Theme Variables**: Use CSS variables instead of hardcoded values
3. **Responsive Design**: Test on all device sizes
4. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
5. **Performance**: Use lazy loading for heavy components
6. **Error Handling**: Always include error states and loading states

## 🤝 Contributing

When adding new admin components:

1. Follow the existing naming convention (`AdminComponentName`)
2. Use the admin theme variables
3. Include proper TypeScript interfaces
4. Add accessibility features
5. Test on multiple devices
6. Update documentation

---

**Built with ❤️ for Dazzling Tours Admin Portal**
