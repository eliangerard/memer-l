const { client } = require("./services/client");
const { io, server, app } = require('./events/socket');
const { router } = require('./events/server');
const { connection } = require('./services/db');
const { auth } = require('./api/routes/auth');
const cors = require('cors');
const { music } = require('./api/routes/music');

connection.then(() => {
    console.log('DB: Connected to database');
}).catch((err) => {
    console.error('DB: ' + err);
});

app.use(cors());
app.use(router);
app.use(auth);
app.use(music);

server.listen(client.config.port, () => {
    console.log(`listening on *:${client.config.port}`);
});

client.login(process.env.DISCORD_TOKEN);