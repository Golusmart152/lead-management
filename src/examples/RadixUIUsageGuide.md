# Radix UI Components Usage Guide

## Package Installation Status ✅

All three Radix UI packages are already installed and ready to use:

- `@radix-ui/react-dialog` (v1.1.15) ✅
- `@radix-ui/react-dropdown-menu` (v2.1.16) ✅
- `@radix-ui/react-tooltip` (v1.2.8) ✅

## Correct Import Syntax

### Dialog Component
```tsx
import * as Dialog from "@radix-ui/react-dialog";
```

### Dropdown Menu Component
```tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
```

### Tooltip Component
```tsx
import * as Tooltip from "@radix-ui/react-tooltip";
```

## Basic Usage Patterns

### Dialog Usage
```tsx
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Open Dialog</button>
  </Dialog.Trigger>
  
  <Dialog.Portal>
    <Dialog.Overlay className="bg-black/50 fixed inset-0" />
    <Dialog.Content className="bg-white rounded-lg p-6 shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
      <Dialog.Title>Dialog Title</Dialog.Title>
      {/* Dialog content */}
      <Dialog.Close asChild>
        <button>Close</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Dropdown Menu Usage
```tsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <button>Actions ▼</button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Portal>
    <DropdownMenu.Content className="bg-white rounded-md shadow-lg border min-w-[200px]">
      <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-100">
        Action Item
      </DropdownMenu.Item>
      <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
      <DropdownMenu.Item className="px-3 py-2 text-red-600 hover:bg-red-50">
        Destructive Action
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

### Tooltip Usage
```tsx
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button>Hover me</button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content 
        className="bg-gray-800 text-white text-sm rounded px-2 py-1"
        side="top"
        sideOffset={5}
      >
        Tooltip content
        <Tooltip.Arrow className="fill-gray-800" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Key Benefits of Radix UI

### Accessibility
- **WAI-ARIA compliant**: All components follow WAI-ARIA design patterns
- **Keyboard navigation**: Full keyboard support for all interactions
- **Screen reader friendly**: Proper ARIA labels and descriptions
- **Focus management**: Automatic focus handling and trapping

### Composability
- **Headless components**: Style and customize without fighting the library
- **Render props**: Full control over rendering and behavior
- **TypeScript support**: Full type safety and IntelliSense

### Bundle Size
- **Tree shakeable**: Import only what you need
- **Small footprint**: Minimal bundle size impact
- **Performance optimized**: Efficient rendering and updates

## Important Notes

### Portal Usage
All three components require using the `Portal` component to render outside the normal DOM flow:
```tsx
<ComponentName.Portal>
  <ComponentName.Content>...</ComponentName.Content>
</ComponentName.Portal>
```

### Provider Requirements
Tooltip requires the `Provider` wrapper at the root level:
```tsx
<Tooltip.Provider>
  {/* Your component tree */}
</Tooltip.Provider>
```

### Trigger Composition
Use `asChild` prop for custom trigger elements:
```tsx
<ComponentName.Trigger asChild>
  <button className="custom-button">Custom Trigger</button>
</ComponentName.Trigger>
```

## Best Practices

1. **Always use Portal**: For proper z-index and positioning
2. **Wrap with Provider**: Especially for Tooltip components
3. **Use asChild**: For custom styling and behavior
4. **Add accessibility attributes**: Enhance user experience
5. **Test keyboard navigation**: Ensure full accessibility

## Example Implementation

See the complete working example in `src/examples/RadixUIDemo.tsx` which demonstrates:
- Individual component usage
- Combined usage in a lead management interface
- Proper accessibility attributes
- Real-world application patterns

## Integration with Existing Code

Since you already have existing UI components in `src/components/ui/`, you can:
- Replace existing modals with Dialog components
- Enhance dropdown menus with DropdownMenu components  
- Add helpful tooltips throughout your application
- Maintain consistency with your existing design system

The Radix UI components work seamlessly with Tailwind CSS and your existing component structure.