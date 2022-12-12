<template>
  <q-page>
    <q-toolbar-title class="flex text-h5 text-bold">Dashboard</q-toolbar-title>
    <div class="row q-mt-md q-gutter-x-md" style="height: 60%">
      <div class="col" style="widht: 40%; border-radius: 10px">
        <div class="row q-gutter-x-md">

          <!--
            Primeiro Carde - Total de reservas feitas nas últimas 24h
          -->
          <div class="col ">
            <q-card
              :dense="$q.screen.lt.md"
              class="my-card text-white"
              style="
                background: radial-gradient(circle, #00ff7e 0%, #5fcc2e 100%);
                height: 120px;
              "
            >
              <q-card-section>
                <q-icon name="group" size="md" />
                <div class="text-subtitle2 text-bold">Total de reservas feitas nas últimas 24h</div>
                <p class="text-right q-mt-sm q-mr-sm text-subtitle1">244</p>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ lorem }}
              </q-card-section>
            </q-card>
          </div>
          <!--
            FIM Primeiro Carde - Total de reservas feitas nas últimas 24h
          -->


          <!-----------Segundo Carde - Total de lugares restantes-------->
          <div class="col q-ml-md">
            <q-card
              :dense="$q.screen.lt.md"
              class="my-card text-white"
              style="
                background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
                height: 120px;
              "
            >
              <q-card-section>
                <q-icon name="group" size="md" />
                <div class="text-subtitle2 text-bold">
                  Total de lugares restantes <br />
                  disponíveis
                </div>
                <p class="text-right q-mr-sm text-subtitle1" style="margin-top: -15px">
                  14
                </p>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ lorem }}
              </q-card-section>
            </q-card>
          </div>

          <!---------- Total De Reservas canceladas-------->
          <div class="col">
            <q-card
              :dense="$q.screen.lt.md"
              class="my-card text-white"
              style="
                background: radial-gradient(circle, #ab47bc 0%, #800080 100%);
                height: 120px;
              "
            >
              <q-card-section>
                <q-icon name="design_services" size="md" />
                <div class="text-subtitle2 text-bold">Total De Reservas Canceladas</div>
                <p class="text-right q-mt-sm q-mr-sm text-subtitle1">15</p>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ lorem }}
              </q-card-section>
            </q-card>
          </div>

          <!--------------TOTAL DE FILMES EM STOK---------------->
          <div class="col q-ml-md">
            <q-card
              :dense="$q.screen.lt.md"
              class="my-card text-white"
              style="
                background: radial-gradient(circle, #ffb268 0%, #ff8c00 100%);
                height: 120px;
              "
            >
              <q-card-section>
                <q-icon name="category" size="md" />
                <div class="text-subtitle2 text-bold">Total de Filmes Em Stok</div>
                <p class="text-right q-mt-sm q-mr-sm text-subtitle1">1200</p>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ lorem }}
              </q-card-section>
            </q-card>
          </div>

        </div>

      </div>
    </div>

    <!-------------Primeiro Gráfico Número de Reservas feitas no ano em curso----------->

    <q-card
      :dense="$q.screen.lt.md"
      class="col"
      bg-color="white"
      style="widht: 90%; height: 300px; background-color: white; border-radius: 4px"
    >
     <q-inner-loading
        :showing="visible"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
      <div id="chart">
        <apexchart
          type="area"
          height="250"
          :options="areaChart.chartOptions"
          :series="areaChart.series"
        />
      </div>
    </q-card>

    <!----------------Cinemas Mais Frequentados---------------------->
    <div class="q-mt-md">
      <div class="row q-gutter-x-md">
        <div class="col" style="background-color: white; height: auto">
          <q-toolbar>
            <q-toolbar-title class="text-subtitle1 text-bold">
              Cinemas mais frequentados
            </q-toolbar-title>
          </q-toolbar>
          <div>
            <q-tabs
              :dense="$q.screen.lt.md"
              v-model="tab"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              narrow-indicator
              inline-label
            >
              <q-tab name="mails" icon="list_alt" label="Lista" />
              <q-tab name="alarms" icon="donut_large" label="Gráfico" />
            </q-tabs>

            <q-tab-panels
              v-model="tab"
              animated
              class="shadow-2 rounded-borders q-mt-xs"
              style="height: 300px"
            >
              <q-tab-panel name="mails">
                <div class="">
                  <q-list separator>
                    <q-item
                      v-for="cinema in cinemas"
                      :key="cinema.nome"
                      clickable
                      v-ripple
                    >
                      <q-item-section top avatar>
                        <q-icon name="design_services" size="lg" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-subtitle2">{{
                          cinema.nome
                        }}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-badge class="text-subtitle2" color="primary">
                          {{ cinema.numero }}
                        </q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-tab-panel>

              <q-tab-panel name="alarms">
                <div id="chart" class="flex flex-center">
                  <apexchart
                    type="donut"
                    width="400"
                    :options="pie.chartOptions"
                    :series="pie.series"
                  ></apexchart>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

        <!-----------Prestadores de serviços mais solicitados---------------->

        <div class="col" style="background-color: white; height: auto">
          <q-toolbar>
            <q-toolbar-title class="text-subtitle1 text-bold">
              Prestadores de serviço mais solicitados
            </q-toolbar-title>
          </q-toolbar>
          <div>
            <q-tabs
              :dense="$q.screen.lt.md"
              v-model="tab2"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              narrow-indicator
              inline-label
            >
              <q-tab name="mails" icon="list_alt" label="Lista" />
              <q-tab name="alarms" icon="bar_chart" label="Gráfico" />
            </q-tabs>

            <q-tab-panels
              :dense="$q.screen.lt.md"
              v-model="tab2"
              animated
              class="shadow-2 rounded-borders q-mt-xs"
              style="height: 300px"
            >
              <q-tab-panel name="mails">
                <div>
                  <q-list separator>
                    <q-item v-for="user in users" :key="user.nome" clickable v-ripple>
                      <q-item-section top avatar>
                        <q-avatar>
                          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ user.nome }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-badge class="text-subtitle2" color="red">
                          {{ user.numero }}
                        </q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-tab-panel>

              <q-tab-panel name="alarms">
                <div id="chart">
                  <apexchart
                    type="bar"
                    height="285"
                    :options="chart.chartOptions"
                    :series="chart.series"
                  ></apexchart>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </div>

    <!---------------------Último Gráfico Dos Géneros------------------>
    <q-card
      :dense="$q.screen.lt.md"
      class="q-mt-md"
      style="width: 97%; background-color: white; border-radius: 2px"
    >
      <div id="chart">
        <apexchart
          type="bar"
          height="300"
          :options="bar.chartOptions"
          :series="bar.series"
        ></apexchart>
      </div>
    </q-card>
  </q-page>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "IndexPage",
  components: {
    apexchart: VueApexCharts,
  },

  setup() {
    //-----------PRIMEIRO GRÁFICO Número de eservas feitas ao longo do ano------------------
    const visible = ref(false)

    let v ;

    const getdDataBD = async () => {
      visible = true
      alert("foiiiii")
      for (let index = 0; index < 100; index++) {
        //const element = array[index];
      }
      visible = false
    }

    const areaChart = reactive({
      series: [
        {
          name: "Número de usuários",
          data: [300, 5, 234, 333, 445, 222, 334, 99, 33, 23, 511, 550],
        },
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: 350,
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Número de Reservas feitas ao longo do Ano",
          align: "left",
        },
        labels: [],
        xaxis: {
          categories: [
            "Jan",
            "Fev",
            "Mar",
            "Abril",
            "Maio",
            "Jun",
            "Jul",
            "Agosto",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ],
        },
        yaxis: {},
        legend: {
          horizontalAlign: "left",
        },
      },
    });
    //--------------------------FIM PRIMEIRO GRáfico -------------------------------

    //--------------------Último Gráfico--------------------------------------
    const bar = reactive({
      series: [
        {
          name: "Servings",
          data: [44, 55, 41, 67, 22, 43, 21, 56],
        },
      ],
      chartOptions: {
        annotations: {
          points: [
            {
              x: "usuarios",
              seriesIndex: 0,
              label: {
                borderColor: "#775DD0",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#775DD0",
                },
                text: "Bananas are good",
              },
            },
          ],
        },
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "40%",
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          width: 3,
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
          },
        },
        xaxis: {
          categories: [
            "Romance",
            "Acção",
            "Drama",
            "Terror",
            "Documentário",
            "Suspance",
            "História",
          ],
          tickPlacement: "on",
        },
        yaxis: {
          title: {
            text: "Estatísticas dos géneros assistidos",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100],
          },
        },
      },
    });
    //--------FIM ÚLTIMO GRÁFICO-----------------------------------------------------

    //-------Gráfico PIZZA Dos Cinemas Mais Frequentados ----------------------------
    const mycinemas = ref(["Cine_UAN","Cine_ADS","Cine_malanje","Cine_Benguela","Cine Cazenga"])
    const pie = reactive({
      series: [44, 55, 41, 17, 15],
      chartOptions: {
        chart: {
          width: 380,
          type: "donut",
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
          },

        },
        dataLabels: {
          enabled: true,
        },
        fill: {
          type: "gradient",
        },
        legend: {
          formatter: function ( opts) {
            return mycinemas.value[opts.seriesIndex] + " - " + opts.w.globals.series[opts.seriesIndex];
          },
        },
        title: {
          text: "Gráfico dos Cinemas mais acessados",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    });
    // FIM Gráfico PIZZA -----------------------------------------------------------

    //------------3º Gráfico Dos Filmes mais assistidos----------------------------
    const chart = reactive({
      series: [
        {
          data: [400, 399, 44, 470, 540],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Até o último Homem",
            "O Heroi Não Chora",
            "Yuri Boyca",
            "Comando Da Jeni",
            "Speed Gonzalo",
          ],
        },
      },
    });
    //------------FIM 3º Gráfico Dos Filmes mais assistidos----------------------------

    onMounted(async () => {
     getdDataBD()
    });
    return {
      visible,
      bar,
      chart,
      pie,
      areaChart,
      filter: ref(""),
      tab: ref("mails"),
      tab2: ref("mails"),


      cinemas: [
        {
          nome: "MCP UAN",
          numero: 110,
        },
        {
          nome: "MCP Samba",
          numero: 103,
        },
        {
          nome: "MCP Malanje",
          numero: 100,
        },
        {
          nome: "MCP Benguela",
          numero: 70,
        },
        {
          nome: "MCP Nova Vida",
          numero: 30,
        },
      ],
      //---------------- FILMES ---------------------------------

      users: [
        {
          nome: "Até o último Homem",
          numero: 100,
        },
        {
          nome: "O Heroi Não Chora",
          numero: 98,
        },
        {
          nome: "Yuri Boyca",
          numero: 74,
        },
        {
          nome: "Comando Da Jeni",
          numero: 12,
        },
        {
          nome: "Speed Gonzalo",
          numero: 5,
        },
      ],
    };
  },
};
</script>
<style scoped></style>
