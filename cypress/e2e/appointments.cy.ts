// cypress/e2e/appointments_simple.cy.ts
describe("Appointments Page", () => {
  it("Oldal betöltése és cím ellenőrzése", () => {
    cy.visit("http://localhost:8080/appointments");

    cy.get("h1").contains("Időpontok").should("exist");
  });
});