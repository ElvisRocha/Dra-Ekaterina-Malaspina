
# Plan: Unificar Estilos de Botones en /BookAppointment

## Resumen

Aplicar los mismos estilos visuales de los botones de /contacto a todos los botones del flujo de agendamiento para mantener consistencia visual.

---

## Diferencias Actuales

| Elemento | /contacto | /BookAppointment |
|----------|-----------|------------------|
| Altura | `h-12` (48px) | `size="lg"` (44px) |
| Bordes | `rounded-full` | `rounded-md` (default) |
| Botones primarios | `btn-gradient rounded-full` | `btn-gradient` |
| Botones secundarios | N/A | `variant="outline"` sin rounded-full |

---

## Cambios a Realizar

### 1. ServiceStep.tsx (Lineas 122-129)

**Boton "Siguiente":**
```tsx
// Antes
<Button
  onClick={onNext}
  disabled={!selectedService}
  className="w-full btn-gradient"
  size="lg"
>

// Despues
<Button
  onClick={onNext}
  disabled={!selectedService}
  className="w-full h-12 btn-gradient rounded-full"
>
```

---

### 2. PatientDataStep.tsx (Lineas 87-102)

**Boton "Atras":**
```tsx
// Antes
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1"
  size="lg"
>

// Despues
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full"
>
```

**Boton "Siguiente":**
```tsx
// Antes
<Button
  onClick={onNext}
  disabled={!isValid}
  className="flex-1 btn-gradient"
  size="lg"
>

// Despues
<Button
  onClick={onNext}
  disabled={!isValid}
  className="flex-1 h-12 btn-gradient rounded-full"
>
```

---

### 3. DateTimeStep.tsx (Lineas 109-124)

**Boton "Atras":**
```tsx
// Antes
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1"
  size="lg"
>

// Despues
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full"
>
```

**Boton "Siguiente":**
```tsx
// Antes
<Button
  onClick={onNext}
  disabled={!isValid}
  className="flex-1 btn-gradient"
  size="lg"
>

// Despues
<Button
  onClick={onNext}
  disabled={!isValid}
  className="flex-1 h-12 btn-gradient rounded-full"
>
```

---

### 4. ConfirmStep.tsx (Lineas 133-156)

**Boton "Atras":**
```tsx
// Antes
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1"
  size="lg"
  disabled={isLoading}
>

// Despues
<Button
  variant="outline"
  onClick={onBack}
  className="flex-1 h-12 rounded-full"
  disabled={isLoading}
>
```

**Boton "Confirmar":**
```tsx
// Antes
<Button
  onClick={onConfirm}
  className="flex-1 btn-gradient"
  size="lg"
  disabled={isLoading}
>

// Despues
<Button
  onClick={onConfirm}
  className="flex-1 h-12 btn-gradient rounded-full"
  disabled={isLoading}
>
```

---

## Resumen de Cambios

| Archivo | Botones Modificados |
|---------|---------------------|
| ServiceStep.tsx | 1 (Siguiente) |
| PatientDataStep.tsx | 2 (Atras, Siguiente) |
| DateTimeStep.tsx | 2 (Atras, Siguiente) |
| ConfirmStep.tsx | 2 (Atras, Confirmar) |
| **Total** | **7 botones** |

---

## Resultado Visual

- Todos los botones tendran altura uniforme de 48px (`h-12`)
- Bordes completamente redondeados (`rounded-full`)
- Botones primarios mantienen el efecto gradient con hover animado
- Botones secundarios (outline) tendran el mismo estilo de borde redondeado
