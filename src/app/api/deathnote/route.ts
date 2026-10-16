import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  InscribedRecord,
  DEFAULT_CAUSES,
  INITIAL_INSCRIBED_ARCHIVE,
} from "@/lib/deathnote";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "deathnote_records.json");

// Helper to read records from disk or initialize with default archive
async function loadRecords(): Promise<InscribedRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_INSCRIBED_ARCHIVE;
  } catch {
    // If file doesn't exist, initialize data folder and write default records
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_INSCRIBED_ARCHIVE, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to initialize deathnote file:", e);
    }
    return INITIAL_INSCRIBED_ARCHIVE;
  }
}

// Helper to persist records
async function saveRecords(records: InscribedRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf-8");
}

export async function GET() {
  try {
    const records = await loadRecords();
    return NextResponse.json({
      success: true,
      records,
      updatedAt: Date.now(),
      total: records.length,
    });
  } catch (error) {
    console.error("GET /api/deathnote error:", error);
    return NextResponse.json(
      { success: false, records: INITIAL_INSCRIBED_ARCHIVE, total: INITIAL_INSCRIBED_ARCHIVE.length },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawName = body?.name;

    if (!rawName || typeof rawName !== "string" || !rawName.trim()) {
      return NextResponse.json(
        { success: false, error: "Target name is required" },
        { status: 400 }
      );
    }

    const cleanName = rawName.trim().slice(0, 64);
    const chosenCause =
      body?.cause && typeof body.cause === "string" && body.cause.trim()
        ? body.cause.trim()
        : DEFAULT_CAUSES[Math.floor(Math.random() * DEFAULT_CAUSES.length)];

    const records = await loadRecords();

    // Check if target was already inscribed
    const existingIndex = records.findIndex(
      (r) => r.name.toLowerCase() === cleanName.toLowerCase()
    );

    let recordedTarget: InscribedRecord;

    if (existingIndex !== -1) {
      // "also need to update itself": update existing record timestamp & cause, move to top
      const existing = records[existingIndex];
      recordedTarget = {
        ...existing,
        name: cleanName, // preserve latest casing
        cause: chosenCause,
        timestamp: Date.now(),
        time: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      };
      records.splice(existingIndex, 1);
      records.unshift(recordedTarget);
    } else {
      // Inscribe new target
      recordedTarget = {
        id: `KIRA-${Date.now().toString().slice(-4)}`,
        name: cleanName,
        time: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        timestamp: Date.now(),
        cause: chosenCause,
      };
      records.unshift(recordedTarget);
    }

    await saveRecords(records);

    return NextResponse.json({
      success: true,
      record: recordedTarget,
      records,
      total: records.length,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("POST /api/deathnote error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist target in Death Note" },
      { status: 500 }
    );
  }
}
