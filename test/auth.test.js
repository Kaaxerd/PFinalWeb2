const request = require("supertest");
const app = require("../app");

describe("Pruebas de autenticación", () => {
  const email = `user${Date.now()}@test.com`;
  let token;

  it("debería registrar un usuario no autónomo", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email,
      password: "TestPassword123!",
      name: "Cristiano",
      surname: "Ronaldo",
      nif: "98765432Z",
    });
    expect([201, 409]).toContain(res.statusCode); // 409 si ya existe
  });

  it("debería hacer login correctamente", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "TestPassword123!",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});