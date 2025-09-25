'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { playlist } from '@/lib/playlist';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length
    );
    setIsPlaying(true);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setProgress(e.currentTarget.currentTime);
  };

  const onLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <Card className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 sm:w-80 rounded-lg bg-card/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md aspect-square">
            <Image
                src={currentTrack.cover}
                alt={currentTrack.title}
                layout="fill"
                objectFit="cover"
            />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <h3 className="font-bold text-sm truncate text-foreground">{currentTrack.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrev}>
            <SkipBack className="size-5" />
          </Button>
          <Button variant="default" size="icon" className="h-10 w-10 rounded-full" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext}>
            <SkipForward className="size-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{formatTime(progress)}</span>
            <Slider
              min={0}
              max={duration || 1}
              step={1}
              value={[progress]}
              onValueChange={handleProgressChange}
              className="w-full"
            />
            <span className="text-xs font-mono text-muted-foreground">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={currentTrack.source} 
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
    </Card>
  );
};

export default MusicPlayer;
