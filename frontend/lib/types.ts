export interface Event {
  id: string
  title: string
  date: string
  shortDescription: string
  longDescription: string
  address: string
  price: number
  cancelled: boolean
  maximumCapacity: number
  assistingUsers: number
  categoryId: number
  creator: string
  image: string //sacar de carpeta o algo así / guardar link a la carpeta en la db??
}
/* 
"id": "886d0346-bccc-49b9-a8ee-dd7897cf6296",
"title": "Evento",
"date": "2025-10-31T17:00:00.000Z",
"shortDescription": "Es un evento increíble",
"longDescription": "Te juro que va a ser realmente increíble y palabras más largas",
"price": 10,
"cancelled": false,
"maximumCapaxity": 50,
"assistingUsers": 4,
"categoryId": 1,
"category": "Entretenimiento y cultura",
"creator": "Luca Greco" */