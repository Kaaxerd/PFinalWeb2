const request = require("supertest");
const app = require("../app");

describe("Pruebas de proyectos", () => {
  let authToken;
  let clientId;
  let projectId;

  beforeAll(async () => {
    authToken = global.token;
    // Creamos un cliente para asociar al proyecto
    const clientRes = await request(app)
      .post("/api/client")
      .set("Authorization", authToken)
      .send({
        name: "Cliente Proyecto",
        nif: `T${Date.now()}`,
        email: `cli-proy-${Date.now()}@test.com`,
        phone: "600600600",
        address: "Calle Proyecto 1",
        postalCode: "28000",
        city: "Madrid",
        province: "Madrid"
      });
    clientId = clientRes.body._id;
  });

  it("POST /api/project", async () => {
    const res = await request(app)
      .post("/api/project")
      .set("Authorization", authToken)
      .send({ name: "Proyecto Alpha", description: "Primera fase", client: clientId });
    expect([201, 409]).toContain(res.statusCode);
    projectId = res.body._id;
  });

  it("GET /api/project", async () => {
    const res = await request(app)
      .get("/api/project")
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("GET /api/project/:id", async () => {
    const res = await request(app)
      .get(`/api/project/${projectId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("PUT /api/project/:id", async () => {
    const res = await request(app)
      .put(`/api/project/${projectId}`)
      .set("Authorization", authToken)
      .send({ status: "completed", description: "Actualizada" });
    expect(res.statusCode).toBe(200);
  });

  it("PATCH archive /api/project/archive/:id", async () => {
    const res = await request(app)
      .patch(`/api/project/archive/${projectId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("GET archived /api/project/archive", async () => {
    const res = await request(app)
      .get("/api/project/archive")
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("PATCH restore /api/project/restore/:id", async () => {
    const res = await request(app)
      .patch(`/api/project/restore/${projectId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/project/:id", async () => {
    const res = await request(app)
      .delete(`/api/project/${projectId}`)
      .set("Authorization", authToken);
    expect([200, 204]).toContain(res.statusCode);
  });
});