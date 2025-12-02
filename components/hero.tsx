export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
                <span className="text-balance">Crispy, Golden, Delicious</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Freshly made fried chicken with premium ingredients and authentic seasoning
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-accent transition">
                Order Now
              </button>
              <button className="rounded-lg border-2 border-primary px-8 py-3 font-medium text-primary hover:bg-primary/5 transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative h-96 w-full">
            <img
              src="/fried-chicken-bucket-golden-crispy.jpg"
              alt="Crispy fried chicken"
              className="h-full w-full object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
