"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Card, CardContent } from "@/components/ui/card";

interface LiveStreamProps {
  playlistUrl: string;
}

export default function LiveStream({ playlistUrl }: LiveStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const proxyUrl = `/api/proxy?url=${encodeURIComponent(playlistUrl)}`;
    const hls = new Hls();

    hls.loadSource(proxyUrl);
    hls.attachMedia(videoRef.current);

    // Hapus autoplay, biarkan user yang klik play
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      // Video siap, tapi tidak auto play
      console.log("Stream ready");
    });

    return () => hls.destroy();
  }, [playlistUrl]);

  return (
    <Card className="max-w-3xl mx-auto mt-10 shadow-lg border border-gray-200 rounded-2xl">
      <CardContent className="p-4">
        <video
          ref={videoRef}
          controls
          className="w-full h-auto rounded-xl bg-black"
          preload="metadata"
        />
      </CardContent>
    </Card>
  );
}
