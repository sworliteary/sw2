import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const file = await readFile(path.join(process.cwd(), "dist", "genre.json"));
  return NextResponse.json({ genres: JSON.parse(file.toString()) });
}
