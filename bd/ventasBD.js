const ventasBD = require("./conexion").ventas;
const usuarioBD = require("./conexion").usuarios; // Asumiendo que esto es correcto
const productoBD = require("./conexion").productos; // Asumiendo que esto es correcto
const admin = require('firebase-admin');
const Venta = require("../modelos/VentaModelo"); // Importa el modelo de Producto

// Función para validar datos de la venta
function validarDatos(venta) {

    return venta.idUsuario !== undefined && 
           venta.idProducto !== undefined && 
           venta.fec_hora !== undefined && 
           venta.cantidad !== undefined &&
           venta.estado !== undefined;
}

// Mostrar todas las ventas
async function mostrarVentas() {
    const ventas = await ventasBD.get();
    let ventasValidas = [];
    
    for (const venta of ventas.docs) { // Uso de `for...of` para manejar promesas
        const venta1 = new Venta({ id: venta.id, ...venta.data() });

        // Obtener usuario y producto
        const usuario1 = await usuarioBD.doc(venta1.idUsuario).get(); 
        const producto1 = await productoBD.doc(venta1.idProducto).get(); 
        
        if (!usuario1.exists || !producto1.exists) {
            console.log("Usuario o producto no encontrado");
            continue; // Saltar esta venta si falta el usuario o el producto
        }
        
        const usuario = usuario1.data();
        const producto = producto1.data();

        // Validar datos y agregar nombre en lugar de ID
        if (validarDatos(venta1.getVenta, usuario, producto)) {
            const ventaConNombres = {
                ...venta1.getVenta,
                usuarioNombre: usuario.nombre, 
                productoNombre: producto.nombre
            };
            ventasValidas.push(ventaConNombres);
        }
    }

    return ventasValidas;
}

// Buscar venta por ID
async function busXId(id) {
    const venta = await ventasBD.doc(id).get();
    
    if (!venta.exists) return null; // Si no existe la venta, devolver null
    
    const venta1 = new Venta({ id: venta.id, ...venta.data() });

    const usuario = await usuarioBD.doc(venta1.idUsuario).get();
    const producto = await productoBD.doc(venta1.idProducto).get();

    if (!usuario.exists || !producto.exists) return null; // Validar que ambos existan

    if (validarDatos(venta1.getVenta, usuario.data(), producto.data())) {
        return {
            ...venta1.getVenta,
            usuarioNombre: usuario.data().nombre,
            productoNombre: producto.data().nombre
        };
    }
    
    return null;
}

// Crear una nueva venta
async function newSale(data) {
    const venta1 = new Venta({
        ...data, 
        fec_hora: admin.firestore.Timestamp.now(), // Añadir la fecha y hora automáticamente
        estado: 'pendiente' // Establecer estado inicial como 'pendiente'
    });

    // Obtener datos de usuario y producto
    const usuario = await usuarioBD.doc(data.idUsuario).get();
    const producto = await productoBD.doc(data.idProducto).get();

    // Validar que existan usuario y producto
    if (!usuario.exists || !producto.exists) return false;

    // Validar los datos de la venta
    if (validarDatos(venta1.getVenta, usuario.data(), producto.data())) {
        // Si todo es válido, actualizar el estado a "vendido"
        await ventasBD.doc().set({
            ...venta1.getVenta,
            estado: 'vendido' // Cambiar el estado a "vendido" antes de guardar
        });

        return true;
    }

    return false;
}

// Cancelar venta por ID
async function cancelSale(id) {
    const ventaValida = await busXId(id);
    
    if (ventaValida) {
        // Marcar la venta como cancelada en lugar de eliminarla
        await ventasBD.doc(id).update({
            estado: 'cancelado' // O puedes usar cancelado: true
        });
        return true;
    }
    
    return false;
}

module.exports = {
    mostrarVentas,
    busXId,
    cancelSale,
    newSale
};