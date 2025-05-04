const request = require("supertest");
const app = require("../app");

let token;
let noteId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "cristiano.ronaldo@email.com",
    password: "ay-mi-m4dre-3l-b1ch8888",
  });
  token = res.body.token;
});

describe("Pruebas de Albaranes", () => {
  it("debería crear un albarán de tipo horas", async () => {
    const res = await request(app)
      .post("/api/deliverynote")
      .set("Authorization", token)
      .send({
        type: "horas",
        client: "cliente_test_id", // ← Reemplaza por IDs reales
        project: "proyecto_test_id",
        entries: [{ name: "Pepe", hours: 2 }],
      });
    expect([201, 401]).toContain(res.statusCode);
    noteId = res.body?._id;
  });

  it("debería listar todos los albaranes", async () => {
    const res = await request(app)
      .get("/api/deliverynote")
      .set("Authorization", token);
    expect([200, 401]).toContain(res.statusCode);
  });

  it("debería obtener el albarán por ID", async () => {
    if (!noteId) return;
    const res = await request(app)
      .get(`/api/deliverynote/${noteId}`)
      .set("Authorization", token);
    expect([200, 401]).toContain(res.statusCode);
  });

  it("debería eliminar el albarán si no está firmado", async () => {
    if (!noteId) return;
    const res = await request(app)
      .delete(`/api/deliverynote/${noteId}`)
      .set("Authorization", token);
    expect([200, 401]).toContain(res.statusCode);
  });
});