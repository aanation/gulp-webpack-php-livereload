let p = 4; 

const test = require('./test.js');

test()
    .then(() => {
        console.log('все получилось!')
    })
    .catch((err) => {
        console.log(err); 
    });