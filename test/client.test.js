const request = require("supertest");
const app = require("../app");

describe("Pruebas de clientes", () => {
  let authToken;
  let clientId;

  beforeAll(async () => {
    authToken = global.token; // Asigna el token global

    // Verifica si el cliente existe, si no, lo crea
    const existingClient = await request(app)
      .get("/api/client")
      .set("Authorization", authToken)
      .query({ email: "cliente@ejemplo.com" });

    if (existingClient.statusCode === 200 && existingClient.body.length > 0) {
      console.log("El cliente ya existe, borrándolo antes de crear uno nuevo...");
      await request(app)
        .delete(`/api/client/${existingClient.body[0]._id}`)
        .set("Authorization", authToken);
    }
  });

  it("POST /api/client", async () => {
    const res = await request(app)
      .post("/api/client")
      .set("Authorization", authToken)
      .send({
        name: "Cliente Uno",
        nif: "12345678A",
        email: "cliente@ejemplo.com",
        phone: "912345678",
        address: "Calle Falsa 123",
        postalCode: "28080",
        city: "Madrid",
        province: "Madrid"
      });
    expect(res.statusCode).toBe(201);
    clientId = res.body._id;
    global.clientId = clientId; // Asegúrate de que el clientId se guarda correctamente
  });

  it("GET /api/client/:id", async () => {
    const res = await request(app)
      .get(`/api/client/${clientId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(clientId);
  });

  it("PUT /api/client/:id", async () => {
    const res = await request(app)
      .put(`/api/client/${clientId}`)
      .set("Authorization", authToken)
      .send({ phone: "987654321", city: "Barcelona" });
    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe("987654321");
  });

  it("PATCH archive /api/client/archive/:id", async () => {
    const res = await request(app)
      .patch(`/api/client/archive/${clientId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("GET archived /api/client/archived/all", async () => {
    const res = await request(app)
      .get("/api/client/archived/all")
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.some(c => c._id === clientId)).toBe(true);
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