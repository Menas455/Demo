//Paquetes necesarios
const express = require('express');
const routes = express.Router();
const controlRutas = require('../controles/controlRutas')

//Rutas de las pantallas
routes.get('/', (req, res)=>{
    res.render('index');
});

routes.get('/login', (req, res)=>{
    res.render('login');
});


//Control de rutas 
routes.post('/login', controlRutas.login);

module.exports = routes;