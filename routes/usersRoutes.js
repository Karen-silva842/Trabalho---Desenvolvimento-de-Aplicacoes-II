/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Retorna todos os usuários cadastrados
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de todos os usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Nenhum usuário encontrado
 */
router.get('/all', (req, res) => {
  usersDB = loadUsers()
  if (usersDB.length === 0) return res.status(404).json({ erro: 'Nenhum usuário encontrado!' })
  res.json(usersDB)
})
