"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Wallet, Mail, UserIcon, Plus, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading, updateBalance } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [isRecharging, setIsRecharging] = useState(false)
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true)
      try {
        const url =
          activeTab === "created"
            ? `${process.env.NEXT_PUBLIC_API_URL}/event/created`
            : `${process.env.NEXT_PUBLIC_API_URL}/event/joined`

        const res = await axios.get(url, { withCredentials: true })
        setMyEvents(res.data.events)
      } catch (err) {
        console.error("Error fetching events", err)
        setMyEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    if (user) fetchEvents()
  }, [user, activeTab])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleRecharge = async () => {
    const amount = Number.parseFloat(rechargeAmount)

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Monto inválido",
        description: "Por favor ingresa un monto válido mayor a 0",
        variant: "destructive",
      })
      return
    }

    setIsRecharging(true)
    const success = await updateBalance(amount)
    setRechargeAmount("")
    setIsRecharging(false)

    if (success) {
      toast({
        title: "¡Recarga exitosa!",
        description: `Se han agregado $${amount.toLocaleString()} a tu balance.`,
      })
      setRechargeAmount("")
    } else {
      toast({
        title: "Error",
        description: "No se pudo procesar la recarga",
        variant: "destructive",
      })
    }
  }

  const quickRechargeAmounts = [500, 1000, 2000, 5000]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || ""} alt={user.username} />
                  <AvatarFallback className="text-2xl">{user.username.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h1 className="font-display font-bold text-3xl">{user.firstName + ' ' + user.lastName}</h1>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                    <span>{user.username}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 px-6 py-4 bg-primary/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-bold text-2xl text-primary">${user.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>Tus datos de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={user.firstName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input value={user.lastName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <Input value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>DNI</Label>
                  <Input value={user.DNI} disabled />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Para actualizar tu información, contacta al soporte.</p>
            </CardContent>
          </Card>

          {/* Recharge Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Recargar Balance
              </CardTitle>
              <CardDescription>Agrega fondos a tu cuenta para registrarte en eventos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Recharge Buttons */}
              <div>
                <Label className="mb-3 block">Montos rápidos</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {quickRechargeAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setRechargeAmount(amount.toString())}
                      className="h-16 text-lg font-semibold"
                    >
                      ${amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Amount */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recharge-amount">Monto personalizado</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="recharge-amount"
                        type="number"
                        placeholder="0.00"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="pl-7"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <Button
                      onClick={handleRecharge}
                      disabled={isRecharging || !rechargeAmount}
                      className="gap-2 min-w-[140px]"
                    >
                      {isRecharging ? (
                        <>Procesando...</>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Recargar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium">Información de pago</p>
                  <p className="text-xs text-muted-foreground">
                    Aquí se integraría un procesador de pagos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Events */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Mis Eventos</CardTitle>
                <CardDescription>
                  {activeTab === "created"
                    ? "Eventos que has creado"
                    : "Eventos en los que estás anotado"}
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={activeTab === "created" ? "default" : "outline"}
                  onClick={() => setActiveTab("created")}
                >
                  Creados
                </Button>
                <Button
                  variant={activeTab === "joined" ? "default" : "outline"}
                  onClick={() => setActiveTab("joined")}
                >
                  Anotados
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {loadingEvents ? (
                <p className="text-muted-foreground">Cargando...</p>
              ) : myEvents.length === 0 ? (
                <p className="text-muted-foreground">No hay eventos en esta categoría</p>
              ) : (
                <ul className="space-y-4">
                  {myEvents.map((event) => {
                    const isPast = new Date(event.date) < new Date()

                    return (
                      <Link key={event.id} href={`/events/${event.id}`} className="block">
                        <li
                          className={`relative p-4 border rounded-lg bg-muted/30 hover:shadow-md transition ${
                            isPast ? "opacity-60 saturate-75" : "opacity-100"
                          }`}
                        >
                          {event.cancelled && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                              Cancelado
                            </div>
                          )}

                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.shortDescription}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </li>
                      </Link>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
