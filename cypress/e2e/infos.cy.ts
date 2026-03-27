// cypress/e2e/infos_page.cy.js
describe("Orvosi leletek oldal", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/infos"); 
  });

  it("Oldal betöltése", () => {
    cy.get("body").should("be.visible");
  });

  it("Cím látszik", () => {
    cy.get("h1").contains("Orvosi leletek").should("exist");
  });

  it("Lapozó gombok látszanak", () => {
    cy.contains("Előző").should("exist");
    cy.contains("Következő").should("exist");
  });
});