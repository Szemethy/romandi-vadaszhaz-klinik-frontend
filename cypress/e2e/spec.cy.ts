describe("Romandi login oldal", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/");
  });

  describe("Alap elemek", () => {
    it("oldal betölt", () => {
      cy.get("body").should("be.visible");
    });

    it("címek megjelennek", () => {
      cy.contains("Romándi Vadászház Klinik").should("exist");
      cy.contains("Bejelentkezés").should("exist");
    });

    it("input mezők léteznek", () => {
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="password"]').should("exist");
    });

    it("gombok léteznek", () => {
      cy.get("button").should("have.length.greaterThan", 0);
    });
  });

  describe("Input működés", () => {
    it("lehet írni az input mezőkbe", () => {
      cy.get('input[type="email"]').type("test@test.com").should("have.value", "test@test.com");

      cy.get('input[type="password"]').type("123456").should("have.value", "123456");
    });
  });

  describe("Validáció", () => {
    it("üres email + jelszó", () => {
      cy.contains("Belépés").click();
      cy.contains("Kérlek add meg az email címet és a jelszót!").should("exist");
    });

    it("csak email hiányzik", () => {
      cy.get('input[type="password"]').type("123456");
      cy.contains("Belépés").click();

      cy.contains("Az email mező nem lehet üres!").should("exist");
    });

    it("csak jelszó hiányzik", () => {
      cy.get('input[type="email"]').type("test@test.com");
      cy.contains("Belépés").click();

      cy.contains("A jelszó mező nem lehet üres!").should("exist");
    });
  });

  describe("Hibakezelés", () => {
    it("hibás login esetén hibaüzenet", () => {
      cy.get('input[type="email"]').type("rossz@test.com");
      cy.get('input[type="password"]').type("rossz");

      cy.contains("Belépés").click();

      cy.contains("Hibás email vagy jelszó").should("exist");
    });
  });

  describe("Navigáció", () => {
    it("regisztráció oldalra navigál", () => {
      cy.contains("Regisztráció").click();
      cy.url().should("include", "registration");
    });

    it("elfelejtett jelszó oldalra navigál", () => {
      cy.contains("Elfelejtetted a jelszavad?").click();
      cy.url().should("include", "forgot-password");
    });
  });

  describe("Felhasználói interakció", () => {
    it("enter lenyomás működik", () => {
      cy.get('input[type="email"]').type("test@test.com");
      cy.get('input[type="password"]').type("123456{enter}");
    });

    it("loading állapot megjelenik", () => {
      cy.get('input[type="email"]').type("test@test.com");
      cy.get('input[type="password"]').type("123456");

      cy.contains("Belépés").click();

      cy.contains("Belépés...").should("exist");
    });
  });
});
