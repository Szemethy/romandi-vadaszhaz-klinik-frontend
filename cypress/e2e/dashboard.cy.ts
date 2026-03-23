describe("Dashboard oldal (mockolt, hibamentes)", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/api/users/login", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          name: "Teszt Elek",
          email: "test@test.com",
          role: "PATIENT",
          phone: "123456789",
          address: "Győr, Teszt utca 1",
          birthDate: "2000-01-01",
          tajNumber: "123456789",
        },
      },
    }).as("login");

    cy.intercept("PUT", "**/api/users/profile", {
      statusCode: 200,
      body: {
        name: "Teszt Elek",
        email: "test@test.com",
        role: "PATIENT",
        phone: "111111111",
        address: "Győr, Teszt utca 1",
        birthDate: "2000-01-01",
        tajNumber: "123456789",
      },
    }).as("updateProfile");

    cy.visit("http://localhost:8080/");

    cy.get('input[type="email"]').type("test@test.com");
    cy.get('input[type="password"]').type("123456");

    cy.contains("Belépés").click();
    cy.wait("@login");

    cy.visit("http://localhost:8080/dashboard");
  });

  describe("Alap elemek", () => {
    it("oldal betölt", () => {
      cy.get("body").should("be.visible");
    });

    it("profil cím megjelenik", () => {
      cy.contains("Személyes profil").should("exist");
    });

    it("mezők megjelennek", () => {
      cy.contains("Telefonszám").should("exist");
      cy.contains("Születési dátum").should("exist");
      cy.contains("Új jelszó").should("exist");
    });
  });

  describe("Szerkesztés mód", () => {
    it("módosítás gomb működik", () => {
      cy.contains("Módosítás").click();

      cy.contains("Mentés").should("exist");
      cy.contains("Mégse").should("exist");
    });

    it("inputok engedélyezve lesznek", () => {
      cy.contains("Módosítás").click();

      cy.get("input").first().should("not.be.disabled");
    });
  });

  describe("Input működés", () => {
    it("telefonszám módosítható", () => {
      cy.contains("Módosítás").click();

      cy.get("input").eq(0).clear().type("987654321").should("have.value", "987654321");
    });

    it("születési dátum módosítható", () => {
      cy.contains("Módosítás").click();

      cy.get('input[type="date"]').clear().type("1999-12-31").should("have.value", "1999-12-31");
    });
  });

  describe("Mentés", () => {
    it("mentés működik", () => {
      cy.contains("Módosítás").click();

      cy.get("input").eq(0).clear().type("111111111");

      cy.contains("Mentés").click();

      cy.wait("@updateProfile");

      cy.contains("Adatok sikeresen mentve!", { timeout: 5000 }).should("exist");
    });
  });

  describe("Mégse funkció", () => {
    it("módosítás visszavonása", () => {
      cy.contains("Módosítás").click();

      cy.get("input").eq(0).clear().type("999999");

      cy.contains("Mégse").click();

      cy.contains("Módosítások elvetve.").should("exist");
    });
  });

  describe("Logout", () => {
    it("kijelentkezés működik", () => {
      cy.contains("Kijelentkezés").click();

      cy.url().should("eq", "http://localhost:8080/");
    });
  });
});
