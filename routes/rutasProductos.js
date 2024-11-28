const rutas = require("express").Router();
const { mostrarProductos, busXId, deleteProd, newProd } = require("../bd/productoBD");

// Obtener todos los productos
rutas.get("/", async (req, res) => {
    const productosValidos = await mostrarProductos();
    res.json(productosValidos); // Respuesta de productos
});

// Buscar producto por ID
rutas.get("/buscarPorId/:id", async (req, res) => {
    const productoValido = await busXId(req.params.id);
    res.json(productoValido);
});

// Borrar producto por ID
rutas.delete("/borrarProducto/:id", async (req, res) => {
    const productoBorrado = await deleteProd(req.params.id);
    res.json(productoBorrado);
});

// Crear un nuevo producto
rutas.post("/nuevoProducto", async (req, res) => {
    const productoValido = await newProd(req.body);
    res.json(productoValido);
});

module.exports = rutas;