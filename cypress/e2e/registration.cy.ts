// const állítás = (text: string, fn: Mocha.Func) => it(text, fn);

describe("Registration Page - alap tesztek", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/registration");
  });

  it("oldal betölt és látható a cím", () => {
    cy.contains("Regisztráció").should("be.visible");
  });

  it("lehet választani orvos vagy páciens szerepet", () => {
    cy.contains("Orvosként regisztrálok").click();
    cy.get('input[name="specialization"]').should("exist");

    cy.contains("Páciensként regisztrálok").click();
    cy.get('input[name="tajNumber"]').should("exist");
  });

  it("input mezők működnek", () => {
    cy.contains("Páciensként regisztrálok").click();
    cy.get('input[name="name"]').type("Teszt Elek").should("have.value", "Teszt Elek");
    cy.get('input[name="email"]').type("test@test.com").should("have.value", "test@test.com");
  });

  it("regisztráció gomb létezik és kattintható", () => {
    cy.contains("Páciensként regisztrálok").click();
    cy.get('button[type="submit"]').should("be.visible").and("not.be.disabled");
  });

  it("hibaüzenet megjelenik, ha mező üresen marad", () => {
    cy.contains("Páciensként regisztrálok").click();
    cy.get('button[type="submit"]').click();
    cy.get("p.text-red-400").should("exist");
  });
});
