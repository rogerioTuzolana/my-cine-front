<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-pa-sm">Abordagens</div>

    <q-slide-transition>
      <q-card-section class="q-px-none" v-show="currentApproach">
        <q-card flat bordered>
          <q-card-section v-if="currentApproach" class="row">
            {{ currentApproach.title }}
            <q-space></q-space>
            <q-btn flat round icon="close" dense @click="currentApproach = null" />
            <q-btn
              flat
              :loading="loadingContent"
              round
              icon="save"
              dense
              @click="saveContent()"
            >
              <template v-slot:loading> <q-spinner-facebook /></template>
            </q-btn>
          </q-card-section>
          <q-separator></q-separator>

          <!--
            <q-card-section>
            <q-list
              v-for="(content, index) in contents"
              :key="index"
              bordered
              class="rounded-borders q-my-sm"
            >
              <q-expansion-item label="Conteúdo">
                <q-separator />

                <template v-slot:header>
                  <q-item-section> {{ content.title }} </q-item-section>

                  <q-item-section side>
                    <div class="row items-center">
                      <q-btn
                        icon="cancel"
                        color="red"
                        round
                        flat
                        @click="removeContent(index)"
                      />
                    </div>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section>
                    <q-input
                      :rules="[(val) => !!val || 'Campo obrigatório']"
                      outlined
                      label="Título"
                      dense
                      v-model="contents[index].title"
                    >
                    </q-input>
                    <q-editor
                      v-model="contents[index].content"
                      min-height="8rem"
                      :toolbar="[
                        [
                          {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            list: 'only-icons',
                            options: ['left', 'center', 'right', 'justify'],
                          },
                          {
                            label: $q.lang.editor.align,
                            icon: $q.iconSet.editor.align,
                            fixedLabel: true,
                            options: ['left', 'center', 'right', 'justify'],
                          },
                        ],
                        [
                          'bold',
                          'italic',
                          'strike',
                          'underline',
                          'subscript',
                          'superscript',
                        ],
                        ['token', 'hr', 'link', 'custom_btn'],
                        ['print', 'fullscreen'],
                        [
                          {
                            label: $q.lang.editor.formatting,
                            icon: $q.iconSet.editor.formatting,
                            list: 'no-icons',
                            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                          },
                          {
                            label: $q.lang.editor.fontSize,
                            icon: $q.iconSet.editor.fontSize,
                            fixedLabel: true,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                              'size-1',
                              'size-2',
                              'size-3',
                              'size-4',
                              'size-5',
                              'size-6',
                              'size-7',
                            ],
                          },
                          {
                            label: $q.lang.editor.defaultFont,
                            icon: $q.iconSet.editor.font,
                            fixedIcon: true,
                            list: 'no-icons',
                            options: [
                              'default_font',
                              'arial',
                              'arial_black',
                              'comic_sans',
                              'courier_new',
                              'impact',
                              'lucida_grande',
                              'times_new_roman',
                              'verdana',
                            ],
                          },
                          'removeFormat',
                        ],
                        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                        ['undo', 'redo'],
                        ['viewsource'],
                      ]"
                      :fonts="{
                        arial: 'Arial',
                        arial_black: 'Arial Black',
                        comic_sans: 'Comic Sans MS',
                        courier_new: 'Courier New',
                        impact: 'Impact',
                        lucida_grande: 'Lucida Grande',
                        times_new_roman: 'Times New Roman',
                        verdana: 'Verdana',
                      }"
                    >
                    </q-editor>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>

            <q-btn
              class="q-mb-sm"
              icon="add"
              color="primary"
              outline
              label="Adicionar conteúdo"
              no-caps
              @click="addContent"
            />
          </q-card-section>
          -->

        </q-card>
      </q-card-section>
    </q-slide-transition>


    <q-card class="q-mb-sm" flat bordered>
      <div class="row q-pa-md q-gutter-sm">
        <q-input
          class="col-7 col-sm-7 col-md-7 col-xs-12 col-lg-7 col-xl-7"
          v-model="filter"
          placeholder="Pesquisar abordagem"
          dense
          outlined
        />
        <q-space />
        <q-btn
          class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
          color="primary"
          label="Nova abordagem"
          @click="newDialog()"
          no-caps
          rounded
        >
        </q-btn>
        <q-btn
          class="col-2 col-sm-2 col-md-2 col-xs-12 col-lg-2 col-xl-2"
          color="primary"
          label="Atualizar"
          @click="getAproaches()"
          no-caps
          rounded
        >
        </q-btn>
      </div>
    </q-card>
    <q-table
      color="primary"
      :dense="$q.screen.lt.xs"
      flat
      square
      bordered
      :loading="loadingTable"
      :rows="rows"
      :columns="columns"
      :visible-columns="['title', 'options', 'topic', 'type_approach', 'criado']"
      row-key="title"
      separator="cell"
      :filter="filter"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td class="text-left" key="topic" :props="props">
            {{ props.row.topic }}
          </q-td>
          <q-td class="text-left" key="type_approach" :props="props">
            {{ props.row.type_approach }}
          </q-td>

          <q-td class="text-left" key="criado" :props="props">
            Yuri Rego aos:
            {{
              new Date(props.row.created_at).toLocaleString("en-GB", { timeZone: "UTC" })
            }}
          </q-td>
          <q-td key="options" class="text-left" :props="props">
            <q-btn
              icon="content_copy"
              :disable="!props.row.link"
              flat
              round
              size="sm"
              dense
              @click="copyTo(props.row.id)"
            >
              <q-tooltip>
                {{
                  props.row.link
                    ? "Copiar conteúdo como Hyperlink"
                    : "Não conteúdo Hyperlink"
                }}
              </q-tooltip>
            </q-btn>

            <q-btn flat round size="sm" icon="edit" @click="newDialog(props.row)" dense />
            <q-btn
              flat
              round
              size="sm"
              icon="source"
              @click="getContents(props.row)"
              dense
            />

            <q-btn
              flat
              round
              size="sm"
              icon="delete"
              @click="confirmDelete(props.row.id)"
              dense
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="showAddApproach" persistent>
      <q-card class="full-width">
        <q-form @submit="saveItem">
          <q-card-section class="q-py-sm">
            <div class="text-h6">Nova Abordagem</div>
          </q-card-section>
          <q-separator />

          <q-card-section class="scroll" style="max-height: 55vh">
            <div class="row">
              <q-input
                class="col-12"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                outlined
                label="Titulo"
                dense
                v-model.trim="formData.title"
                autofocus
              />
              <q-select
                class="col-12"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                dense
                outlined
                v-model="formData.topic_id"
                :options="optionsTopic"
                label="Topico"
              />
              <q-select
                class="col-12"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                dense
                outlined
                v-model="formData.type_approach_id"
                :options="optionsAproach"
                label="Tipo de Abordagem"
              />

              <div class="col-12">
                <q-checkbox
                  v-model="formData.link"
                  class="col-4"
                  label="Conteúdo hyperlink"
                />
                <q-checkbox
                  v-model="formData.premium"
                  class="col-4"
                  label="Conteúdo Premium"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              label="Cancelar "
              @click="loadingForm = false"
              color="primary"
              v-ripple
              no-caps
              dense
              v-close-popup
            />

            <q-btn label="Salvar" color="primary" dense type="submit" v-ripple no-caps />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-inner-loading
      :showing="loadingForm"
      label="Carregando dados..."
      label-class="text-primary"
      color="primary"
      label-style="font-size: 1.1em"
    />
  </q-page>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useQuasar, copyToClipboard } from "quasar";

const columns = [
  {
    name: "title",
    required: true,
    label: "Título",
    align: "left",
    field: "title",
    sortable: true,
  },

  {
    name: "topic",
    align: "left",
    label: "Tópico",
    field: "topic",
    sortable: true,
  },
  {
    name: "type_approach",
    align: "left",
    label: "Tipo de abordagem",
    field: "type_approach",
    sortable: true,
  },

  {
    name: "criado",
    align: "left",
    label: "Criado Por",
    field: "criado Por",
    sortable: true,
  },

  {
    name: "options",
    align: "left",
    label: "Ação",
    field: "options",
    sortable: true,
  },
];

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const loadingForm = ref(false);
    const loadingTable = ref(false);
/*
    const {
      list,
      joinTables,
      post,
      update,
      removeWhere,
      remove,
      getById,
      getByField,
    } = useApi();
    const rows = ref([]);
    const optionsAproach = ref(null);
    const optionsTopic = ref(null);

    const showAddApproach = ref(false);
    const formData = reactive({
      title: "",
      topic_id: null,
      type_approach_id: null,
      link: false,
      premium: false,
    });
    const getLists = async () => {
      const auxAproach = await list("type_approach");
      const auxTopic = await list("topic");
      optionsAproach.value = auxAproach.map((item) => ({
        label: item.type_approach,
        value: item.id,
      }));
      optionsTopic.value = auxTopic.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    };
    // const cat = [];
    const getAproaches = async () => {
      try {
        loadingTable.value = true;
        const aux = await joinTables("approach", [
          {
            name: "topic",
            foreign_key: "topic_id",
            fields: "name",
          },
          {
            name: "type_approach",
            foreign_key: "type_approach_id",
            fields: "type_approach",
          },
        ]);

        rows.value = aux.map((item) => ({
          id: item.id,
          title: item.title,
          link: item.link,
          type_approach_id: item.type_approach_id,
          topic_id: item.topic_id,
          topic: item.topic.name,
          type_approach: item.type_approach.type_approach,
          created_at: item.created_at,
          premium: item.premium,
        }));

        loadingTable.value = false;
      } catch (error) {
        loadingTable.value = false;
        alert(error);
      }
    };

    const deleteItem = async (id) => {
      // await remove('favorite_approach_user', id);
      await removeWhere("approach_contents", "id_approach", id);
      await removeWhere("favorite_approach_user", "approach_id", id);
      await removeWhere("definicao", "approach_id", id);
      await removeWhere("exameComplementar", "approach_id", id);
      await remove("approach", id);
      getAproaches();
    };

    onMounted(() => {
      getAproaches();
      getLists();
    });

    const newDialog = async (data) => {
      if (data) {
        loadingForm.value = true;

        const result = await getById("type_approach", data.type_approach_id);
        const resultTopic = await getById("topic", data.topic_id);

        formData.title = data.title;
        formData.id = data.id;
        formData.link = data.link;
        formData.premium = data.premium;

        loadingForm.value = false;

        formData.type_approach_id = {
          label: result.type_approach,
          value: result.id,
        };

        formData.topic_id = {
          label: resultTopic.name,
          value: resultTopic.id,
        };
      } else {
        formData.premium = false;
        contents.value = [];
        formData.title = "";
        formData.topic_id = null;
        formData.type_approach_id = null;
      }
      showAddApproach.value = true;
    };

    const saveItem = async () => {
      try {
        showAddApproach.value = false;
        loadingForm.value = true;
        let approach_id = formData.id;

        if (!formData.id) {
          delete formData.id;
          formData.topic_id = formData.topic_id.value;
          formData.type_approach_id = formData.type_approach_id.value;

          // const result = await post("approach", formData);
          approach_id = result[0].id;
        } else {
          formData.topic_id = formData.topic_id.value;
          formData.type_approach_id = formData.type_approach_id.value;
          // await update("approach", formData);
          delete formData.id;
        }

        getAproaches();
        loadingForm.value = false;
      } catch (error) {
        alert(error.message);
        loadingForm.value = false;
      }
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

    const contents = ref([]);

    const addContent = () => {
      contents.value.push({
        title: "Novo conteúdo",
        content: "",
      });
    };

    const currentApproach = ref();
    const loadingContent = ref(false);

    const saveContent = async () => {
      contents.value.forEach(async (content) => {
        const data = {
          title: content.title,
          content: content.content,
          id: content.id,
          id_approach: currentApproach.value.id,
        };
        loadingContent.value = true;

        if (content.id) {
          // await update("approach_contents", data);
        } else {
          delete data.id;
          // await post("approach_contents", data);
        }
        loadingContent.value = false;
      });
    };
    const removeContent = (index) => {
      if (contents.value[index].id) {
        const { id } = contents.value[index];

        $q.dialog({
          title: "Eliminar conteúdo",
          message: `Gostaria de apagar conteúdo ${contents.value[index].title} ?`,
          persistent: true,
          cancel: "Cancelar",
        }).onOk(async () => {
          // await remove("approach_contents", id);
          $q.notify({
            message: "Conteúdo apagado com sucesso!!",
          });
        });
      }

      contents.value.splice(index, 1);
    };

    const getContents = async (approach) => {
      currentApproach.value = approach;
      loadingForm.value = true;

      loadingForm.value = false;
    };

    const copyTo = (key) => {
      copyToClipboard(`${window.location.origin}/content/${key}`)
        .then(() => {
          // success!
          $q.notify({
            message: "Conteúdo copiado",
          });
        })
        .catch(() => {
          // fail
        });
    };

    */

    return {
      copyTo,
      getContents,
      loadingContent,
      saveContent,
      contents,
      loadingForm,
      loadingTable,
      addContent,
      removeContent,
      filter,
      newDialog,
      showAddApproach,
      formData,
      optionsAproach,
      optionsTopic,
      saveItem,
      currentApproach,
      deleteItem,
      confirmDelete,
      columns,
      rows,
      getAproaches,
    };
  },
});
</script>

<style></style>
