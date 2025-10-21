export interface Event {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  date: string
  time: string
  address: string
  image: string
  category: string
  attendees: number
  maxAttendees: number
  price: number
  creatorId: string
  creatorName: string
  attendeesList: Array<{
    id: string
    name: string
    avatar: string
  }>
}

export const categories = [
  "Todos",
  "Entretenimiento y cultura",
  "Deportes y bienestar",
  "Educación y desarrollo",
  "Negocios y tecnología",
  "Comunidad y sociedad",
]

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Concierto de Rock en Vivo",
    shortDescription: "Una noche inolvidable con las mejores bandas de rock",
    longDescription:
      "Únete a nosotros para una noche épica de rock en vivo con bandas locales e internacionales. Disfruta de un ambiente increíble, comida y bebidas disponibles. Este evento promete ser una experiencia musical única que no querrás perderte.",
    date: "2025-11-15",
    time: "20:00",
    address: "Estadio Nacional, Ciudad de México",
    image: "/rock-concert-stage.png",
    category: "Entretenimiento y cultura",
    attendees: 450,
    maxAttendees: 500,
    price: 350,
    creatorId: "2",
    creatorName: "Eventos Musicales MX",
    attendeesList: [
      { id: "1", name: "Carlos Ruiz", avatar: "/diverse-person.png" },
      { id: "2", name: "María González", avatar: "/diverse-group-two.png" },
      { id: "3", name: "Juan Pérez", avatar: "/diverse-group-outdoors.png" },
    ],
  },
  {
    id: "2",
    title: "Maratón Ciudad 2025",
    shortDescription: "Carrera de 42km por las calles principales",
    longDescription:
      "Participa en el maratón más importante del año. Recorre 42 kilómetros por las calles más emblemáticas de la ciudad. Incluye kit de corredor, medalla de finisher y hidratación en todo el recorrido. Apto para corredores de todos los niveles.",
    date: "2025-11-20",
    time: "07:00",
    address: "Parque Central, Guadalajara",
    image: "/marathon-runners.png",
    category: "Deportes y bienestar",
    attendees: 1200,
    maxAttendees: 1500,
    price: 450,
    creatorId: "3",
    creatorName: "Deportes GDL",
    attendeesList: [
      { id: "4", name: "Ana López", avatar: "/diverse-group-four.png" },
      { id: "5", name: "Pedro Sánchez", avatar: "/diverse-group-five.png" },
    ],
  },
  {
    id: "3",
    title: "Conferencia Tech Summit",
    shortDescription: "Las últimas tendencias en tecnología e innovación",
    longDescription:
      "Conferencia de dos días con los líderes más importantes de la industria tecnológica. Aprende sobre IA, blockchain, desarrollo web y más. Incluye networking, talleres prácticos y certificado de asistencia.",
    date: "2025-11-25",
    time: "09:00",
    address: "Centro de Convenciones, Monterrey",
    image: "/tech-conference.png",
    category: "Negocios y tecnología",
    attendees: 280,
    maxAttendees: 300,
    price: 1200,
    creatorId: "4",
    creatorName: "Tech Events",
    attendeesList: [
      { id: "6", name: "Laura Martínez", avatar: "/diverse-group-six.png" },
      { id: "7", name: "Roberto García", avatar: "/diverse-group-seven.png" },
      { id: "8", name: "Sofia Torres", avatar: "/diverse-group-eight.png" },
    ],
  },
  {
    id: "4",
    title: "Exposición de Arte Contemporáneo",
    shortDescription: "Obras de artistas emergentes y establecidos",
    longDescription:
      "Descubre las obras más innovadoras del arte contemporáneo. Esta exposición presenta trabajos de más de 50 artistas nacionales e internacionales. Incluye recorridos guiados, charlas con artistas y venta de obras.",
    date: "2025-11-18",
    time: "11:00",
    address: "Museo de Arte Moderno, CDMX",
    image: "/art-gallery-exhibition.jpg",
    category: "Entretenimiento y cultura",
    attendees: 150,
    maxAttendees: 200,
    price: 200,
    creatorId: "5",
    creatorName: "Cultura y Arte",
    attendeesList: [{ id: "9", name: "Diana Flores", avatar: "/diverse-group-nine.png" }],
  },
  {
    id: "5",
    title: "Festival Gastronómico",
    shortDescription: "Degustación de platillos de chefs reconocidos",
    longDescription:
      "Un festival culinario que reúne a los mejores chefs del país. Disfruta de degustaciones, demostraciones en vivo, talleres de cocina y maridajes. Una experiencia gastronómica completa para todos los amantes de la buena comida.",
    date: "2025-11-22",
    time: "13:00",
    address: "Plaza Gastronómica, Puebla",
    image: "/food-festival.png",
    category: "Entretenimiento y cultura",
    attendees: 320,
    maxAttendees: 400,
    price: 550,
    creatorId: "6",
    creatorName: "Sabores de México",
    attendeesList: [
      { id: "10", name: "Miguel Ángel", avatar: "/diverse-group.png" },
      { id: "11", name: "Valentina Cruz", avatar: "/person-11.png" },
    ],
  },
  {
    id: "6",
    title: "Taller de Desarrollo Personal",
    shortDescription: "Aprende técnicas para mejorar tu vida",
    longDescription:
      "Taller intensivo de un día completo enfocado en desarrollo personal y profesional. Aprende técnicas de productividad, gestión emocional, liderazgo y comunicación efectiva. Incluye material didáctico y certificado.",
    date: "2025-11-28",
    time: "10:00",
    address: "Hotel Ejecutivo, Querétaro",
    image: "/workshop-seminar.jpg",
    category: "Educación y desarrollo",
    attendees: 45,
    maxAttendees: 50,
    price: 800,
    creatorId: "7",
    creatorName: "Crecimiento Personal",
    attendeesList: [{ id: "12", name: "Fernando Ruiz", avatar: "/person-12.png" }],
  },
]
