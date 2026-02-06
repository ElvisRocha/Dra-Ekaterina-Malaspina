

# Plan: Estandarizar Hover de Botones en /contacto

## Analisis

Se identificaron 3 botones en la pagina:

| Boton | Clase/Variant | Hover Actual |
|-------|---------------|--------------|
| Enviar Mensaje | `btn-gradient` | Degradado coral-fuchsia con elevacion |
| Chatear por WhatsApp | `btn-gradient` | Degradado coral-fuchsia con elevacion |
| Como Llegar | `variant="outline"` | `bg-accent` (coral) - diferente |

El boton "Como Llegar" usa el variant outline estandar que tiene un hover diferente al estilo corporativo.

---

## Solucion

Aplicar la clase `btn-outline-gradient` al boton "Como Llegar" para que tenga un hover consistente con el estilo corporativo pero manteniendo su apariencia outline.

Sin embargo, primero debo verificar si existe esta clase en el CSS. Segun el archivo `src/index.css`, solo existe `btn-gradient` pero NO `btn-outline-gradient`.

### Opcion A: Crear clase `btn-outline-gradient`

Agregar una nueva clase CSS que mantenga el estilo outline pero active el degradado en hover:

```css
/* src/index.css - agregar despues de btn-gradient */
.btn-outline-gradient {
  @apply relative overflow-hidden font-medium px-8 py-4 rounded-full transition-all duration-300;
  @apply border-2 border-primary text-primary bg-transparent;
}

.btn-outline-gradient:hover {
  @apply text-white border-transparent;
  transform: translateY(-2px);
  background: var(--gradient-cta);
  box-shadow: var(--shadow-soft);
}

.btn-outline-gradient > * {
  @apply relative z-10;
}
```

### Opcion B: Cambiar a btn-gradient directamente

Cambiar el boton "Como Llegar" para usar `btn-gradient` como los otros dos botones principales.

---

## Recomendacion

**Opcion A** es preferible porque:
- Mantiene la jerarquia visual (botones outline son secundarios)
- El boton "Como Llegar" es menos importante que "Enviar Mensaje" o "WhatsApp"
- Pero al hacer hover, activa el mismo degradado corporativo

---

## Cambios a Realizar

### 1. Archivo: `src/index.css`

Agregar despues de la linea 180 (despues de `.btn-gradient span`):

```css
/* Outline button with gradient hover */
.btn-outline-gradient {
  @apply relative overflow-hidden font-medium px-8 py-4 rounded-full transition-all duration-300;
  @apply border-2 border-primary text-primary bg-transparent;
}

.btn-outline-gradient:hover {
  @apply text-white border-transparent;
  transform: translateY(-2px);
  background: var(--gradient-cta);
  box-shadow: var(--shadow-soft);
}

.btn-outline-gradient > * {
  @apply relative z-10;
}
```

### 2. Archivo: `src/pages/Contact.tsx`

Modificar el boton "Como Llegar" (lineas 327-337):

```tsx
// Antes
<Button 
  variant="outline"
  className="rounded-full"
  onClick={...}
>

// Despues - remover variant y usar clase personalizada
<Button 
  className="h-12 btn-outline-gradient"
  onClick={...}
>
```

---

## Resultado Final

| Boton | Estado Normal | Estado Hover |
|-------|---------------|--------------|
| Enviar Mensaje | Degradado magenta-fuchsia | Degradado coral-fuchsia + elevacion |
| Chatear por WhatsApp | Degradado magenta-fuchsia | Degradado coral-fuchsia + elevacion |
| Como Llegar | Borde primario, fondo transparente | Degradado coral-fuchsia + elevacion |

Todos los botones tendran el mismo efecto hover de degradado corporativo, manteniendo la consistencia visual de la pagina.

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/index.css` | Agregar clase `btn-outline-gradient` |
| `src/pages/Contact.tsx` | Actualizar boton "Como Llegar" |

