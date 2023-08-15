require("dotenv").config();

//importando o express e o bodyparser
const express = require('express')
const bodyParser = require('body-parser')

//importando o script de inicializacao do banco de dados
const tabelas = require('./database/tabelas')

//importando as rotas da API
const endpoint = require('./routes/endpoint')

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

//cria uma aplicação express
const app = express()


//parse das requisicoes do tipo application/json
app.use(bodyParser.json())

//porta em que a app será executada
const port = 3000

//inicializacao do banco de dados
tabelas.inicializa()

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//define que as requisicoes ao endereco "/filmes" devem ser tratada pelo filmeRouter
app.use('/', endpoint)

//executando a aplicação na porta definida
app.listen(port, () => {
  console.log(`O servidor está sendo executado em http://localhost:${port}`)
})