const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    msgAlert: "",
    activeAlert: false,
    carrinhoAtivo: false
  },
  created() {
    this.getProdutos()
    this.checkLocalStorage()
    this.router()
  },
  watch: {
    produto() {
      document.title = this.produto.nome || "NewsTech"
      const hash = this.produto.id || hash.replace("#", "")      
      history.pushState(null, null, `#${hash}`)
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    }
  },
  filters: {
    formataPreco(valor) {
      return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }
  },
  computed: {
    carrinhoTotal() {
      let total = 0
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco
        })
      }
      return total
    }
  },
  methods: {
    getProdutos() {
      fetch("./api/produtos.json")
        .then(res => res.json())
        .then(res => {
          this.produtos = res
        })
    },
    getProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(res => res.json())
        .then(res => {
          this.produto = res
        })
    },
    abrirModal(id) {
      this.getProduto(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    fecharModal({ target, currentTarget }) {
      if (target == currentTarget ) this.produto = false 
      history.pushState(null, null, '/') 
    },
    fecharCarrinho({ target, currentTarget }) {
      if (target == currentTarget) this.carrinhoAtivo = false
    },
    adicionarItem() {
      this.produto.estoque--
      const { id, nome, preco } = this.produto
      this.carrinho.push({ id, nome, preco })
      this.alert(`${nome} adicionado ao carrinho!`)
    },
    removerItem(index) {
      this.carrinho.splice(index, 1)
    },
    checkLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },
    checkEstoque() {
      const items = this.carrinho.filter(({ id }) => id === this.produto.id) 
      this.produto.estoque -= items.length
    },
    alert(mensagem) { 
      this.msgAlert = mensagem
      this.activeAlert = true 
      setTimeout(() => {
        this.activeAlert = false
      }, 3000)
    },
    router() {
      const hash = document.location.hash
      if (hash) {
        this.getProduto(hash.replace("#", ""))
      }
    }
  }
})
