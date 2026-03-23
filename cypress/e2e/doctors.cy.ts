// cypress/e2e/doctors.simple.spec.ts
describe("Doctors Page - egyszerű ellenőrzés", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/doctors");
  });

  it("Az oldal betölt", () => {
    cy.get("main").should("exist");
  });

  it("A cím megjelenik", () => {
    cy.contains("Orvosaink").should("exist");
  });
});