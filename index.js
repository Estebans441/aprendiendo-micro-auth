const express = require('express');
const app = express();

app.disable('x-powered-by');

const PORT = process.env.PORT ?? 1234;

// Middleware - Ejecuta una funcion antes de llegar a la ruta
app.use((req, res, next) => {
    // revisar cookies, headers, etc
    if(req.method != 'POST') return next();
    
    let body = '';
    req.on('data', chunk =>{
        body += chunk.toString();
    });

    req.on('end', () => {
        const data = JSON.parse(body);
        data.timestamp = Date.now();
        req.body = data;
        next();
    });
});

// Resumen
// app.use(express.json());

// GET
app.get('/pokemon/ditto', (req, res) => {
    const dittoJSON = require('./pokemon/ditto.json');
    res.status(200).json(dittoJSON);
});

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

// POST
app.post('/pokemon', (req, res) => {
    res.status(200).json(req.body);
})

// 404 - Use para indicar que cualquier funcion que llegue a este punto no fue encontrada
app.use((req, res) => {
    res.status(404).send('<h1>Página no encontrada<h1>');
});

// LISTEN
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
