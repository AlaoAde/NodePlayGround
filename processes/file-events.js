const fs = require('fs');
fs.watch(__filename, { persistent: false }, (event, filename) => {
    console.log(event);
    console.log(filename);
})

setImmediate(function() {
    fs.rename(__filename, __filename + '.new', () => {});
});