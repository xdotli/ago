'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function BrowserButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/launch')
      if (!response.ok) {
        throw new Error('Failed to launch browser')
      }
      alert('Browser launched successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to launch browser. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? 'Launching...' : 'Launch Browser'}
    </Button>
  )
}