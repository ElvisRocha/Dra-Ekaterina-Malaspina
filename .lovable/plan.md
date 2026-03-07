

# Iteración 1: Schema DB + Auth + Login + ProtectedRoute + AdminLayout

## Bug fix previo

`BookingModal.tsx` usa `fullName` pero `FirstTimeForm` espera `firstName` + `lastName`. Hay que:
- Cambiar el state `formData` de `fullName` a `firstName` + `lastName` (dos campos separados)
- Actualizar el formulario UI para tener dos inputs
- Pasar `firstName`/`lastName` al `initialData` de `FirstTimeForm`
- Agregar campos faltantes: `email: ''`, `contactId: ''`

---

## 1. Schema de Base de Datos (SQL Migration)

### Enum de roles
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'doctora', 'secretaria');
```

### Tabla `user_roles`
```sql
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
```

### Función `has_role` (SECURITY DEFINER)
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
```

### Tabla `profiles`
```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellido text NOT NULL,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);
```

### Trigger auto-create profile
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre',''), COALESCE(NEW.raw_user_meta_data->>'apellido',''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Tabla `pacientes`
```sql
CREATE TABLE public.pacientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_identificacion text NOT NULL DEFAULT 'cedula',
  numero_identificacion text NOT NULL,
  primer_nombre text NOT NULL,
  segundo_nombre text,
  primer_apellido text NOT NULL,
  segundo_apellido text,
  fecha_nacimiento date,
  sexo text DEFAULT 'F',
  estado_civil text,
  nacionalidad text DEFAULT 'Costa Rica',
  telefono text,
  email text,
  direccion text,
  ocupacion text,
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  contacto_emergencia_parentesco text,
  ghl_contact_id text,
  notas text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Tabla `expediente_master`
```sql
CREATE TABLE public.expediente_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  -- Antecedentes patológicos
  alergias text,
  enfermedades_cronicas text,
  cirugias_previas text,
  medicamentos_actuales text,
  -- Hábitos
  tabaco boolean DEFAULT false,
  alcohol boolean DEFAULT false,
  drogas boolean DEFAULT false,
  ejercicio text,
  -- Antecedentes familiares
  antecedentes_familiares text,
  -- Ginecológico
  menarca integer,
  ciclo_regular boolean,
  duracion_ciclo integer,
  fur date,
  metodo_anticonceptivo text,
  vida_sexual_activa boolean,
  num_parejas_sexuales integer,
  its_previas text,
  -- Obstétrico
  gestas integer DEFAULT 0,
  partos integer DEFAULT 0,
  cesareas integer DEFAULT 0,
  abortos integer DEFAULT 0,
  ectopicos integer DEFAULT 0,
  hijos_vivos integer DEFAULT 0,
  -- Citología
  ultimo_papanicolaou date,
  resultado_papanicolaou text,
  vph_positivo boolean DEFAULT false,
  -- Menopausia
  menopausia boolean DEFAULT false,
  edad_menopausia integer,
  terapia_hormonal boolean DEFAULT false,
  -- Estado
  embarazada boolean DEFAULT false,
  control_prenatal_activo boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);
```

### Tabla `consultas`
```sql
CREATE TABLE public.consultas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  fecha timestamptz DEFAULT now(),
  motivo_consulta text,
  enfermedad_actual text,
  examen_fisico jsonb DEFAULT '{}'::jsonb,
  signos_vitales jsonb DEFAULT '{}'::jsonb,
  diagnostico text,
  plan_tratamiento text,
  notas text,
  dibujos jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
```

### Tabla `control_prenatal`
```sql
CREATE TABLE public.control_prenatal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL,
  embarazo_numero integer DEFAULT 1,
  fur date,
  fpp date,
  fecha_control timestamptz DEFAULT now(),
  semanas_gestacion numeric(4,1),
  peso numeric(5,2),
  presion_arterial text,
  altura_uterina numeric(4,1),
  fcf integer,
  movimientos_fetales boolean,
  edema text,
  presentacion text,
  observaciones text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

### Tabla `citas`
```sql
CREATE TABLE public.citas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid REFERENCES public.pacientes(id) ON DELETE CASCADE,
  tipo_cita text NOT NULL,
  fecha_hora timestamptz NOT NULL,
  duracion_minutos integer DEFAULT 30,
  estado text DEFAULT 'programada',
  notas text,
  ghl_appointment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### RLS Policies
- **profiles**: users read own; admin/doctora read all
- **user_roles**: only readable by admin via `has_role()`
- **pacientes**: admin/doctora full access; secretaria SELECT/INSERT/UPDATE
- **expediente_master, consultas, control_prenatal**: admin/doctora only
- **citas**: admin/doctora/secretaria full access

---

## 2. Archivos nuevos a crear

| Archivo | Descripción |
|---------|-------------|
| `src/hooks/useAuth.ts` | Hook: sesión, perfil, rol, login, logout |
| `src/components/admin/ProtectedRoute.tsx` | Wrapper: verifica auth + rol, redirige a login |
| `src/pages/admin/AdminLogin.tsx` | Login email+password, branding clínica |
| `src/components/admin/AdminLayout.tsx` | SidebarProvider + Sidebar + main content |
| `src/components/admin/AdminSidebar.tsx` | Navegación: Dashboard, Pacientes, Calendario, Config |
| `src/pages/admin/AdminDashboard.tsx` | Placeholder dashboard con tarjetas vacías |

## 3. Cambios en archivos existentes

| Archivo | Cambio |
|---------|--------|
| `src/App.tsx` | Agregar rutas `/admin/*` |
| `src/components/BookingModal.tsx` | Fix `fullName` → `firstName`/`lastName` |

## 4. Flujo de Auth

1. `useAuth` usa `onAuthStateChange` (antes de `getSession`)
2. Al autenticarse, consulta `profiles` + `user_roles` para obtener rol
3. `ProtectedRoute` acepta prop `allowedRoles` y renderiza children o redirige
4. Login solo email+password, sin registro público
5. Usuarios se crean manualmente desde Supabase dashboard

## 5. Diseño del Login

- Fondo gradiente coral → magenta (consistente con branding)
- Logo de la clínica centrado
- Card con formulario email + contraseña
- Botón primario con colores de la marca
- Sin opción de registro (solo admin crea cuentas)

## 6. AdminLayout

- Usa `SidebarProvider` de shadcn
- Sidebar con `collapsible="icon"`
- Items: Dashboard (LayoutDashboard), Pacientes (Users), Calendario (Calendar), Configuración (Settings)
- Header con SidebarTrigger + nombre usuario + RoleBadge + logout
- `<Outlet />` para contenido de rutas hijas

