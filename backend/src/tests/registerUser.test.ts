import request from "supertest";
import app from "..";

describe("POST /user/register (register controller)", () => {
  it("debería registrar un usuario con datos válidos", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        firstName: "Juan",
        lastName: "Pérez",
        username: "juanperez",
        DNI: "12345678",
        email: "juan@example.com",
        password: "password123"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.firstName).toBe("Juan");
    expect(response.body.user.username).toBe("juanperez");
  });

  it("debería rechazar el registro si falta un campo obligatorio", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        firstName: "Juan",
        lastName: "Pérez",
        username: "juanperez",
        DNI: "12345678",
        email: "" // email vacío
        // password faltante
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
