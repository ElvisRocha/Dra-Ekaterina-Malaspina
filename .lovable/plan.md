

## Adaptar la foto de Ekaterina al circulo en "Acerca de Mi"

Actualmente la imagen se muestra con `h-40 w-auto` dentro de un contenedor circular con borde punteado, lo que hace que no llene el circulo y no se vea profesional.

### Cambios en `src/pages/AboutMe.tsx`

1. **Hacer que la imagen llene completamente el circulo**: Reemplazar las clases de la imagen para usar `object-cover` y llenar todo el contenedor circular.

2. **Eliminar el borde punteado placeholder**: Cambiar el estilo del contenedor de "placeholder" a un contenedor profesional con sombra y overflow hidden.

**Cambio concreto en el contenedor del hero:**

- Contenedor circular: Remover `bg-secondary/30 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center` y usar `overflow-hidden shadow-lg border-4 border-white`.
- Imagen: Cambiar `h-40 w-auto mb-1` a `w-full h-full object-cover` para que llene todo el circulo.

El resultado sera una foto circular profesional con sombra suave, sin bordes punteados.

