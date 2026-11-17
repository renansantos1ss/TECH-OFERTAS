
let todosProdutos = [];
let categoriaAtual = "Todos";

async function carregarProdutos() {
  const area = document.getElementById("produtos");

  try {
    const resposta = await fetch("./products.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os produtos.");
    }

    const dados = await resposta.json();

    // Exibe somente produtos com links válidos
    todosProdutos = dados.filter(produto => {
      if (typeof produto.url !== "string") return false;

      try {
        const link = new URL(produto.url);
        return (
          link.protocol === "https:" ||
          link.protocol === "http:"
        );
      } catch {
        return false;
      }
    });

    mostrarProdutos();
  } catch (erro) {
    console.error(erro);
    area.textContent = "Não foi possível carregar os produtos.";
  }
}

function mostrarProdutos() {
  const area = document.getElementById("produtos");
  const pesquisa = document.getElementById("pesquisa")
    .value.toLowerCase().trim();

  area.replaceChildren();

  const filtrados = todosProdutos.filter(produto => {
    const nome = String(produto.name || "").toLowerCase();
    const categoria = String(produto.category || "");

    const correspondePesquisa = nome.includes(pesquisa);
    const correspondeCategoria =
      categoriaAtual === "Todos" ||
      categoria.toLowerCase() === categoriaAtual.toLowerCase();

    return correspondePesquisa && correspondeCategoria;
  });

  if (filtrados.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.textContent = "Nenhum produto encontrado.";
    area.appendChild(mensagem);
    return;
  }

  filtrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "card-produto";

    const imagem = document.createElement("img");
    imagem.src = produto.image || "";
    imagem.alt = produto.name || "Produto";
    imagem.loading = "lazy";

    const titulo = document.createElement("h3");
    titulo.textContent = produto.name || "Produto";

    const descricao = document.createElement("p");
    descricao.textContent = produto.price
      ? `R$ ${produto.price}`
      : "Confira o preço na loja";

    const botao = document.createElement("a");
    botao.href = produto.url;
    botao.target = "_blank";
    botao.rel = "noopener noreferrer sponsored";
    botao.textContent = "Ver oferta";

    card.append(imagem, titulo, descricao, botao);
    area.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pesquisa")
    .addEventListener("input", mostrarProdutos);

  document.querySelectorAll("[data-categoria]")
    .forEach(botao => {
      botao.addEventListener("click", () => {
        categoriaAtual = botao.dataset.categoria;

        document.querySelectorAll("[data-categoria]")
          .forEach(b => b.classList.remove("ativo"));

        botao.classList.add("ativo");
        mostrarProdutos();
      });
    });

  document.querySelector('[data-categoria="Todos"]')
    .classList.add("ativo");

  carregarProdutos();
});
