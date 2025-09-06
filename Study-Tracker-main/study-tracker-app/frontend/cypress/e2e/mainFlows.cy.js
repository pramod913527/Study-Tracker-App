describe('Main Flows', () => {
  it('Signup, create timetable, start/complete session', () => {
    cy.visit('/');
    cy.contains('Signup').click();
    cy.get('input[type=email]').type('testuser@example.com');
    cy.get('input[type=password]').type('password123');
    cy.contains('Sign Up').click();
    cy.contains('Timetable').click();
    cy.contains('Add Slot').click();
    cy.get('input[name=subject]').type('Math');
    cy.get('input[name=time]').type('10:00');
    cy.contains('Save').click();
    cy.contains('Student PWA').click();
    cy.contains('Start Session').click();
    cy.contains('Complete Session').click();
    cy.contains('Session completed').should('exist');
  });
});
