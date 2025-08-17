const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'data');

module.exports = {
  saveResult: (id, obj) => {
    const dir = path.join(base, id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(obj, null, 2));
  },
  loadResult: (id) => {
    const file = path.join(base, id, 'result.json');
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
};
