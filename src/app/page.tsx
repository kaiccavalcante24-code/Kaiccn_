import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FaDiscord, FaTiktok, FaWhatsapp } from "react-icons/fa";
import MusicPlayer from '@/components/MusicPlayer';


const links = [
  {
    href: 'https://comunidadedayone.com.br/pagina-oficial/',
    label: 'D.A.Y COMMUNITY',
    backgroundImage: 'https://i.imgur.com/iXUBEal.jpeg',
  },
  {
    href: 'https://www.instagram.com/kaiccn_',
    label: 'Instagram',
    icon: <Instagram className="size-5" />,
  },
  {
    href: 'https://discord.gg/yDXTRvJCuQ',
    label: 'Comunidade Gratuita',
    icon: <FaDiscord className="size-5" />,
  },
  {
    href: 'https://www.tiktok.com/@okaiccn_?is_from_webapp=1&sender_device=pc',
    label: 'Tiktok │okaiccn_',
    icon: <FaTiktok className="size-5" />,
  },
  {
    href: 'https://chat.whatsapp.com/GznPLfRztSvGBBDcZgH08A',
    label: 'Networking Day One',
    icon: <FaWhatsapp className="size-5" />,
  },
];

export default function Home() {
  const profilePic = PlaceHolderImages.find(p => p.id === 'profile_picture');

  return (
    <main className="page-wrapper relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden pb-48 sm:pb-4">
      <Image
        src="https://i.imgur.com/jf8g3JT.gif"
        alt="Animated background"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
        unoptimized
      />
      <div className="absolute inset-0 z-10 bg-black/70"></div>
      <div className="z-20 flex w-full flex-col items-center justify-center text-center">
        {profilePic && (
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full mb-4 border-2 border-primary/50 shadow-lg overflow-hidden">
            <Image
              src={profilePic.imageUrl}
              alt={profilePic.description}
              layout="fill"
              objectFit="cover"
              data-ai-hint={profilePic.imageHint}
              priority
            />
          </div>
        )}

        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
          Kaic Cavalcante
        </h1>
        <p className="font-body text-md sm:text-lg text-foreground/80 mt-1">@Kaiccn_</p>

        <div className="mt-8 flex w-full max-w-sm flex-col items-center space-y-4">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="outline"
              className="w-full h-14 sm:h-16 text-sm sm:text-base font-bold bg-accent/60 border-white/10 backdrop-blur-sm hover:bg-accent hover:text-foreground transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full text-white relative overflow-hidden group"
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="z-10 w-full h-full flex items-center justify-center">
                {link.backgroundImage && (
                  <>
                    <Image
                      src={link.backgroundImage}
                      alt={link.label}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 z-10 bg-black/70 group-hover:bg-black/60 transition-colors"></div>
                  </>
                )}
                <div className="relative z-20 flex items-center gap-2 sm:gap-4">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </div>
      <MusicPlayer />
    </main>
  );
}
