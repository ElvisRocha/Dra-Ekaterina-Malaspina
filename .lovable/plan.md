
# Plan: Fix Patient Data Not Populating in FirstTimeForm

## Problem

The `FirstTimeForm` component initializes its `formData` state using `useState` with `initialData` values. However, `useState` only uses the initial value on the **first render** and ignores subsequent changes to the prop.

### Current Flow

1. `BookAppointment` mounts with empty `patientData`
2. `FirstTimeForm` component is rendered (even if hidden via `isOpen={false}`)
3. `useState` initializes `formData` with empty `initialData` values
4. User fills in patient data in Step 2
5. User confirms booking, `showFirstTimeForm` becomes `true`
6. `initialData` now has real values, but `formData` state is still empty

## Solution

Add a `useEffect` hook that updates the form state when `initialData` changes AND when the dialog opens (`isOpen` becomes true). This ensures the locked fields are populated with the correct values.

---

## File to Modify

**`src/components/FirstTimeForm.tsx`**

### Changes

1. Import `useEffect` from React (already using `useState`)
2. Add a `useEffect` that syncs `initialData` to `formData` when the dialog opens

### Code Change

Add after the `useState` declaration (around line 57):

```tsx
// Sync initialData to formData when dialog opens
useEffect(() => {
  if (isOpen) {
    setFormData(prev => ({
      ...prev,
      fullName: initialData.fullName,
      idNumber: initialData.idNumber,
      phone: initialData.phone,
    }));
  }
}, [isOpen, initialData.fullName, initialData.idNumber, initialData.phone]);
```

This ensures that:
- When `isOpen` becomes `true`, the form updates with the latest `initialData`
- Only the three locked fields are synchronized (not overwriting other user input)
- The effect re-runs if any of the initial data values change

---

## Summary

| Issue | Fix |
|-------|-----|
| `useState` ignores prop updates after initial render | Add `useEffect` to sync when dialog opens |
| Locked fields show empty values | Populate from `initialData` when `isOpen` becomes true |
