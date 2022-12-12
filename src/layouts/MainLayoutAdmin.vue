<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="text-white" style="background: #24292e" height-hint="61.59">
      <q-toolbar class="q-py-md q-gutter-xs row q-px-xs">
        <div class="q-ml-xs q-gutter-sm text-body2">
          <q-btn class="q-mr-sm col-2 col-sm-1 col-md-2 col-xs-1 col-lg-2 col-xl-1" round dense flat :ripple="false" :icon="fabGithub" label="My_CiN£PLaCe" size="17px" color="orange" no-caps />
        </div>

        <div class="GL__toolbar-link q-ml-xs q-gutter-sm text-body2 text-weight-bold row items-center no-wrap">
          <q-btn class="col-2 col-sm-2 col-md-2 col-xs-2 col-lg-2 col-xl-2" to="/home" icon="home" />
          <q-btn class="col-2 col-sm-2 col-md-2 col-xs-2 col-lg-2 col-xl-2" icon="edit" />
          <a v-if="$q.screen.md || $q.screen.lg" class="text-white col-2 col-sm-2 col-md-2 col-xs-2 col-lg-2 col-xl-2" href="javascript:void(0)">
            Mais
          </a>
        </div>

        <q-space v-if="$q.screen.md || $q.screen.lg" />

        <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
          <q-btn class="col-2 col-sm-2 col-md-2 col-xs-2 col-lg-2 col-xl-2" dense flat round size="sm" icon="notifications" />
          <q-btn class="col-2 col-sm-2 col-md-2 col-xs-2 col-lg-2 col-xl-2" dense flat>
            <div class="row items-center no-wrap">
              <q-icon name="add" size="20px" />
              <q-icon name="arrow_drop_down" size="17px" style="margin-left: -2px; " />
            </div>
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable :to="{ name: 'sessoes' }" class="sessoes">
                  <q-item-section >Gerenciar Sessão</q-item-section>
                </q-item>
                <q-item clickable :to="{ name: 'filmes' }">
                  <q-item-section>Novo Filme</q-item-section>
                </q-item>
                <q-item clickable :to="{ name: 'cinemas' }">
                  <q-item-section>Gerenciar Cinema</q-item-section>
                </q-item>
                <q-item clickable :to="{ name: 'reservas' }">
                  <q-item-section>Gerenciar Reservas</q-item-section>
                </q-item>
                <q-separator />
                <q-item-label header>Auditoria</q-item-label>
                <q-item :to="{ name: 'historico' }" >
                  <q-item-section>Histórico</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn dense flat no-wrap>
            <q-avatar rounded size="20px">
              <img src="https://cdn.quasar.dev/img/avatar3.jpg">
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="GL__menu-link-signed-in">
                  <q-item-section>
                    <div>Admin <strong>YURI REGO</strong></div>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable class="GL__menu-link-status">
                  <q-item-section>
                    <div>
                      <q-icon name="tag_faces" color="blue-9" size="18px" />
                      Estado
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable class="GL__menu-link">
                  <q-item-section>Meu Perfil</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Meus Trabalhos</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Ajuda</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section>Definições</q-item-section>
                </q-item>
                <q-item clickable class="GL__menu-link">
                  <q-item-section @click="goout">Sair</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { fabGithub } from '@quasar/extras/fontawesome-v6'
import { useRouter } from 'vue-router';
import axios from "axios";

const stringOptions = [
  'quasarframework/quasar',
  'quasarframework/quasar-awesome'
]
export default {
  name: 'MyLayout',
  setup () {
    const text = ref('')
    const options = ref(null)
    const filteredOptions = ref([])
    const search = ref(null) // $refs.search

    const loading = ref(false);

    const router = useRouter();

    const url = "http://192.168.179.62/";

    const goout = async () => {
      try {
        loading.value = true;

        loading.value = true;
      axios({
        method: "post",
        url: `${url}cinema/admin/logout`,
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        /*
        $q.notify({
          title: `${res}`,
          color: 'positive',
          position: 'top',
          message: 'Reserva Efetuada com Sucesso!!',
          icon: 'done'
        })*/
      })
      .catch((error) => {
          $q.dialog({
            title: 'Erro ao oucupar lugar!!!',
            dark: true,
            message: `tipo de erro: ${error}`,
            progress: {
              spinner: QSpinnerGears,
              color: 'negative'
            },
            persistent: true, // we want the user to not be able to close it
            ok: true // we want the user to not be able to close it
          })
          alert(error)
          console.log(error);
        });
        loading.value = false;
        router.replace('/admin');
      } catch (error) {
        alert(error.message);
      }
    }

    function filter (val, update) {
      if (options.value === null) {
        // load data
        setTimeout(() => {
          options.value = stringOptions
          search.value.filter('')
        }, 2000)
        update()
        return
      }
      if (val === '') {
        update(() => {
          filteredOptions.value = options.value.map(op => ({ label: op }))
        })
        return
      }
      update(() => {
        filteredOptions.value = [
          {
            label: val,
            type: 'O que Procuras'
          },
          {
            label: val,
            type: 'All GitHub'
          },
          ...options.value
            .filter(op => op.toLowerCase().includes(val.toLowerCase()))
            .map(op => ({ label: op }))
        ]
      })
    }
    return {
      fabGithub,
      text,
      options,
      filteredOptions,
      search,
      filter,
      goout
    }
  }
}
</script>

<style lang="sass">
.GL
  &__select-GL__menu-link
    .default-type
      visibility: hidden
    &:hover
      background: #0366d6
      color: white
      .q-item__section--side
        color: white
      .default-type
        visibility: visible
  &__toolbar-link
    a
      color: white
      text-decoration: none
      &:hover
        opacity: 0.7
  &__menu-link:hover
    background: #0366d6
    color: white
  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important
  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9
  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none
</style>
