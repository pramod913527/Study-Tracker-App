const mongoose = require('mongoose');
const { setModels, aggregateDailyMetrics } = require('../jobs/analyticsAggregationJobs');

describe('Analytics Aggregation Jobs', () => {
  let Session, MetricsDaily;
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker_test', {});
    Session = mongoose.model('Session', require('../../../database/models/session').schema);
    MetricsDaily = mongoose.model('MetricsDaily', require('../../../database/models/metricsDaily').schema);
    setModels({ SessionModel: Session, MetricsDailyModel: MetricsDaily });
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  beforeEach(async () => {
    await Session.deleteMany({});
    await MetricsDaily.deleteMany({});
  });

  it('should aggregate daily metrics per student', async () => {
    const studentId = new mongoose.Types.ObjectId();
    const today = new Date();
    today.setHours(0,0,0,0);
    await Session.create([
      { slotId: new mongoose.Types.ObjectId(), date: today.toISOString().slice(0,10), plannedStartTs: today, plannedEndTs: new Date(today.getTime()+3600000), orgId: new mongoose.Types.ObjectId(), studentId, status: 'completed' },
      { slotId: new mongoose.Types.ObjectId(), date: today.toISOString().slice(0,10), plannedStartTs: today, plannedEndTs: new Date(today.getTime()+7200000), orgId: new mongoose.Types.ObjectId(), studentId, status: 'planned' }
    ]);
    await aggregateDailyMetrics(today);
    const agg = await MetricsDaily.findOne({ studentId, date: today.toISOString().slice(0,10) });
    expect(agg).toBeTruthy();
    expect(agg.completed).toBe(1);
    expect(agg.missed).toBe(1);
    expect(agg.total).toBe(2);
  });
});
