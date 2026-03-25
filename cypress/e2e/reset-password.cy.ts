// cypress/e2e/reset_password.cy.ts

describe("Reset Password Page", () => {
  const baseUrl = "http://localhost:8000/reset-password"; // fejlesztői URL

  beforeEach(() => {
    // Feltöltjük az URL-t query param-mal
    cy.visit(`${baseUrl}/reset-password?email=doktor%40gmail.com`);
  });

  it("megjeleníti az összes input mezőt és gombot", () => {
    cy.get("input[disabled]").should("have.value", "test@example.com"); // email
    cy.get('input[placeholder="6 jegyű kód"]').should("exist");
    cy.get('input[placeholder="Új jelszó"]').should("exist");
    cy.get('input[placeholder="Jelszó megerősítése"]').should("exist");
    cy.get("button").contains("Jelszó módosítása").should("exist");
  });

  it("hibát jelenít meg, ha a backend visszadobja", () => {
    cy.intercept("POST", "**/api/users/reset-password", {
      statusCode: 400,
      body: { message: "Helytelen kód" },
    }).as("resetRequest");

    cy.get('input[placeholder="6 jegyű kód"]').type("123456");
    cy.get('input[placeholder="Új jelszó"]').type("Test1234!");
    cy.get('input[placeholder="Jelszó megerősítése"]').type("Test1234!");

    cy.get("button").contains("Jelszó módosítása").click();

    cy.wait("@resetRequest");

    cy.get(".text-red-400").should("contain.text", "Helytelen kód");
  });

  it("sikeresen átirányít a főoldalra", () => {
    cy.intercept("POST", "**/api/users/reset-password", {
      statusCode: 200,
      body: { message: "Sikeres reset" },
    }).as("resetRequest");

    cy.get('input[placeholder="6 jegyű kód"]').type("654321");
    cy.get('input[placeholder="Új jelszó"]').type("NewPass123!");
    cy.get('input[placeholder="Jelszó megerősítése"]').type("NewPass123!");

    cy.get("button").contains("Jelszó módosítása").click();

    cy.wait("@resetRequest");

    cy.url().should("eq", `${baseUrl}/`); // visszairányítás a főoldalra
  });
});
