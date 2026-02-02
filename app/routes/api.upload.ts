import { json, type ActionArgs } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

// Note: this route uses `sharp` to resize images. Install it with:
// npm install sharp
// If you don't want sharp, the route will still save the original file but won't resize.

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const file = formData.get("file") as any;

  if (!file) {
    return json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeBase = (file.name || "upload").replace(/[^a-zA-Z0-9._-]/g, "-");
    const baseName = `${Date.now()}-${safeBase}`;

    // Try to use sharp for resizing; fallback to saving the original
    let url = "";
    let thumb = "";
    try {
      // dynamic import so dev doesn't crash if sharp isn't installed
      const sharp = (await import("sharp")).default;

      // create optimized main image (max width 1200)
      const optimizedBuffer = await sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
      const mainFilename = `${baseName}-opt.jpg`;
      await fs.writeFile(path.join(uploadsDir, mainFilename), optimizedBuffer);
      url = `/uploads/${mainFilename}`;

      // create thumbnail (square 400x400 crop)
      const thumbBuffer = await sharp(buffer).resize(400, 400, { fit: "cover" }).jpeg({ quality: 78 }).toBuffer();
      const thumbFilename = `${baseName}-thumb.jpg`;
      await fs.writeFile(path.join(uploadsDir, thumbFilename), thumbBuffer);
      thumb = `/uploads/${thumbFilename}`;
    } catch (sharpErr) {
      // sharp not available or failed; save original file
      const origFilename = `${baseName}`;
      await fs.writeFile(path.join(uploadsDir, origFilename), buffer);
      url = `/uploads/${origFilename}`;
      thumb = url;
    }

    return json({ url, thumb });
  } catch (err: any) {
    console.error("Upload error:", err);
    return json({ error: "Upload failed" }, { status: 500 });
  }
}

export const loader = () => {
  return new Response(null, { status: 405 });
};
