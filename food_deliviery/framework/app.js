const http = require('http')
const Router = require('./router');

module.exports = class App {
    constructor() {
        this.router = new Router();
        this.middlewares = [];
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this.handle(req, res);
        });

        server.listen(port, callback);
    }

    handle(req, res) {
        res.status = function (code) {
            res.statusCode = code;
            return res;
        };

        res.send = function (data) {
            res.end(data);
        };

        res.json = function (obj) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
        };

        let index = 0;
        const stack = [...this.middlewares, this.router.handle.bind(this.router)];

        const next = () => {
            const layer = stack[index++];
            if (!layer) return;
            layer(req, res, next);
        };

        next();
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    get(url, handler) {
        this.router.register('GET', url, handler);
    }

    post(url, handler) {
        this.router.register('POST', url, handler);
    }

    patch(url, handler) {
        this.router.register('PATCH', url, handler);
    }

    delete(url, handler) {
        this.router.register('DELETE', url, handler);
    }
}