<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-11">
        <h4>Bem vindo(a)!</h4>
      </div>
      <div class="col-md-1 text-right">
        <button @click.prevent="doLogout" class="btn btn-primary">Sair</button>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-3">
        <div class="form-group">
          <label for="ide_number">Número</label>
          <input v-model="form.ide_number" id="ide_number" class="form-control" />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="ide_date">Data de emissão</label>
          <input v-model="form.ide_date" type="date" id="ide_date" class="form-control" />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="prod_description">Descrição do produto</label>
          <input v-model="form.prod_description" id="prod_description" class="form-control" />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="prod_code">Código do produto</label>
          <input v-model="form.prod_code" id="prod_code" class="form-control" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <div class="form-group">
          <label for="emit_cnpj">CNPJ do emitente</label>
          <input v-model="form.emit_cnpj" id="emit_cnpj" class="form-control" />
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="order_by">Ordernar por</label>
          <select v-model="form.order_by" id="order_by" class="form-control">
            <option value="ide.dhEmi">Data de emissão</option>
            <option value="total.ICMSTot.vNF">Valor total da nota</option>
          </select>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="order">Tipo de ordernação</label>
          <select v-model="form.order" id="order" class="form-control">
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <button @click.prevent="doSearchInvoices" id="search-btn" class="btn btn-primary">Pesquisar</button>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-6">
        Soma das notas: R$ {{ formatCurrency(this.sum) }}
      </div>
      <div class="col-md-6">
        Quantidade de notas: {{ this.count }}
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-12">
        <table id="invoices">
          <tr>
            <th>Número</th>
            <th>Data de emissão</th>
            <th>Descrição do produto</th>
            <th>Código do produto</th>
            <th>CNPJ</th>
            <th>Valor</th>
          </tr>
          <tr v-for="invoice in this.invoices" :key="invoice._id">
            <td>{{ invoice.ide.nNF }}</td>
            <td>{{ invoice.ide.dhEmi }}</td>
            <td>
              <div v-for="prod in invoice.det" :key="prod.prod.cProd">
                {{ prod.prod.xProd }}
              </div>
            </td>
            <td>
              <div v-for="prod in invoice.det" :key="prod.prod.cProd">
                {{ prod.prod.cProd }}
              </div>
            </td>
            <td>{{ formatCNPJ(invoice.emit.CNPJ) }}</td>
            <td>R$ {{ formatCurrency(invoice.total.ICMSTot.vNF) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
  #invoices {
    width: 100%;
  }
  #invoices tr,
  #invoices th,
  #invoices td {
    border: 1px solid #000;
  }
  #invoices tr:nth-child(even) {
    background-color: #dedede;
  }
  #search-btn {
    margin-top: 32px;
  }
</style>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'dashboard',

  data () {
    return {
      invoices: [],
      sum: 0,
      count: 0,
      form: {
        ide_number: '',
        ide_date: '',
        prod_description: '',
        prod_code: '',
        emit_cnpj: '',
        order_by: 'ide.dhEmi',
        order: 'asc'
      }
    }
  },

  mounted () {
    if (this.$route.params.name) {
      this.client.name = this.$route.params.name
    }
  },

  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      client: 'auth/client'
    })
  },

  methods: {
    ...mapActions({
      logout: 'auth/logout',
      searchInvoices: 'auth/searchInvoices'
    }),

    async doSearchInvoices () {
      let invoices = await this.searchInvoices(this.form)
      this.invoices = invoices.list
      this.sum = invoices.sum
      this.count = invoices.count
    },

    formatCNPJ (value) {
      let cnpj = value.toString().replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/)
      return cnpj[1] + '.' + cnpj[2] + '.' + cnpj[3] + '/' + cnpj[4] + '-' + cnpj[5]
    },

    formatCurrency (value) {
      let val = (value / 1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },

    doLogout () {
      this.logout()
      this.$router.replace({
        path: '/'
      })
    }
  }
}
</script>
