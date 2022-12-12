<template>
  <q-page padding>
    <div
      class="column bg-white q-gutter-y-md items-center"
      :class="{
        'login-size': $q.screen.width > 599,
        'absolute-center': $q.screen.width > 599,
      }"
    >

      <div class="full-width text-h7 text-center"><strong>Recomendamus-lhe uma senha forte <strong class="text-primary">MyCinePlace</strong>, informe o seu E-mail.</strong></div>
      <br><br>

      <q-form @submit.prevent="handleRestEmail" class="full-width q-mt-lg constrain-4">
        <q-input
          dense
          v-model="email"
          rounded
          outlined
          label="E-mail"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo não pode estar vazio']"
        />

        <q-btn unelevated rounded :id="id" dense label="acessar" type="submit"
          style="min-width: 100%; border: 0.5px solid #49d166; background-color: #49d166; color: #FFF;
          padding: 5px 30px; font-weight: normal; .q-btn__content { padding: 10px; }"
        />
        <q-btn :to="{ name: 'reset-password' }" label="Cancelar" class="full-width q-my-md text-primary text-center text-h9" flat/>
        <br />
        <q-spinner class="absolute-center" v-if="loading" size="xl" color="primary" />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "reset-passwordPage",
  setup() {
    const email = ref('');

    const loading = ref(false);

    const router = useRouter();

    const $q = useQuasar();

    const handleRestEmail = async () => {
      try {
        loading.value = true;
        // await sendPasswordRestEmail(email.value);
        $q.notify({
          type: "positive",
          message: `foi enviada uma notificação para ${email.value}`,
        });
        router.push('login');
      } catch (error) {
        alert(error)
      } finally {
        loading.value = false;
      }
    };
    return {
      handleRestEmail,
      email,
      loading,
    };
  },
});
</script>

<style scoped></style>
