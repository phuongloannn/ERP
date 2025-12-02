import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍗</span>
              <h3 className="text-xl font-bold">Crispy Wings</h3>
            </div>
            <p className="text-sm opacity-90">
              Serving delicious fried chicken since 2024. Made fresh daily with the finest ingredients.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold">Location</h4>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <p>123 Main Street<br/>Your City, ST 12345</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <p>(555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <p>hello@crispywings.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold">Hours</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <p>Mon - Thu: 11am - 10pm</p>
              </div>
              <p className="ml-6">Fri - Sat: 11am - 12am</p>
              <p className="ml-6">Sun: 12pm - 9pm</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2025 Crispy Wings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
