const { RulesEngine, missedSessionRule } = require('../services/rulesEngine');

describe('Escalation & Rules Engine', () => {
  it('should trigger escalation action for missed session', async () => {
    const engine = new RulesEngine();
    let triggered = false;
    engine.addRule(missedSessionRule(async (ctx) => { triggered = true; ctx.actionDone = true; }));
    const context = { session: { status: 'planned' } };
    await engine.evaluate(context);
    expect(triggered).toBe(true);
    expect(context.actionDone).toBe(true);
  });

  it('should not trigger action for completed session', async () => {
    const engine = new RulesEngine();
    let triggered = false;
    engine.addRule(missedSessionRule(async (ctx) => { triggered = true; }));
    const context = { session: { status: 'completed' } };
    await engine.evaluate(context);
    expect(triggered).toBe(false);
  });
});
