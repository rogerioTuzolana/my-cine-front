<template>
  <q-layout view="hHh lpR fff" class="bg-grey-9 text-white">
    <q-header elevated class="bg-grey-10">
      <q-toolbar>

        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />

        <q-toolbar-title class="text-deep-orange">
         <strong>MyCiN£<span class="text-weight-bold text-blue">P</span>LaCe</strong>

        </q-toolbar-title>


        <q-space/>
        <div class="row">
          <q-input style="background-color:aliceblue; margin:20px; margin-right: 0%; width: 400px; padding-left: 3px;" rounded v-model="token" prefix="Token ou email: " label-slot clearable>
            <!--
            <template v-slot:prepend>
              <q-avatar>
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
              </q-avatar>
            </template>
            -->
            <template v-slot:label>
              Podes atualizar ou cancelar a sua reserva <span class="q-px-sm bg-blue text-white text-italic rounded-borders">aqui</span>
            </template>
          </q-input>
          <q-btn dense flat icon="search" color="deep-orange" @click="atualizarReseeva()" />
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above

      :mini="!drawer || miniState"

      :width="250"
      :breakpoint="10"

      class="bg-grey-9"
    >

      <q-scroll-area class="fit">
      <q-list dark>
        <q-item-label header>Faça a gestão da sua Reserva</q-item-label>

        <q-item clickable target="_blank" rel="noopener" to="/">
            <q-btn flat to="/"><q-icon style="color:white" name="home"/></q-btn>
        </q-item>

        <q-item clickable target="_blank" rel="noopener" href="https://facebook.quasar.dev">
          <q-item-section avatar>
            <q-icon style="color:cornflowerblue" name="facebook"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>Facebook</q-item-label>
            <q-item-label caption>@facebook.Com</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" href="http://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon style="color:aqua" name="whatsapp" />
          </q-item-section>
          <q-item-section>
            <q-item-label>whatsapp Chat</q-item-label>
            <q-item-label caption>https://whatsapp.com</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon style="color:blueviolet" name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>https://forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" href="https://twitter.quasar.dev">
          <q-item-section avatar>
            <q-icon style="color:darkgrey" name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>instagram</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable target="_blank" rel="noopener" href="https://twitter.quasar.dev">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sobre Nós</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

      <!--
        in this case, we use a button (can be anything)
        so that user can switch back
        to mini-mode
      -->
      <div class="q-mini-drawer-hide absolute" style="top: 10px; right: -8px">
        <q-btn
          size="10px"
          dense
          round
          unelevated
          color="orange"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
          </q-avatar>
          <div class="row-item-start">
            <div>Contactos & Links:</div>
          </div>
          <br><br>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <div>

      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'MyLayout',
  setup () {
    const miniState = ref(true);

    const token = ref('')

    const editReserva = ref(false)

    const atualizarReseeva = async () => {
      // fazer requisição da reserva com o token x
      editReserva.value = true
      alert(editReserva.value)
    }

    return {
      editReserva,
      token,
      drawer: ref(false),
      miniState,
      atualizarReseeva,

      drawerClick (e) {
        // if in "mini" state and user
        // click on drawer, we switch it to "normal" mode
        if (miniState.value) {
          miniState.value = false

          // notice we have registered an event with capture flag; 005132418LS046
          // we need to stop further propagation as this click is
          // intended for switching drawer to "normal" mode only
          e.stopPropagation()
        }
      }
    }
  }
}
</script>
