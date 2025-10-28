import request from "supertest";
import app from "..";
import { AuthService } from "../services/authService";

const authService = new AuthService();

const validToken = authService.createToken({
    id: "e3941e30-4d17-46d1-841d-fbafd35623d3" // id de usuario
});

describe("POST /event/join (joinEvent controller)", () => {

  it("debería permitir a un usuario unirse a un evento con datos válidos", async () => {
    const response = await request(app)
      .post("/event/join")
      .set("Cookie", [`token=${validToken}`]) 
      .send({
        eventId: "1cc549b1-15b7-460d-a02c-154dc024155c", // id de un evento real 
        amount: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user_event");
    expect(response.body.user_event).toHaveProperty("id");
    expect(response.body.user_event).toHaveProperty("eventId", "0b059689-a148-4b02-b087-8cffa23799a2");
    expect(response.body.user_event).toHaveProperty("userId", "e3941e30-4d17-46d1-841d-fbafd35623d3");
  }, 10000);

  it("debería rechazar si falta el token", async () => {
    const response = await request(app)
      .post("/event/join")
      .send({
        eventId: "1cc549b1-15b7-460d-a02c-154dc024155c",
        amount: 1,
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it("debería rechazar si falta eventId", async () => {
    const response = await request(app)
      .post("/event/join")
      .set("Cookie", [`token=${validToken}`])
      .send({
        amount: 1,
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
