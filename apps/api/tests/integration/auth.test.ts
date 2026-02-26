import request from "supertest";
import app from "../../src/index";

describe("POST /api/auth/register", () => {
  it("returns 201 with user data on success", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: `test-${Date.now()}@cleus.ai`, username: `user${Date.now()}`, password: "SecurePass123!" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email");
  });

  it("returns 409 on duplicate email", async () => {
    const data = { email: "dup@cleus.ai", username: "dupuser", password: "SecurePass123!" };
    await request(app).post("/api/auth/register").send(data);
    const res = await request(app).post("/api/auth/register").send(data);
    expect(res.status).toBe(409);
  });
});
