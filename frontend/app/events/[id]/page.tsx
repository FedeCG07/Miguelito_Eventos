"use client"

import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { mockEvents } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { Calendar, MapPin, Users, DollarSign, User, ArrowLeft, Ticket } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const event = mockEvents.find((e) => e.id === id)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)

  if (!event) {
    notFound()
  }

  const attendancePercentage = (event.attendees / event.maxAttendees) * 100
  const spotsLeft = event.maxAttendees - event.attendees

  const handleRegister = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.balance < event.price) {
      toast({
        title: "Saldo insuficiente",
        description: "No tienes suficiente saldo para registrarte en este evento. Por favor, recarga tu balance.",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRegistering(false)

    toast({
      title: "¡Registro exitoso!",
      description: `Te has registrado para ${event.title}. Se han deducido $${event.price} de tu balance.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Badge className="mb-4 text-base px-4 py-1">{event.category}</Badge>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-balance mb-2">{event.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-base leading-relaxed text-muted-foreground">{event.longDescription}</p>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Fecha y Hora</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-muted-foreground">{event.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Organizador</p>
                      <p className="text-sm text-muted-foreground">{event.creatorName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Precio</p>
                      <p className="text-sm text-muted-foreground">${event.price}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendees List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Asistentes ({event.attendees})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.attendeesList.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                        <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{attendee.name}</span>
                    </div>
                  ))}
                  {event.attendees > event.attendeesList.length && (
                    <p className="text-sm text-muted-foreground">
                      Y {event.attendees - event.attendeesList.length} personas más...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold">${event.price}</span>
                    <span className="text-sm text-muted-foreground">por persona</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Asistentes</span>
                    <span className="font-medium">
                      {event.attendees} / {event.maxAttendees}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${attendancePercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {spotsLeft > 0 ? `${spotsLeft} lugares disponibles` : "Evento lleno"}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base gap-2"
                  size="lg"
                  onClick={handleRegister}
                  disabled={isRegistering || spotsLeft === 0}
                >
                  <Ticket className="h-5 w-5" />
                  {isRegistering ? "Registrando..." : spotsLeft === 0 ? "Evento Lleno" : "Registrarse"}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-muted-foreground">Debes iniciar sesión para registrarte</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
