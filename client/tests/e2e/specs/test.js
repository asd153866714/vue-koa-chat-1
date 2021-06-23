// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
  });
  it("Redirect to login page", () => {
    cy.get('[type="button"]').should("have.value", "登入");
  });
});
