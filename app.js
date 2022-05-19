//Requires 
var express = require('express');
const mysql = require('mysql');
const bodyParser = require ('body-parser');

const fileUpload = require('express-fileupload');

// CORS Middleware 
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header ("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret,Authorization");
    next();
});

//Inicializar variables
var app= express();

app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server - puerto 3000 online');
});

//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});




//Añadir un nuevo producto 

app.post('/producto', function (req, res) {
    let datosProducto = {
        //productId: 0, /*campo autoincremental */
        productName: req.body.name,
        productCode: req.body.code,
        productDate: req.body.date,
        price: parseInt(req.body.price),
        description: req.body.description,
        starRating: parseInt(req.body.rating),
        imageUrl: req.body.image
    };
    console.log(datosProducto)

    if (mc) {
        mc.query("INSERT INTO productos SET ?", datosProducto, function (error, result) {
            if (error) {
                res.status(500).json({"Mensaje": "Error"});
            }
            else{
                res.status(201).json({"Mensaje": "Insertado"});
            }
        });
        
    }
});
//Borrar un producto 
app.delete ('/producto/:id', function (req, res) {
    let id = req.params.id;
    if (mc) {
        console.log(id);
        mc.query("DELETE FROM products WHERE productId = ?", id, function (error, result) {
            if (error) {
                return res.status(500).json({"Mensaje": "Error"});
            }
            else {
                return res.status(200).json({ "Mensaje": "Registro con id=" + id + "Borrado"});
            }
        });
    }
});
// Actualizar un producto 
app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let producto = req.body;
    console.log(id);
    console.log(producto);
    if (!id || !producto) {
        return res.status(400).send ({ error: producto, message: 'Debe proveer un id y los datos de un producto'});
    }
    mc.query("UPDATE productos SET ? WHERE productId = ?", [producto, id], function (error, results, fields) {
        if (error) throw error;
        return res.status(200).json({"Mensaje": "Registro con id=" + id + "ha sido actualizado" });
    });
});

// Actualizar la imagen de un producto
app.put('/upload/producto/:id', (req, res) => {
    let id = req.params.id;
    if (!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }

    //Obtener nombre del archivo
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //solo estas extensiones aceptamos
    let extensionesValidas = ['png','jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo)<0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones válidas son' + extensionesValidas.join(',')}
        });
    };

    // Nombre de archivo personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path
    let path = `./uploads/productos/${nombreArchivo}`;

    console.log(path);

    archivo.mv(path, err => {
        if (err) {
            return res.status (500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: 'petición realizada correctamente'
        });
    })
});

//Recuperar todos los productos
app.get('/productos', function (req, res) {
    mc.query('SELECT * FROM productos', function (error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Lista de productos.'
        });
    });
});

//Configuración de la conexión
const mc = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'productos'
});
//Conectar a la base de datos
mc.connect();



