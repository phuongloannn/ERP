"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Mail, Phone, User, Shield, Clock } from "lucide-react"

interface Profile {
  id: number
  name: string
  email: string
  phone?: string
  is_active: number | boolean
  created_at: string
  updated_at: string
}

export default function AccountDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setError("")
      try {
        const res = await fetch("/api/customer/profile")
        const data = await res.json()
        if (!data.success) {
          setError(data.error || "Please login to view your account.")
          return
        }
        setProfile(data.data)
        setName(data.data.name || "")
        setPhone(data.data.phone || "")
      } catch (err) {
        setError("Unable to load profile.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveProfile = async () => {
    setError("")
    setSuccess("")
    setSaving(true)
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || "Update failed")
        return
      }
      setSuccess("Profile updated")
    } catch (err) {
      setError("Unable to save profile.")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Account</p>
            <h1 className="text-3xl font-bold">Profile & activity</h1>
            <p className="text-sm text-muted-foreground">Manage your details and view your orders.</p>
          </div>
          <Link
            href="/account/orders"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
          >
            View orders
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {logoutLoading ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading account...
          </div>
        ) : error ? (
          <div className="p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive text-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="w-4 h-4 text-primary" /> Profile
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent outline-none"
                      placeholder="090 000 0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{profile?.email}</span>
                  </div>
                </div>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
                  {saving ? "Saving..." : "Save changes"}
                </button>
                {success && (
                  <div className="text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-2">
                    {success}
                  </div>
                )}
                {error && !loading && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="w-4 h-4 text-primary" /> Account status
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Created: {profile && new Date(profile.created_at).toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Updated: {profile && new Date(profile.updated_at).toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Status: {profile?.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/account/orders"
                  className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90"
                >
                  Order history
                </Link>
                <Link
                  href="/shop"
                  className="px-4 py-2 rounded-lg bg-muted text-foreground font-semibold hover:opacity-90"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}