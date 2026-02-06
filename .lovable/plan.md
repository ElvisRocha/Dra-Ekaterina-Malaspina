
# Plan: Reorder Form Fields in FirstTimeForm

## Overview

Reorder the first four fields in the FirstTimeForm to match the requested layout.

---

## Current Layout

```text
Row 1: Nombre Completo 🔒    |  Edad (años)
Row 2: Número de ID 🔒       |  Teléfono 🔒
```

## Requested Layout

```text
Row 1: Nombre Completo 🔒    |  Número de Identificación 🔒
Row 2: Teléfono 🔒           |  Edad (años)
```

---

## File to Modify

**`src/components/FirstTimeForm.tsx`**

### Changes

Reorder the fields within the first two `grid` sections (lines 146-200):

**Row 1 (lines 146-170):**
- Keep: Nombre Completo (left)
- Move: Número de Identificación → right (replacing Edad)

**Row 2 (lines 172-200):**
- Move: Teléfono → left (replacing Número de Identificación)
- Move: Edad → right (replacing Teléfono)

---

## Resulting Structure

```tsx
{/* Row 1: Nombre Completo | Número de Identificación */}
<div className="grid md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="fullName">...</Label>
    <Input id="fullName" ... disabled />
  </div>
  <div>
    <Label htmlFor="idNumber">...</Label>
    <Input id="idNumber" ... disabled />
  </div>
</div>

{/* Row 2: Teléfono | Edad */}
<div className="grid md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="phone">...</Label>
    <Input id="phone" ... disabled />
  </div>
  <div>
    <Label htmlFor="age">...</Label>
    <Input id="age" type="number" ... />
  </div>
</div>
```

This ensures:
- All three locked fields (Nombre, ID, Teléfono) remain properly styled with the lock icon
- The Edad field remains editable
- Vertical alignment is consistent since fields in the same row will have similar label lengths
