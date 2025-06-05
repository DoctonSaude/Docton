const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Rota básica de teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Docton Saúde!' });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 