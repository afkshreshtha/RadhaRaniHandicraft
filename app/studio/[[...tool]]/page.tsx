'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// your Sanity studio config
import Cookies from 'js-cookie'
import Studio from '@/sanity/studio'

export default function StudioPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const correctPassword = process.env.NEXT_PUBLIC_STUDIO_PASSWORD || 'admin123'

  useEffect(() => {
    const authCookie = Cookies.get('studio_auth')
    if (authCookie === 'true') {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === correctPassword) {
      Cookies.set('studio_auth', 'true', { expires: 1 }) // Save for 1 day
      setAuthenticated(true)
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  if (loading) return null

  if (authenticated) {
    return (
      <div className="min-h-screen">
        <Studio/>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Studio Login</h1>
        <input
          type="password"
          placeholder="Enter Studio Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Enter Studio
        </button>
      </form>
    </div>
  )
}
