
# Plan: Auto-fill and Disable Patient Data Fields in First Time Form

## Overview

Modify the FirstTimeForm component so the three fields already captured during booking (Name, ID, Phone) are pre-filled, disabled, and visually styled to indicate they cannot be edited.

---

## Current State

The FirstTimeForm component already:
- Receives `initialData` prop with `fullName`, `idNumber`, and `phone`
- Pre-fills these values in the form state
- But all three fields are currently **editable**

---

## Changes Required

### File to Modify

**`src/components/FirstTimeForm.tsx`**

### 1. Add Translation Keys

**`src/contexts/LanguageContext.tsx`**

Add new translation for the locked field tooltip:

```javascript
'form.lockedField': { 
  es: 'Este dato fue proporcionado al agendar su cita', 
  en: 'This information was provided when booking your appointment' 
}
```

### 2. Create Disabled Input Styling

Add a reusable pattern for the three locked fields with:
- `disabled` attribute on the Input component
- Visual styling: `bg-gray-100 text-gray-600 cursor-not-allowed`
- Lock icon (using Lucide `Lock` icon) positioned inside or next to the field
- Tooltip on hover explaining why the field is locked

### 3. Modify Three Fields

Update the following Input fields to be disabled with the locked style:

**Full Name field (lines 135-141):**
```tsx
<div className="relative">
  <Label htmlFor="fullName">
    {t('booking.fullName')}
    <Lock className="inline-block ml-1 h-3 w-3 text-muted-foreground" />
  </Label>
  <Input
    id="fullName"
    value={formData.fullName}
    disabled
    className="mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
    title={t('form.lockedField')}
  />
</div>
```

**ID Number field (lines 157-163):**
```tsx
<div className="relative">
  <Label htmlFor="idNumber">
    {t('booking.id')}
    <Lock className="inline-block ml-1 h-3 w-3 text-muted-foreground" />
  </Label>
  <Input
    id="idNumber"
    value={formData.idNumber}
    disabled
    className="mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
    title={t('form.lockedField')}
  />
</div>
```

**Phone field (lines 165-173):**
```tsx
<div className="relative">
  <Label htmlFor="phone">
    {t('booking.phone')}
    <Lock className="inline-block ml-1 h-3 w-3 text-muted-foreground" />
  </Label>
  <Input
    id="phone"
    type="tel"
    value={formData.phone}
    disabled
    className="mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
    title={t('form.lockedField')}
  />
</div>
```

### 4. Import Lock Icon

Add the Lock icon import from Lucide:

```tsx
import { Lock } from 'lucide-react';
```

---

## Visual Design

```text
┌─────────────────────────────────────────────────┐
│ Nombre Completo 🔒                              │
│ ┌─────────────────────────────────────────────┐ │
│ │ María García                                │ │  ← bg-gray-100
│ └─────────────────────────────────────────────┘ │    text-gray-600
│                                                 │    cursor: not-allowed
│ Número de Identificación 🔒                     │    title="Este dato fue..."
│ ┌─────────────────────────────────────────────┐ │
│ │ 123456789                                   │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Teléfono 🔒                                     │
│ ┌─────────────────────────────────────────────┐ │
│ │ +506 8888-8888                              │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Edad (años)                   ← Still editable │
│ ┌─────────────────────────────────────────────┐ │
│ │                                             │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## Files to Modify

1. **`src/components/FirstTimeForm.tsx`**
   - Add Lock icon import
   - Update fullName, idNumber, and phone Input fields with:
     - `disabled` attribute
     - Locked styling classes
     - `title` attribute for tooltip
   - Add Lock icon next to each label
   - Remove `onChange` handlers from these three fields (optional, since disabled prevents changes anyway)

2. **`src/contexts/LanguageContext.tsx`**
   - Add `form.lockedField` translation key

---

## Summary of Changes

| Field | Current | After |
|-------|---------|-------|
| Full Name | Editable | Disabled, gray background, lock icon |
| ID Number | Editable | Disabled, gray background, lock icon |
| Phone | Editable | Disabled, gray background, lock icon |
| All other fields | Editable | Unchanged |
