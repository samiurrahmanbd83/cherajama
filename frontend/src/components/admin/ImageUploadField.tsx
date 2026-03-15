import { useMemo, useState } from "react";
import { getApiBase } from "../../lib/api";

type ImageUploadFieldProps = {
  label?: string;
  folder: "products" | "categories" | "homepage";
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
};

const ImageUploadField = ({
  label = "Upload images",
  folder,
  value,
  onChange,
  multiple = false
}: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => getApiBase(), []);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("admin_token") || "";
  };

  const uploadFile = async (file: File) => {
    const token = getToken();
    if (!token) throw new Error("Admin token is required.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch(`${apiBase}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Upload failed.");
    }

    return data.data?.url as string;
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;

    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        if (url) uploaded.push(url);
      }
      const next = multiple ? [...value, ...uploaded] : uploaded.slice(-1);
      onChange(next);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="rounded-lg border border-[#2f3c52] bg-[#0c111a] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-[#8fb3ff]">{label}</p>
        {uploading && <span className="text-xs text-[#8fb3ff]">Uploading...</span>}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="mt-3 text-xs text-[#c4d1f0]"
        onChange={handleChange}
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {value.length > 0 && (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {value.map((url) => (
            <div key={url} className="rounded-lg border border-[#243045] bg-[#0f141e] p-2">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[#121826]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Uploaded" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="mt-2 w-full rounded-md border border-[#ff7d7d] px-2 py-1 text-xs font-semibold text-[#ff7d7d]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
