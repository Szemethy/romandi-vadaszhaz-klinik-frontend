// cypress/e2e/my_services_simple.cy.js
describe('My Services Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/myservices');
  });

  it('Oldal betöltése a /my-services útvonalon', () => {
    cy.get('h1').contains('Szolgáltatásaim').should('exist');
  });

  it('Új szolgáltatás form megjelenik', () => {
    cy.get('h2').contains('Új szolgáltatás').should('exist');
    cy.get('input[placeholder="Szakterület"]').should('exist');
    cy.get('textarea[placeholder="Leírás"]').should('exist');
    cy.get('input[placeholder="Helyszín"]').should('exist');
    cy.get('input[placeholder="Ár"]').should('exist');
    cy.get('button').contains('Szolgáltatás létrehozása').should('exist');
  });

  it('Lista konténer megjelenik', () => {
    cy.get('.grid.gap-6').should('exist');
  });

  it('Pagination gombok léteznek', () => {
    cy.get('button').contains('Előző').should('exist');
    cy.get('button').contains('Következő').should('exist');
  });

  it('Ha nincs szolgáltatás, a placeholder üzenet látszik', () => {
    cy.get('p').contains('Nincs még szolgáltatásod.').should('exist');
  });
});