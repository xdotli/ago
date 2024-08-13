'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DbProxyButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleCreateTable = async () => {
    setLoading(true);
    setResult("");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS FakeUsers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      const response = await fetch('/api/create-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery: createTableQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(`Error creating table: ${error.message}`);
      } else {
        setResult(`Error creating table: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInsertData = async () => {
    setLoading(true);
    setResult("");

    const insertDataQuery = `
      INSERT INTO FakeUsers (name, email) VALUES
      ('John Doe', 'john@example.com'),
      ('Jane Smith', 'jane@example.com'),
      ('Bob Johnson', 'bob@example.com');
    `;

    try {
      const response = await fetch('/api/insert-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery: insertDataQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(`Error querying data: ${error.message}`);
      } else {
        setResult(`An unknown error occurred while querying data`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQueryData = async () => {
    setLoading(true);
    setResult("");

    const queryDataQuery = `
      SELECT * FROM FakeUsers;
    `;

    try {
      const response = await fetch('/api/insert-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery: queryDataQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error querying data: ${error.message}`);
      } else {
        setResult(`An unknown error occurred while querying data`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleCreateTable} disabled={loading}>
        {loading ? "Creating..." : "Create Fake Table"}
      </Button>
      <Button onClick={handleInsertData} disabled={loading}>
        {loading ? "Inserting..." : "Insert Fake Data"}
      </Button>
      <Button onClick={handleQueryData} disabled={loading}>
        {loading ? "Querying..." : "Query Fake Data"}
      </Button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-w-md">
          {result}
        </pre>
      )}
    </div>
  );
};

export default DbProxyButton;