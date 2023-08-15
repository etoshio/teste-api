const conexao = require('./conexao')

exports.inicializa = () => {
    conexao.query("CREATE TABLE IF  NOT EXISTS cliente (uuid varchar(100), cpf varchar(20) NOT NULL, nome varchar(100) NOT NULL, email varchar(100) NOT NULL, dataDeNascimento DATETIME NOT NULL, genero varchar(20) NOT NULL, rendaMensal DECIMAL(12,2) NOT NULL, PRIMARY KEY(uuid) )", (err, result, fields) => {
        if (err) {
            console.log("Ocorreu um erro ao tentar criar a tabela no banco de dados.")
        } else {
            console.log("Tabela criada com sucesso!")
        }
    })

    conexao.query("CREATE TABLE IF  NOT EXISTS produto (uuid varchar(100), nome varchar(100) NOT NULL, susep varchar(100) NOT NULL, expiracaoDeVenda DATETIME NOT NULL, valorMinimoAporteInicial DECIMAL(12,2) NOT NULL, valorMinimoAporteExtra DECIMAL(12,2) NOT NULL, idadeDeEntrada INT NOT NULL, idadeDeSaida INT NOT NULL, carenciaInicialDeResgate INT NOT NULL, carenciaEntreResgates INT NOT NULL, PRIMARY KEY(uuid) )", (err, result, fields) => {
        if (err) {
            console.log("Ocorreu um erro ao tentar criar a tabela no banco de dados.")
        } else {
            console.log("Tabela criada com sucesso!")
        }
    })

    conexao.query("CREATE TABLE IF  NOT EXISTS plano (uuid varchar(100), idCliente varchar(100) NOT NULL, idProduto varchar(100) NOT NULL, aporte DECIMAL(12,2) NOT NULL, dataDaContratacao DATETIME NOT NULL, idadeDeAposentadoria INT NOT NULL, dataDaCarencia DATETIME NULL, PRIMARY KEY(uuid) )", (err, result, fields) => {
        if (err) {
            console.log("Ocorreu um erro ao tentar criar a tabela no banco de dados.")
        } else {
            console.log("Tabela criada com sucesso!")
        }
    })
}