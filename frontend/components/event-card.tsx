"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
  joined?: boolean
  category: string
}

export function EventCard({ event, joined, category }: EventCardProps) {
  const attendancePercentage = (event.assistingUsers / event.maximumCapacity) * 100
  const isAlmostFull = attendancePercentage >= 80

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full group">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm">{category}</Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-display font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
            {joined && (
              <span className="ml-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                Ya estás anotado
              </span>
            )}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">{event.shortDescription}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(event.date).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span> 
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.address}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {event.assistingUsers}/{event.maximumCapacity}
            </span>
            {isAlmostFull && (
              <Badge variant="destructive" className="text-xs">
                Casi lleno
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>{event.price}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
