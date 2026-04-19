describe("DoctorServices Page - basic check", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/doctorservices/69e3df85a59be250f1ebe221");
  });

  it("1. Betölt az oldal (main látható)", () => {
    cy.get("body").should("exist");
  });
});
