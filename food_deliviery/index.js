const http = require('http')
const App = require('./framework/app');
const bodyParser = require('./framework/middleware')

const app = new App();
const PORT = 3000;

app.use(bodyParser);

require('./framework/routes')(app);

app.listen(PORT, () => {
    console.log('Server listening on: ', PORT)
});
