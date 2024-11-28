var rutas=require("express").Router();
//var {Router}= require("express");
var {mostrarUsuarios,busXId,deleteUser,newUser}= require("../bd/usuarioBD");

rutas.get("/", async (req, res)=>{
    var usuariosValidos = await mostrarUsuarios()
    res.json(usuariosValidos);
});

rutas.get("/buscarPorId/:id", async(req,res)=>{
    var usuarioValido = await busXId(req.params.id);
    res.json(usuarioValido);
});

rutas.delete("/borrarUsuario/:id", async(req,res)=>{
    var usuarioBorrado = await deleteUser(req.params.id);
    res.json(usuarioBorrado);
});

rutas.post("/nuevoUsuario", async(req, res)=>{
    var usuarioValido = await newUser(req.body);
    res.json(usuarioValido);
});

module.exports=rutas;