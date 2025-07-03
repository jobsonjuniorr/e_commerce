# 🛒 E-Commerce em Node.js + React

Este projeto é um sistema completo de e-commerce, desenvolvido com **Node.js** no backend e **React** no frontend. Ele permite o cadastro de usuários, listagem de produtos, gerenciamento de pedidos, pagamento e muito mais.

---

## 🚀 Tecnologias Utilizadas

### Backend (Node.js)
- Express
- Sequelize (ORM)
- MySQL
- JWT (autenticação)
- Bcrypt (criptografia de senha)
- Dotenv

### Frontend (React)
- React
- React Router DOM
- TailwindCss
- Axios
- Font Awesome

---

## ⚙️ Instalação e Execução

### 🔧 Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/jobsonjuniorr/e_commerce.git
   cd e_commerce
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   Crie um `.env` com as variáveis:
   ```
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=ecommerce
   JWT_SECRET=sua_chave_secreta
   ```

4. Execute o servidor:
   ```bash
   node index.js
   ```

---

### 💻 Frontend

1. Vá até o diretório:
   ```bash
   cd ecommerce-front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute a aplicação:
   ```bash
   npm start
   ```

---

## 🗃️ Estrutura do Banco de Dados (MySQL)

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    tipo ENUM('cliente', 'admin') DEFAULT 'cliente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    categoria ENUM('blusa', 'calca') NOT NULL,
    imagem VARCHAR(255), 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

CREATE TABLE pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    metodo_pagamento ENUM('pix', 'cartao_credito', 'boleto') NOT NULL,
    status ENUM('pendente', 'aprovado', 'recusado') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    padrao BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

## 🔁 Rotas Básicas da API

| Método | Rota                | Descrição                       |
|--------|---------------------|---------------------------------|
| POST   | `/login`            | Autentica usuário               |
| POST   | `/usuarios`         | Cria novo usuário               |
| GET    | `/produtos`         | Lista todos os produtos         |
| GET    | `/produtos/:id`     | Retorna detalhes de um produto |
| POST   | `/pedidos`          | Cria novo pedido                |
| GET    | `/pedidos/:id`      | Consulta pedido por ID          |

---

## 📂 Estrutura de Pastas Recomendada

```
e_commerce/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── config/
├── index.js
└── .env
```

```
ecommerce-front/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   └── index.js
```

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se à vontade para usar e modificar conforme necessário.

---

## 👨‍💻 Autor

Desenvolvido por [Jobson Junior](https://github.com/jobsonjuniorr)