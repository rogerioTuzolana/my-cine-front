<template>
  <q-page class="constrain-4">
    <div class="column full-width" align="center">
        <div class="col item q-pt-lg">
            <q-avatar size="80px">
              <img :src="formData.img_url">
            </q-avatar>
            <div align="center" >
                <q-input
                  label="Carregar Imagem"
                  stack-label
                  type="file"
                  v-model="img"
                  accept="image/*"
                />
            </div>
        </div>

        <form @submit.prevent="updatePerfile">
            <q-card-section class="q-pt-none">
            <div class="q-mb-md">
                <q-input
                label="Nome"
                dense
                v-model="formData.name"
                autofocus
                @keyup.enter="prompt = false"
                lazy-rules
                :rules="titleRules"
                ref="title"
                />
            </div>

            <div class="q-mb-md">
                <q-input
                dense
                v-model="formData.birthday"
                type="date"
                @keyup.enter="prompt = false"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Campo não pode estar vazio'
                ]"
                />
            </div>

            <div class="q-mb-md">
                <q-input
                label="Nacionalidade"
                dense
                v-model="formData.nationality"
                autofocus
                @keyup.enter="prompt = false"
                lazy-rules
                :rules="titleRules"
                ref="title"
                />
            </div>

            <q-inner-loading
                :showing="loading"
                label="Carregando..."
                label-class="text-primary"
                color="primary"
                label-style="font-size: 1.1em"
            />

            <div class="q-mb-md">
                <q-input
                label="E-mail"
                dense
                v-model="formData.email"
                autofocus
                @keyup.enter="prompt = false"
                lazy-rules
                :rules="diagnosisRules"
                ref="diagnosis"
                />
            </div>

            <div class="q-mb-md">
                <q-input
                label="Telefone"
                dense
                v-model="formData.phone"
                autofocus
                @keyup.enter="prompt = false"
                lazy-rules
                :rules="complentary_examsRules"
                ref="complentary_exams"
                />
            </div>

            <div class="q-mb-md">
                <q-input
                label="CPF"
                dense
                v-model="formData.cpf"
                autofocus
                @keyup.enter="prompt = false"
                lazy-rules
                :rules="complentary_examsRules"
                ref="complentary_exams"
                />
            </div>

            </q-card-section>

            <q-card-actions align="right" class="text-white">
                <q-btn
                    class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
                    color="primary"
                    label="Atualizar"
                    @click="getProfils()"
                    no-caps
                    rounded
                    >
                </q-btn>
               <q-btn
                    class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
                    color="primary"
                    label="Salvar Alteração"
                    @click="updatePerfile()"
                    no-caps
                    rounded
                    >
                </q-btn>
            </q-card-actions>
        </form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { onBeforeUnmount } from 'vue';

//import useApi from '../../composebles/useApi';

export default defineComponent({
  name: 'PerfilPage',

  setup() {
    const loading = ref(true);

    const formData = ref({});

    //const { getByField, update, uplodImg } = useApi();

    const { user } = useAuthUser();

    const img = ref([]);

    const $q = useQuasar()
    let timer

    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer)
        $q.loading.hide()
      }
    })

    const getProfils = async () => {
      try {
        loading.value = true;
        //const aux = await getByField('perfil', 'user_id', user.value.id);
        formData.value = aux[0];
        loading.value = false;
      } catch (error) {
        loading.value = false;
        showErrorNotification(`A Resposta do banco Não Foi Bem Sucedida Pelo Seguinte Erro: ${error}`);
      }
    };
    const updatePerfile = async () => {
      try {
        $q.loading.show({
          message: 'Atualizando perfil. Esta acção pode levar algusn segundos...'
        })

        // hiding in 3s
        timer = setTimeout(() => {
          $q.loading.hide()
          timer = void 0
        }, 3000)
        loading.value = true;


      } catch (error) {
        loading.value = false;
        showErrorNotification(`A Atualização Não Foi Bem Sucedida Pelo Seguinte Erro: ${error}`);
        alert(JSON.stringify(error));
      }
    };
    onMounted(() => {
      getProfils();
    });
    return {
      loading,
      img,
      updatePerfile,
      getProfils,
      formData,
      slide: ref('style'),
      showAdPerfil: ref(false),
      titleRules: [
        (val) => (val && val.length > 0) || 'Por favor digite alguma coisa',
      ],
      definitionRules: [
        (val) => (val && val.length > 0) || 'Por favor digite alguma coisa',
      ],
      diagnosisRules: [
        (val) => (val && val.length > 0) || 'Por favor digite alguma coisa',
      ],
      complentary_examsRules: [
        (val) => (val && val.length > 0) || 'Por favor digite alguma coisa',
      ],
    };
  },
});
</script>

<style lang="sass" scoped>
  .pic
    position: absolute
    top: 85px
    left: 80px
  .item
    margin-bottom: 20px
  .btn-profile
    min-width: 150px
    width: 95%
    margin-right: 10px
  .btn-prime
    background: #FFAF00
  .btn-prime .q-icon
    font-size: .4em
  .btn-opcao
    border-bottom: 1px solid #CCCCCC
    width: 90%
    text-align: left
    margin-bottom: 10px
  .btn-opcao.q-btn__content
    min-width: 100%
  .btn-opcao.q-btn__content.block
    flex-grow: 3
</style>
