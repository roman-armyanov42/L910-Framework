const url = require('url');

module.exports = class Router {
    constructor() {
        this.routes = [];
    }

    register(method, path, handler) {
        this.routes.push({ method, path, handler });
    }

    handle(req, res, next) {
        const { pathname, query } = url.parse(req.url, true);
        req.query = query;

        const method = req.method;

        for (const route of this.routes) {
            if (route.method !== method) continue;

            const params = this.match(route.path, pathname);

            if (params) {
                req.params = params;
                return route.handler(req, res);
            }
        }

        res.status(404).json({ message: 'Route not found' });
    }

    match(routePath, requestPath) {
        const routeParts = routePath.split('/');
        const requestParts = requestPath.split('/');

        if (routeParts.length !== requestParts.length) 
            return null;

        const params = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) 
                params[routeParts[i].slice(1)] = requestParts[i];
            else if (routeParts[i] !== requestParts[i])
                return null;
        }

        return params;
    }
}
