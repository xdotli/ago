// app/api/db-proxy/route.ts

import { NextResponse } from 'next/server';
import { db } from "@/server/db";
import { economicEvents } from "@/server/db/schema";

export async function POST(request: Request) {
  try {
    const events = await request.json();

    // Assuming events is an array of objects with time, currency, and event properties
    const insertPromises = events.map((event: { time: any; currency: any; event: any; }) =>
      db.insert(economicEvents).values({
        time: event.time,
        currency: event.currency,
        event: event.event,
      })
    );

    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Events inserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error inserting events:', error);
    return NextResponse.json({ error: 'Failed to insert events' }, { status: 500 });
  }
}