const fastify = require('fastify')({
  logger: true
});

const port = process.env.PORT || 3000;

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/'
});

fastify.post('/push', async (request, reply) => {

});

fastify.listen(port, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server listening on ${address}`);
});