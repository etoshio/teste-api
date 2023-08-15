const router = require('express').Router()
const produto = require('../controllers/produto')
const cliente = require('../controllers/cliente')
const plano = require('../controllers/plano')

router.post('/clientes', cliente.adiciona)
router.post('/produtos', produto.adiciona)
router.post('/planos', plano.adiciona)
router.put('/planos/aporte', plano.aporte)
router.put('/planos/resgate', plano.resgate)

module.exports = router