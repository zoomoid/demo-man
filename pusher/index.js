const fastify = require('fastify')({ logger: true });
const path = require('path');
const { log } = require('@zoomoid/log');
const pump = require('pump');

const token = process.env.TOKEN;
if(!token){
  log(`Could not find provided token in ENV variables. Protected routes will reject requests`, `type`, `Warning`);
}
const port = process.env.PORT || 3000;

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/'
});

fastify.register(require('fastify-multipart'), {
  limits: {
    files: 1, // Upload at most one file at a time, otherwise our album -> track mapping will break
    fileSize: 25000000, // should be 25MB
  }
});

fastify.post('/push', async (request, reply) => {
  if(!request.isMultipart()){
    request.log.error('No form-data/multipart post, rejecting request');
    reply.code(400).send(new Error('Request is not multipart'));
    return
  }

  const mp = request.multipart(handler, onEnd);

  function onEnd(err) {
    request.log.info('Upload completed')
    reply.redirect('/#/success'); // Redirect to /#/success on finished upload
  }

  function handler(field, file, filename, encoding, mimetype) {
    // TODO: implement this!
    // How do we determine where to insert the file to (i.e. which directory) ?
    // Naive solution: Query /api/ for all albums and present user with combobox
    // => require axios in pusher-front-end
    // => require request-like in pusher to validate combobox selection server-side
    // ===> Still feasible?

    const ALBUM = field.album // TODO: check this

    pump(file, fs.createWriteStream(path.join(__dirname, ALBUM, filename)));
  }
});

fastify.listen(port, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server listening on ${address}`);
});