const express = require("express");
const cors = require("cors");
const session = require("express-session"); // Importar express-session
const usuariosRutas = require("./routes/rutasUsuarios");

const app = express();
app.use(session({
    secret: "281wigdwiug18ud",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si estás utilizando HTTPS
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", usuariosRutas);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});
