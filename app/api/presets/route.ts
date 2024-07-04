import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const presetsDir = path.join(process.cwd(), 'public/presets');

export async function GET(req: NextRequest) {
  try {
    const files = await fs.readdir(presetsDir);
    const presets = await Promise.all(files.map(async (file) => {
      const filePath = path.join(presetsDir, file);
      const data = await fs.readFile(filePath, 'utf8');
      return {
        name: path.basename(file, path.extname(file)),
        segments: JSON.parse(data),
      };
    }));

    return NextResponse.json(presets);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching presets' }, { status: 500 });
  }
}
