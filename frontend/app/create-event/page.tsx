"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, DollarSign, ImageIcon, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import axios from "axios"

export default function CreateEventPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<{ id: string; category: string }[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await axios.get(`${baseUrl}/category/`, { withCredentials: true })
        setCategories(res.data.categories)
      } catch (err) {
        console.error("Error cargando categorías", err)
      }
    }
    fetchCategories()
  }, [])

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    date: "",
    time: "",
    address: "",
    image: "",
    category: "",
    maxAttendees: "",
    price: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (
      !formData.title ||
      !formData.shortDescription ||
      !formData.longDescription ||
      !formData.date ||
      !formData.time ||
      !formData.address ||
      !formData.category ||
      !formData.maxAttendees ||
      !formData.price
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("image", imageFile, imageFile.name);

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        uploadData,
        { withCredentials: true }
      );

      imageUrl = uploadRes.data.url;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL

      const eventDate = new Date(`${formData.date}T${formData.time}:00`)

      const payload = {
        title: formData.title,
        date: eventDate.toISOString(),
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        address: formData.address,
        price: Number(formData.price),        
        maximumCapacity: Number(formData.maxAttendees),
        category: formData.category,
        imageLink: imageUrl ?? ""
      }

      await axios.post(`${baseUrl}/event/create`, payload, { withCredentials: true })

      toast({
        title: "Evento creado",
        description: "Tu evento ha sido creado exitosamente",
      })

      router.push("/")
    } catch (err) {
      console.error("Error creando evento:", err)
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }

    toast({
      title: "Evento creado",
      description: "Tu evento ha sido creado exitosamente",
    })

    // Redirect to home
    router.push("/")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a eventos
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Crear Nuevo Evento</CardTitle>
          <CardDescription>Completa la información para publicar tu evento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Título del Evento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ej: Concierto de Rock en Vivo"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription">
                Descripción Corta <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shortDescription"
                placeholder="Una breve descripción del evento"
                value={formData.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                required
              />
            </div>

            {/* Long Description */}
            <div className="space-y-2">
              <Label htmlFor="longDescription">
                Descripción Completa <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="longDescription"
                placeholder="Describe tu evento en detalle..."
                value={formData.longDescription}
                onChange={(e) => handleChange("longDescription", e.target.value)}
                rows={5}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Fecha <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  Hora <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Dirección <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Ej: Estadio Nacional, Ciudad de México"
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Imagen</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="image"
                  placeholder="Arrastra y suelta la imagen"
                  className="pl-10"
                  value={formData.image}
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Max Attendees and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">
                  Cupos Máximos <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxAttendees"
                    type="number"
                    min="1"
                    placeholder="100"
                    className="pl-10"
                    value={formData.maxAttendees}
                    onChange={(e) => handleChange("maxAttendees", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Precio <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="500"
                    className="pl-10"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear Evento"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
