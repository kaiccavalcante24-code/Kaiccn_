'use client';

import { useCollection, useMemoFirebase, useUser } from '@/firebase';
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
  const { user, isUserLoading } = useUser();
  const firestore = useMemoFirebase(() => getFirestore(), []);
  
  const clickEventsQuery = useMemoFirebase(() => {
    // Only create the query if the user is authenticated and firestore is available
    if (!firestore || !user) return null;
    return query(collection(firestore, 'click_events'), orderBy('timestamp', 'desc'));
  }, [firestore, user]);

  const { data: clickEvents, isLoading: isLoadingEvents, error } = useCollection(clickEventsQuery);

  const renderLocation = (locationDataString: string) => {
    try {
      const locationData = JSON.parse(locationDataString);
      return `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
    } catch (e) {
      return "N/A";
    }
  };

  if (isUserLoading) {
    return (
        <div className="container mx-auto py-10">
            <p>Carregando...</p>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="container mx-auto py-10">
            <h1 className='text-2xl font-bold'>Acesso Negado</h1>
            <p>Você precisa estar logado para ver esta página.</p>
        </div>
    )
  }


  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Painel de Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEvents && <p>Carregando dados...</p>}
          {error && <p className='text-red-500'>Erro ao carregar dados. Você tem permissão para ver essas informações?</p>}
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
