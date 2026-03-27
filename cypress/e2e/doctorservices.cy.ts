it("debug", () => {
  cy.visit("http://localhost:8080/doctorservices/69c3900b83e25eb460d13192");

  cy.get("body").then(($body) => {
    console.log($body.html());
  });
});

it("betöltődik a szolgáltatások oldal", () => {
  cy.visit("http://localhost:8080/doctorservices/69c3900b83e25eb460d13192");

  cy.contains("Szolgáltatások").should("exist");
});

it("loading szöveg megjelenik", () => {
  cy.visit("http://localhost:8080/doctorservices/69c3900b83e25eb460d13192");

  cy.contains("Betöltés...").should("exist");
});

it("loading szöveg megjelenik", () => {
  cy.visit("http://localhost:8080/doctorservices/69c3900b83e25eb460d13192");

  cy.contains("Betöltés...").should("exist");
});