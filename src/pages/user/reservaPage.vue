<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card style="min-height: 100%; background-color: black;" class="full-width" flat bordered>
      <q-card-section class="full-width" horizontal>
        <div class="full-width ">
          <q-video style="min-height: 100%;" :src="filme.TRILLER" />
        </div>
      </q-card-section>
    </q-card>

    <q-separator />

    <q-card class="full-width" flat bordered>
      <q-card-section class="full-width" horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-h5 q-mt-sm q-mb-xs text-grey-9">{{filme.NOME}}</div>
          <div class="text-overline text-grey-8">{{filme.GENERO}}</div>
          <div style="min-width:80%" class="text-caption text-black">
            {{filme.DESCRISAO}}
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            :src="filme.CAPA"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <!--Selecione o Cinema-->
        <div style="max-width:30%" class="q-gutter-x-md q-gutter-y-md full-width">
          <q-select class="shadow-1 overflow-hidden"
            style="background-color:orangered;border-radius: 2px;min-width: 25%"
            color="white" outlined label-color="white"
            v-model="model" :options="op"
            :option-value="(op) => op === null ? null : op.ID_CINEMA"
            :option-label="(op) => op === null ? 'Null value' : op.NOME"
            label="Escolha O Cinema"
            header-class="bg-orange text-white"
            expand-icon-class="text-black"
          >

          </q-select>
          <br>
        </div>
        <!--fimmm Selevciona Cinema-->


        <q-btn @click="makeReserve" v-if="model.length != 0" flat class="flex" style="padding: 10px ; margin-bottom: 20px;" color="black">
          <strong>Reserve</strong>
        </q-btn>
      </q-card-actions>
    </q-card>

  </div>
</template>

<script>
import { onMounted, ref, onUpdated } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex";
import axios from "axios"

export default {
  name: "reservaPage",

  setup () {
    const route = useRoute()

    const router = useRouter()

    const store = useStore();

    const model = ref('')

    const op = ref([{name: "Cine-Luanda", id: 1},{name: "Cine-Benguela", id: 2},{name: "Cine-Malanje", id: 3},{name: "Cine-Cabinda", id: 4}]
)
      const sessoes = [
        {id: 1, data: "11-09-2022", id_sala: "2A", preco: "1000kz",
        estado: true,
        id_filme: 1, id_admin: 22
        },
        {id: 2, data: "15-09-2022", id_sala: "1A", preco: "3000kz",
        estado: true,
        id_filme: 1, id_admin: 22
        }
      ]

    const filme = ref({})

    const loading = ref(false)

    const url = "http://192.168.179.62/";

    const getFilme = async () => {
      try {
        loading.value = true
        const auxCinemas = await axios.get(`${url}cinema/cines`);
        op.value = auxCinemas.data.data
        const auxFilme = await axios.get(`${url}cinema/filme/${route.params.id}`)
        filme.value = auxFilme.data.data
      } catch (error) {
        alert(error)
      } finally {
        loading.value = false
      }
      /*
      for (let index = 0; index < filmes.length; index++) {
        if (filmes[index].id == route.params.id) {
          filme.value = filmes[index]
          break
        }
      }*/
      store.commit("user/setFilme", filme.value)

    }

    const makeReserve = () => {
      /*
      axios
        .get("http://128.0.0.1/8085/cinema")
        .then((res) => {
                console.log(res.data)
        })
        .catch((error) => {
                console.log(error);
        });

      axios({
        method: 'post',
        url: 'http://128.0.0.1/8085/cinema',
        headers: { "content-type": "multipart/form-data" }
      })
      */
      router.push(`/cSessoes/${model.value.ID_CINEMA}`);

    }

    onMounted( () => {
      getFilme()
    })

    return {
      sessoes,
      model,
      op,
      filme,
      tab: ref(sessoes[0].data),
      makeReserve
    }
  }
}
</script>


