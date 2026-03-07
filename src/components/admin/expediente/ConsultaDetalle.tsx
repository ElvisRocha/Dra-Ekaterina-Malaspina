import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Pencil, Stethoscope, Heart, ClipboardList, Pill } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Consulta = Tables<'consultas'>;

interface Props {
  consulta: Consulta;
  onBack: () => void;
  onEdit: () => void;
}

const ConsultaDetalle = ({ consulta, onBack, onEdit }: Props) => {
  const signos = consulta.signos_vitales && typeof consulta.signos_vitales === 'object'
    ? consulta.signos_vitales as Record<string, string>
    : null;

  const examen = consulta.examen_fisico && typeof consulta.examen_fisico === 'object'
    ? (consulta.examen_fisico as any).descripcion || null
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="font-display text-lg text-foreground">
              Consulta — {consulta.fecha ? format(new Date(consulta.fecha), "dd MMMM yyyy · HH:mm", { locale: es }) : 'Sin fecha'}
            </h3>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Motivo y enfermedad */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" /> Motivo de Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Motivo</p>
              <p className="text-foreground">{consulta.motivo_consulta || '—'}</p>
            </div>
            {consulta.enfermedad_actual && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Enfermedad actual</p>
                <p className="text-foreground whitespace-pre-wrap">{consulta.enfermedad_actual}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signos vitales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent" /> Signos Vitales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signos && Object.keys(signos).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {signos.presion_arterial && <Stat label="PA" value={signos.presion_arterial} />}
                {signos.frecuencia_cardiaca && <Stat label="FC" value={`${signos.frecuencia_cardiaca} lpm`} />}
                {signos.frecuencia_respiratoria && <Stat label="FR" value={`${signos.frecuencia_respiratoria} rpm`} />}
                {signos.temperatura && <Stat label="Temp" value={`${signos.temperatura} °C`} />}
                {signos.peso && <Stat label="Peso" value={`${signos.peso} kg`} />}
                {signos.talla && <Stat label="Talla" value={`${signos.talla} cm`} />}
                {signos.saturacion && <Stat label="SpO₂" value={`${signos.saturacion}%`} />}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No registrados.</p>
            )}
          </CardContent>
        </Card>

        {/* Examen físico */}
        {examen && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" /> Examen Físico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap">{examen}</p>
            </CardContent>
          </Card>
        )}

        {/* Diagnóstico y plan */}
        <Card className={examen ? '' : 'lg:col-span-2'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Pill className="h-4 w-4 text-accent" /> Diagnóstico y Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Diagnóstico</p>
              <p className="text-foreground">{consulta.diagnostico || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Plan de tratamiento</p>
              <p className="text-foreground whitespace-pre-wrap">{consulta.plan_tratamiento || '—'}</p>
            </div>
            {consulta.notas && (
              <div className="border-t border-border pt-2">
                <p className="text-muted-foreground text-xs mb-1">Notas</p>
                <p className="text-foreground whitespace-pre-wrap">{consulta.notas}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

export default ConsultaDetalle;
