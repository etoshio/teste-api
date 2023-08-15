const mysql = require('mysql2/promise');

const client = mysql.createPool(process.env.CONNECTION_STRING);
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

exports.adiciona = async (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.description = 'Endpoint para adicionar um cliente.'
    /* #swagger.parameters['addCliente'] = {
        in: 'body',
        description: 'Informações do cliente.',
        required: true,
        schema: { $ref: "#/definitions/AddCliente" }
    } */

    var uuid = uuidv4();
    const values = [uuid, req.body.cpf, req.body.nome, req.body.email, req.body.dataDeNascimento, req.body.genero, req.body.rendaMensal];
    await client.query('INSERT INTO teste.cliente(uuid,cpf,nome,email,dataDeNascimento,genero,rendaMensal) VALUES(?,?,?,?,?,?,?)', values);
    /* #swagger.responses[201] = { 
        schema: { $ref: "#/definitions/Response" },
        description: 'Adicionado com Sucesso.' 
    } */
    res.status(201).json({"id": uuid})
}

exports.buscaPorId = async (id) => {
    const res = await client.query('SELECT * FROM teste.cliente where uuid=?', [id]);
    return res[0];
}

