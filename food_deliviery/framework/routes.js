const fs = require('fs');
const path = require('path');
const Order = require('../models/order');
const Spot = require('../models/spot');

const BASE_DATA_PATH = path.join(__dirname, '../data');

function createResourceRoutes(app, resourceName, Model) {
    const DATA_PATH = path.join(BASE_DATA_PATH, `${resourceName}.json`);

    function readData() {
        try {
            const data = fs.readFileSync(DATA_PATH, 'utf-8');
            const parsed = data ? JSON.parse(data) : [];

            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
                return parsed[resourceName] || []; 

            return Array.isArray(parsed) ? parsed : [];
        } 
        catch (error) {
            console.error("Ошибка чтения файла:", error);
            return [];
        }
    }

    function writeData(items) {
        const dataToSave = { [resourceName]: items };
        fs.writeFileSync(DATA_PATH, JSON.stringify(dataToSave, null, 2));
    }

    const resource = `/${resourceName}`;

    app.get(resource, (req, res) => {
        res.json(readData());
    });

    app.get(`${resource}/:id`, (req, res) => {
        try {
            const items = readData();
            const item = items.find(i => i.id === Number(req.params.id));
            
            if (!item) return res.status(404).json({ message: `${resourceName} not found` });
            
            res.json(item);
        }
        catch (error) {
            console.log(error)
        }
    });

    app.post(resource, (req, res) => {
        const items = readData();
        const newItem = Model.create(req.body);

        items.push(newItem);

        writeData(items);
        res.status(201).json(newItem);
    });

    app.delete(`${resource}/:id`, (req, res) => {
        const items = readData();
        const filtered = items.filter(i => i.id !== Number(req.params.id));

        if (filtered.length === items.length) {
            return res.status(404).json({ message: 'Not found' });
        }

        writeData(filtered);
        res.json({ message: `${resourceName} deleted` });
    });

    app.patch(`${resource}/:id`, (req, res) => {
        const items = readData();
        const index = items.findIndex(i => i.id === Number(req.params.id));

        if (index === -1) return res.status(404).json({ message: 'Not found' });

        const instance = new Model(items[index]);
        instance.patch(req.body);
        
        items[index] = instance;
        writeData(items);
        res.json(instance);
    });
};

module.exports = (app) => {
    createResourceRoutes(app, 'orders', Order);
    createResourceRoutes(app, 'spots', Spot);

    app.get('/', (req, res) => {
        res.json({
            status: "Server is running",
            resources: ["/orders", "/spots"]
        });
    });
}