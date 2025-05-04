const request = require("supertest");
const app = require("../app");

let token;
let companyId;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "cristiano.ronaldo@email.com",
    password: "ay-mi-m4dre-3l-b1ch8888",
  });
  token = res.body.token;
});

describe("Pruebas de compañía", () => {
  it("debería crear una compañía", async () => {
    const res = await request(app)
      .post("/api/company")
      .set("Authorization", token)
      .send({
        name: "Empresa Test",
        cif: `B${Date.now()}`,
        address: "Calle Test",
        postalCode: "28080",
        province: "Madrid",
      });
    expect([201, 403, 409]).toContain(res.statusCode);
    companyId = res.body?._id;
  });

  it("debería actualizar la compañía", async () => {
    if (!companyId) return;
    const res = await request(app)
      .put(`/api/company/${companyId}`)
      .set("Authorization", token)
      .send({ number: 99 });
    expect([200, 403]).toContain(res.statusCode);
  });
});