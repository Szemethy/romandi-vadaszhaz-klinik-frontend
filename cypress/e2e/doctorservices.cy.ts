// cypress/e2e/doctorservices.cy.ts

describe("DoctorServices Page - alap tesztek", () => {
  const doctorId = "69e3df85a59be250f1ebe221";

  beforeEach(() => {
    cy.visit(`http://localhost:8080/doctorservices/${doctorId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "auth-storage",
          JSON.stringify({
            state: {
              user: {
                id: "1",
                role: "PATIENT",
                name: "Test User",
                email: "test@test.hu",
                phone: "",
                address: "",
                tajNumber: "",
              },
              token: "fake-token",
            },
          }),
        );
      },
    });
  });

  it("1. Az oldal betölt", () => {
    cy.get("main").should("exist");
  });

  it("2. Látszik a Szolgáltatások cím", () => {
    cy.contains("Szolgáltatások").should("exist");
  });
});
