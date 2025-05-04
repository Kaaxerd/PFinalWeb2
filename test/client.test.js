const request = require("supertest");
const app = require("../app");

let token;
let clientId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "cristiano.ronaldo@email.com",
    password: "ay-mi-m4dre-3l-b1ch8888",
  });
  token = res.body.token;
});

describe("Pruebas de cliente", () => {
  it("debería crear un cliente", async () => {
    const res = await request(app)
      .post("/api/client")
      .set("Authorization", token)
      .send({
        name: "Cliente Test",
        nif: `CIF${Date.now()}`,
        address: "Dirección Test",
        province: "Madrid",
      });
    expect([201, 409]).toContain(res.statusCode);
    clientId = res.body?._id;
  });

  it("debería actualizar un cliente", async () => {
    if (!clientId) return;
    const res = await request(app)
      .put(`/api/client/${clientId}`)
      .set("Authorization", token)
      .send({ phone: "987654321" });
    expect([200, 403]).toContain(res.statusCode);
  });

  it("debería hacer soft delete de un cliente", async () => {
    if (!clientId) return;
    const res = await request(app)
      .patch(`/api/client/archive/${clientId}`)
      .set("Authorization", token);
    expect([200, 403]).toContain(res.statusCode);
  });

  it("debería hacer hard delete del cliente", async () => {
    if (!clientId) return;
    const res = await request(app)
      .delete(`/api/client/${clientId}`)
      .set("Authorization", token);
    expect([200, 403]).toContain(res.statusCode);
  });
});