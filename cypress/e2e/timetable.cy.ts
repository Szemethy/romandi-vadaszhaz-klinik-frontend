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

  it("Időtartam input létezik és alapértelmezett értéke 30 perc", () => {
    cy.get('input[type="number"]').should("exist").and("have.value", "30");
  });

  it("Kezdés és Befejezés inputok léteznek és alapértelmezett értékekkel", () => {
    cy.get('input[type="time"]').first().should("exist").and("have.value", "08:00");
    cy.get('input[type="time"]').last().should("exist").and("have.value", "12:00");
  });

  it("Hibaüzenet mező kezdetben nem látható", () => {
    cy.get("p.text-red-400").should("not.exist");
  });
});
