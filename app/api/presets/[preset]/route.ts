import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const presetsDir = path.join(process.cwd(), 'public/presets');

export async function GET(req: NextRequest, { params }: { params: { preset: string } }) {
  const { preset } = params;
  const presetPath = path.join(presetsDir, `${preset}.json`);

  try {
    const data = await fs.readFile(presetPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ message: 'Preset not found' }, { status: 404 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { preset: string } }) {
  const { preset } = params;
  const presetPath = path.join(presetsDir, `${preset}.json`);
  const segments = await req.json();

  try {
    await fs.writeFile(presetPath, JSON.stringify(segments, null, 2));
    return NextResponse.json({ message: 'Preset saved' });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving preset' }, { status: 500 });
  }
}
