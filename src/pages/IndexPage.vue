<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
    <q-carousel-slide :name="1" img-src="img/hermer.jpg" />
      <q-carousel-slide :name="2" img-src="img/vingadores.jpg" />
      <q-carousel-slide :name="3" img-src="img/filmes-20191.jpg" />
      <q-carousel-slide :name="4" img-src="img/hermer.jpg" />
    </q-carousel>
  </div>
<q-separator />
<q-separator />

  <div class="row full-width q-gutter-x-lg col-xs-12 col-sm-6 col-md-4" >
    <q-select class="shadow-1 overflow-hidden"
     style="background-color:orangered;border-radius: 3px;min-width: 25%"
     color="white" outlined label-color="white" v-model="options.cinema" :options="cinemas"
     label="Escolha Por Cinema"
      @show="startCounting"
      @hide="stopCounting"
      header-class="bg-orange text-white"
      expand-icon-class="text-white"
    >
    </q-select>

    <q-select class="shadow-1 overflow-hidden"
     style="background-color:orangered;border-radius: 3px;min-width: 25%"
     color="white" outlined label-color="white" v-model="options.filme" :options="filmes"
     label="Escolha Por Filme"
      @show="startCounting"
      @hide="stopCounting"
      header-class="bg-orange text-white"
      expand-icon-class="text-white"
    >
    </q-select>
    <q-select class="shadow-1 overflow-hidden"
     style="background-color:orangered;border-radius: 3px;min-width: 25%"
     color="white" outlined label-color="white" v-model="options.esperiencia" :options="esperiencias"
     label="Escolha Por Esperiência"
      @show="startCounting"
      @hide="stopCounting"
      header-class="bg-orange text-white"
      expand-icon-class="text-white"
    >
    </q-select>
  </div>
<!---->
  <div class="q-pa-md">
    <div class="q-gutter-y-md full-width" >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="exibicao" label="EM EXIBIÇÂO" />
          <q-tab name="brevemente" label="BREVEMENTE" />
          <q-tab name="mais" label="MAIS FILMES" />
        </q-tabs>

        <q-separator />



        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="exibicao">
            <!-------------Inicio Tabela De Filmes disponíveis-------->

            <q-table
              grid
              :card-container-class="cardContainerClass"
              class="text-weight-bold text-grey"
              title="Os Melhores Filmes de Acção Só No My-CiNePLaCe"
              :rows="filmes"
              row-key="id"
              :filter="filter"
              hide-bottom
              hide-header
              :pagination="{
                rowsPerPage: 40
              }"
              :rows-per-page-options="rowsPerPageOptions"
            >
              <template v-slot:top-right>
                <q-input borderless dense style="width:390px; background-color:cornsilk;" debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:item="props">
                <div class="q-pa-md col-xs-8 col-sm-4 col-md-2">
                  <q-card>
                    <q-card-section class="" :style="{ fontSize: props.row.NOME + 'px' }">
                      <q-img style="cursor:alias; min-height: 30ch ;" @click="go(props.row.ID_FILME)" :src="props.row.CAPA" spinner-color="blue" ></q-img>
                     </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center" :style="{ fontSize: props.row.data + 'px' }">
                      <div><strong><q-bg class="text-orange-6">{{ props.row.NOME }} </q-bg> ||  {{ props.row.GENERO }} </strong></div>

                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
            <!-------------Fim Tabela De Filmes disponíveis-------->
          </q-tab-panel>

          <q-tab-panel name="brevemente">
            <!-------------Inicio Tabela De Filmes Brevemente-------->
            <q-table
              grid
              :card-container-class="cardContainerClass"
              class="text-weight-bold text-grey"
              title="Vem aí Grandes novidades So No My CiNePLaCe"
              :rows="rows"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-header
              v-model:pagination="pagination"
              :rows-per-page-options="rowsPerPageOptions"
            >
              <template v-slot:top-right>
                <q-input borderless dense style="width:390px; background-color:cornsilk;" debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                  <q-card>
                    <q-card-section class="text-center">
                      Calories for
                      <br>
                      <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center" :style="{ fontSize: props.row.calories + 'px' }">
                      <div>{{ props.row.calories }} g</div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
            <!-------------Fim Tabela De Filmes Brevemente-------->
          </q-tab-panel>

          <q-tab-panel name="mais">
            <!-------------Inicio Tabela De Filmes Mais-------->
            <q-table
              grid
              :card-container-class="cardContainerClass"
              class="text-weight-bold text-grey"
              title="Mais diverção e Romance So No My CiNePLaCe"
              :rows="filmes"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-header
              v-model:pagination="pagination"
              :rows-per-page-options="rowsPerPageOptions"
            >
              <template v-slot:top-right>
                <q-input borderless dense style="width:390px; background-color:cornsilk;" debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                  <q-card>
                    <q-card-section class="text-center">
                      Calories for
                      <br>
                      <strong>{{ props.row.NOME }}</strong>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center" :style="{ fontSize: props.row.calories + 'px' }">
                      <div>{{ props.row.calories }} g</div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
            <!-------------Fim Tabela De Filmes Mais-------->
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <!-------------Fimm Carrocel-------->


  </div>


  <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          @click="dilogChat=true"
          fab
          color="blue"
          icon="chat"
          class="flax absolute-down"
        />   <q-inner-loading :showing="loading" color="primary" />
  </q-page-sticky>

  <!--
    Q DILOG DO Chat.......................
  -->
  <q-dialog v-model="dilogChat" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 row item-start">
          <q-icon name="fas fa-crown" style="margin-right: 10px"/> Assistente de Apoio
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <q-separator />
      </q-card-section><br>
      <q-form @submit="updatValuePremium">

        <!--
          Aqui Começa O Chat.......................
        -->

          <div style="width: 100%; max-width: 400px">
            <div class="q-pa-md column col justify-end">
              <q-chat-message
              v-for="messege in messeges "
              :key="messege.text"
              :name="messege.from"
              :text= "[messege.text]"
              :sent="messege.from === 'Me' ? true : false"
              :bg-color="messege.from === 'Me' ? 'gray' : 'primary'"
            >
            </q-chat-message>
          </div>
          <div class="flex-center" style="margin-left:3px">
            <q-input  class="full-width" rounded outlined v-model="texto" dense bg-color="white" label="escreva sua Mensagem" >
              <template v-slot:after>
                <q-btn round dense flat icon="send" color="blue" @click="sendMessege"  type="submit"/>
              </template>
            </q-input><br>
          </div>

        </div>
        <!--
          Aqui Termina O Chat.......................
        -->
      </q-form>
    </q-card>

  </q-dialog>
</template>

<script>
import { useQuasar } from 'quasar'
import axios from "axios"
import { ref, onMounted, watch } from 'vue'
import { useRouter } from "vue-router";

const rows = []

rows.push({ name: "Vingadores", data: "12-09-2022", img: "img/herois.jpeg", genero: "acção",id: 1 })
rows.push({ name: "Vingadores", data: "12-09-2022", img: "img/herois.jpeg", genero: "drama", id: 10 })
rows.push({ name: "Vingadores", data: "12-09-2022", img: "img/herois.jpeg", genero: "romance", id: 11 })
rows.push({ name: "Vingadores", data: "12-09-2022", img: "img/vingadores.jpg", genero: "suspance", id: 2 })
rows.push({ name: "Homem Aranha", data: "12-09-2022", img: "img/filmes-20191.jpg", id: 3 })
rows.push({ name: "Até o último Homem", data: "12-09-2022", img: "img/hermer.jpg", id: 4 })
rows.push({ name: "As Panteiras", data: "12-09-2022", img: "img/herois.jpeg", id: 5 })
rows.push({ name: "O Heroi Não chora", data: "12-09-2022", img: "img/vingadores.jpg", id: 6 })
//rows.push({ name: "007", data: "12-09-2022", img: "img/herois.jpeg", id: 7 })
rows.push({ name: "jhon Week", data: "12-09-2022", img: "img/filmes-20191.jpg", id: 8 })
rows.push({ name: "Esquadrão", data: "12-09-2022", img: "img/hermer.jpg", id: 9 })
rows.push({ name: "jhon Week", data: "12-09-2022", img: "img/filmes-20191.jpg", id: 12 })
rows.push({ name: "Esquadrão", data: "12-09-2022", img: "img/hermer.jpg", id: 13 })
rows.push({ name: "jhon Week", data: "12-09-2022", img: "img/filmes-20191.jpg", id: 8 })
rows.push({ name: "Esquadrão", data: "12-09-2022", img: "img/hermer.jpg", id: 9 })



//rows.sort(() => (-1 + Math.floor(3 * Math.random())))

export default {
  setup () {
    const texto = ref(" ")

    const $q = useQuasar()

    const dilogChat = ref(false)

    const router = useRouter()

    const url = "http://192.168.179.62/";

    const filmes = ref([])

    const cinemas = ref(["Cine-luanda","HMalanje", "Benguela"])

    const esperiencias = ref(["3D","4D", "HD"])

    const go = async (id) => {
       //alert(id);
      router.push(`/reserva/${id}`);
    };

    const listFilme = async () => {
      const auxCinemas = await axios.get(`${url}/cinema/cines`)
      cinemas.value = auxCinemas.data.data
      const auxFilmes = await axios.get(`${url}/cinema/filmes`)
      filmes.value = auxFilmes.data.data
      console.log(JSON.stringify(filmes))
    }
    function getItemsPerPage () {
      if ($q.screen.lt.sm) {
        return 6
      }
      if ($q.screen.lt.md) {
        return 9
      }
      return 12
    }

    const filter = ref('')
    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    })

    watch(() => $q.screen.name, () => {
      pagination.value.rowsPerPage = getItemsPerPage()
    })

    onMounted(async () => {
      listFilme()

      //alert(JSON.stringify(filme.data))
      //console.log(JSON.stringify(filme))
      //getFilme()

    })

    return {
      options: ref({
        filme: "",
        cinema: "",
        esperiencia: ""
      }),
      tab: ref('exibicao'),
      go,
      texto,
      dilogChat,
      filmes,
      cinemas,
      esperiencias,
      messeges:ref([
                {
                    text: "Olá Josué, tudo bem?",
                    from: "Edson Xauvunge"
                },
                {
                    text: "Estou bem, e você?",
                    from: "Me"
                },
                {
                    text: "Também traquilo, como vai a tua namorada?",
                    from: "Edson Xauvunge"
                },
                {
                    text: "Está fix wey e a tua? kkkkk",
                    from: "Me"
                },
                {
                    text: "Qual? kkkk",
                    from: "Edson Xauvunge"
                },
      ]),
      rows,

      filter,
      pagination,

      columns: [
        { name: 'name', label: 'Título', field: 'name' },
        { name: 'calories', label: 'Data', field: 'calories' }
      ],

      /*

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : null
      }),

      rowsPerPageOptions: computed(() => {
        return $q.screen.gt.xs
          ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
          : [3]
      }),
      */

      slide: ref(1),
      autoplay: ref(true)
    }
  },

  methods:{
    sendMessege(){
      this.messeges.push({
          text: this.texto,
          from: "Me"
      });

      this.texto = " ";
    }
  }
}
</script>

<style lang="sass">
.my-emoji
  vertical-align: middle
  height: 2em
  width: 2em

.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
