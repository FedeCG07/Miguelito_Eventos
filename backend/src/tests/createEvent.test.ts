import request from "supertest";
import app from "..";
import { AuthService } from "../services/authService";

const authService = new AuthService();

const validToken = authService.createToken({
    id: "dd6143ac-e467-44b2-b7a0-6504b93e94ed" // <-- Id de usuario existente
});

describe("POST /event/create (createEvent)", () => {
  it("debería crear un evento con datos válidos", async () => {
    const response = await request(app)
      .post("/event/create")
      .set("Cookie", [`token=${validToken}`])
      .send({
            "title": "Evento de test",
            "date": "2025-11-13T17:00:00Z",
            "shortDescription": "Es un evento increíble",
            "longDescription": "Te juro que va a ser realmente increíble y palabras más largas",
            "address": "Mi casa",
            "price": 0,
            "maximumCapacity": 50,
            "category": 1,
            "imageLink": ""
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("event");
    expect(response.body.event).toHaveProperty("id");
    expect(response.body.event.title).toBe("Evento de test");
    expect(response.body.event.price).toBe(0);
    expect(response.body.event.maximumCapacity).toBe(50);
    expect(response.body.event.cancelled).toBe(false);
  });

  it("debería rechazar la creación sin título", async () => {
    const response = await request(app)
      .post("/event/create")
      .send({
            "title": "",
            "date": "2025-12-10T00:00:00.000Z",
            "shortDescription": "Festival de rock",
            "longDescription": "Una jornada con las mejores bandas argentinas",
            "address": "Buenos Aires",
            "price": 2000,
            "maximumCapacity": 5000,
            "category": 1
        });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});