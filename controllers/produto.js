const mysql = require('mysql2/promise');

const client = mysql.createPool(process.env.CONNECTION_STRING);
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');


exports.adiciona = async (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.description = 'Endpoint para adicionar um produto.'
    /* #swagger.parameters['addProduto'] = {
        in: 'body',
        description: 'Informações do produto.',
        required: true,
        schema: { $ref: "#/definitions/AddProduto" }
    } */
    var uuid = uuidv4();
    const values = [uuid, req.body.nome, req.body.susep, req.body.expiracaoDeVenda, req.body.valorMinimoAporteInicial, req.body.valorMinimoAporteExtra, req.body.idadeDeEntrada, req.body.idadeDeSaida, req.body.carenciaInicialDeResgate, req.body.carenciaEntreResgates];
    await client.query('INSERT INTO teste.produto(uuid,nome,susep,expiracaoDeVenda,valorMinimoAporteInicial,valorMinimoAporteExtra,idadeDeEntrada,idadeDeSaida,carenciaInicialDeResgate,carenciaEntreResgates) VALUES(?,?,?,?,?,?,?,?,?,?)', values);
      
    /* #swagger.responses[201] = { 
        schema: { $ref: "#/definitions/Response" },
        description: 'Adicionado com Sucesso.' 
    } */
    res.status(201).json({"id": uuid})
}

exports.buscaPorId = async (id) => {
    const res = await client.query('SELECT * FROM teste.produto where uuid=?', [id]);
    return res[0];
}