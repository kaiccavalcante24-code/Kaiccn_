'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, getFirestore, query, orderBy } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminPage() {
  const firestore = useMemoFirebase(() => getFirestore(), []);
  
  const clickEventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'click_events'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: clickEvents, isLoading: isLoadingEvents, error } = useCollection(clickEventsQuery);

  const renderLocation = (locationDataString: string) => {
    try {
      const locationData = JSON.parse(locationDataString);
      return `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Painel de Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEvents && <p>Carregando dados...</p>}
          {error && <p className='text-red-500'>Erro ao carregar dados. As permissões do banco de dados podem estar sendo atualizadas. Tente recarregar a página em alguns instantes.</p>}
          {!isLoadingEvents && clickEvents && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data / Hora</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Botão Clicado</TableHead>
                  <TableHead>Link de Destino</TableHead>
                  <TableHead>Localização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clickEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {event.timestamp?.toDate ? format(event.timestamp.toDate(), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.trafficSource === 'direct' ? 'secondary' : 'default'}>
                        {event.trafficSource}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.label}</TableCell>
                    <TableCell>
                        <a href={event.href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            {event.href}
                        </a>
                    </TableCell>
                    <TableCell>{event.locationData ? renderLocation(event.locationData) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
