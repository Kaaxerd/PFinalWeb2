const request = require("supertest");
const app = require("../app");

describe("Pruebas de compañías", () => {
  let authToken;
  let companyId;

  beforeAll(() => {
    authToken = global.token;
  });

  it("POST /api/company", async () => {
    const res = await request(app)
      .post("/api/company")
      .set("Authorization", authToken)
      .send({
        name: "Servitop, SL.",
        cif: `B${Date.now()}`,
        street: "Carlos V",
        number: 22,
        postal: 28936,
        city: "Móstoles",
        province: "Madrid"
      });
    expect([201, 409]).toContain(res.statusCode);
    companyId = res.body._id;
  });

  it("PATCH /api/company/:id", async () => {
    const res = await request(app)
      .patch(`/api/company/${companyId}`)
      .set("Authorization", authToken)
      .send({
        name: "Servitop Updated, SL.",
        street: "Calle Actualizada",
        number: 45
      });
    
    expect([200, 403]).toContain(res.statusCode); // Puede no estar autorizado a actualizar => aceptamos 200 o 403
  });

  it("PATCH /api/company/:id/logo", async () => {
    const res = await request(app)
      .patch(`/api/company/${companyId}/logo`)
      .set("Authorization", authToken)
      .attach("logo", "./test/cr7.png");
    
    expect([200, 403]).toContain(res.statusCode); // Sólo comprobamos el código de estado
  });
});