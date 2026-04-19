describe("Timetable Page - alap tesztek", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/timetable", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "__STORE__", {
          value: {
            user: { id: 1, role: "DOCTOR" },
            token: "fake-token",
          },
          writable: true,
        });
      },
    });
  });

  it("Mentés gomb létezik és nem disabled", () => {
    cy.get("button").contains("Mentés").should("exist").and("not.be.disabled");
  });

  it("Nap kiválasztó létezik és tartalmazza a hét napjait", () => {
    cy.get("select").should("exist");
    cy.get("select option").should("have.length", 7);
    cy.get("select option").first().should("contain.text", "Hétfő");
  });

  it("Hibaüzenet mező kezdetben nem látható", () => {
    cy.get("p.text-red-400").should("not.exist");
  });
});
