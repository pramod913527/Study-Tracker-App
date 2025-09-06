// Escalation & Rules Engine: evaluate missed sessions and trigger actions (mocked)
const escalationLog = [];

class RulesEngine {
  constructor() {
    this.rules = [];
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  async evaluate(context) {
    for (const rule of this.rules) {
      if (rule.condition(context)) {
        await rule.action(context);
        escalationLog.push({ rule: rule.name, context, triggered: true, timestamp: new Date() });
      }
    }
  }

  getLog() {
    return escalationLog;
  }
}

// Example: Missed session escalation rule
function missedSessionRule(action) {
  return {
    name: 'missed_session',
    condition: ctx => ctx.session && ctx.session.status !== 'completed',
    action
  };
}

module.exports = { RulesEngine, missedSessionRule };
