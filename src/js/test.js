module.exports = function() {
    const s = 4; 
    function coin() {
        return Math.random() <= 0.5; 
    };

    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if (coin()) {
                resolve(s);
            } else {
                reject(new Error('you are loser ^_^')); 
            }
        }, 2000);
    });
};