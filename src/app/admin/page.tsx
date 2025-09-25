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
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ArrowUpRight, MousePointerClick, Users } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useMemoFirebase(() => getFirestore(), []);
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // Default to 30 days
  
  const clickEventsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null; 
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
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const renderLocation = (locationDataString: string) => {
    try {
      const locationData = JSON.parse(locationDataString);
      if (locationData.city && locationData.region && locationData.country_name) {
        return `${locationData.city}, ${locationData.region}, ${locationData.country_name}`;
      }
      return "Location data incomplete";
    } catch (e) {
      return "N/A";
    }
  };

  const analyticsData = useMemo(() => {
    if (!clickEvents) return null;

    const now = new Date();
    const daysToSubtract = selectedPeriod === 'all' ? clickEvents.length > 0 ? Math.ceil((now.getTime() - (clickEvents[clickEvents.length - 1].timestamp?.toDate()?.getTime() ?? now.getTime())) / (1000 * 3600 * 24)) : 0 : parseInt(selectedPeriod);
    const startDate = subDays(now, daysToSubtract);

    const periodClickEvents = clickEvents.filter(event => 
      event.timestamp?.toDate && event.timestamp.toDate() > startDate
    );

    const totalClicks = periodClickEvents.length;
    const uniqueVisitors = new Set(periodClickEvents.map(e => e.ipAddress)).size;

    const clicksByLabel = periodClickEvents.reduce((acc, event) => {
      const label = event.label || 'N/A';
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clicksByLabelChartData = Object.entries(clicksByLabel)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const mostClickedButton = clicksByLabelChartData[0]?.name || 'N/A';

    const trafficOverTime = periodClickEvents.reduce((acc, event) => {
      if (!event.timestamp?.toDate) return acc;
      const date = format(startOfDay(event.timestamp.toDate()), 'dd/MM');
      const source = event.trafficSource || 'direct';

      if (!acc[date]) {
        acc[date] = {};
      }
      acc[date][source] = (acc[date][source] || 0) + 1;

      return acc;
    }, {} as Record<string, Record<string, number>>);

    const allSources = Array.from(new Set(periodClickEvents.map(e => e.trafficSource || 'direct')));
    
    const intervalEndDate = now;
    const intervalStartDate = startDate;
    const dateInterval = eachDayOfInterval({ start: intervalStartDate, end: intervalEndDate });

    const trafficOverTimeChartData = dateInterval.map(day => {
      const dateKey = format(day, 'dd/MM');
      const dailyData = trafficOverTime[dateKey] || {};
      
      const dayData: { date: string, [key: string]: any } = { date: dateKey };
      allSources.forEach(source => {
        dayData[source] = dailyData[source] || 0;
      });
      return dayData;
    });

    return {
      totalClicks,
      uniqueVisitors,
      mostClickedButton,
      trafficSources: allSources,
      trafficOverTimeChartData,
      clicksByLabelChartData,
      recentClickEvents: periodClickEvents,
    };
  }, [clickEvents, selectedPeriod]);

  
  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <p>Carregando...</p>
        </div>
    )
  }

  const AREA_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  const periodTitleMap: Record<string, string> = {
    '7': 'Últimos 7 dias',
    '30': 'Últimos 30 dias',
    '90': 'Últimos 90 dias',
    'all': 'Todo o período'
  };

  const currentPeriodTitle = periodTitleMap[selectedPeriod];

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Image
        src="https://i.imgur.com/Fm3Waqw.jpeg"
        alt="Abstract background"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
      />
      <div className="absolute inset-0 z-10 bg-black/70"></div>
      
      <main className="z-20 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                 <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[180px] bg-card/60 backdrop-blur-sm border-white/10 text-white">
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/90 text-white border-white/20">
                        <SelectItem value="7">Últimos 7 dias</SelectItem>
                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                        <SelectItem value="90">Últimos 90 dias</SelectItem>
                        <SelectItem value="all">Todo o período</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleLogout} variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10">Sair</Button>
        </div>
        
        {isLoadingEvents && <p className="text-white">Carregando dados...</p>}
        {error && <p className='text-red-400'>Erro ao carregar dados: {error.message}</p>}

        {analyticsData && (
          <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              <Card className="bg-card/40 backdrop-blur-sm border-white/10 text-white rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total de Cliques ({currentPeriodTitle})</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalClicks}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/40 backdrop-blur-sm border-white/10 text-white rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Visitantes Únicos ({currentPeriodTitle})</CardTitle>
                  <Users className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.uniqueVisitors}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/40 backdrop-blur-sm border-white/10 text-white rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Botão Mais Clicado ({currentPeriodTitle})</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold truncate">{analyticsData.mostClickedButton}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
              <Card className="bg-card/40 backdrop-blur-sm border-white/10 text-white rounded-xl">
                <CardHeader>
                  <CardTitle>Fontes de Tráfego ({currentPeriodTitle})</CardTitle>
                  <p className="text-sm text-muted-foreground">Total de visitas por dia de cada fonte de tráfego.</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.trafficOverTimeChartData}>
                      <defs>
                        {analyticsData.trafficSources.map((source, index) => (
                          <linearGradient key={source} id={`color-${source}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={AREA_COLORS[index % AREA_COLORS.length]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={AREA_COLORS[index % AREA_COLORS.length]} stopOpacity={0}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(30, 30, 30, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white',
                        }}
                      />
                      <Legend wrapperStyle={{ color: 'white' }} />
                      {analyticsData.trafficSources.map((source, index) => (
                        <Area
                          key={source}
                          type="monotone"
                          dataKey={source}
                          stroke={AREA_COLORS[index % AREA_COLORS.length]}
                          fillOpacity={1}
                          fill={`url(#color-${source})`}
                          name={source.charAt(0).toUpperCase() + source.slice(1)}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-card/40 backdrop-blur-sm border-white/10 text-white rounded-xl">
                <CardHeader>
                  <CardTitle>Cliques por Link ({currentPeriodTitle})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.clicksByLabelChartData} layout="vertical" margin={{ left: 30 }}>
                      <XAxis type="number" hide tick={{ fill: 'white' }} />
                      <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} tick={{ fill: 'white' }}/>
                      <Tooltip cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }} contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)' }}/>
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/40 backdrop-blur-sm border-white/10 text-white rounded-xl">
              <CardHeader>
                <CardTitle>Eventos de Clique Recentes ({currentPeriodTitle})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-white/10">
                      <TableHead className="text-gray-300">Data / Hora</TableHead>
                      <TableHead className="text-gray-300">Fonte</TableHead>
                      <TableHead className="text-gray-300">Botão Clicado</TableHead>
                      <TableHead className="text-gray-300">Link de Destino</TableHead>
                      <TableHead className="text-gray-300">Localização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.recentClickEvents && analyticsData.recentClickEvents.map((event) => (
                      <TableRow key={event.id} className="border-b-white/10 hover:bg-white/5">
                        <TableCell>
                          {event.timestamp?.toDate ? format(event.timestamp.toDate(), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={event.trafficSource === 'direct' ? 'secondary' : 'default'} className="bg-accent/80 text-white">
                            {event.trafficSource}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.label}</TableCell>
                        <TableCell>
                            <a href={event.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                                {event.href}
                            </a>
                        </TableCell>
                        <TableCell>{event.locationData ? renderLocation(event.locationData) : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

    