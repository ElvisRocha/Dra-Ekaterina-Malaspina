

# Plan: Agregar Texto de Ayuda Debajo del Textarea

## Resumen

Agregar un parrafo sutil debajo del campo "Mensaje" y antes del boton "Enviar Mensaje" en el formulario de contacto, con soporte para ambos idiomas.

---

## Cambio a Realizar

**Archivo:** `src/pages/Contact.tsx`

**Ubicacion:** Entre el cierre del `</div>` del textarea (linea 177) y el `<Button>` (linea 179).

**Codigo a agregar:**

```tsx
// Despues de la linea 177 (cierre del div del textarea)
<p className="text-sm text-muted-foreground">
  {language === 'es' 
    ? 'Te contactaremos lo antes posible' 
    : 'We will contact you as soon as possible'}
</p>
```

---

## Estructura Resultante

```tsx
<div className="space-y-2">
  <Label htmlFor="message">
    {language === 'es' ? 'Mensaje' : 'Message'} *
  </Label>
  <Textarea
    id="message"
    ...
  />
</div>

{/* NUEVO: Texto de ayuda */}
<p className="text-sm text-muted-foreground">
  {language === 'es' 
    ? 'Te contactaremos lo antes posible' 
    : 'We will contact you as soon as possible'}
</p>

<Button type="submit" ...>
  ...
</Button>
```

---

## Estilos Aplicados

| Clase | Efecto |
|-------|--------|
| `text-sm` | Texto pequeño (14px) |
| `text-muted-foreground` | Color gris suave del tema (variable CSS) |

El texto heredara el espaciado del `space-y-5` del formulario, manteniendo consistencia visual.

---

## Archivo Modificado

- `src/pages/Contact.tsx` (1 elemento `<p>` nuevo)

