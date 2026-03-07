export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      citas: {
        Row: {
          created_at: string | null
          duracion_minutos: number | null
          estado: string | null
          fecha_hora: string
          ghl_appointment_id: string | null
          id: string
          notas: string | null
          paciente_id: string | null
          tipo_cita: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duracion_minutos?: number | null
          estado?: string | null
          fecha_hora: string
          ghl_appointment_id?: string | null
          id?: string
          notas?: string | null
          paciente_id?: string | null
          tipo_cita: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duracion_minutos?: number | null
          estado?: string | null
          fecha_hora?: string
          ghl_appointment_id?: string | null
          id?: string
          notas?: string | null
          paciente_id?: string | null
          tipo_cita?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas: {
        Row: {
          created_at: string | null
          created_by: string | null
          diagnostico: string | null
          dibujos: Json | null
          enfermedad_actual: string | null
          examen_fisico: Json | null
          fecha: string | null
          id: string
          motivo_consulta: string | null
          notas: string | null
          paciente_id: string
          plan_tratamiento: string | null
          signos_vitales: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          diagnostico?: string | null
          dibujos?: Json | null
          enfermedad_actual?: string | null
          examen_fisico?: Json | null
          fecha?: string | null
          id?: string
          motivo_consulta?: string | null
          notas?: string | null
          paciente_id: string
          plan_tratamiento?: string | null
          signos_vitales?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          diagnostico?: string | null
          dibujos?: Json | null
          enfermedad_actual?: string | null
          examen_fisico?: Json | null
          fecha?: string | null
          id?: string
          motivo_consulta?: string | null
          notas?: string | null
          paciente_id?: string
          plan_tratamiento?: string | null
          signos_vitales?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      control_prenatal: {
        Row: {
          activo: boolean | null
          altura_uterina: number | null
          created_at: string | null
          edema: string | null
          embarazo_numero: number | null
          fcf: number | null
          fecha_control: string | null
          fpp: string | null
          fur: string | null
          id: string
          movimientos_fetales: boolean | null
          observaciones: string | null
          paciente_id: string
          peso: number | null
          presentacion: string | null
          presion_arterial: string | null
          semanas_gestacion: number | null
        }
        Insert: {
          activo?: boolean | null
          altura_uterina?: number | null
          created_at?: string | null
          edema?: string | null
          embarazo_numero?: number | null
          fcf?: number | null
          fecha_control?: string | null
          fpp?: string | null
          fur?: string | null
          id?: string
          movimientos_fetales?: boolean | null
          observaciones?: string | null
          paciente_id: string
          peso?: number | null
          presentacion?: string | null
          presion_arterial?: string | null
          semanas_gestacion?: number | null
        }
        Update: {
          activo?: boolean | null
          altura_uterina?: number | null
          created_at?: string | null
          edema?: string | null
          embarazo_numero?: number | null
          fcf?: number | null
          fecha_control?: string | null
          fpp?: string | null
          fur?: string | null
          id?: string
          movimientos_fetales?: boolean | null
          observaciones?: string | null
          paciente_id?: string
          peso?: number | null
          presentacion?: string | null
          presion_arterial?: string | null
          semanas_gestacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "control_prenatal_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      expediente_master: {
        Row: {
          abortos: number | null
          alcohol: boolean | null
          alergias: string | null
          antecedentes_familiares: string | null
          cesareas: number | null
          ciclo_regular: boolean | null
          cirugias_previas: string | null
          control_prenatal_activo: boolean | null
          drogas: boolean | null
          duracion_ciclo: number | null
          ectopicos: number | null
          edad_menopausia: number | null
          ejercicio: string | null
          embarazada: boolean | null
          enfermedades_cronicas: string | null
          fur: string | null
          gestas: number | null
          hijos_vivos: number | null
          id: string
          its_previas: string | null
          medicamentos_actuales: string | null
          menarca: number | null
          menopausia: boolean | null
          metodo_anticonceptivo: string | null
          num_parejas_sexuales: number | null
          paciente_id: string
          partos: number | null
          resultado_papanicolaou: string | null
          tabaco: boolean | null
          terapia_hormonal: boolean | null
          ultimo_papanicolaou: string | null
          updated_at: string | null
          vida_sexual_activa: boolean | null
          vph_positivo: boolean | null
        }
        Insert: {
          abortos?: number | null
          alcohol?: boolean | null
          alergias?: string | null
          antecedentes_familiares?: string | null
          cesareas?: number | null
          ciclo_regular?: boolean | null
          cirugias_previas?: string | null
          control_prenatal_activo?: boolean | null
          drogas?: boolean | null
          duracion_ciclo?: number | null
          ectopicos?: number | null
          edad_menopausia?: number | null
          ejercicio?: string | null
          embarazada?: boolean | null
          enfermedades_cronicas?: string | null
          fur?: string | null
          gestas?: number | null
          hijos_vivos?: number | null
          id?: string
          its_previas?: string | null
          medicamentos_actuales?: string | null
          menarca?: number | null
          menopausia?: boolean | null
          metodo_anticonceptivo?: string | null
          num_parejas_sexuales?: number | null
          paciente_id: string
          partos?: number | null
          resultado_papanicolaou?: string | null
          tabaco?: boolean | null
          terapia_hormonal?: boolean | null
          ultimo_papanicolaou?: string | null
          updated_at?: string | null
          vida_sexual_activa?: boolean | null
          vph_positivo?: boolean | null
        }
        Update: {
          abortos?: number | null
          alcohol?: boolean | null
          alergias?: string | null
          antecedentes_familiares?: string | null
          cesareas?: number | null
          ciclo_regular?: boolean | null
          cirugias_previas?: string | null
          control_prenatal_activo?: boolean | null
          drogas?: boolean | null
          duracion_ciclo?: number | null
          ectopicos?: number | null
          edad_menopausia?: number | null
          ejercicio?: string | null
          embarazada?: boolean | null
          enfermedades_cronicas?: string | null
          fur?: string | null
          gestas?: number | null
          hijos_vivos?: number | null
          id?: string
          its_previas?: string | null
          medicamentos_actuales?: string | null
          menarca?: number | null
          menopausia?: boolean | null
          metodo_anticonceptivo?: string | null
          num_parejas_sexuales?: number | null
          paciente_id?: string
          partos?: number | null
          resultado_papanicolaou?: string | null
          tabaco?: boolean | null
          terapia_hormonal?: boolean | null
          ultimo_papanicolaou?: string | null
          updated_at?: string | null
          vida_sexual_activa?: boolean | null
          vph_positivo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "expediente_master_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: true
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          activo: boolean | null
          contacto_emergencia_nombre: string | null
          contacto_emergencia_parentesco: string | null
          contacto_emergencia_telefono: string | null
          created_at: string | null
          direccion: string | null
          email: string | null
          estado_civil: string | null
          fecha_nacimiento: string | null
          ghl_contact_id: string | null
          id: string
          nacionalidad: string | null
          notas: string | null
          numero_identificacion: string
          ocupacion: string | null
          primer_apellido: string
          primer_nombre: string
          segundo_apellido: string | null
          segundo_nombre: string | null
          sexo: string | null
          telefono: string | null
          tipo_identificacion: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          contacto_emergencia_nombre?: string | null
          contacto_emergencia_parentesco?: string | null
          contacto_emergencia_telefono?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          estado_civil?: string | null
          fecha_nacimiento?: string | null
          ghl_contact_id?: string | null
          id?: string
          nacionalidad?: string | null
          notas?: string | null
          numero_identificacion: string
          ocupacion?: string | null
          primer_apellido: string
          primer_nombre: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          sexo?: string | null
          telefono?: string | null
          tipo_identificacion?: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          contacto_emergencia_nombre?: string | null
          contacto_emergencia_parentesco?: string | null
          contacto_emergencia_telefono?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          estado_civil?: string | null
          fecha_nacimiento?: string | null
          ghl_contact_id?: string | null
          id?: string
          nacionalidad?: string | null
          notas?: string | null
          numero_identificacion?: string
          ocupacion?: string | null
          primer_apellido?: string
          primer_nombre?: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          sexo?: string | null
          telefono?: string | null
          tipo_identificacion?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          apellido: string
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          nombre: string
        }
        Insert: {
          apellido?: string
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          nombre?: string
        }
        Update: {
          apellido?: string
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctora" | "secretaria"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "doctora", "secretaria"],
    },
  },
} as const
