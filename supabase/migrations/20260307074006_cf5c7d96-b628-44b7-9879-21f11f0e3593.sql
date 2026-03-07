
-- Enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'doctora', 'secretaria');

-- Tabla user_roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Función has_role (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- RLS user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Tabla profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL DEFAULT '',
  apellido text NOT NULL DEFAULT '',
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admin/doctora read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctora'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Trigger auto-create profile
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

-- Tabla pacientes
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

ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/doctora full access pacientes" ON public.pacientes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctora'));
CREATE POLICY "Secretaria read pacientes" ON public.pacientes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'secretaria'));
CREATE POLICY "Secretaria insert pacientes" ON public.pacientes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'secretaria'));
CREATE POLICY "Secretaria update pacientes" ON public.pacientes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'secretaria'));

-- Tabla expediente_master
CREATE TABLE public.expediente_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id uuid REFERENCES public.pacientes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  alergias text,
  enfermedades_cronicas text,
  cirugias_previas text,
  medicamentos_actuales text,
  tabaco boolean DEFAULT false,
  alcohol boolean DEFAULT false,
  drogas boolean DEFAULT false,
  ejercicio text,
  antecedentes_familiares text,
  menarca integer,
  ciclo_regular boolean,
  duracion_ciclo integer,
  fur date,
  metodo_anticonceptivo text,
  vida_sexual_activa boolean,
  num_parejas_sexuales integer,
  its_previas text,
  gestas integer DEFAULT 0,
  partos integer DEFAULT 0,
  cesareas integer DEFAULT 0,
  abortos integer DEFAULT 0,
  ectopicos integer DEFAULT 0,
  hijos_vivos integer DEFAULT 0,
  ultimo_papanicolaou date,
  resultado_papanicolaou text,
  vph_positivo boolean DEFAULT false,
  menopausia boolean DEFAULT false,
  edad_menopausia integer,
  terapia_hormonal boolean DEFAULT false,
  embarazada boolean DEFAULT false,
  control_prenatal_activo boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.expediente_master ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/doctora full access expediente" ON public.expediente_master FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctora'));

-- Tabla consultas
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

ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/doctora full access consultas" ON public.consultas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctora'));

-- Tabla control_prenatal
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

ALTER TABLE public.control_prenatal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/doctora full access control_prenatal" ON public.control_prenatal FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctora'));

-- Tabla citas
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

ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/doctora full access citas" ON public.citas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctora'));
CREATE POLICY "Secretaria full access citas" ON public.citas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'secretaria'));
