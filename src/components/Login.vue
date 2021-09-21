<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-7">
        <img src="@/assets/logo_topo.png" style="width: 100%" />
      </div>
      <div class="col-md-1"></div>
      <div class="col-md-4">
        <form>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input v-model="form.email" type="email" id="email" class="form-control" />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input v-model="form.password" type="password" id="password" class="form-control" />
          </div>
          <div v-if="errorLogin" class="form-group text-danger">
            <b>Estas credenciais não representam nenhuma conta cadastrada.</b>
          </div>
          <div v-if="error" class="form-group text-danger">
            <b>Erro em nosso sistema. Tente acessar em outro momento.</b>
          </div>
          <div class="form-group">
            <button @click="doLogin" type="button" class="btn btn-success btn-block mt-3">Acessar conta</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'login',

  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      errorLogin: false,
      error: false
    }
  },

  methods: {
    ...mapActions({
      login: 'auth/login'
    }),

    doLogin () {
      this.errorLogin = false
      this.error = false
      this.login(this.form).then(() => {
        this.$router.replace({
          name: 'dashboard'
        })
      })
        .catch(error => {
          if (error.response.status === 401) {
            this.errorLogin = true
          } else {
            this.error = true
          }
        })
    }
  }
}
</script>
