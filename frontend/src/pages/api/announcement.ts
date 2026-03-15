import type { NextApiRequest, NextApiResponse } from "next";

const resolveBackendBase = () =>
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiBase = resolveBackendBase();
  const target = `${apiBase}/api/announcement${req.url?.includes("?") ? req.url?.slice(req.url.indexOf("?")) : ""}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || ""
      },
      body: req.method && !["GET", "HEAD"].includes(req.method) ? JSON.stringify(req.body ?? {}) : undefined
    });

    const text = await upstream.text();
    res.status(upstream.status);
    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (error: any) {
    res.status(502).json({ success: false, message: error?.message || "Upstream error" });
  }
}

