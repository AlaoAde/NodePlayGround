'use strict';
const fs = require('fs');
fs.writeFile('target.txt', 'Replacement Text', (err) => {
    if (err) {
        throw err;
    }
    console.log('File saved!');
});
