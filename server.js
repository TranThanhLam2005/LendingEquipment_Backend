const app = require('./app');
const PORT = process.env.PORT;
const HOST = process.env.HOST_ChauThanh;

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});