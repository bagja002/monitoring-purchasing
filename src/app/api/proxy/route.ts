import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target) {
        return NextResponse.json({ error: "Missing ?url" }, { status: 400 });
    }

    try {
        const res = await fetch(target, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) {
            return NextResponse.json({ error: "Fetch failed" }, { status: res.status });
        }

        const contentType = res.headers.get("content-type") || "";
        const buffer = await res.arrayBuffer();

        // ---- jika ini file playlist .m3u8 ----
        if (contentType.includes("application/vnd.apple.mpegurl") || target.endsWith(".m3u8")) {
            const text = Buffer.from(buffer).toString("utf8");

            // base path tempat file segmen berada
            const base = target.substring(0, target.lastIndexOf("/") + 1);

            // ubah setiap baris yang bukan komentar (#) agar jadi proxy
            const modified = text
                .split("\n")
                .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith("#")) return line;
                    const absolute = trimmed.startsWith("http") ? trimmed : base + trimmed;
                    return `/api/proxy?url=${encodeURIComponent(absolute)}`;
                })
                .join("\n");

            return new NextResponse(modified, {
                headers: {
                    "Content-Type": "application/vnd.apple.mpegurl",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        // ---- untuk file .ts atau .m4s ----
        return new NextResponse(Buffer.from(buffer), {
            headers: {
                "Content-Type": contentType || "application/octet-stream",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (err) {
        console.error("Proxy error:", err);
        return NextResponse.json({ error: "Proxy crashed" }, { status: 500 });
    }
}
