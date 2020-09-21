const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

module.exports = themeName => {
  const themePath = path.join(__dirname, `../themes/theme-${themeName}-vars.less`);
  const less = fs.readFileSync(themePath, 'utf8');
  const themeConfigs = lessToJs(less);
  return themeConfigs;
};
