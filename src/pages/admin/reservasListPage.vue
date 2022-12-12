<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-pa-sm">Reservas</div>
    <q-card class="q-mb-sm" flat bordered>
      <div class="row q-pa-md q-gutter-sm">
        <q-input
          class="col-7 col-sm-7 col-md-7 col-xs-12 col-lg-7 col-xl-7"
          v-model="filter"
          placeholder="Pesquisar Reservas"
          dense
          outlined
        />
        <q-space />
        <q-btn
          class="text-orange col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
          color="black"
          label="Atualizar"
          @click="listAll()"
          no-caps
          rounded
        >
        </q-btn>
      </div>
    </q-card>
    <q-table

      :dense="$q.screen.lt.md"
      flat
      square
      bordered
      title="Lista de Reservas"
      :rows="reservas"
      :columns="columns"
      :visible-columns="['sala', 'preco', 'data','filme', 'data-reserva', 'options']"
      row-key="sala"
      :filter="filter"
      separator="cell"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="sala" class="text-center" :props="props">
            {{ props.row.SALA }}
          </q-td>
          <q-td key="data-reserva" :props="props">
            {{ props.row.DATA_RESERVA }}
          </q-td>
          <q-td key="preco" :props="props">
            {{ props.row.PRECO }}
          </q-td>
          <q-td key="data" :props="props">
            {{ props.row.DATA_SESSAO }}
          </q-td>
          <q-td key="filme" :props="props">
            {{ props.row.NOME }}
          </q-td>
          <q-td key="options" class="text-center" :props="props">
            <q-btn color="blue-10" flat square icon="visibility" @click="newDialog(props.row)" dense />
            <q-btn color="red" flat square icon="delete" @click="confirmDelete(props.row)" dense />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <q-dialog v-model="dialogReserva" >
        <div class="column full-width" align="center">
          <q-card>
            <q-card-section>
              <strong>Reserva</strong>
            </q-card-section>
            <q-separator/>
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

                    <q-input readonly style="width: 46%" v-model="formData.name" filled  hint="nome"/>


                    <q-input readonly style="width: 46%" v-model="formData.email" filled type="email" hint="Email" />

                    <q-input readonly class="full-width" v-model="formData.phone" filled type="tel" hint="Telephone number" />

                    <h7 class="text-left text-orange full-width q-gutter-y-sm"><strong>Dados da Reserva:</strong></h7>
                    <q-input disable v-model="formData.phone" filled type="text" hint="Cinema" />

                    <q-input disable v-model="formData.phone" filled type="text" hint="Filme"  />

                    <q-input disable v-model="formData.phone" filled hint="sala" />

                    <q-input disable v-model="lugaresSelecionados" filled type="text" hint="lugares"  />

                    <q-input disable v-model="formData.hora" filled type="time" hint="hora da estreia" />

                    <q-input disable v-model="formData.data_sessao" filled type="text" hint="Data da sessão" />

                    <q-input disable style="width: 20%" v-model="formData.preco" filled hint="Preço Total" />

                </div>
              </div>
            </q-card-section>

            <q-separator/>

            <q-card-actions align="right" class="text-white">
              <q-btn
                class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
                color="primary"
                label="Voltar"
                v-ripple
                no-caps
                v-close-popup
              />
            </q-card-actions>
          </q-card>

        </div>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
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
    name: "filme",
    align: "center",
    label: "Filme",
    field: "filme",
    sortable: true,
  },
  {
    name: "data-reserva",
    align: "center",
    label: "Data Reserva",
    field: "data-reserva",
    sortable: true,
  },
    {
    name: "options",
    align: "center",
    label: "opções",
    field: "options",
    sortable: true,
  },
];
export default defineComponent({
  setup() {
    const loading = ref(true);
    const $q = useQuasar();
    const reservas = ref([]);
    const dialogReserva = ref(false)

    const url = "http://192.168.179.62/";

    const data = new FormData();

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
    const listAll = async () => {
      try {
        loading.value = true;
        const auxReserva = await axios.get(`${url}cinema/admin/reservas`);
        reservas.value = auxReserva.data.data
        /*
        for (let index = 0; index < 10; index++) {
          reservas.value.push(formData.value)
        }*/
        loading.value = false;
      } catch (error) {
        alert(error);
      }
    };
    const idTopic = [];
    const deleteItem = async (id) => {
      try {
        loading.value = true;
        //const allIdsTOpic = await getByField("topic", "categoria_id", id);
        //for await (const t of allIdsTOpic) {
          // await removeWhere("access_topic_user", "topic_id", t.id);
          //const app = await getByField("approach", "topic_id", t.id);
          //for await (const a of app) {
            //await removeWhere("favorite_approach_user", "approach_id", a.id);
            //await removeWhere("approach_contents", "id_approach", a.id);
          //}
          //await removeWhere("approach", "topic_id", t.id);
        //}
        //await removeWhere("topic", "categoria_id", Number(id));
        //await remove("categoria", id);
      } catch (error) {
        alert(JSON.stringify(error));
      } finally {
        listAll();
        loading.value = false;
      }
    };
    const saveItem = async () => {
      try {
        loading.value = true;
        if (!formData.value.id) {
          delete formData.value.id;
          //await post("categoria", formData);
        } else {
          //await update("categoria", formData);
        }
        listAll();
      } catch (error) {
        alert(error);
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      listAll();
    });
    const onItemClick = async () => {};
    const dialogCategory = ref(false);
    const newDialog = (data) => {
      if (data) {
        Object.keys(data).forEach((key) => {
          formData[key] = data[key];
        });
        dialogReserva.value = true
      } else {
        formData.value.name = "";
      }
      //dialogCategory.value = true;
    };
    function confirmDelete(dat) {
      $q.dialog({
        title: "Eliminar registro",
        message: "Gostaria de apagar este registro?",
        persistent: true,
        cancel: "Cancelar",
      })
        .onOk(async () => {
          //deleteItem(id);
          data.append("token", dat.TOKEN_ID);
          data.append("id_admin", 2);

        axios({
        method: "post",
        url: `${url}cinema/eliminar-reserva`,
        headers: { "content-type": "multipart/form-data" },
        data: data,
      })
        .then((res) => {
          $q.notify({
            title: `${res.data}`,
            color: 'positive',
            position: 'top',
            message: 'Reserva Eliminada com Sucesso!!',
            icon: 'done'
          })
        })
        .catch((error) => {
          $q.dialog({
            title: 'Erro ao eliminar a reserva!!!',
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

        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
    const filter = ref("");

    const converter = (minutos) => {
      const horas = Math.floor(minutos/ 60);
      const min = minutos % 60;
      const textoHoras = (`00${horas}`).slice(-2);
      const textoMinutos = (`00${min}`).slice(-2);

      return `${textoHoras }:${textoMinutos}`;
    };  console.log(converter(70));

    return {
      filter,
      confirmDelete,
      newDialog,
      formData,
      loading,
      deleteItem,
      dialogCategory,
      saveItem,
      onItemClick,
      columns,
      reservas,
      listAll,
      dialogReserva,
      tokenVisivel: ref(false),
    };
  },
});
</script>

<style></style>
