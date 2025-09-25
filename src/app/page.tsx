import Image from 'next/image';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
    href: 'https://github.com',
    label: 'GitHub',
    icon: <Github className="size-5" />,
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: <Linkedin className="size-5" />,
  },
  {
    href: 'https://x.com',
    label: 'Twitter / X',
    icon: <Twitter className="size-5" />,
  },
];

export default function Home() {
  const profilePic = PlaceHolderImages.find(p => p.id === 'profile_picture');

  return (
    <main className="page-wrapper relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <Image
        src="https://i.imgur.com/jf8g3JT.gif"
        alt="Animated background"
        layout="fill"
        objectFit="cover"
        className="absolute z-0"
        unoptimized
      />
      <div className="absolute inset-0 z-10 bg-black/50"></div>
      <div className="z-20 flex w-full flex-col items-center justify-center text-center">
        {profilePic && (
          <div className="relative w-32 h-32 rounded-full mb-4 border-2 border-primary/50 shadow-lg overflow-hidden">
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

        <h1 className="font-headline text-4xl font-bold text-foreground">
          Kaic Cavalcante
        </h1>
        <p className="font-body text-lg text-foreground/80 mt-1">@Kaiccn_</p>

        <div className="mt-8 flex w-full max-w-xs flex-col items-center space-y-4 sm:max-w-sm">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="outline"
              className="w-full h-16 text-base font-bold bg-accent/60 border-white/10 backdrop-blur-sm hover:bg-accent hover:text-foreground transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full text-white relative overflow-hidden group"
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
                    <div className="absolute inset-0 z-10 bg-black/50"></div>
                  </>
                )}
                <div className="relative z-20 flex items-center gap-4">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
