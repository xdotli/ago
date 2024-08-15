// app/api/(proxy)/create-table/route.ts

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
    console.error('Error creating table:', error);
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}