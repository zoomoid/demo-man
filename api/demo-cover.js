const fs = require('fs');

const cover = fs.readFileSync('./demo-cover').toString();

module.exports = {
  cover: cover,
}