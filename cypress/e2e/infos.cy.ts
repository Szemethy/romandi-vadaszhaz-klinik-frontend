describe("InfosPage - egyszerű tesztek", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/infos");
  });

  it("oldal betölt és látható a cím", () => {
    cy.contains("Orvosi leletek").should("be.visible");
  });

  it("Betöltés jelzés megjelenik, ha nincs adat", () => {
    cy.contains("Betöltés...").should("exist");
  });

  it("Előző gomb kezdetben disabled", () => {
    cy.get("button").contains("Előző").should("be.disabled");
  });

  it("Következő gomb látható és nem disabled", () => {
    cy.get("button").contains("Következő").should("exist").and("not.be.disabled");
  });

  it("Oldalszám megjelenik", () => {
    cy.get("span").should("contain.text", "1 /");
  });

  it("PDF letöltés gomb létezik a mintalelet blokkban", () => {
    cy.get("button").contains("📄 Lelet letöltése").should("exist");
  });
});
