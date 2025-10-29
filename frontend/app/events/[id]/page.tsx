"use client"

import { use, useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, DollarSign, User, ArrowLeft, Ticket, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [event, setEvent] = useState<any | null>()
  const [loading, setLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [amount, setAmount] = useState(1)
  const [assistants, setAssistants] = useState<any[]>([])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await axios.get(`${baseUrl}/event/${id}`, { withCredentials: true })
        setEvent(res.data.event)
        console.log(res.data.event)
      } catch (err) {
        console.error("Error fetching event:", err)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await axios.get(`${baseUrl}/event/assisting/${id}`, { withCredentials: true })
        setAssistants(res.data.users)
      } catch (err) {
        console.error("Error fetching users:", err)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchAssistants()
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const attendancePercentage = (event.assistingUsers / event.maximumCapacity) * 100
  const spotsLeft = event.maximumCapacity - event.assistingUsers
  const isCreator = user && event.creator === user.username
  let hasJoined = false
  for (const att of assistants) {
    if (user?.id == att.id) {
      hasJoined = true
    }
  }

  const handleJoin = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Cantidad inválido",
        description: "Por favor ingresa una cantidad válida mayor a 0",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      await axios.post(`${baseUrl}/event/join`, { eventId: id, amount }, { withCredentials: true })
      toast({
        title: "¡Registro exitoso!",
        description: `Te has registrado para ${event.title}. Se han deducido $${event.price * amount} de tu balance.`,
      })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 402) {
          toast({
            title: "Saldo insuficiente",
            description: "No tienes suficiente saldo para este evento.",
            variant: "destructive",
          })
        }
        if (err.response.status === 409) {
          toast({
            title: "Cupos insuficientes",
            description: "El evento no cuenta con suficientes lugares.",
            variant: "destructive",
          })
        }
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCancelReservation = async () => {
    setIsRegistering(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      await axios.post(`${baseUrl}/event/unreserve`, { eventId: id, amount }, { withCredentials: true })
      toast({
        title: "Reserva cancelada",
        description: `Has cancelado ${amount} lugar(es) para ${event.title}.`,
      })
    } catch (err) {
      console.error("Error cancelling reservation", err)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCancelEvent = async () => {
    setIsRegistering(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      await axios.post(`${baseUrl}/event/cancel/${id}`, { }, { withCredentials: true })
      toast({
        title: "Evento cancelado",
        description: `${event.title} fue cancelado.`,
      })
    } catch (err) {
      console.error("Error cancelling event", err)
    } finally {
      setIsRegistering(false)
    }
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
        <Image src={event.imageLink || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          {event.cancelled && <Badge className="bg-red-600 text-white">Cancelado</Badge>}
          {hasJoined && <Badge className="bg-green-600 text-white">Ya estás anotado</Badge>}
          <div className="flex items-center justify-between">
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
              {event.title}
            </h1>
            <Badge variant="outline">{event.category}</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base leading-relaxed text-muted-foreground">{event.longDescription}</p>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
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
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-muted-foreground">{event.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Organizador</p>
                      <p className="text-sm text-muted-foreground">
                        {event.creator}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5" />
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
                <CardTitle>Asistentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assistants!.map((att: any) => (
                  <div key={att.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={att.avatar} alt={att.username} />
                      <AvatarFallback>{att.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{att.username}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">${event.price * amount ? event.price * amount : 0}</span>
                  <span className="text-sm text-muted-foreground">total</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Asistentes</span>
                    <span className="font-medium">
                      {event.assistingUsers} / {event.maximumCapacity}
                    </span>
                  </div>

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

                {/* Ticket Amount */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                  />
                  <span className="text-sm">entradas</span>
                </div>

                {/* Buttons */}
                {isCreator ? (
                  <Button onClick={handleCancelEvent} disabled={isRegistering || event.cancelled} variant="destructive" className="w-full">
                    <XCircle className="h-5 w-5" /> Cancelar evento
                  </Button>
                ) : hasJoined ? (
                  <Button
                    onClick={handleCancelReservation}
                    disabled={isRegistering || event.price !== 0 || event.cancelled}
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Ticket className="h-5 w-5" /> Cancelar reservas
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base gap-2"
                    size="lg"
                    onClick={handleJoin}
                    disabled={isRegistering || spotsLeft === 0 || event.cancelled}
                  >
                    <Ticket className="h-5 w-5" />
                    {isRegistering ? "Procesando..." : spotsLeft === 0 ? "Evento lleno" : "Registrarse"}
                  </Button>
                )}

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
