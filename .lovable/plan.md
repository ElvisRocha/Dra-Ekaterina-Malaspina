
# Plan: Dedicated Booking Page with Cal.com-Style Date Picker

## Overview

This plan transforms the current modal-based booking flow into a dedicated full-page experience at `/BookAppointment`, adding a new date/time selection step inspired by Cal.com's interface.

---

## Current State

- Booking flow is a 3-step modal (Service, Patient Data, Confirm)
- Modal opens via `BookingModal` component using Radix Dialog
- CTA buttons trigger `setIsBookingOpen(true)`
- No routing integration for booking

---

## Planned Architecture

```text
/                     --> Landing page (Index.tsx)
/BookAppointment      --> Full booking page (new)
/BookAppointment?service=consulta-sola  --> Pre-selected service
```

---

## Implementation Steps

### Step 1: Create BookAppointment Page

**New file: `src/pages/BookAppointment.tsx`**

This will be a full-page component with:
- Two-panel layout (main content + right sidebar for service info)
- 4-step stepper with progress indicators
- Integration with existing language context
- URL query parameter handling for pre-selected services

**Layout Structure:**
```text
+----------------------------------------------------------+
| Navbar (logo, language toggle, back link)                 |
+----------------------------+-----------------------------+
|                            |                             |
|   Main Stepper Content     |   Service Info Panel       |
|   (Steps 1-4)              |   (shows when service      |
|                            |    is selected)            |
|                            |                             |
+----------------------------+-----------------------------+
| Minimal Footer                                           |
+----------------------------------------------------------+
```

### Step 2: Create Booking Components

**New file: `src/components/booking/BookingNavbar.tsx`**
- Simplified navbar with logo, language toggle, and "Back" link
- Uses React Router's `Link` component

**New file: `src/components/booking/StepIndicator.tsx`**
- 4-step progress indicator
- Visual states: completed (solid magenta), current (magenta border), pending (gray)
- Step labels: Servicio, Datos, Fecha, Confirmar

**New file: `src/components/booking/ServiceInfoPanel.tsx`**
- Right-side panel showing selected service details
- Formatted educational content with emojis
- Scrollable independently
- Mobile: Collapsible accordion

### Step 3: Create Step Components

**New file: `src/components/booking/steps/ServiceStep.tsx`**
- Reuses existing accordion-based service selection logic
- Triggers right panel update on selection

**New file: `src/components/booking/steps/PatientDataStep.tsx`**
- Patient information form (name, ID, phone)
- Form validation

**New file: `src/components/booking/steps/DateTimeStep.tsx`**
- Cal.com-inspired 3-column layout:
  - Left: Selected service summary (name, duration, price, timezone)
  - Center: Monthly calendar with day selection
  - Right: Available time slots for selected day

**Components for DateTimeStep:**

**New file: `src/components/booking/calendar/ServiceSummary.tsx`**
- Service name, duration, price
- Timezone display (America/Costa_Rica)
- Globe icon for timezone

**New file: `src/components/booking/calendar/MonthCalendar.tsx`**
- Monthly view with navigation arrows
- Localized day/month names (ES/EN)
- Available days highlighted
- Selected day with magenta background
- Past days disabled (grayed out)

**New file: `src/components/booking/calendar/TimeSlots.tsx`**
- Shows when a day is selected
- 12h/24h toggle
- Green dot indicator for available slots
- Scrollable list of time buttons
- Selected slot highlighted in magenta

**New file: `src/components/booking/steps/ConfirmStep.tsx`**
- Complete summary: service, patient data, date/time
- Formatted date display
- Confirm button

### Step 4: Add Translations

**Update: `src/contexts/LanguageContext.tsx`**

New translation keys needed:
```javascript
// Navigation
'booking.back': 'Volver' / 'Back'

// Step 4 label
'booking.step4': 'Confirmar' / 'Confirm'
'booking.dateStep': 'Fecha' / 'Date'

// Calendar
'calendar.selectDay': 'Selecciona un día para ver los horarios disponibles' / 'Select a day to see available times'
'calendar.timezone': 'Zona horaria' / 'Timezone'
'calendar.duration': 'Duración' / 'Duration'
'calendar.format12': '12h' / '12h'
'calendar.format24': '24h' / '24h'

// Day names (short)
'days.mon': 'LUN' / 'MON'
'days.tue': 'MAR' / 'TUE'
'days.wed': 'MIÉ' / 'WED'
'days.thu': 'JUE' / 'THU'
'days.fri': 'VIE' / 'FRI'
'days.sat': 'SÁB' / 'SAT'
'days.sun': 'DOM' / 'SUN'

// Month names
'months.january': 'enero' / 'January'
// ... (all 12 months)

// Confirmation
'confirm.dateTime': 'Fecha y hora' / 'Date and Time'
'confirm.at': 'a las' / 'at'

// Service info panel
'serviceInfo.viewInfo': 'Ver información del servicio' / 'View service information'
```

### Step 5: Update Routing

**Update: `src/App.tsx`**
```jsx
import BookAppointment from './pages/BookAppointment';

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/BookAppointment" element={<BookAppointment />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Step 6: Update Landing Page CTAs

**Update: `src/pages/Index.tsx`**
- Remove `BookingModal` state and component
- Change `onBookClick` to navigate to `/BookAppointment`

**Update: `src/components/Navbar.tsx`**
- Change `onBookClick` prop to use `navigate('/BookAppointment')`

**Update: `src/components/HeroSection.tsx`**
- Navigation instead of modal trigger

**Update: `src/components/WhyChooseUs.tsx`**
- Navigation instead of modal trigger

**Update: `src/components/FinalCTA.tsx`**
- Navigation instead of modal trigger

**Update: `src/components/ServicesSection.tsx`**
- `onBookService` navigates to `/BookAppointment?service={serviceId}`

### Step 7: Mock Data for Availability

**New file: `src/utils/availability.ts`**

```javascript
// Mock function to generate available weekdays for a month
export const getAvailableDays = (year: number, month: number): string[] => {
  // TODO: Replace with n8n webhook call
  // Returns dates in 'YYYY-MM-DD' format
  // Mock: all weekdays (Mon-Fri) from today onwards
};

// Mock function to get time slots for a date
export const getAvailableSlots = (date: string): string[] => {
  // TODO: Replace with n8n webhook call
  // Returns times in 'HH:mm' format (24h)
  // Mock: ['14:00', '14:30', '15:00', ...]
};
```

---

## Responsive Design

### Desktop (1024px+)
- Two-column layout: Main (70%) + Service Info Panel (30%)
- DateTimeStep: 3-column layout (info, calendar, slots)

### Tablet (768px - 1023px)
- Service Info Panel as collapsible sidebar
- DateTimeStep: Service info above, calendar and slots side by side

### Mobile (< 768px)
- Service Info Panel as expandable accordion
- DateTimeStep: Vertical stack (info -> calendar -> slots)
- Full-width stepper
- Slots appear below calendar when day selected

---

## Data Flow on Confirmation

```javascript
const appointmentData = {
  service: {
    id: string,
    name: string,
    category: string,
    duration: string,
    price: number
  },
  patient: {
    fullName: string,
    identification: string,
    phone: string
  },
  appointment: {
    date: 'YYYY-MM-DD',
    time: 'HH:mm',
    timezone: 'America/Costa_Rica'
  },
  language: 'es' | 'en',
  createdAt: ISO timestamp
};
// TODO: Send to n8n webhook
```

---

## Files to Create

1. `src/pages/BookAppointment.tsx` - Main booking page
2. `src/components/booking/BookingNavbar.tsx` - Simplified navbar
3. `src/components/booking/StepIndicator.tsx` - 4-step progress
4. `src/components/booking/ServiceInfoPanel.tsx` - Right sidebar
5. `src/components/booking/steps/ServiceStep.tsx` - Step 1
6. `src/components/booking/steps/PatientDataStep.tsx` - Step 2
7. `src/components/booking/steps/DateTimeStep.tsx` - Step 3 (Cal.com style)
8. `src/components/booking/steps/ConfirmStep.tsx` - Step 4
9. `src/components/booking/calendar/ServiceSummary.tsx` - Service info in date step
10. `src/components/booking/calendar/MonthCalendar.tsx` - Calendar component
11. `src/components/booking/calendar/TimeSlots.tsx` - Time slot picker
12. `src/utils/availability.ts` - Mock availability functions

## Files to Modify

1. `src/App.tsx` - Add route
2. `src/contexts/LanguageContext.tsx` - Add translations
3. `src/pages/Index.tsx` - Remove modal, add navigation
4. `src/components/Navbar.tsx` - Change to navigation
5. `src/components/HeroSection.tsx` - Change to navigation
6. `src/components/WhyChooseUs.tsx` - Change to navigation
7. `src/components/FinalCTA.tsx` - Change to navigation
8. `src/components/ServicesSection.tsx` - Navigate with service param

---

## Technical Details

### Calendar Implementation
- Uses `date-fns` (already installed) for date manipulation
- Locale support for Spanish/English month and day names
- Navigation between months with boundary checks (no past months)

### Time Format Toggle
- State persisted in component
- Converts 24h to 12h with AM/PM when toggled
- Display format only; internal state always 24h

### Query Parameter Handling
- Uses `useSearchParams` from react-router-dom
- On mount, reads `service` param and pre-selects matching service
- Skips to Step 2 if valid service found

### Existing Components Reused
- `ConfirmationPopup` - Success message
- `NewPatientModal` - First-time patient detection
- `FirstTimeForm` - Medical history form
- All UI components (Button, Input, Accordion, etc.)

---

## Styling Notes

- Calendar selected day: `bg-primary text-primary-foreground`
- Available day: `text-foreground hover:bg-secondary`
- Unavailable day: `text-muted-foreground/50 cursor-not-allowed`
- Time slot: `border border-border hover:border-primary`
- Selected slot: `bg-primary text-primary-foreground`
- Green availability indicator: `bg-green-500 rounded-full w-2 h-2`
- Right panel background: `bg-blush` or `bg-cream`
