describe("Reset Password Page - minimal test", () => {
  const email = "doktor@gmail.com";

  it("betöltődik az oldal", () => {
    cy.visit(`/reset-password?email=${email}`);

    cy.contains("Új jelszó beállítása").should("exist");

    cy.get("button").contains("Jelszó módosítása").should("exist");
  });
});
