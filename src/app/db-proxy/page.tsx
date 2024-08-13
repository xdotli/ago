'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DbProxyButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setResult("");

    const pseudoData = [
      { time: "07:30", currency: "USD", event: "Nonfarm Payrolls" },
      { time: "09:00", currency: "EUR", event: "ECB Press Conference" },
      { time: "14:00", currency: "GBP", event: "BoE Interest Rate Decision" },
    ];

    try {
      const response = await fetch('/api/db-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pseudoData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult(`An unknown error occurred`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Sending..." : "Send Pseudo Data to API"}
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