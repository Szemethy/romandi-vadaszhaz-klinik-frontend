// cypress/e2e/forgot_password.cy.js
describe("Forgot Password Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/forgot-password");
  });

  it("Oldal betöltése", () => {
    cy.get("h1").contains("Jelszó visszaállítás").should("exist");
  });

  it("Email input mező létezik", () => {
    cy.get('input[type="email"]').should("exist");
  });

  it("Küldés gomb létezik és látható", () => {
    cy.get("button").contains("Kód küldése").should("be.visible");
  });

  it("Üres email mezővel kattintás hibát jelez", () => {
    cy.get("button").contains("Kód küldése").click();
    cy.contains("Add meg az email címet").should("exist");
  });

  it("Email beírható az input mezőbe", () => {
    cy.get('input[type="email"]')
      .type("teszt@test.com")
      .should("have.value", "teszt@test.com");
  });
});