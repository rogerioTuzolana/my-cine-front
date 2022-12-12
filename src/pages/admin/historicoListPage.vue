<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-pa-sm">Histórico Clientes</div>
    <q-card class="q-mb-sm" flat bordered>
      <div class="row q-pa-md q-gutter-sm">
        <q-input
          class="col-7 col-sm-7 col-md-7 col-xs-12 col-lg-7 col-xl-7"
          v-model="filter"
          placeholder="Pesquisar Clientes"
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
      title= "Lista de Clientes"
      :rows="clientes"
      :columns="columns"
      :visible-columns="['nome', 'terminal', 'email', 'historico']"
      row-key="email"
      :filter="filter"
      separator="cell"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="nome" class="text-center" :props="props">
            {{ props.row.NOME }}
          </q-td>
          <q-td key="terminal" :props="props">
            {{ props.row.NUM_TEL }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.EMAIL }}
          </q-td>
          <q-td key="historico" class="text-center" :props="props">
            <q-btn color="blue-10" flat square icon="visibility" @click="newDialog(props.row)" dense />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <div class="column" style="min-width: 99.9%">
    <q-dialog v-model="dialogCategory" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Consultar Histórico</div>
        </q-card-section>
        <q-form @submit="saveItem">
          <q-card-section class="q-pa-sm">
            <q-input label="informe o email" dense v-model.trim="formData.email" autofocus />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn label="Cancelar" color="primary" v-ripple no-caps v-close-popup />
            <q-btn
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
import { defineComponent, onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
const columns = [
  {
    name: "nome",
    required: true,
    label: "Nome",
    align: "center",
    field: "nome",
    sortable: true,
  },
  {
    name: "terminal",
    align: "center",
    label: "Terminal",
    field: "terminal",
    sortable: true,
  },
  {
    name: "email",
    align: "center",
    label: "Email",
    field: "email",
    sortable: true,
  },
  {
    name: "historico",
    align: "center",
    label: "Ver Histórico",
    field: "historico",
    sortable: true,
  }
];
export default defineComponent({
  setup() {
    const loading = ref(true);
    const $q = useQuasar();
    const clientes = ref([]);
    const route = useRoute()

    const formData = ref({
      name: "",
      gostou: false,
      email: "",
      data_reserva: "12-09-2009",
      data_sessao: "8-10-2022",
      token: "12jahsdshu8e7238",
      id_filme: 1,
      id_cinema: 2,
      id_sala: 7,
      id: 1,
      preco: '3000kz',
      lugar1: '', lugar2: '',
      phone: ''
    });

    const url = "http://192.168.179.62/";

    const historico = ref([])

    const listAll = async () => {
      try {
        loading.value = true;

        const auxclientes = await axios.get(`${url}cinema/admin/clientes`);

        const auxHistorico = await axios.get(`${url}cinema/historico-reserva/${formData.value.email}`);
        historico.value = auxHistorico.data.data
        alert(JSON.stringify(historico.value))

        clientes.value = auxclientes.data.data
        /*
        for (let index = 0; index < 10; index++) {
          clientes.value.push(formData.value)
        }
        */
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
        if (!formData.id) {
          delete formData.id;
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
      } else {
        //formData.name = "";
      }
      dialogCategory.value = true;
    };
    function confirmDelete(id) {
      $q.dialog({
        title: "Eliminar registro",
        message: "Gostaria de apagar este registro?",
        persistent: true,
        cancel: "Cancelar",
      })
        .onOk(() => {
          deleteItem(id);
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
    const filter = ref("");
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
      clientes,
      listAll,
      //varDialogPassword: ref(false),
    };
  },
});
</script>

<style></style>
