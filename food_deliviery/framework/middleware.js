module.exports = function bodyParser(req, res, next) {
    if (req.method === 'GET' || req.method === 'DELETE')
        return next();

    let rawData = '';

    req.on('data', (chunk) => {
        rawData += chunk.toString();
    });

    req.on('end', () => {
        if (!rawData) {
            req.body = {};
            return next();
        }

        try {
            req.body = JSON.parse(rawData);
            next();
        } 
        catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
    });

    req.on('error', (err) => {
        console.error(err);
        res.writeHead(500);
        res.end('Server Error');
    });
}