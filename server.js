const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let usuarios = [
  { id: 1, nome: "João" },
  { id: 2, nome: "Maria" },
];

function buscarUsuario(id) {
  return usuarios.find((u) => u.id === parseInt(id));
}

function listarUsuarios(req, res) {
  res.json(usuarios);
}

function obterUsuario(req, res) {
  const usuario = buscarUsuario(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  res.json(usuario);
}

function criarUsuario(req, res) {
  const nome = req.body.nome;

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ erro: "O nome é obrigatório" });
  }

  const novoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    nome: nome.trim(),
  };

  usuarios.push(novoUsuario);

  res.status(201).json(novoUsuario);
}

function atualizarUsuario(req, res) {
  const usuario = buscarUsuario(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  const nome = req.body.nome;

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ erro: "O nome é obrigatório" });
  }

  usuario.nome = nome.trim();

  res.json(usuario);
}

function removerUsuario(req, res) {
  const index = usuarios.findIndex((u) => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  usuarios.splice(index, 1);

  res.json({ mensagem: "Usuário removido" });
}

app.get("/usuarios", listarUsuarios);
app.get("/usuarios/:id", obterUsuario);
app.post("/usuarios", criarUsuario);
app.put("/usuarios/:id", atualizarUsuario);
app.delete("/usuarios/:id", removerUsuario);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
