require('dotenv').config();
const express = require('express')
const mysql = require('mysql2')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.set("views", "views")

const db = mysql.createConnection({
    host: "localhost",
    database: process.env.DB,
    user: "root",
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

db.connect((err) => {
    if (err) throw err
    console.log(`Connected`)

    app.get("/", (req, res) => {
        const selectQuery = "SELECT * FROM mahasiswa";
        db.query(selectQuery, (err, result) => {
            const users = JSON.parse(JSON.stringify(result))
            res.render("index", { users: users, title: "Daftar Mahasiswa" })
        });
    });

    app.post("/tambah", (req, res) => {
        const insertQuery = `INSERT INTO mahasiswa (nama, kelas) VALUES ('${req.body.nama}', '${req.body.kelas}');`
        db.query(insertQuery, (err, result) => {
            if (err) throw err;
            res.redirect("/");
        });
    });

    app.post("/update", (req, res) => {
        const updateQuery = `UPDATE mahasiswa SET kelas = '${req.body.updateKelas}' WHERE nama = '${req.body.nama}';`
        db.query(updateQuery, (err, result) => {
            if (err) throw err;
            res.redirect("/");
        });
    });

    app.post("/delete", (req, res) => {
        const deleteQuery = `DELETE FROM mahasiswa WHERE nama = '${req.body.nama}' OR id = '${req.body.IDMahasiswa}';`
        db.query(deleteQuery, (err, result) => {
            if (err) throw err;
            res.redirect("/");
        })
    });

});

app.listen(8000, () => {
    console.log(`server ready`);
})