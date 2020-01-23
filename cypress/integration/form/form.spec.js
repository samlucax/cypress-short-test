/// <reference types="Cypress" />

var faker = require("faker");

context("Form", () => {
  beforeEach(() => {
    startRoutes();
    cy.visit("start?workflowType=DivorceWorkflow&diagnostics=true");
    cy.wait(["@postInfos"])
      .its("status")
      .should("be", 200);
  });

  it.only("When I fill the form it should be saved properly", () => {
    fillHaveDependents("No");
//     fillZip("32789");
//     fillConditions(["None of the above"]);
//     fillAgreeDivide("Yes");
//     fillDefaultOptions("Yes");
//     fillEmail();
//     submit();
//     closeAnalysisDialog(false);
//     accessDiagnosticsMenuTab();
//     assertDiagnosticsFormHasBeenCompleted();
  });
  
  it.only("When I do not fill it should not be saved", () => {
    cy.log("Yeah");
  });
});

function fillHaveDependents(haveDependents) {
  //radio
  cy.get("[data-cy=have_dependents]")
    .find(".mat-radio-label-content")
    .contains(haveDependents)
    .prev()
    .find('input[type="radio"]')
    .check({ force: true });
}

function fillZip(zip) {
  //text
  cy.get("[data-cy=zip]")
    .find('input[type="text"]')
    .type(zip);
}

function fillConditions(conditions) {
  conditions.forEach(condition => {
    //checkboxes
    cy.get("[data-cy=spec_cond_pre]")
      .find(".mat-checkbox-label")
      .contains(condition)
      .prev()
      .find('input[type="checkbox"]')
      .check({ force: true });
  });
}

function fillAgreeDivide(agree) {
  //radio
  cy.get("[data-cy=agree_divide]")
    .find(".mat-radio-label-content")
    .contains(agree)
    .prev()
    .find('input[type="radio"]')
    .check({ force: true });
}

function fillDefaultOptions(doIAmOk) {
  //radio
  cy.get("[data-cy=default]")
    .find(".mat-radio-label-content")
    .contains(doIAmOk)
    .prev()
    .find('input[type="radio"]')
    .check({ force: true });
}

function fillEmail() {
  //text
  cy.get("[data-cy=email]")
    .find('input[type="text"]')
    .type(faker.internet.email());
}

function submit() {
  //button
  cy.get("[data-cy=q-submit-btn]").click();
}

//it is displayed sometimes. With more time we can do this dinamically using conditional testing rules
function closeAnalysisDialog(close) {
  if (close) {
    cy.get("[data-cy=analysis-dialog-close]").click();
  }
}

function accessDiagnosticsMenuTab() {
  cy.wait(["@getRecommendations"])
    .its("status")
    .should("be", 200);
  cy.contains("Diagnostics")
    .parent()
    .find("a")
    .click();
}

function assertDiagnosticsFormHasBeenCompleted() {
  cy.get("[data-cy=q-list-title]")
    .parent()
    .next()
    .find("[data-cy=q-list-status]")
    .should("contain.text", "Complete");
}

function startRoutes() {
  cy.server();
  cy.route({
    method: "POST",
    url: "https://in.hotjar.com/api/v2/client/sites/1508247/visit-data?sv=5"
  }).as("postInfos");

  cy.route({
    method: "GET",
    url:
      "https://test-api.jdivorce.com/api/lawyers/recommendations/plan?workflow_type=DivorceWorkflow&workflow_stage=diagnostics"
  }).as("getRecommendations");
}
