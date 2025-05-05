const request = require("supertest");
const app = require("./app");

beforeAll(async () => {
  if (!global.token) {
    try {
      const res = await request(app).post("/api/auth/login").send({
        email: "cristiano.ronaldo@email.com",
        password: "ay-mi-m4dre-3l-b1ch8888",
      });

      if (res.statusCode === 200 && res.body.token) {
        global.token = `Bearer ${res.body.token}`;
        global.clientId = res.body.user._id; // Verifica que esta línea esté funcionando correctamente
        console.log("✅ Token y clientId cargados correctamente para los tests");
      } else {
        throw new Error("❌ No se pudo obtener el token de login.");
      }
    } catch (err) {
      console.error("❌ Error durante el login inicial:", err);
    }
  }
});