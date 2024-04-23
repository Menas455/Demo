const jwt = require('jsonwebtoken');
const conexion = require('../server/server');
const {promisify} = require('util');
const express = require('express');



exports.login = async (req, res) => {
    try {
        const usuario = req.body.nombre;
        const pass = req.body.pass;

        if(usuario == '' || pass == ''){
            res.render('login', {
                alert: true,
                icon: 'info',
                text: '¡Llene todos los campos!',
                title: 'ADVERTENCIA'
              })


        }else{
            conexion.query('SELECT * FROM contraloria_sesion WHERE usuario = ?', [usuario], (error, results) => {
                if(results.length > 0){
                    if(pass == results[0].passw){
                    //Datos correctos - redirecion al index
                        const id = results[0].id;
                        const token = jwt.sign({id:id}, process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA});
                        const cookiesOpciones = {
                            httpOnly: true
                        }

                        res.cookie('jwt', token, cookiesOpciones);
                        res.redirect('/');
    
                    }else{
                        //contraseña incorrecta
                        res.render('login', {
                            alert: true,
                            icon: 'error',
                            text: '¡Usuario o contraseña incorrecto!',
                            title: 'ADVERTENCIA'
                          })
    
                        }
                }else{
                    //usuario incorrecta
                  res.render('login', {
                    alert: true,
                    icon: 'error',
                    text: '¡Usuario o contraseña incorrecto!',
                    title: 'ADVERTENCIA'
                  })
            }
        });
        }
       
    } catch (error) {
        console.log(error);
    }
}


exports.autenticado = async(req, res, next)=>{
    if(req.cookie.jwt){
        try {
            const decodificar = await promisify(jwt.verify)(req.cookie.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM usuario WHERE id = ?', [decodificar], (error, results)=>{
                if(!results) return next();
                req.nombre = results;
                return next();
            })
        } catch (error) {
            console.log(error);
            return next();
        }
    }else{
        res.redirect('/');
    }
}
