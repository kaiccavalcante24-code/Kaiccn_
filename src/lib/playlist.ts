export type Track = {
  title: string;
  artist: string;
  cover: string;
  source: string;
};

export const playlist: Track[] = [
  {
    title: 'Nome da Música 1',
    artist: 'Nome do Artista 1',
    cover: 'https://picsum.photos/seed/1/200/200',
    source: '/musicas/1.mp3',
  },
  {
    title: 'Nome da Música 2',
    artist: 'Nome do Artista 2',
    cover: 'https://picsum.photos/seed/2/200/200',
    source: '/musicas/2.mp3',
  },
  {
    title: 'Nome da Música 3',
    artist: 'Nome do Artista 3',
    cover: 'https://picsum.photos/seed/3/200/200',
    source: '/musicas/3.mp3',
  },
];
