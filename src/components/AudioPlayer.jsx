import { Button } from "@heroui/button";
import { Pause, Play } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Update progress as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = e.target.value;
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div >
      <audio ref={audioRef} src={src} preload="metadata" />

      <Button
        isIconOnly
        onPress={togglePlay}
        className="px-3 py-1 bg-blue-500 text-white rounded"
        startContent={isPlaying ? <Pause/> : <Play/>}
      >
        {/* {isPlaying ? "Pause" : "Play"} */}
      </Button>

      <input
        type="range"
        min={0}
        max={duration}
        step="0.1"
        value={progress}
        onChange={handleSeek}
        className="w-full mt-2"
      />

      <div className="flex justify-between text-sm mt-1">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
