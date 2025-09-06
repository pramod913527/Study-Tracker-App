// Observability: Prometheus metrics setup
const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code']
});

function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    end({ code: res.statusCode });
  });
  next();
}

function metricsEndpoint(req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
}

module.exports = { metricsMiddleware, metricsEndpoint };
