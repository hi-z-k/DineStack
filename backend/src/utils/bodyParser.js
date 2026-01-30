const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch(err) { reject(new Error('Invalid JSON data')); }
        });
        req.on('error', err => reject(err));
    });
};
module.exports = getRequestBody;
