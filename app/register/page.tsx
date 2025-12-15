"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, User, Phone } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })

      const data = await res.json()
      if (!data.success) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/login")
    } catch (err) {
      setError("Unable to register. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Create account</p>
          <h1 className="text-3xl font-bold text-foreground">Join Manh Hoach</h1>
          <p className="text-sm text-muted-foreground">Register to order online and track your purchases.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full name</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/60">
              <User className="w-4 h-4 text-muted-foreground" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/60">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone (optional)</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/60">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="090 000 0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/60">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirm password</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input focus-within:ring-2 focus-within:ring-primary/60">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:opacity-80">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
