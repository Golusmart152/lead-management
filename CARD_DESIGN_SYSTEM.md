# Unified Card Design System Documentation

## Overview

This document provides comprehensive documentation for the unified card design system that maintains visual consistency across all dashboard components, forms, tables, and other UI elements. The design system is based on the reference HTML template and implements glass morphism effects, consistent spacing, typography, and interactive states.

## Design Philosophy

The card design system follows these core principles:

- **Visual Consistency**: All cards use the same design language with unified colors, spacing, and typography
- **Glass Morphism**: Modern glass effects with backdrop blur and transparency
- **Responsive Design**: Seamless adaptation across different screen sizes
- **Accessibility**: Proper contrast ratios, focus indicators, and keyboard navigation
- **Performance**: Optimized animations and interactions with reduced motion support

## Base Card System

### Core CSS Classes

#### Primary Card Classes
- `.ds-card` - Base card component with glass effect
- `.card-bg-neo` - Main glass morphism card styling
- `.ds-glass-surface` - Elevated glass surface variant
- `.ds-glass-subtle` - Subtle glass effect variant

#### Interactive Effects
- `.dashboard-card--hover-lift` - Hover lift effect
- `.dashboard-card--hover-glow` - Hover glow effect  
- `.dashboard-card--hover-border` - Hover border emphasis
- `.dashboard-card--hover-scale` - Hover scale effect
- `.dashboard-card--active-press` - Active press effect

### Color Scheme

#### Background Colors
- **Base**: `rgba(19, 24, 36, 0.91)` - Primary card background
- **Surface**: `rgba(40, 40, 50, 0.5)` - Secondary surfaces
- **Overlay**: `rgba(20, 20, 26, 0.4)` - Header surfaces

#### Text Colors
- **Primary**: `#ffffff` - Main text
- **Secondary**: `#a0a0b2` - Supporting text
- **Muted**: `#767692` - Less important text
- **Placeholder**: `#767692` - Form placeholders

#### Border Colors
- **Primary**: `#24263d` - Card borders
- **Focus**: `#3b82f6` - Focus states
- **Muted**: `rgba(255, 255, 255, 0.05)` - Subtle borders

#### Accent Colors
- **Primary**: `#3b82f6` - Main accent
- **Hover**: `#2563eb` - Hover state
- **Ring**: `rgba(59, 130, 246, 0.1)` - Focus rings

## Component Library

### 1. Base Card Components

#### Card Component (`src/components/ui/card.tsx`)

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

// Basic usage
<Card variant="glass" size="md" interactive>
  <CardHeader>
    <CardTitle level={2}>Card Title</CardTitle>
  </CardHeader>
  <CardContent spacing="md">
    Card content goes here
  </CardContent>
  <CardFooter justify="end">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: `'default' | 'glass' | 'subtle' | 'elevated'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `interactive`: `boolean` - Enable hover/click effects
- `focusable`: `boolean` - Enable keyboard focus

#### CardHeader Component
- `align`: `'start' | 'center' | 'end'` - Content alignment

#### CardTitle Component
- `level`: `1 | 2 | 3 | 4 | 5 | 6` - Heading level

#### CardContent Component
- `spacing`: `'none' | 'sm' | 'md' | 'lg'` - Padding spacing

#### CardFooter Component
- `justify`: `'start' | 'center' | 'end' | 'between' | 'around'` - Flex justification

### 2. Dashboard Card Components

#### InteractiveDashboardCard (`src/modules/dashboard/components/DashboardCard.tsx`)

```tsx
import { InteractiveDashboardCard } from '@/modules/dashboard/components/DashboardCard'

<InteractiveDashboardCard 
  variant="glass"
  size="md"
  hoverEffect="lift"
  activeEffect="press"
  onClick={handleClick}
  aria-label="Customer card"
>
  {/* Card content */}
</InteractiveDashboardCard>
```

**Props:**
- `hoverEffect`: `'lift' | 'glow' | 'border' | 'scale'`
- `activeEffect`: `'press' | 'glow' | 'border'`

### 3. Specialized Card Components

#### CustomerCard (`src/modules/dashboard/components/CustomerCard.tsx`)
Enhanced customer display card with:
- Avatar with gradient background
- Tier-based styling
- Financial metrics display
- Contact information
- Action buttons

#### LeadCard (`src/modules/dashboard/components/LeadCard.tsx`)
Lead management card featuring:
- Status-based color coding
- Value highlighting
- Contact methods
- Source attribution

#### TaskCard (`src/modules/dashboard/components/TaskCard.tsx`)
Task management card with:
- Priority indicators
- Progress tracking
- Status management
- Due date warnings

### 4. Form Components

#### Dialog Component (`src/components/ui/dialog.tsx`)
Unified modal dialog system:
```tsx
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Input Component (`src/components/ui/input.tsx`)
Enhanced form inputs:
```tsx
<Input 
  variant="default" 
  inputSize="md"
  placeholder="Enter text..."
/>
```

**Variants:**
- `default`: Standard input with border
- `filled`: Filled background style
- `ghost`: Transparent with hover border

**Sizes:**
- `sm`: Compact input (32px height)
- `md`: Standard input (36px height)
- `lg`: Large input (44px height)

### 5. Table Components

#### Table Component (`src/components/ui/table.tsx`)
Unified table system:
```tsx
<Table variant="default" layout="auto" interactive>
  <TableHeader>
    <TableRow>
      <TableHead sortable>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow interactive onClick={handleRowClick}>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Badge className="status-badge">Active</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Variants:**
- `default`: Standard table
- `striped`: Alternating row colors
- `compact`: Smaller spacing

#### MobileTable Component (`src/components/ui/mobile-table.tsx`)
Responsive mobile table:
- Card-based layout on mobile
- Expandable rows
- Touch-friendly interactions
- Consistent styling

## Accessibility Features

### Keyboard Navigation
- All interactive cards support keyboard navigation
- Tab order follows logical flow
- Enter/Space activates clickable cards
- Focus indicators with proper contrast

### Screen Reader Support
- Proper ARIA labels and roles
- Semantic HTML structure
- State announcements for dynamic content
- Alternative text for images

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences
- Minimum 4.5:1 contrast ratios
- Focus indicators clearly visible

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly sizing (minimum 44px)
- Simplified card layouts
- Swipe-friendly interactions
- Optimized typography scaling

### Tablet Adaptations
- Medium-density layouts
- Two-column grids where appropriate
- Balanced spacing

## Usage Guidelines

### Best Practices

1. **Consistent Spacing**: Use the design system's spacing variables
2. **Proper Variants**: Choose appropriate card variants for context
3. **Interactive States**: Always provide visual feedback for interactions
4. **Loading States**: Use skeleton components during loading
5. **Error States**: Display clear error messaging

### Common Patterns

#### Dashboard Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {customers.map(customer => (
    <CustomerCard 
      key={customer.id}
      customer={customer}
      onContact={handleContact}
      onViewDetails={handleViewDetails}
    />
  ))}
</div>
```

#### Form with Cards
```tsx
<Card variant="glass" size="lg">
  <CardHeader>
    <CardTitle>User Information</CardTitle>
  </CardHeader>
  <CardContent spacing="lg">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-group">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div className="form-group">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
    </div>
  </CardContent>
  <CardFooter justify="end">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

#### Data Table
```tsx
<Table variant="striped" interactive>
  <TableHeader>
    <TableRow>
      <TableHead sortable>Name</TableHead>
      <TableHead sortable>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id} onClick={() => selectUser(user)}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge className={statusStyles[user.status]}>
            {user.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Migration Guide

### From Old Card System

1. **Update Imports**: Change from old card components to new unified system
2. **Replace Classes**: Update CSS classes to use design system tokens
3. **Update Props**: Adapt to new prop interfaces
4. **Test Interactions**: Verify hover/click states work correctly
5. **Accessibility**: Ensure keyboard navigation functions properly

### Example Migration

**Before:**
```tsx
<Card className="bg-background border rounded-xl shadow-sm">
  <h3 className="font-semibold text-lg">Title</h3>
  <p className="text-muted-foreground">Content</p>
</Card>
```

**After:**
```tsx
<Card variant="glass" size="md">
  <CardHeader>
    <CardTitle level={3}>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-400">Content</p>
  </CardContent>
</Card>
```

## Performance Considerations

### Optimization Tips

1. **Lazy Loading**: Use React.lazy for large card lists
2. **Virtual Scrolling**: Implement for large datasets
3. **Image Optimization**: Optimize avatar images
4. **Debounced Interactions**: Debounce hover effects on mobile
5. **CSS-in-JS**: Consider CSS-in-JS for dynamic styles

### Animation Performance

- Use `transform` and `opacity` for animations
- Avoid layout-triggering properties
- Respect `prefers-reduced-motion`
- Use `will-change` sparingly

## Testing Guidelines

### Visual Testing
- Test across all breakpoints
- Verify color contrast ratios
- Check hover/focus states
- Validate loading states

### Accessibility Testing
- Keyboard navigation flow
- Screen reader compatibility
- Color blindness simulations
- High contrast mode

### Performance Testing
- Animation smoothness
- Large list rendering
- Memory usage patterns
- Bundle size impact

## Future Enhancements

### Planned Features
- Dark/Light theme variants
- Advanced animation presets
- Custom card builder
- Accessibility audit tools
- Performance monitoring

### Version History
- **v1.0.0**: Initial unified card system
- **v1.1.0**: Enhanced accessibility features
- **v1.2.0**: Mobile optimization improvements

## Support and Resources

### Documentation
- [Design System Overview](./README.md)
- [Component API Reference](./COMPONENTS.md)
- [Theming Guide](./THEMING.md)
- [Migration Guide](./MIGRATION.md)

### Tools
- [Storybook Documentation](http://localhost:6006)
- [Design Tokens](./design-tokens.json)
- [Accessibility Checker](./a11y-checker.js)

### Community
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Issue Tracker](../issues)
- [Feature Requests](../features)

---

This documentation ensures consistent usage of the unified card design system across all components while maintaining accessibility, performance, and user experience standards.