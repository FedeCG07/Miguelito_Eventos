"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")
  const [events, setEvents] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: "all", name: "Todos" }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const baseUrl = process.env.NEXT_PUBLIC_API_URL

        const [categoriesRes, eventsRes] = await Promise.all([
          axios.get(`${baseUrl}/category/`),
          axios.get(`${baseUrl}/event/`)
        ])

        setCategories([
          { id: "all", name: "Todos" },
          ...categoriesRes.data.categories.map((c: any) => ({
            id: c.id,
            name: c.category
          }))
        ])
        setEvents(eventsRes.data.events)
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los datos. Intenta nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredEvents = useMemo(() => {
    if (selectedCategoryId === "all") return events;
    return events.filter(event => event.categoryId === selectedCategoryId)
  }, [selectedCategoryId, events])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="bg-gradient-to-r from-primary via-primary/90 to-accent py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "secondary" : "outline"}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className="rounded-full border-2 border-primary-foreground/20 hover:border-primary-foreground/40 transition-colors"
                  size="lg"
                >
                  {category.name}
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
                  {selectedCategoryId === "all"
                    ? "Todos los Eventos"
                    : categories.find((c) => c.id === selectedCategoryId)?.name || ""}
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
