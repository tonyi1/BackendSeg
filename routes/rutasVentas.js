const rutas = require("express").Router();
const { mostrarVentas, busXId, cancelSale, newSale } = require("../bd/ventasBD");

// Obtener todos los productos
rutas.get("/", async (req, res) => {
    const ventasValidas = await mostrarVentas();
    res.json(ventasValidas); // Respuesta de productos
});

// Buscar producto por ID
rutas.get("/buscarPorId/:id", async (req, res) => {
    const ventaValida = await busXId(req.params.id);
    res.json(ventaValida);
});

// Borrar producto por ID
rutas.patch("/cancelarVenta/:id", async (req, res) => {
    const ventaCancelada = await cancelSale(req.params.id);
    res.json(ventaCancelada);
});

// Crear un nuevo producto
rutas.post("/nuevaVenta", async (req, res) => {
    const ventaValida = await newSale(req.body);
    res.json(ventaValida);
});

module.exports = rutas;