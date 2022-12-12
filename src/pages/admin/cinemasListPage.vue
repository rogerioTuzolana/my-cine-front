<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-pa-sm">Cinemas</div>
    <q-card class="q-mb-sm" flat bordered>
      <div class="row q-pa-md q-gutter-sm">
        <q-input
          class="col-7 col-sm-7 col-md-7 col-xs-12 col-lg-7 col-xl-7"
          v-model="filter"
          placeholder="Pesquisar Cinemas"
          dense
          outlined
        />
        <q-space />
        <q-btn
          class="text-orange col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
          color="black"
          label="Novo tipo"
          @click="newDialog()"
          no-caps
          rounded
        >
        </q-btn>
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
      title="Lista de Cinemas"
      :rows="cinemas"
      :columns="columns"
      :visible-columns="['nome', 'localizacao', 'lugar', 'options']"
      row-key="sala"
      :filter="filter"
      separator="cell"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="nome" class="text-center" :props="props">
            {{ props.row.NOME }}
          </q-td>
          <q-td key="localizacao" :props="props">
            {{ props.row.LOCALIZACAO }}
          </q-td>
          <q-td key="lugar" class="text-center" :props="props">
            <q-btn color="grey" flat square icon="visibility" @click="verLugar(props.row.ID_CINEMA)" dense />
          </q-td>
          <q-td key="options" class="text-center" :props="props">
            <q-btn color="orange-10" flat square icon="edit" @click="newDialog(props.row)" dense />
            <q-btn color="red" flat square icon="delete" @click="newDialog(props.row)" dense />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <div class="column" style="min-width: 99.9%">


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
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
//import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const columns = [
  {
    name: "nome",
    required: true,
    label: "nome",
    align: "center",
    field: "nome",
    sortable: true,
  },
  {
    name: "localizacao",
    align: "center",
    label: "localização",
    field: "localizacao",
    sortable: true,
  },
  {
    name: "lugar",
    align: "center",
    label: "ver lugar",
    field: "lugar",
    sortable: true,
  },
  {
    name: "options",
    align: "center",
    label: "Opções",
    field: "options",
    sortable: true,
  },
];
export default defineComponent({
  setup() {
    const loading = ref(true);
    const $q = useQuasar();
    const cinemas = ref([]);

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

    const router = useRouter()

    const url = "http://192.168.179.62/";

    const listAll = async () => {
      try {
        loading.value = true;
        const auxCinemas = await axios.get(`${url}cinema/admin/cines`);
        cinemas.value = auxCinemas.data.data
        /*
        for (let index = 0; index < 10; index++) {
          cinemas.value.push(formData.value)
        }
        */

      } catch (error) {
        alert(error);
      } finally {
        loading.value = false;
      }
    };

    const verLugar = async (id_cinema) => {
      router.push(`/ver-lugar/${id_cinema}`);
    }
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
        formData.name = "";
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
      cinemas,
      listAll,
      verLugar
      //varDialogPassword: ref(false),
    };
  },
});
</script>

<style></style>
