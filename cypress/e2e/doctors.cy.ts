describe("Doctors Page - smoke test", () => {
  it("Az oldal betölt", () => {
    cy.visit("http://localhost:8080/doctors");

    cy.get("main", { timeout: 10000 }).should("exist");
  });
  it("Betöltés felirat látszik", () => {
    cy.visit("http://localhost:8080/doctors");

    cy.contains("Betöltés", { timeout: 10000 }).should("be.visible");
  });
});
