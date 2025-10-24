import request from "supertest";
import app from "..";

describe("POST /event/create (createEvent)", () => {
  it("debería crear un evento con datos válidos", async () => {
    const response = await request(app)
      .post("/event/create")
      .send({
            "title": "Rock en Baradero",
            "date": "2025-12-10T00:00:00.000Z",
            "shortDescription": "Festival de rock",
            "longDescription": "Una jornada con las mejores bandas argentinas",
            "address": "Buenos Aires",
            "price": 2000,
            "maximumCapacity": 5000,
            "category": 1
        });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Rock en Baradero");
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