import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl">Evento no encontrado</h1>
          <p className="text-muted-foreground">Lo sentimos, el evento que buscas no existe o ha sido eliminado.</p>
        </div>
        <Link href="/">
          <Button size="lg">Volver a eventos</Button>
        </Link>
      </div>
    </div>
  )
}
