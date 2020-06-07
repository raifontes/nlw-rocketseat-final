const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db")

//  Configurar pasta pública
server.use(express.static("public"))

//  Habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

//  Utilizando tamplate engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/view", {
    express: server,
    noCache: true
})


//  Configurar caminhos da aplicação
//  Página inicial
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    
    //  req.query: Query Strings da nossa url

    return res.render("create-point.html",)
})

server.post("/savepoint", (req,res) =>{

    //req.body: O corpo do formulário

    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    ` 
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.render("create-point.html", {error: true})
        }

        console.log("Cadastrado com sucesso")
        //  O this funciona de uma maneira totalmente diferente em uma
        //  arrow function, logo a função tem que ser expressa da forma 
        //  convencional. Assistir o vídeo da rocketseat sobe this.
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {
    const search = req.query.search

    if(search == ""){
        //Pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }

    //  Pergar os dados do banco de dados
    //  Consultar os dados da tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }

        const total = rows.length

        //mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total})
    })
})

//  Ligar o servidor
server.listen(3000) //porta 3000