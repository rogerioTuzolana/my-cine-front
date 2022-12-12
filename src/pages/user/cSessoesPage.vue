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
            {{ props.row.NUM_SALA }}
          </q-td>
          <q-td key="preco" :props="props">
            {{ props.row.PRECO }}
          </q-td>
          <q-td key="data" :props="props">
            {{ props.row.DATA_SESSAO }} | {{ props.row.HORA }}
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
                    :disable="lugar.estado == '1' ? true : false"
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
              <strong>Lugares Selecionado: </strong><strong style="color:teal">{{ lugaresSelecionados }}</strong> <strong>| Preço:</strong><strong style="color:teal">{{ preco }}KZs</strong>
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
                v-model="formData.v_nome_cliente"
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
                v-model.trim="formData.v_email_cliente"
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
                v-model.trim="formData.v_tel_cliente"
                autofocus
                lazy-rules
                :rules="[
                  (val) =>
                    (val.length > 8 || val.length == 0) || 'O terminal deve ter 9 dígitos ',
                ]"
                mask="###-###-###"
                hint="Mask: ###-###-###"
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
                v-if="formData.v_nome_cliente && formData.v_email_cliente"
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

                    <q-input style="width: 46%" v-model="formData.v_nome_cliente" filled  hint="nome"/>


                    <q-input style="width: 46%" v-model="formData.v_email_cliente" filled type="email" hint="Email" />

                    <q-input class="full-width" v-model="formData.v_tel_cliente" filled type="tel" hint="Telephone number" /><br>


                    <h7 class="text-left text-orange full-width q-gutter-y-sm"><strong>Dados da Reserva:</strong></h7>

                    <q-input disable v-model="formData.cinema" filled type="text" hint="Cinema" />

                    <q-input disable v-model="formData.filme" filled type="text" hint="Filme"  />

                    <q-input disable v-model="formData.sala_sessao" filled hint="sala" />

                    <q-input disable v-model="lugaresSelecionados" filled type="text" hint="lugares"  />

                    <q-input disable v-model="formData.hora_sessao" filled type="time" hint="hora da estreia" />

                    <q-input disable v-model="formData.data_sessao" filled type="text" hint="Data da sessão" />

                    <q-input disable style="width: 20%" v-model="preco" filled hint="Preço Total" />

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
    const url = "http://192.168.179.62/";
    const lugares = ref([]);

    const confirmReserva = ref(false)

    const lugaresSelecionados = ref([])

    const idsLugar = ref([])

    const formData = ref({
      v_nome_cliente: "",
      v_email_cliente: "",
      token: "",
      qtd: null,
      id_cine: null,
      id_sassion: null,
      position: '',
      v_tel_cliente: "9",

      preco: 0,
      filme: '',
      cinema: '',
      sala_sessao: '',
      data_sessao: '',
      hora_sessao: '',
      id_sala: null,
      lugares: ""
    });

    const preco = ref(0)

    const store = useStore();

    //---------------------Q - DILOG-------------------------//

    const cinemas = [{name: "Cine-Luanda", id: 1},{name: "Cine-Benguela", id: 2}]
    const listAll = async () => {
      try {
        let teste = store.getters["user/getFilme"];
        formData.value.id_cine = route.params.id
        //alert((formData.value.id_cine))
        formData.value.filme = teste.NOME
        loading.value = true;

        const s = await axios.get(`${url}cinema/filme-sessoes/${route.params.id}/${teste.ID_FILME}`);
        sessoes.value = s.data.data

      } catch (error) {
        alert(error);
      } finally {
        loading.value = false;
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
      data.append("token", token.toString(2));
      data.append("v_nome_cliente", formData.value.v_nome_cliente);
      data.append("v_email_cliente", formData.value.v_email_cliente);
      data.append("v_tel_cliente", formData.value.v_tel_cliente);
      data.append("qtd", formData.value.qtd);
      data.append("position", formData.value.position);
      data.append("id_session", parseInt(formData.value.id_sassion));
      data.append("id_cine", parseInt(formData.value.id_cine));

      axios({
        method: "post",
        url: `${url}cinema/criar-reserva`,
        headers: { "content-type": "multipart/form-data" },
        data: data,
      })
        .then((res) => {
          $q.notify({
            title: `${res}`,
            color: 'positive',
            position: 'top',
            message: 'Reserva Efetuada com Sucesso!!',
            icon: 'done'
          })
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
      const dataLugares = new FormData();
      if (idsLugar.value.length > 1) {
        formData.value.lugares = `[${idsLugar.value[0]},${idsLugar.value[1]}]`
      } else {
        formData.value.lugares = `[${idsLugar.value[0]}]`
      }
      dataLugares.append("lugares", formData.value.lugares);
      axios({
        method: "post",
        url: `${url}cinema/estado-lugar/${formData.value.id_sala}`,
        headers: { "content-type": "multipart/form-data" },
        data: dataLugares,
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
        //alert(JSON.stringify(res.data));
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
        alert(JSON.stringify(lugaresSelecionados.value))
        loading.value = true;

        if (lugar) {
          formData.value.token = Math.floor(Math.random() * 10) * 7 + Math.floor(Math.random() * 17)

          let token = "my" + "32" + "YERE" + formData.value.token.toString(2) + lugaresSelecionados.value[0];

          formData.value.token = token

          if (lugaresSelecionados.value.length > 1) {
            formData.value.position = lugaresSelecionados.value[0] + "," + lugaresSelecionados.value[1]
            alert(formData.value.position)
          } else {
            formData.value.position = lugaresSelecionados.value[0]
          }

          confirmReserva.value = true;
          formData.value.qtd = lugaresSelecionados.value.length

        }else{
          await postReserva(formData.value.token);
          //alert('Selecione Pelomenos um Lugar!!')
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

    const newDialog = async (data) => {
      try {
        if (data) {
          Object.keys(data).forEach((key) => {
            //formData[key] = data[key];
            formData.value.id_sassion = data.ID_SESSAO;
            formData.value.preco = parseFloat(data.PRECO);
            formData.value.cinema = data.NOME_CIN
            formData.value.id_sala = data.ID_SALA
          });
          const auxLugar = await axios.get(`${url}cinema/lugar-sala/${data.ID_SESSAO}`);
          //alert(JSON.stringify(auxLugar.data.data))
          lugares.value = auxLugar.data.data.map((item) => ({
            id: item.ID_LUGAR,
            posicao: item.POSICAO,
            estado: item.ESTADO,
            color: item.ESTADO = "1"  ? 'red' : 'teal'
          }));
          alert(JSON.stringify(lugares.value))
          dialogLugar.value = true;
        } else {
          Object.keys(data).forEach((key) => {
          //formData[key] = "";
        });
        }
      } catch (error) {
        alert(error)
      } finally {
        dialog.value = false;
      }

    };


    const alter = ref(true)
    const ocupar = async (id) => {

      alter.value = true

      const ja = ref(false)

      if (lugaresSelecionados.value.length > 2) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Lamentamos, mas não lhe é permitido escolher mais de um lugar!!',
          icon: 'report_problem'
        })


        //alert('Só Podes escolher apenas Dois Lugares!!')

        lugares.value.forEach((el) => {
          if (el.id === id) {
            lugaresSelecionados.value.splice(lugaresSelecionados.value.length-1, 1)
            el.estado = false
            id = 0
            //idsLugar.value.pop()
            //alter.value = true
          }

        })

      } else {
        if(idsLugar.value.length > 0){
          alert('tamanho' + idsLugar.value.length)
          for (let index = 0; index < idsLugar.value.length; index++) {
            alert(parseInt(idsLugar.value[index]) + id)
            if (idsLugar.value[index] == id) {
              if (index === 0) {
                idsLugar.value.splice(0, 1)
                alter.value = false
                id = 0

              } else {
                idsLugar.value.splice(1, 1)
                alter.value = false
                id = 0
              }
              alert('eliminar')
              break;
            }

          }


        }


        if (lugaresSelecionados.value.length === 1) {
          preco.value = formData.value.preco
          if (alter.value) {
            alert('tam 1')
            idsLugar.value[0] = id
            id = 0
            alter.value = true
            //ja.value = false
         }


        } else if (lugaresSelecionados.value.length === 2){
          preco.value = formData.value.preco + formData.value.preco
          if (alter.value) {
            alert('tam 2')
            idsLugar.value[1] = id
            id = 0
            alter.value = true
            //ja.value = false
          }

        } else {
          preco.value = 0
        }
      }
      alert(JSON.stringify(idsLugar.value))
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
      preco,
      idsLugar
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
