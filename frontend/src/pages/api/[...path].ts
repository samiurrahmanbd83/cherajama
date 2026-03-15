import type { NextApiRequest, NextApiResponse } from "next";

const resolveBackendBase = () =>
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const segments = Array.isArray(req.query.path) ? req.query.path : [];
  const query = req.url?.split("?")[1];
  const target = `${resolveBackendBase()}/api/${segments.join("/")}${query ? `?${query}` : ""}`;

  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization as string;
  }

  let body: string | undefined;
  if (req.method && !["GET", "HEAD"].includes(req.method)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(req.body ?? {});
  }

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body
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

