const request = require("supertest");
const app = require("../app");

describe("Pruebas de proyectos", () => {
  let projectId;
  let clientId;
  let authToken;

  beforeAll(() => {
    authToken = global.token; // Asigna el token global
    clientId = global.clientId; // Asigna el clientId global
    if (!authToken || !clientId) {
      throw new Error("Token o Client ID no están definidos correctamente.");
    }
  });  

  it("POST /api/project", async () => {
    const res = await request(app)
      .post("/api/project")
      .set("Authorization", authToken)
      .send({ name: "Proyecto Alpha", description: "Primera fase", client: clientId });
    expect([201, 409]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      projectId = res.body._id;
    }
  });

  it("GET /api/project", async () => {
    const res = await request(app)
      .get("/api/project")
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/project/:id", async () => {
    if (!projectId) {
      throw new Error("Project ID no está definido.");
    }
    const res = await request(app)
      .get(`/api/project/${projectId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(projectId);
  });

  it("PUT /api/project/:id", async () => {
    if (!projectId) {
      throw new Error("Project ID no está definido.");
    }
    const res = await request(app)
      .put(`/api/project/${projectId}`)
      .set("Authorization", authToken)
      .send({ status: "completed", description: "Actualizada" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  it("PATCH archive /api/project/archive/:id", async () => {
    if (!projectId) {
      throw new Error("Project ID no está definido.");
    }
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
    expect(res.body.some(p => p._id === projectId)).toBe(true);
  });

  it("PATCH restore /api/project/restore/:id", async () => {
    if (!projectId) {
      throw new Error("Project ID no está definido.");
    }
    const res = await request(app)
      .patch(`/api/project/restore/${projectId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toBe(200);
  });

  it("DELETE /api/project/:id", async () => {
    if (!projectId) {
      throw new Error("Project ID no está definido.");
    }
    const res = await request(app)
      .delete(`/api/project/${projectId}`)
      .set("Authorization", authToken);
    expect([200, 204]).toContain(res.statusCode);
  });
});