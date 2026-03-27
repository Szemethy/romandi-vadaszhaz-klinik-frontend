describe("Reset Password Page - minimal test", () => {
  const email = "doktor%40gmail.com";

  it("betöltődik az oldal", () => {
    cy.visit(`http://localhost:8080/reset-password?email=${email}`);

    cy.contains("Új jelszó beállítása").should("exist");

    cy.get("button").contains("Jelszó módosítása").should("exist");
  });

  it("email megjelenik az input mezőben", () => {
  const email = "doktor%40gmail.com";

  cy.visit(`http://localhost:8080/reset-password?email=${email}`);

  cy.get("input").first().should("have.value", "doktor@gmail.com");
});

it("felhasználó tud írni a mezőkbe", () => {
  cy.visit(`http://localhost:8080/reset-password?email=${email}`);

  cy.get('input[placeholder="6 jegyű kód"]').type("123456");
  cy.get('input[placeholder="Új jelszó"]').type("Teszt123!");
  cy.get('input[placeholder="Jelszó megerősítése"]').type("Teszt123!");

  cy.get('input[placeholder="6 jegyű kód"]').should("have.value", "123456");
});
});
