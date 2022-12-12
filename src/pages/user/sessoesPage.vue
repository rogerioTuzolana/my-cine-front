<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-pa-sm">Sessoẽs</div>
    <q-card class="q-mb-sm" flat bordered>
      <div class="row q-pa-md q-gutter-sm">
        <q-input
          class="col-7 col-sm-7 col-md-7 col-xs-12 col-lg-7 col-xl-7"
          v-model="filter"
          placeholder="Pesquisar Sessões"
          dense
          outlined
        />
        <q-space />
      </div>
    </q-card>
    <q-table
      dark
      :dense="$q.screen.lt.md"
      flat
      square
      bordered
      title="Lista de Sessões"
      :rows="sessoes"
      :columns="columns"
      :visible-columns="['sala', 'preco', 'data', 'options']"
      row-key="sala"
      :filter="filter"
      separator="cell"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="sala" class="text-center" :props="props">
            {{ props.row.id_sala }}
          </q-td>
          <q-td key="preco" :props="props">
            {{ props.row.preco }}
          </q-td>
          <q-td key="data" :props="props">
            {{ props.row.data_sessao }}
          </q-td>
          <q-td key="options" class="text-center" :props="props">
            <q-btn
              flat
              square
              icon="send"
              @click="newDialog(props.row)"
              dense
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <div class="column" style="min-width: 99.9%">
    <q-dialog v-model="dialogLugar" persistent>
      <q-card style="min-width: 380px">
        <q-card-section>
          <div class="text-h6 row item-start">
            <q-icon name="fas fa-crown" style="margin-right: 10px" /> Podes
            Escolher Até 2 Lugares no Máximo!
          </div>
          <q-separator /> </q-card-section
        ><br />

        <q-form @submit="saveItem(true)">
          <q-card-section>
            <div class="q-pa-md bg-grey-10 text-white">
              <div class="q-gutter-sm">
                <q-checkbox keep-color val="teal" unchecked-icon="task_alt" disable label="Lugar Selecionado" color="teal" />
                <q-checkbox  keep-color disable label="Lugar Ocupado" color="red" />
                <q-checkbox keep-color disable label="Lugar desocupado" color="white" />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="q-pa-sm">
              <div class="q-pa-sm">
                <div class="col-8 q-gutter-sm">
                  <q-checkbox class="q-mr-sm"
                    v-for="(lugar, index) in lugares"
                    :key="index"
                    @click="ocupar(lugar.id)"
                    :color="lugar.color"
                    :disable="lugar.estado"
                    v-model="lugaresSelecionados"
                    :val="lugar.posicao"
                    size="xs"
                    dense
                    keep-color
                  />
                </div>
              </div>
            </div>
            <q-separator /> </q-card-section
          ><br />

          <q-card-section class="q-pa-sm">
            <div class="q-px-sm">
              <strong>Lugares Selecionado: </strong><strong style="color:green">{{ lugaresSelecionados }}</strong>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              label="Cancelar"
              color="primary"
              v-ripple
              no-caps
              v-close-popup
            />
            <q-btn
              v-if="lugaresSelecionados.length > 0"
              label="Salvar"
              color="primary"
              type="submit"
              v-ripple
              no-caps
              v-close-popup
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <div>
      <q-dialog v-model="dialogClient" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Informe Os Teus Dados</div>
          </q-card-section>
          <q-form @submit="save">
            <q-card-section class="q-pa-sm">
              <q-input
                dense
                v-model="formData.name"
                label="Nome"
                autofocus
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Campo não pode estar vazio',
                ]"
              /><br />
              <q-input
                label="Email"
                dense
                v-model.trim="formData.email"
                autofocus
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Campo não pode estar vazio',
                ]"
              />
              <q-input
                label="Telefone"
                dense
                v-model.trim="formData.phone"
                autofocus
                lazy-rules
                mask="###-###-###"
                hint="Mask: ###-###-###"
              />
              <q-checkbox
                class="q-ma-sm"
                dense
                v-model="formData.gostou"
                autofocus
                label="Receber Notificações?"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn
                to="/"
                label="Cancelar"
                color="primary"
                v-ripple
                no-caps
                v-close-popup
              />
              <q-btn
                v-if="formData.email && formData.name"
                label="Salvar"
                color="primary"
                type="submit"
                v-ripple
                no-caps
                v-close-popup
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirmReserva" persistent>
        <div class="column full-width" align="center">
          <q-card>
            <h6>
              <strong>Copie o token e guade bem, pois é o seu id secreto!</strong>
            </h6>
            <q-card-section class="q-pt-none">
              <div class="q-pa-md">
                <div class="text-center q-gutter-md row items-start">

                    <h7 class="text-left text-orange q-gutter-y-sm"><strong>Dados Pessoal:</strong></h7>
                    <q-input readonly class="full-width" v-model="formData.token" filled :type="tokenVisivel ? 'password' : 'text'" hint="Token" >
                      <template v-slot:append>
                        <q-icon
                          name="content_copy"
                          class="cursor-pointer "
                          @click="copyToken"
                        />
                        <q-space/><q-space/>
                        <q-icon
                          :name="tokenVisivel ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="tokenVisivel = !tokenVisivel"
                        />

                      </template>
                    </q-input>

                    <q-input style="width: 46%" v-model="formData.name" filled  hint="nome"/>


                    <q-input style="width: 46%" v-model="formData.email" filled type="email" hint="Email" />

                    <q-input class="full-width" v-model="formData.phone" filled type="tel" hint="Telephone number" /><br>


                    <h7 class="text-left text-orange full-width q-gutter-y-sm"><strong>Dados da Reserva:</strong></h7>

                    <q-input disable v-model="formData.cinema.name" filled type="text" hint="Cinema" />

                    <q-input disable v-model="formData.filme.title" filled type="text" hint="Filme"  />

                    <q-input disable v-model="formData.id_sala" filled hint="sala" />

                    <q-input disable v-model="lugaresSelecionados" filled type="text" hint="lugares"  />

                    <q-input disable v-model="formData.hora" filled type="time" hint="hora da estreia" />

                    <q-input disable v-model="formData.data_sessao" filled type="text" hint="Data da sessão" />

                    <q-input disable style="width: 20%" v-model="formData.preco" filled hint="Preço Total" />

                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="text-white">
              <q-btn
                class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
                color="primary"
                label="cancelar"

                v-ripple
                no-caps
                v-close-popup
              >
              </q-btn>
              <q-btn
                class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
                color="primary"
                label="Salvar"
                @click="saveItem(false)"
                v-ripple
                no-caps
                v-close-popup
                >
              </q-btn>
            </q-card-actions>
          </q-card>

        </div>
      </q-dialog>
    </div>

    <q-inner-loading
      :showing="loading"
      label="Atualizando..."
      label-class="text-primary"
      color="primary"
      label-style="font-size: 1.1em"
    />
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useQuasar, QSpinnerGears, copyToClipboard } from "quasar";
import axios from "axios";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
//import { useQuasar, QSpinnerGears } from 'quasar'

const columns = [
  {
    name: "sala",
    required: true,
    label: "Sala",
    align: "center",
    field: "sala",
    sortable: true,
  },
  {
    name: "preco",
    align: "center",
    label: "Preço",
    field: "preco",
    sortable: true,
  },
  {
    name: "data",
    align: "center",
    label: "Data e Hora",
    field: "data",
    sortable: true,
  },
  {
    name: "options",
    align: "center",
    label: "Escolha O Lugar",
    field: "options",
    sortable: true,
  },
];
export default {
  name: "sessoesPage",

  setup() {
    const router = useRouter()
    const route = useRoute()
    const filter = ref("");
    const dialogLugar = ref(false);
    const loading = ref(false);
    const $q = useQuasar();
    const sessoes = ref([]);
    const reservas = ref([]);
    const lugaresDesocupados = ref([]);
    const dialogClient = ref(true);
    const data = new FormData();
    const url = "http://192.168.43.127/";
    const lugares = [
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
      { id: 1, posicao: "1s", estado: true, color: "red" },
      { id: 2, posicao: "2s", estado: false, color: "teal" },
      { id: 3, posicao: "3s", estado: false, color: "teal" },
      { id: 4, posicao: "4s", estado: false, color: "teal" },
      { id: 5, posicao: "5s", estado: true, color: "red" },
      { id: 6, posicao: "6s", estado: false, color: "teal" },
      { id: 7, posicao: "7s", estado: false, color: "teal" },
      { id: 8, posicao: "8s", estado: false, color: "teal" },
    ];

    const filmes = [
        {id: 1, capa: "img/vingadores.jpg", title: "Vingadores", genero: "Acção",
        triler: "video/O Princípio Que TODO Programador Precisa Conhecer.mp4",
        descricao: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliqua '
        },
        {id: 2, capa: "img/filmes-20191.jpg", title: "Vingadores", genero: "Acção",
        triler: "video/O Princípio Que TODO Programador Precisa Conhecer.mp4",
        descricao: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliqua. sed do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliquased do eiusmod tempor incididunt ut labore et dolore magna aliqua '
        }
      ]

    const confirmReserva = ref(false)

    const lugaresSelecionados = ref([])

    const formData = ref({
      name: "",
      gostou: false,
      email: "",
      data_reserva: Date.now,
      hora: '12:04',
      data_sessao: "08-10-2022",
      token: "12jahsdshu8e7238",
      filme: {},
      cinema: {},
      id_sala: 'Y7',
      id: 1,
      preco: "3000kz",
      lugar1: "",
      lugar2: "",
      phone: "",
    });

    const store = useStore();

    //---------------------Q - DILOG-------------------------//

    const cinemas = [{name: "Cine-Luanda", id: 1},{name: "Cine-Benguela", id: 2},{name: "Cine-Malanje", id: 3},{name: "Cine-Cabinda", id: 4}]
    const listAll = async () => {
      try {
        let teste = store.getters["user/getFilme"];
        formData.value.cinema = cinemas[route.params.id]
        formData.value.filme = teste
        loading.value = true;

        //formData.value.cinema = await axios.get(`${url}cinemas/route.params.id`);
        // alert(JSON.stringify(formData.value.cinema))
        //sessoes.value = await axios.get(`${url}sessoes/`);
        //lugares.value = await axios.get(`${url}lugares/`);

        for (let index = 0; index < 10; index++) {
          sessoes.value.push(formData.value);
          lugaresDesocupados.value.push(index + "S");
        }

        loading.value = false;
      } catch (error) {
        alert(error);
      }
    };

    const copyToken = async () => {

      copyToClipboard(formData.value.token)
        .then(() => {
          $q.notify({
            color: 'positive',
            position: 'top',
            message: 'Token Copiado!',
            icon: 'done'
          })
        })
        .catch(() => {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Token não Copiado!',
            icon: 'report_problem'
          })
        })
    }

    const postReserva = async (token) => {
      data.append("first_name", formData.value.data_reserva);
      data.append("last_name", formData.value.id_sala);
      data.append("lugar1", formData.value.lugar1);
      data.append("lugar2", formData.value.lugar2);
      //data.append("id_cinema", formData.value.cinema.id);
      //data.append("id_filme", formData.value.filme.id);
      data.append("email", formData.value.email);

      axios({
        method: "post",
        url: `${url}cinema/post`,
        headers: { "content-type": "multipart/form-data" },
        data: data,
      })
        .then((res) => {
          $q.notify({
            color: 'positive',
            position: 'top',
            message: 'Reserva Efetuada com Sucesso!!',
            icon: 'done'
          })
          console.log(res.data);
        })
        .catch((error) => {
          $q.dialog({
            title: 'Erro ao efetuar a reserva!!!',
            dark: true,
            message: `tipo de erro: ${error}`,
            progress: {
              spinner: QSpinnerGears,
              color: 'negative'
            },
            persistent: true, // we want the user to not be able to close it
            ok: true // we want the user to not be able to close it
          })
          console.log(error);
        });

        router.push('/')
    };

    const alerts = async () => {
      const dialog = $q.dialog({
        title: 'Uploading...',
        dark: true,
        message: '0%',
        progress: {
          spinner: QSpinnerGears,
          color: 'amber'
        },
        persistent: true, // we want the user to not be able to close it
        ok: false // we want the user to not be able to close it
      })

        // we simulate some progress here...
      let percentage = 0
      const interval = setInterval(() => {
        percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

        // we update the dialog
        dialog.update({
          message: `Uploading... ${percentage}%`
        })

        // if we are done, we're gonna close it
        if (percentage === 100) {
          clearInterval(interval)
          dialog.update({
            title: 'Done!',
            message: 'Upload completed successfully',
            progress: false,
            ok: true
          })
        }
      }, 500)

    }

    const idTopic = [];
    const saveItem = async (lugar) => {
      try {
        loading.value = true;

        if (lugar) {
          formData.value.token = Math.floor(Math.random() * 10) * 7 + Math.floor(Math.random() * 17)

          let token = "my" + "32" + "YERE" + formData.value.token.toString(2) + "mcp";

          formData.value.token = token

          confirmReserva.value = true;
          //alert(confirmReserva.value)
          //data.append("token", token);
        }else{
          await postReserva(formData.value.token);
        }
      } catch (error) {
        alert(error);
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      listAll();
    });

    const newDialog = (data) => {
      if (data) {
        Object.keys(data).forEach((key) => {
          //formData[key] = data[key];
          formData.value.data_sessao = data.data_sessao;
          formData.value.id_sala = data.id_sala;
          formData.value.preco = data.preco;
          formData.value.filme = data.filme;
          formData.value.cinema = data.cinema;
        });
      } else {
        formData.value.data_sessao = "";
        formData.value.id_sala = "";
        formData.value.preco = "";
        formData.value.filme = "";
      }
      dialogLugar.value = true;
    };

    const ocupar = async (id) => {
      if (lugaresSelecionados.value.length > 2) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Lamentamos, mas não lhe é permitido escolher mais de um lugar!!',
          icon: 'report_problem'
        })


        //alert('Só Podes escolher apenas Dois Lugares!!')
        lugares.forEach((el) => {
          if (el.id === id) {
            lugaresSelecionados.value.splice(lugaresSelecionados.value.length-1, 1)
            el.estado = false
            id = 0
          }
        })

      }
    }

    return {
      copyToken,
      dialogClient,
      data,
      filter,
      ocupar,
      newDialog,
      formData,
      loading,
      dialogLugar,
      saveItem,
      columns,
      sessoes,
      lugaresDesocupados,
      varDialogPassword: ref(false),
      lugaresSelecionados,
      lugares,
      confirmReserva,
      tokenVisivel: ref(false),
    };
  },
};
</script>

<style>
  .material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48
  }
  </style>
