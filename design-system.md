# Flow Myna Design System

A professional, refined design system inspired by Supabase and modern B2B applications. Focused on clarity, subtlety, and enterprise-grade polish.

## 🎨 Color Palette

### Primary Colors
```css
/* Primary Brand Color - Emerald */
bg-emerald-600         /* Primary buttons, active states */
bg-emerald-700         /* Button hover states */
text-emerald-600       /* Primary text accents (light mode) */
text-emerald-400       /* Primary text accents (dark mode) */

/* Subtle Backgrounds */
bg-emerald-50          /* Light mode subtle backgrounds */
bg-emerald-950/50      /* Dark mode subtle backgrounds */
border-emerald-100     /* Light mode borders */
border-emerald-900     /* Dark mode borders */

/* Neutral Grays */
bg-gray-50             /* Light background */
bg-gray-950            /* Dark background */
bg-white               /* Cards, forms (light) */
bg-gray-900            /* Cards, forms (dark) */
```

### Status Colors
- **Success:** `emerald-400` (indicators), `emerald-600` (buttons)
- **Neutral:** `gray-400`, `gray-500`, `gray-600`
- **Borders:** `gray-200` (light), `gray-800` (dark)

### Extended Color Palette (Use Sparingly)

**🎯 EMERALD FIRST PRINCIPLE:** Use emerald for 95% of all accent colors, buttons, highlights, and brand elements.

#### Limited Exception Colors (Use Only When Semantically Necessary)

```css
/* Professional Blue - ONLY for object/data categorization and cohort selection */
bg-blue-50             /* Light backgrounds for object icons */
bg-blue-950/50         /* Dark backgrounds for object icons */
bg-blue-100            /* Object type badge backgrounds */
bg-blue-500            /* Cohort pills, cohort buttons, outflow numbers - STANDARD BLUE */
bg-blue-600            /* Cohort button hover states, pill close button hover */
text-blue-800          /* Object type badge text (light) */
text-blue-600          /* Object icon text (light) */
text-blue-500          /* Object icon text (dark), outflow breakdown numbers, cohort hover states - STANDARD BLUE */
border-blue-100        /* Object icon borders (light) */
border-blue-900        /* Object icon borders (dark) */

/* Professional Green - Keep existing colors for events/success */
bg-green-50            /* Light backgrounds for event elements */
bg-green-900/20        /* Dark backgrounds for event elements */
bg-green-100           /* Event type badge backgrounds */
text-green-800         /* Event type badge text (light) */
text-green-600         /* Event icon text (light) */
text-green-400         /* Event icon text (dark) */

/* Muted Red - ONLY for destructive actions and critical errors */
bg-red-50              /* Light backgrounds for error states */
bg-red-900/20          /* Dark backgrounds for error states */
bg-red-100             /* Error badge backgrounds */
text-red-800           /* Error badge text (light) */
text-red-600           /* Error text (light) */
text-red-400           /* Error text (dark) */
```

#### Color Usage Rules (STRICT)

**✅ EMERALD FOR:**
- All buttons (primary, secondary, ghost with emerald accents)
- All interactive states (hover, active, focus)
- All progress indicators and step completion
- All success states and confirmations
- All brand elements and highlights
- All call-to-action elements

**🔵 BLUE ONLY FOR:**
- Object type badges/indicators (semantic distinction from events)
- Object-related icons and containers
- Cohort selection UI (pills, buttons, outflow numbers)
- **Maximum 3-4 uses per page** (expanded for cohort functionality)

**🟢 GREEN ONLY FOR:**
- Event type badges/indicators (existing usage)
- Event-related icons and containers
- Alternative success states (keep existing patterns)

**🔴 RED ONLY FOR:**
- Delete/destroy actions
- Critical errors requiring immediate attention
- **Maximum 1-2 uses per page**

**⚫ GRAY FOR EVERYTHING ELSE:**
- Secondary information
- Disabled states
- Neutral badges and labels
- Background elements

## 🎯 Typography

### Headers
```jsx
{/* Page Headers */}
<h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
    Page Title
</h1>

{/* Section Headers */}
<h2 className="text-lg font-medium text-gray-900 dark:text-white">
    Section Title
</h2>

{/* Card Headers */}
<h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
    Card Title
</h3>
```

### Body Text
```jsx
{/* Primary Description */}
<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
    Main description text
</p>

{/* Secondary Text */}
<p className="text-sm text-gray-500 dark:text-gray-400">
    Secondary information
</p>

{/* Helper Text */}
<p className="text-xs text-gray-500 dark:text-gray-400">
    Helper or supporting text
</p>
```

## 🎨 Components

### Buttons

#### Primary Emerald Button (EXACT TEMPLATE)
```jsx
{/* 🔥 CRITICAL: Use this EXACT className for all primary emerald buttons */}
<button className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
    <svg className="w-4 h-4">...</svg>
    Button Text
</button>
```

**⚠️ IMPORTANT RULES FOR EMERALD BUTTONS:**
- **NEVER use `disabled:bg-emerald-400`** - it makes buttons appear washed out
- **ALWAYS include `focus:ring-offset-2`** - this is part of our brand consistency  
- **Use `disabled={condition}`** attribute instead of disabled styling classes
- **Exact colors:** `bg-emerald-600 hover:bg-emerald-700` - no variations

#### Secondary Emerald Button
```jsx
<button className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
    <svg className="w-4 h-4">...</svg>
    Button Text
</button>
```

#### Ghost Button
```jsx
<button className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm">
    Button Text
</button>
```

### Cards

#### Standard Card
```jsx
<div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all duration-200 cursor-pointer">
    <div className="p-6">
        {/* Card content */}
    </div>
</div>
```

#### Form Card
```jsx
<div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
    {/* Form content */}
</div>
```

### Icons

#### Subtle Icon Container
```jsx
<div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
    <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
        {initials}
    </span>
</div>
```

#### Small Icon Container
```jsx
<div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
    <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400">...</svg>
</div>
```

#### Feature Icon (Large)
```jsx
<div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400">...</svg>
</div>
```

### Form Inputs
```jsx
<input className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-colors duration-200 text-sm" />
```

### Progress Indicators & Steps

#### Step Progress (Wizard/Multi-step flows)
```jsx
{/* ✅ CORRECT: Always use emerald for progress steps */}
<div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
    step.id === currentStep
        ? 'border-emerald-600 bg-emerald-600 text-white'  // Current step: emerald
        : step.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'  // Completed: emerald
            : 'border-gray-300 bg-white text-gray-500'  // Future: neutral
}`}>
    {step.completed ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    ) : (
        <span className="font-medium text-xs">{index + 1}</span>
    )}
</div>

{/* Step text */}
<p className={`font-medium text-xs ${
    step.id === currentStep ? 'text-emerald-600' : 'text-gray-900 dark:text-white'
}`}>
    {step.title}
</p>
```

**⚠️ CRITICAL RULES FOR PROGRESS STEPS:**
- **NEVER use teal, cyan, or other blues** for current/active steps
- **ALWAYS use emerald-600 for current step** (consistency with buttons)
- **ALWAYS use emerald-500 for completed steps** (slightly lighter for distinction)
- **Use gray-300 for future/pending steps** (neutral state)

#### Loading Progress Bars
```jsx
{/* Progress bar container */}
<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div 
        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
    />
</div>
```

### Status Indicators & Badges

#### Badge Component
Use the `<Badge>` component for consistent status, role, and type indicators throughout the application.

```jsx
{/* Status Badges */}
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="soft">Draft</Badge>
<Badge variant="default">Processing</Badge>

{/* Role Badges (Team Management) */}
<Badge variant="primary">Owner</Badge>    {/* Emerald - highest privilege */}
<Badge variant="success">Admin</Badge>     {/* Green - administrative access */}
<Badge variant="soft">Member</Badge>       {/* Gray - standard access */}

{/* Process/Type Badges */}
<Badge variant="soft">Purchase Order</Badge>
<Badge variant="default">API Integration</Badge>
```

#### Status Indicators with Dots
```jsx
{/* Active Status with Dot */}
<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
    <Badge variant="success">Active</Badge>
</div>

{/* Feature Indicators */}
<div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
    <span>Feature name</span>
</div>
```

#### Badge Variant Guidelines
- **`primary`** (emerald): Owner roles, featured items, primary brand elements
- **`success`** (green): Active states, admin roles, completed processes  
- **`warning`** (yellow): Pending states, processing, requires attention
- **`error`** (red): Failed states, error conditions, critical issues
- **`soft`** (light gray): Draft states, member roles, neutral information
- **`default`** (gray): Processing states, standard information, fallback

## 📐 Layout & Spacing

### Container Spacing
- **Page padding:** `py-8` (top/bottom), `px-4 sm:px-6 lg:px-8` (sides)
- **Section margins:** `mb-8` for major sections, `mb-6` for subsections
- **Card padding:** `p-6` for main cards, `p-4` for compact cards
- **Button padding:** `px-4 py-2.5` for primary, `px-3 py-2` for secondary

### Grid Systems
```jsx
{/* Card Grid */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {/* Cards */}
</div>

{/* Form Grid */}
<div className="space-y-5">
    {/* Form fields */}
</div>
```

### Full-Screen Centering (No Scroll)
```jsx
{/* ✅ CORRECT: Modern approach with fallback for mobile browser chrome */}
<div className="h-dvh bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ height: 'calc(100vh - 3rem)' }}>
    <div className="w-full max-w-md">
        {/* Centered content */}
    </div>
</div>

{/* For pages without dashboard header, use full viewport */}
<div className="h-dvh bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ height: '100dvh' }}>
    <div className="w-full max-w-md">
        {/* Centered content */}
    </div>
</div>
```

**Why this works:**
- `h-dvh` (Dynamic Viewport Height) automatically accounts for mobile browser chrome
- `calc(100vh - 3rem)` fallback for older browsers (3rem = 48px header height)  
- Prevents scrolling issues on mobile devices with address bars
- 93%+ browser support for `dvh` units with reliable fallback

**❌ NEVER use these approaches:**
- `h-screen` (causes scrolling when header is present)
- `fixed top-16 left-0 right-0 bottom-0` (causes layout issues)
- `min-height: 100vh` alone (doesn't account for header height)

## ✨ Animations & Transitions

### Standard Transitions
```css
transition-colors duration-200  /* Color changes */
transition-all duration-200     /* General hover effects */
hover:shadow-sm                 /* Subtle shadow on hover */
```

### Focus States
```css
/* Primary Focus (Emerald) */
focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2

/* Secondary Focus (Gray) */
focus:outline-none focus:ring-2 focus:ring-gray-500
```

### Loading States
```jsx
{/* Spinner */}
<svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
```

## 🌗 Dark Mode Support

All components include proper dark mode variants:
- Use `dark:` prefixes consistently
- Maintain proper contrast ratios
- Use subtle transparency: `/50` for overlays

## 🎯 Key Principles

1. **Subtle Elegance:** Prefer understated design over flashy effects
2. **Consistent Emerald:** Use emerald as the primary brand color throughout
3. **Proper Spacing:** Follow consistent spacing patterns
4. **Clean Borders:** Use subtle borders instead of heavy shadows
5. **Professional Typography:** Clear hierarchy with appropriate font weights
6. **Minimal Animations:** Smooth but subtle transitions
7. **Accessibility First:** Proper focus states and contrast

## 🚀 Implementation Guidelines

### Do's ✅
- **Copy-paste the exact emerald button className** from this guide
- Use `bg-emerald-600 hover:bg-emerald-700` for all primary buttons
- Include `focus:ring-offset-2` for emerald buttons
- Use `fixed inset-0` for full-screen centering without scroll
- Keep button sizes consistent (`px-4 py-2.5` for primary)
- Use `rounded-lg` for most elements, `rounded-xl` for larger cards

### Don'ts ❌
- **NEVER use `disabled:bg-emerald-400`** - makes buttons look washed out
- **NEVER use `h-screen` with headers** - causes scrolling issues on mobile
- **NEVER use `fixed top-16 left-0 right-0 bottom-0`** - causes layout problems
- **NEVER use teal, cyan, or random blues** for buttons or progress indicators
- **NEVER use blue for buttons** - always use emerald for interactive elements
- Don't modify emerald button colors - use exact values from guide
- Don't remove `focus:ring-offset-2` from emerald buttons
- **Don't use more than 2-3 blue elements per page** (objects only)
- **Don't use more than 1-2 red elements per page** (errors only)
- Avoid multiple bright colors or rainbow gradients
- Don't use transform scaling on hover for buttons
- Avoid heavy shadows or blur effects
- Don't mix different border radius patterns
- **Don't create new color variants** - stick to defined palette

## 🏷️ Badge Usage Patterns

### Common Status Mappings
```jsx
// Project/Upload Status
const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'active': return 'success';
        case 'completed': return 'success';
        case 'processing': return 'warning';
        case 'pending': return 'warning';
        case 'uploading': return 'default';
        case 'draft': return 'soft';
        case 'paused': return 'soft';
        case 'failed': return 'error';
        case 'error': return 'error';
        default: return 'default';
    }
};

// Team Role Hierarchy
const getRoleBadgeVariant = (role) => {
    switch (role) {
        case 'Owner': return 'primary';     // Emerald - highest authority
        case 'Admin': return 'success';     // Green - administrative
        case 'Member': return 'soft';       // Gray - standard access
        default: return 'soft';
    }
};

// Data/Process Types
const getTypeBadgeVariant = (type) => {
    return 'soft'; // Use soft for most categorization badges
};
```

### Do's and Don'ts ✅❌
**✅ DO:**
- Use `success` for active/completed states
- Use `warning` for pending/processing states  
- Use `primary` for owner/featured items
- Use `soft` for categories and member roles
- Use consistent variant mapping across similar contexts

**❌ DON'T:**
- Mix different badge variants for the same status across pages
- Use `primary` for regular status indicators (reserve for special emphasis)
- Create hardcoded badge styling - always use the Badge component
- Use bright colors (like old teal/cyan) that don't fit the professional theme

## 📋 Component Checklist

When creating new components:
- [ ] Uses emerald-600/700 for primary actions (exact colors)
- [ ] Has proper dark mode variants
- [ ] Includes correct focus states (with ring-offset-2 for emerald)
- [ ] Follows consistent spacing patterns
- [ ] Uses appropriate text sizes and weights
- [ ] Has subtle hover effects
- [ ] Maintains visual hierarchy
- [ ] **Uses Badge component for all status/role indicators**
- [ ] **No disabled color variants for emerald buttons**

## 🔥 Common Mistakes to Avoid

1. **Washed-out emerald buttons:** Using `disabled:bg-emerald-400` instead of just `disabled={condition}`
2. **Inconsistent focus rings:** Missing `focus:ring-offset-2` on emerald buttons
3. **Scrolling on centered pages:** Using `min-h-screen` instead of `fixed inset-0`
4. **Color variations:** Modifying emerald-600/700 instead of using exact values
5. **Color creep:** Adding new colors without strict justification (stick to emerald-first principle)
6. **Wrong step colors:** Using teal/cyan (`#007590`) instead of emerald for progress indicators
7. **Blue buttons:** Using blue for any interactive elements (blue is only for object categorization)

## 🎨 Color Discipline Philosophy

This design system prioritizes **color restraint** over variety. The emerald-first approach:

- **Creates brand consistency** across all interactions
- **Reduces cognitive load** by limiting color meanings
- **Maintains professional appearance** suitable for enterprise users
- **Prevents color chaos** that can make interfaces feel unpolished

**Remember:** A cohesive, single-accent design is more professional than a rainbow of colors. When in doubt, choose emerald or neutral gray.

This design system creates a professional, cohesive experience that builds trust with enterprise users while maintaining visual appeal and usability. 