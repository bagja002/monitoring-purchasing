"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface LiveStreamProps {
  playlistUrl: string;
  autoPlay?: boolean;
}

export default function LiveStream({
  playlistUrl,
  autoPlay = true,
}: LiveStreamProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playlistUrl;
      if (autoPlay) video.play().catch(() => null);
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(playlistUrl);
      hls.attachMedia(video);
      if (autoPlay) {
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => null);
        });
      }
      return () => hls.destroy();
    }
  }, [playlistUrl, autoPlay]);

  return (
    <video
      ref={videoRef}
      controls
      muted
      className="w-full h-full object-cover rounded-xl bg-black"
    />
  );
}
