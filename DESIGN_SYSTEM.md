# Design System Documentation

## Design Philosophy

This design system follows Steve Jobs' principles of simplicity, beauty, and attention to detail. Every component is crafted with care to create a cohesive, elegant user experience.

## Core Principles

### 1. Simplicity
- Remove everything unnecessary
- Every element serves a purpose
- Clear, intuitive interfaces

### 2. Consistency
- Unified design language throughout
- Consistent spacing, colors, typography
- Predictable interactions

### 3. Beauty
- Every pixel is intentional
- Harmonious color palette
- Generous whitespace

### 4. Delight
- Smooth animations and transitions
- Subtle micro-interactions
- Joyful user experience

## Color System

### Primary - Professional Blue
- Used for primary actions, links, and key UI elements
- Conveys trust, professionalism, and reliability
- Range: 50-950

### Success - Green
- Indicates successful actions, approvals, and positive states
- Range: 50-900

### Warning - Amber
- Signals caution, pending actions, and items needing attention
- Range: 50-900

### Error - Red
- Represents errors, rejections, and critical alerts
- Range: 50-900

### Neutral - Gray
- Used for text, borders, backgrounds
- Range: 50-950

## Typography

### Font Family
System font stack for optimal performance and native feel:
- macOS/iOS: -apple-system, BlinkMacSystemFont
- Windows: Segoe UI
- Android: Roboto
- Fallback: Arial, sans-serif

### Type Scale
- **xs**: 0.75rem (12px) - Small labels, captions
- **sm**: 0.875rem (14px) - Secondary text
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px) - Subheadings
- **xl**: 1.25rem (20px) - Card titles
- **2xl**: 1.5rem (24px) - Section headers
- **3xl**: 1.875rem (30px) - Page headers
- **4xl**: 2.25rem (36px) - Large headlines

## Spacing Scale

8px grid system for consistent spacing:
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px

## Border Radius

Rounded corners throughout for a modern, friendly feel:
- **sm**: 4px - Small elements
- **md**: 8px (default) - Most UI elements
- **lg**: 12px - Cards, larger containers
- **xl**: 16px - Prominent cards
- **2xl**: 24px - Modals, large containers
- **full**: 9999px - Pills, avatars

## Shadows

Subtle elevation system:
- **sm**: Subtle - Hover states
- **md**: Default - Cards, dropdowns
- **lg**: Elevated - Active cards
- **xl**: High - Modals, overlays
- **2xl**: Highest - Critical modals

## Component Library

### Buttons
5 variants for different contexts:
- **Primary**: Main actions (blue background)
- **Secondary**: Alternative actions (gray background)
- **Ghost**: Tertiary actions (transparent)
- **Danger**: Destructive actions (red background)
- **Outline**: Secondary prominence (bordered)

3 sizes:
- **sm**: 36px height
- **md**: 40px height (default)
- **lg**: 48px height

### Form Inputs
Consistent form elements with:
- Clear labels
- Optional helper text
- Error states with messages
- Focus indicators
- Disabled states

Types:
- Text input
- Select dropdown
- Textarea
- File upload (drag-and-drop)
- Search input

### Cards
Flexible container with sections:
- Header (title, description)
- Content (main body)
- Footer (actions)

Features:
- Rounded corners (12px)
- Subtle border
- Hover shadow effect
- Responsive padding

### Badges
Status and category indicators:
- **default**: Dark background
- **secondary**: Light gray
- **success**: Green (approvals, low risk)
- **warning**: Amber (pending, medium risk)
- **error**: Red (rejections, high risk)
- **primary**: Blue (info)
- **outline**: Bordered (neutral)

### Tables
Clean data display:
- Clear headers
- Row hover states
- Sortable columns
- Responsive overflow
- Zebra striping optional

### Modals
Overlay dialogs:
- Backdrop blur
- Centered positioning
- Close button
- Keyboard navigation (ESC)
- Focus trap
- 4 sizes (sm, md, lg, xl)

### Progress Indicators
Visual feedback:
- Progress bars (with variants)
- Stepper (multi-step forms)
- Timeline (activity history)
- Skeleton loaders

### Empty States
Beautiful placeholders:
- Icon
- Title
- Description
- Call-to-action button
- Dashed border container

## Animations

Smooth, performant animations:
- **Duration**: 200-300ms (fast and responsive)
- **Easing**: ease-out, ease-in-out
- **Properties**: opacity, transform, colors
- **Performance**: GPU-accelerated (transform, opacity)

Built-in animations:
- fade-in
- slide-up
- slide-down
- scale-in

## Accessibility

### WCAG AA Compliance
- Color contrast ratios meet standards
- Focus indicators on all interactive elements
- Screen reader labels (ARIA)
- Keyboard navigation support

### Keyboard Navigation
- Tab order follows visual flow
- Enter/Space for buttons
- Escape closes modals
- Arrow keys for menus

### Screen Reader Support
- Semantic HTML
- ARIA labels and roles
- Live regions for dynamic content
- Form labels and error messages

## Responsive Design

### Breakpoints
- **sm**: 640px - Mobile landscape
- **md**: 768px - Tablet
- **lg**: 1024px - Desktop
- **xl**: 1280px - Large desktop

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)
- Readable text without zooming

## Best Practices

### Do's
✅ Use consistent spacing from the scale
✅ Maintain color palette
✅ Follow component patterns
✅ Test on multiple devices
✅ Ensure accessibility
✅ Use semantic HTML

### Don'ts
❌ Don't create arbitrary spacing
❌ Don't use colors outside the palette
❌ Don't reinvent existing components
❌ Don't ignore accessibility
❌ Don't use inline styles
❌ Don't skip responsive testing

## Usage Examples

```tsx
// Import components
import { Button, Card, Badge } from '@/components/ui'

// Use in your pages
<Card>
  <CardHeader>
    <CardTitle>Client Details</CardTitle>
    <CardDescription>View and manage client information</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge variant="success">Approved</Badge>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Save Changes</Button>
    <Button variant="outline">Cancel</Button>
  </CardFooter>
</Card>
```

## Maintenance

The design system is a living document. As the product evolves:
1. Document new patterns
2. Deprecate outdated components
3. Maintain consistency
4. Gather user feedback
5. Iterate and improve

---

Built with passion and attention to detail. Every pixel matters.

