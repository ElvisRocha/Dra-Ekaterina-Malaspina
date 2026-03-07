import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Plus, Pencil } from 'lucide-react';
import ConsultaFormModal from './ConsultaFormModal';
import ConsultaDetalle from './ConsultaDetalle';
import type { Tables } from '@/integrations/supabase/types';

type Consulta = Tables<'consultas'>;

interface Props {
  pacienteId: string;
}

const ExpedienteConsultas = ({ pacienteId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editConsulta, setEditConsulta] = useState<Consulta | null>(null);
  const [viewConsulta, setViewConsulta] = useState<Consulta | null>(null);

  const { data: consultas, isLoading } = useQuery({
    queryKey: ['consultas', pacienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultas')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    setShowForm(false);
    setEditConsulta(null);
    queryClient.invalidateQueries({ queryKey: ['consultas', pacienteId] });
    queryClient.invalidateQueries({ queryKey: ['paciente_stats', pacienteId] });
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;

  // Viewing a single consulta
  if (viewConsulta) {
    return (
      <ConsultaDetalle
        consulta={viewConsulta}
        onBack={() => setViewConsulta(null)}
        onEdit={() => {
          setEditConsulta(viewConsulta);
          setViewConsulta(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Nueva consulta
        </Button>
      </div>

      {!consultas?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay consultas registradas.</p>
            <p className="text-xs mt-1">Haz clic en "Nueva consulta" para agregar la primera.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {consultas.map((c) => {
            const signos = c.signos_vitales && typeof c.signos_vitales === 'object'
              ? c.signos_vitales as Record<string, string>
              : null;

            return (
              <Card
                key={c.id}
                className="cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => setViewConsulta(c)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {c.fecha ? format(new Date(c.fecha), "dd MMM yyyy · HH:mm", { locale: es }) : 'Sin fecha'}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {c.diagnostico && (
                        <Badge variant="secondary" className="text-xs">{c.diagnostico}</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditConsulta(c);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  {c.motivo_consulta && (
                    <p><strong className="text-foreground">Motivo:</strong> {c.motivo_consulta}</p>
                  )}
                  {signos && Object.keys(signos).length > 0 && (
                    <div className="flex gap-3 flex-wrap text-xs mt-1">
                      {signos.presion_arterial && <Badge variant="outline">PA: {signos.presion_arterial}</Badge>}
                      {signos.peso && <Badge variant="outline">Peso: {signos.peso} kg</Badge>}
                      {signos.temperatura && <Badge variant="outline">T: {signos.temperatura}°C</Badge>}
                    </div>
                  )}
                  {c.plan_tratamiento && (
                    <p className="line-clamp-1"><strong className="text-foreground">Plan:</strong> {c.plan_tratamiento}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      <ConsultaFormModal
        open={showForm}
        onOpenChange={setShowForm}
        pacienteId={pacienteId}
        onSuccess={handleSuccess}
      />

      {/* Edit modal */}
      {editConsulta && (
        <ConsultaFormModal
          open={!!editConsulta}
          onOpenChange={(open) => !open && setEditConsulta(null)}
          pacienteId={pacienteId}
          consulta={editConsulta}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ExpedienteConsultas;
