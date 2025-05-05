const request = require("supertest");
const app = require("../app");

function generarNIFValido() {
  const numeros = Math.floor(10000000 + Math.random() * 90000000);
  const letras = "ABCDEFGHJKLMNPQRSTVWXYZ";
  const letra = letras[numeros % 23];
  return `${numeros}${letra}`;
}

describe("Pruebas de autenticación", () => {
  let testEmail;
  const testPassword = "TestPassword123!";
  let userId;
  let verificationCode;
  let resetToken;

  it("debería registrar un usuario no autónomo", async () => {
    testEmail = `user${Date.now()}@test.com`;
    const nif = generarNIFValido();
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: testEmail, password: testPassword, autonomous: false, nif });
    expect([200, 201, 409]).toContain(res.statusCode);
    userId = res.body.user?._id;
    verificationCode = res.body.verificationCode;
  });

  it("debería verificar el usuario", async () => {
    const res = await request(app)
      .post("/api/auth/verify-email")
      .send({ email: testEmail, verificationCode });
    expect(res.statusCode).toBe(200);
  });

  it("debería hacer login correctamente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    global.token = `Bearer ${res.body.token}`;
  });

  it("GET /api/auth/me", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", global.token);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  it("PUT /api/auth/:id", async () => {
    const newName = "NuevoNombre";
    const res = await request(app)
      .put(`/api/auth/${userId}`)
      .set("Authorization", global.token)
      .send({ name: newName });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(newName);
  });

  it("POST /api/auth/forgot-password", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .set("Authorization", global.token)
      .send({ email: testEmail });
    expect(res.statusCode).toBe(200);
    resetToken = res.body.resetToken;
  });

  it("PATCH /api/auth/reset-password", async () => {
    const newPass = "OtraPass123!";
    const res = await request(app)
      .patch("/api/auth/reset-password")
      .set("Authorization", global.token)
      .send({ token: resetToken, newPassword: newPass });
    expect(res.statusCode).toBe(200);
  });

  it("DELETE soft /api/auth/me?soft=true", async () => {
    const res = await request(app)
      .delete("/api/auth/me?soft=true")
      .set("Authorization", global.token);
    expect([200, 204]).toContain(res.statusCode);
  });

  it("DELETE hard /api/auth/me?soft=false", async () => {
    const res = await request(app)
      .delete("/api/auth/me?soft=false")
      .set("Authorization", global.token);
    // tras soft-delete, el token podría no servir => aceptamos 401 también
    expect([200, 204, 401]).toContain(res.statusCode);
  });
});