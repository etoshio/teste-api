const mysql = require('mysql2/promise');

const client = mysql.createPool(process.env.CONNECTION_STRING);
const cliente = require('../controllers/cliente')
const produto = require('../controllers/produto')
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

exports.adiciona = async (req, res) => {
    // #swagger.tags = ['Plano']
    // #swagger.description = 'Endpoint para adicionar um plano.'
    /* #swagger.parameters['addPlano'] = {
        in: 'body',
        description: 'Informações do plano.',
        required: true,
        schema: { $ref: "#/definitions/AddPlano" }
    } */
    var uuid = uuidv4();

    const resultsCliente = await cliente.buscaPorId(req.body.idCliente);
    if(resultsCliente.length == 0) {
        return res.status(400).json({"error": "Cliente inexistente " + req.body.idCliente})
    }

    const resultsProduto = await produto.buscaPorId(req.body.idProduto);
    if(resultsProduto.length == 0) {
        return res.status(400).json({"error": "Produto inexistente " + req.body.idProduto})
    }

    var expiracaoDeVenda = new Date(resultsProduto[0].expiracaoDeVenda)
    if(expiracaoDeVenda <= new Date()){
        return res.status(400).json({"error": "Prazo de Venda Expirado " + req.body.idProduto})
    }

    if(req.body.aporte < resultsProduto[0].valorMinimoAporteInicial) {
        return res.status(400).json({"error": "Valor Mínimo do Aporte " + req.body.idProduto})
    }

    const idadeAtual = idade(new Date(resultsCliente[0].dataDeNascimento))
    console.log(idadeAtual)
    if(idadeAtual < resultsProduto[0].idadeDeEntrada && resultsProduto[0].idadeDeSaida > idadeAtual) {
        return res.status(400).json({"error": "Impossibilidade por causa da Idade de Entrada e Saída  " + req.body.idProduto})
    }

    const values = [uuid, req.body.idCliente, req.body.idProduto, req.body.aporte, req.body.dataDaContratacao, req.body.idadeDeAposentadoria];
    await client.query('INSERT INTO teste.plano(uuid,idCliente,idProduto,aporte,dataDaContratacao,idadeDeAposentadoria)VALUES(?,?,?,?,?,?)', values);
      
    /* #swagger.responses[201] = { 
        schema: { $ref: "#/definitions/Response" },
        description: 'Adicionado com Sucesso.' 
    } */
    res.status(201).json({"id": uuid})
}

exports.aporte = async (req, res) => {
    // #swagger.tags = ['Plano']
    // #swagger.description = 'Endpoint para Aporte Extra no plano.'
    /* #swagger.parameters['aportePlano'] = {
        in: 'body',
        description: 'Informações do aporte no plano.',
        required: true,
        schema: { $ref: "#/definitions/AportePlano" }
    } */
    const resultsCliente = await cliente.buscaPorId(req.body.idCliente);
    if(resultsCliente.length == 0) {
        return res.status(400).json({"error": "Cliente inexistente " + req.body.idCliente})
    }
    
    const resultsProduto = await produto.buscaPorId(req.body.idProduto);
    if(resultsProduto.length == 0) {
        return res.status(400).json({"error": "Produto inexistente " + req.body.idProduto})
    }

    const resultsPlano = await this.buscaPorIdClienteAndIdProduto(req.body.idCliente, req.body.idProduto);
    if(resultsPlano.length == 0) {
        return res.status(400).json({"error": "Plano inexistente para esse Cliente e Produto"})
    }

    if(req.body.aporte < resultsProduto[0].valorMinimoAporteExtra) {
        return res.status(400).json({"error": "Valor Mínimo Extra do Aporte " + req.body.idProduto})
    }

    const valorTotal = Number(resultsPlano[0].aporte) + Number(req.body.valorAporte);
    const values = [valorTotal, resultsPlano[0].uuid];
    await client.query('UPDATE teste.plano SET aporte = ? WHERE uuid = ?', values);

    /* #swagger.responses[200] = { 
        schema: { $ref: "#/definitions/Response" },
        description: 'Atualizado com Sucesso.' 
    } */
    res.status(200).json({"id": resultsPlano[0].uuid})
}

exports.resgate = async (req, res) => {
    // #swagger.tags = ['Plano']
    // #swagger.description = 'Endpoint para Resgate no plano.'
    /* #swagger.parameters['addPlano'] = {
        in: 'body',
        description: 'Informações do restate no plano.',
        required: true,
        schema: { $ref: "#/definitions/ResgatePlano" }
    } */
    const resultsPlano = await this.buscaPorId(req.body.idPlano);
    if(resultsPlano.length == 0) {
        return res.status(400).json({"error": "Plano inexistente " + req.body.idPlano})
    }
    
    const resultsProduto = await produto.buscaPorId(resultsPlano[0].idProduto);
    if(resultsProduto.length == 0) {
        return res.status(400).json({"error": "Produto inexistente " + resultsPlano[0].idProduto})
    }

    const diasResgate = dias(new Date(resultsPlano[0].dataDaContratacao))

    console.log(diasResgate)

    if(resultsPlano[0].dataDaCarencia == null && diasResgate < resultsProduto[0].carenciaInicialDeResgate) {
        return res.status(400).json({"error": "Prazo de carência inicial excedido " + resultsPlano[0].idProduto})
    }

    if(resultsPlano[0].dataDaCarencia != null) {
        const diasUltimoResgate = dias(new Date(resultsPlano[0].dataDaCarencia))
        if(diasUltimoResgate < resultsProduto[0].carenciaEntreResgates) {
            return res.status(400).json({"error": "Prazo de carência excedido, ocorre entre períodos menores " + resultsPlano[0].idProduto})

        }

    }

    const valorTotal = Number(resultsPlano[0].aporte) - Number(req.body.valorResgate)
    if(valorTotal < 0) {
        return res.status(400).json({"error": "Saldo Insuficiente para o resgate " + req.body.idPlano})
    }

    const values = [valorTotal, new Date(), resultsPlano[0].uuid];
    await client.query('UPDATE teste.plano SET aporte = ?, dataDaCarencia = ? WHERE uuid = ?', values);

    res.status(200).json({"id": resultsPlano[0].uuid})
}

exports.buscaPorIdClienteAndIdProduto = async (idCliente, idProduto) => {
    const res = await client.query('SELECT * FROM teste.plano where idCliente=? AND idProduto=? ', [idCliente, idProduto ]);
    return res[0];
}

exports.buscaPorId = async (id) => {
    const res = await client.query('SELECT * FROM teste.plano where uuid=?', [id]);
    return res[0];
}

function idade(d1, d2) {
    d2 = d2 || new Date();
    var diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function dias(data1){
    data1 = new Date(data1);
    var data2 = new Date();
    return (data2 - data1)/(1000*3600*24);
  }