describe("NewRecordPage - alap tesztek", () => {
  const appointmentId = "teszt-id-123";

  it("betöltődik az oldal címe", () => {
    cy.visit(`/newrecord/${appointmentId}`);
    cy.contains("Lelet készítése").should("exist");
  });

  it("betöltés szöveg megjelenik", () => {
    cy.visit(`/newrecord/${appointmentId}`);
    cy.contains("Betöltés...").should("exist");
  });

  it("textarea és mentés gomb megjelenik", () => {
    cy.visit(`/newrecord/${appointmentId}`);
    cy.get("textarea[placeholder='Írd ide a leletet...']").should("exist");
    cy.contains("Lelet mentése").should("exist");
  });
});