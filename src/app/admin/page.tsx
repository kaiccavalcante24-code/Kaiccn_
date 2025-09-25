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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useMemoFirebase(() => getFirestore(), []);
  
  const clickEventsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null; // Wait for user
    return query(collection(firestore, 'click_events'), orderBy('timestamp', 'desc'));
  }, [firestore, user]);

  const { data: clickEvents, isLoading: isLoadingEvents, error } = useCollection(clickEventsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  const renderLocation = (locationDataString: string) => {
    try {
      const locationData = JSON.parse(locationDataString);
      return `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
    } catch (e) {
      return "N/A";
    }
  };

  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <p>Carregando...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Painel de Analytics</CardTitle>
          <Button onClick={handleLogout} variant="outline">Sair</Button>
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
