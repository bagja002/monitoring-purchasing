"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LiveStream from "@/component/live-stream";

export default function CCTVGridPage() {
  const [activeCam, setActiveCam] = useState<number | null>(null);

  const cameras = [
    {
      id: 1,
      name: "CCTV 1 – Cikupa",
      url: "https://cctv-dishub.tangerangkab.go.id/storage/video/01jsrcb5aqka89ned967d8gz1k/01jsrcb5aqka89ned967d8gz1k.m3u8",
    },
    {
      id: 2,
      name: "CCTV 2 – Balaraja",
      url: "https://cctv-dishub.tangerangkab.go.id/storage/video/01jsr079n4btzjemf6r9br473w/01jsr079n4btzjemf6r9br473w.m3u8",
    },
    {
      id: 3,
      name: "CCTV 3 – Curug",
      url: "https://cctv-dishub.tangerangkab.go.id/storage/video/01jsrxyzfakeexample1/01jsrxyzfakeexample1.m3u8",
    },
    {
      id: 4,
      name: "CCTV 4 – Pasar Kemis",
      url: "https://cctv-dishub.tangerangkab.go.id/storage/video/01jsrxyzfakeexample2/01jsrxyzfakeexample2.m3u8",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-100 py-10 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-8">
        Dashboard CCTV Kabupaten Tangerang
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-11/12 max-w-5xl">
        {cameras.map((cam) => (
          <Card
            key={cam.id}
            className="cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => setActiveCam(cam.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                {cam.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="relative w-full h-64 flex items-center justify-center bg-black/70 rounded-xl overflow-hidden">
              {activeCam === cam.id ? (
                <LiveStream playlistUrl={cam.url} />
              ) : (
                <div className="text-gray-300 text-sm select-none">
                  Klik untuk menyalakan stream
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
