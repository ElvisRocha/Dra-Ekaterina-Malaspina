import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Consulta = Tables<'consultas'>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteId: string;
  consulta?: Consulta | null;
  onSuccess: () => void;
}

interface SignosVitales {
  presion_arterial?: string;
  frecuencia_cardiaca?: string;
  frecuencia_respiratoria?: string;
  temperatura?: string;
  peso?: string;
  talla?: string;
  saturacion?: string;
}

const emptyForm = {
  motivo_consulta: '',
  enfermedad_actual: '',
  diagnostico: '',
  plan_tratamiento: '',
  notas: '',
};

const emptySignos: SignosVitales = {
  presion_arterial: '',
  frecuencia_cardiaca: '',
  frecuencia_respiratoria: '',
  temperatura: '',
  peso: '',
  talla: '',
  saturacion: '',
};

const ConsultaFormModal = ({ open, onOpenChange, pacienteId, consulta, onSuccess }: Props) => {
  const { user } = useAuth();
  const isEdit = !!consulta;

  const [form, setForm] = useState(() =>
    consulta
      ? {
          motivo_consulta: consulta.motivo_consulta || '',
          enfermedad_actual: consulta.enfermedad_actual || '',
          diagnostico: consulta.diagnostico || '',
          plan_tratamiento: consulta.plan_tratamiento || '',
          notas: consulta.notas || '',
        }
      : { ...emptyForm }
  );

  const [signos, setSignos] = useState<SignosVitales>(() =>
    consulta?.signos_vitales && typeof consulta.signos_vitales === 'object'
      ? { ...emptySignos, ...(consulta.signos_vitales as SignosVitales) }
      : { ...emptySignos }
  );

  const [examenFisico, setExamenFisico] = useState(
    consulta?.examen_fisico && typeof consulta.examen_fisico === 'object'
      ? JSON.stringify(consulta.examen_fisico) === '{}'
        ? ''
        : (consulta.examen_fisico as any).descripcion || ''
      : ''
  );

  const [saving, setSaving] = useState(false);

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateSignos = (field: string, value: string) =>
    setSignos((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.motivo_consulta.trim()) {
      toast({ title: 'El motivo de consulta es obligatorio', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        paciente_id: pacienteId,
        motivo_consulta: form.motivo_consulta.trim() || null,
        enfermedad_actual: form.enfermedad_actual.trim() || null,
        diagnostico: form.diagnostico.trim() || null,
        plan_tratamiento: form.plan_tratamiento.trim() || null,
        notas: form.notas.trim() || null,
        signos_vitales: Object.fromEntries(
          Object.entries(signos).filter(([, v]) => v && v.trim())
        ),
        examen_fisico: examenFisico.trim()
          ? { descripcion: examenFisico.trim() }
          : {},
        created_by: user?.id || null,
      };

      if (isEdit && consulta) {
        const { error } = await supabase
          .from('consultas')
          .update(payload)
          .eq('id', consulta.id);
        if (error) throw error;
        toast({ title: 'Consulta actualizada ✓' });
      } else {
        const { error } = await supabase.from('consultas').insert(payload);
        if (error) throw error;
        toast({ title: 'Consulta registrada ✓' });
      }

      onSuccess();
    } catch (err: any) {
      toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Reset form when consulta changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (!isEdit) {
        setForm({ ...emptyForm });
        setSignos({ ...emptySignos });
        setExamenFisico('');
      }
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? 'Editar Consulta' : 'Nueva Consulta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Motivo y enfermedad actual */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">
              Motivo de Consulta
            </legend>
            <div>
              <Label>Motivo de consulta *</Label>
              <Textarea
                value={form.motivo_consulta}
                onChange={(e) => updateForm('motivo_consulta', e.target.value)}
                rows={2}
                placeholder="¿Por qué acude la paciente?"
              />
            </div>
            <div>
              <Label>Enfermedad actual</Label>
              <Textarea
                value={form.enfermedad_actual}
                onChange={(e) => updateForm('enfermedad_actual', e.target.value)}
                rows={3}
                placeholder="Descripción detallada de la enfermedad actual..."
              />
            </div>
          </fieldset>

          {/* Signos vitales */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">
              Signos Vitales
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Presión arterial</Label>
                <Input
                  value={signos.presion_arterial || ''}
                  onChange={(e) => updateSignos('presion_arterial', e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div>
                <Label className="text-xs">FC (lpm)</Label>
                <Input
                  value={signos.frecuencia_cardiaca || ''}
                  onChange={(e) => updateSignos('frecuencia_cardiaca', e.target.value)}
                  placeholder="72"
                />
              </div>
              <div>
                <Label className="text-xs">FR (rpm)</Label>
                <Input
                  value={signos.frecuencia_respiratoria || ''}
                  onChange={(e) => updateSignos('frecuencia_respiratoria', e.target.value)}
                  placeholder="18"
                />
              </div>
              <div>
                <Label className="text-xs">Temp. (°C)</Label>
                <Input
                  value={signos.temperatura || ''}
                  onChange={(e) => updateSignos('temperatura', e.target.value)}
                  placeholder="36.5"
                />
              </div>
              <div>
                <Label className="text-xs">Peso (kg)</Label>
                <Input
                  value={signos.peso || ''}
                  onChange={(e) => updateSignos('peso', e.target.value)}
                  placeholder="65"
                />
              </div>
              <div>
                <Label className="text-xs">Talla (cm)</Label>
                <Input
                  value={signos.talla || ''}
                  onChange={(e) => updateSignos('talla', e.target.value)}
                  placeholder="165"
                />
              </div>
              <div>
                <Label className="text-xs">SpO₂ (%)</Label>
                <Input
                  value={signos.saturacion || ''}
                  onChange={(e) => updateSignos('saturacion', e.target.value)}
                  placeholder="98"
                />
              </div>
            </div>
          </fieldset>

          {/* Examen físico */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">
              Examen Físico
            </legend>
            <Textarea
              value={examenFisico}
              onChange={(e) => setExamenFisico(e.target.value)}
              rows={4}
              placeholder="Hallazgos del examen físico..."
            />
          </fieldset>

          {/* Diagnóstico y plan */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">
              Diagnóstico y Plan
            </legend>
            <div>
              <Label>Diagnóstico</Label>
              <Textarea
                value={form.diagnostico}
                onChange={(e) => updateForm('diagnostico', e.target.value)}
                rows={2}
                placeholder="Diagnóstico presuntivo o definitivo..."
              />
            </div>
            <div>
              <Label>Plan de tratamiento</Label>
              <Textarea
                value={form.plan_tratamiento}
                onChange={(e) => updateForm('plan_tratamiento', e.target.value)}
                rows={3}
                placeholder="Indicaciones, medicamentos, estudios solicitados..."
              />
            </div>
          </fieldset>

          {/* Notas */}
          <div>
            <Label>Notas adicionales</Label>
            <Textarea
              value={form.notas}
              onChange={(e) => updateForm('notas', e.target.value)}
              rows={2}
              placeholder="Observaciones..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-gradient" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Actualizar consulta' : 'Guardar consulta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultaFormModal;
