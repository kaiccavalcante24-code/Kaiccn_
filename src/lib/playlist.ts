export type Track = {
  title: string;
  artist: string;
  cover: string;
  source: string;
};

export const playlist: Track[] = [
  {
    title: 'Caleb Arredondo - Feeling Blue',
    artist: 'Kurate Music',
    cover: 'https://i.imgur.com/uOey02b.png',
    source: '/musicas/1.mp3',
  },
  {
    title: 'C418 - Mice on Venus',
    artist: 'Relax Mine',
    cover: 'https://i.imgur.com/qaktpAp.png',
    source: '/musicas/2.mp3',
  },
  {
    title: 'Nome da Música 3',
    artist: 'Nome do Artista 3',
    cover: 'https://picsum.photos/seed/3/200/200',
    source: '/musicas/3.mp3',
  },
];
