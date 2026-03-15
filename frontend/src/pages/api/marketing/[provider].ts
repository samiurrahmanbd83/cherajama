import type { NextApiRequest, NextApiResponse } from "next";

const resolveBackendBase = () =>
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  const provider = req.query.provider as string;

  try {
    const apiBase = resolveBackendBase();
    const upstream = await fetch(`${apiBase}/api/marketing/${provider}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "",
        Accept: "application/json"
      },
      body: JSON.stringify(req.body)
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

