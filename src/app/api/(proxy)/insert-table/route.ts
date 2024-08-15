// app/api/(proxy)/insert-table/route.ts

import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sqlQuery } = await request.json();

    if (!sqlQuery) {
      return NextResponse.json({ error: 'SQL query is required' }, { status: 400 });
    }

    // Execute the provided SQL query
    const result = await sql.query(sqlQuery);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}