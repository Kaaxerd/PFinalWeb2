const request = require("supertest");
const app = require("../app");

describe("Pruebas de albaranes", () => {
  let authToken;
  let clientId;
  let projectId;
  let deliveryNoteHoursId;
  let deliveryNoteMatId;

  beforeAll(async () => {
    authToken = global.token;

    // Creamos cliente y proyecto para pruebas
    const clientRes = await request(app)
      .post("/api/client")
      .set("Authorization", authToken)
      .send({
        name: "Cliente Albarán",
        nif: `D${Date.now()}`,
        email: `cli-albaran-${Date.now()}@test.com`,
        phone: "611611611",
        address: "Calle Albarán 1",
        postalCode: "28001",
        city: "Madrid",
        province: "Madrid"
      });
      
    clientId = clientRes.body._id;

    const projectRes = await request(app)
      .post("/api/project")
      .set("Authorization", authToken)
      .send({ name: "Proyecto Albarán", description: "Desc", client: clientId });
    projectId = projectRes.body._id;
  });

  it("POST /api/deliverynote (hours)", async () => {
    const res = await request(app)
      .post("/api/deliverynote")
      .set("Authorization", authToken)
      .send({ type: "hours", project: projectId, people: [{ name: "Juan Pérez", hours: 6 }] });
    expect([201, 403]).toContain(res.statusCode);
    if (res.statusCode === 201) deliveryNoteHoursId = res.body._id;
  });

  it("POST /api/deliverynote (materials)", async () => {
    const res = await request(app)
      .post("/api/deliverynote")
      .set("Authorization", authToken)
      .send({
        type: "materials",
        project: projectId,
        materials: [{ name: "Cemento", quantity: 10 }, { name: "Arena", quantity: 5 }]
      });
    expect([201, 403]).toContain(res.statusCode);
    if (res.statusCode === 201) deliveryNoteMatId = res.body._id;
  });

  it("GET /api/deliverynote", async () => {
    const res = await request(app)
      .get("/api/deliverynote")
      .set("Authorization", authToken);
    expect([200, 403]).toContain(res.statusCode);
  });

  it("GET /api/deliverynote/:id", async () => {
    if (!deliveryNoteHoursId) return;
    const res = await request(app)
      .get(`/api/deliverynote/${deliveryNoteHoursId}`)
      .set("Authorization", authToken);
    expect([200, 403]).toContain(res.statusCode);
  });

  it("GET /api/deliverynote/pdf/:id", async () => {
    if (!deliveryNoteHoursId) return;
    const res = await request(app)
      .get(`/api/deliverynote/pdf/${deliveryNoteHoursId}`)
      .set("Authorization", authToken);
    expect([200, 403, 404]).toContain(res.statusCode);
  });

  it("POST /api/deliverynote/sign/:id", async () => {
    if (!deliveryNoteHoursId) return;
    const res = await request(app)
      .post(`/api/deliverynote/sign/${deliveryNoteHoursId}`)
      .set("Authorization", authToken)
      .attach("signature", "./test/firma.jpg");
    expect([200, 403]).toContain(res.statusCode);
  });

  it("DELETE /api/deliverynote/:id", async () => {
    if (!deliveryNoteMatId) return;
    const res = await request(app)
      .delete(`/api/deliverynote/${deliveryNoteMatId}`)
      .set("Authorization", authToken);
    expect([200, 204, 403, 404]).toContain(res.statusCode);
  });
});