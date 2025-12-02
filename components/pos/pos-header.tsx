'use client'

import { LogOut, Clock, User } from 'lucide-react'

export default function POSHeader() {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Manh Hoach POS</h1>
        <p className="text-sm opacity-90">Hanoi Branch</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span className="text-sm font-medium">{currentTime}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User size={18} />
          <span className="text-sm font-medium">Cashier</span>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
