const request = require("supertest");
const app = require("../app");

describe("Pruebas de clientes", () => {
  let authToken;
  let clientId;

  beforeAll(() => {
    authToken = global.token;
  });

  it("POST /api/client", async () => {
    const res = await request(app)
      .post("/api/client")
      .set("Authorization", authToken)
      .send({
        name: "Cliente Uno",
        nif: `A${Date.now()}`,
        email: `cliente${Date.now()}@test.com`,
        phone: "912345678",
        address: "Calle Falsa 123",
        postalCode: "28080",
        city: "Madrid",
        province: "Madrid"
      });
    expect([201, 409]).toContain(res.statusCode);
    clientId = res.body._id;
  });

  it("GET /api/client", async () => {
    const res = await request(app)
      .get("/api/client")
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("GET /api/client/:id", async () => {
    const res = await request(app)
      .get(`/api/client/${clientId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/client/:id", async () => {
    const res = await request(app)
      .put(`/api/client/${clientId}`)
      .set("Authorization", authToken)
      .send({ phone: "987654321", city: "Barcelona" });
    expect(res.statusCode).toBe(200);
  });

  it("PATCH /api/client/archive/:id", async () => {
    const res = await request(app)
      .patch(`/api/client/archive/${clientId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("GET /api/client/archived/all", async () => {
    const res = await request(app)
      .get("/api/client/archived/all")
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("PATCH /api/client/restore/:id", async () => {
    const res = await request(app)
      .patch(`/api/client/restore/${clientId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/client/:id", async () => {
    const res = await request(app)
      .delete(`/api/client/${clientId}`)
      .set("Authorization", authToken);
    expect([200, 204]).toContain(res.statusCode);
  });
});