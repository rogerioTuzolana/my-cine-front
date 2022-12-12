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
        <q-btn
          class="text-orange col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
          color="black"
          label="Nova Sessão"
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
      dark
      :dense="$q.screen.lt.md"
      flat
      square
      bordered
      title="Lista de Sessões"
      :rows="sessoes"
      :columns="columns"
      :visible-columns="['sala', 'preco', 'data', 'hora', 'filme', 'estado', 'options']"
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
            {{ props.row.DATA_SESSAO }}
          </q-td>
          <q-td key="hora" :props="props">
            {{ props.row.HORA }}
          </q-td>
          <q-td key="filme" :props="props">
            {{ props.row.NOME }}
          </q-td>
          <q-td key="estado" :props="props">
            <q-btn :color="props.row.ESTADO == '1' ? 'green' : 'red'" :label="props.row.ESTADO ? 'Activado' : 'Desactivado'"
              class="cursor-pointer" @click="props.row.ESTADO = !props.row.ESTADO" dense
            />

          </q-td>
          <q-td key="options" class="text-center" :props="props">
            <q-btn color="grey" flat square icon="edit" @click="newDialog(props.row)" dense />
            <q-btn color="red-10" flat square icon="delete" @click="confirmDelete(props.row)" dense />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>

  <div class="column" style="min-width: 99.9%">
    <q-dialog v-model="dialogSessao" >
      <div class="column full-width" align="center">
        <q-card>
          <q-card-section>
            <strong>Editar Sessão</strong>
          </q-card-section>
          <q-separator/>
          <q-card-section class="q-pt-none">
            <div class="q-pa-md">
              <div class="text-center q-gutter-md row items-start">
                <q-input disable v-model="formData.phone" filled type="text" hint="Cinema" />

                <q-input disable v-model="formData.phone" filled type="text" hint="Filme"  />

                <q-input disable v-model="formData.phone" filled hint="sala" />

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
              label="Cancelar"
              v-ripple
              no-caps
              v-close-popup
            />
            <q-btn
              class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
              color="primary"
              label="Salvar"
              @click="update"
              v-ripple
              no-caps
              v-close-popup
            />
          </q-card-actions>
        </q-card>

      </div>
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
    label: "Data",
    field: "data",
    sortable: true,
  },
  ,
  {
    name: "hora",
    align: "center",
    label: "hora",
    field: "hora",
    sortable: true,
  },
  ,
  {
    name: "filme",
    align: "center",
    label: "filme",
    field: "filme",
    sortable: true,
  },
  ,
  {
    name: "estado",
    align: "center",
    label: "estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "options",
    align: "center",
    label: "Acção",
    field: "options",
    sortable: true,
  },
];
export default defineComponent({
  setup() {
    const loading = ref(true);
    const $q = useQuasar();
    const sessoes = ref([]);

    const url = "http://192.168.179.62/";

    const onItemClick = async () => {};
    const dialogSessao = ref(false);

    const formData = ref({
      sala: "Y",
      estado: true,
      data: "12-01-2000",
      hora: '12:04',
      id: 1,
      preco: "3000kz",
      filme: "Vingador"
    });

    const listAll = async () => {
      try {
        loading.value = true;
        const auxSessoes = await axios.get(`${url}cinema/admin/sessoes`);

        //alert(JSON.stringify(auxSessoes))

        sessoes.value = auxSessoes.data.data

        //alert(JSON.stringify(sessoes.value))

        /*
        for (let index = 0; index < 10; index++) {
          sessoes.value.push(formData.value)
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

    const newDialog = (data) => {
      if (data) {
        Object.keys(data).forEach((key) => {
          formData[key] = data[key];
        });
      } else {
        formData.value.name = "";
      }
      dialogSessao.value = true;
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
      dialogSessao,
      saveItem,
      onItemClick,
      columns,
      sessoes,
      listAll,
      //varDialogPassword: ref(false),
    };
  },
});
</script>

<style></style>
