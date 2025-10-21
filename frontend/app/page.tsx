"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { mockEvents, categories } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const { user } = useAuth()

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      return selectedCategory === "Todos" || event.category === selectedCategory
    })
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="bg-gradient-to-r from-primary via-primary/90 to-accent py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full border-2 border-primary-foreground/20 hover:border-primary-foreground/40 transition-colors"
                  size="lg"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredEvents.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-2xl">
                  {selectedCategory === "Todos" ? "Todos los Eventos" : selectedCategory}
                </h2>
                <p className="text-muted-foreground">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "evento" : "eventos"}
                </p>
              </div>

              {user && (
                <Link href="/create-event">
                  <Button size="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Evento
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No hay eventos en esta categoría</p>
          </div>
        )}
      </section>
    </div>
  )
}
