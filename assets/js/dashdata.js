'use strict';

var iothub = require('azure-iothub');
var connectionString = 'HostName=PoolReserv.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=kB4kJPo6KFlC1WY4uRWlXNLjdyqYNQavMybj843dw7w=';
var registry = iothub.Registry.fromConnectionString(connectionString);

const { Chart } = require('chart.js');

const account = "storagebylucas";
const accountKey = "SpQFqhSBlR6TDW3PLNBnKmJM+tIHCAalr0MWUoycJe63rpqo+ck6yklYtOREWxxQ66lHoRRDKTVs+ASt+vZU+Q==";

const tableName = "TableTest";

var meses = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var tableUri = 'https://' + 'storagebylucas' + '.table.core.windows.net';
var sas = 'sp=raud&st=2022-10-14T14:27:06Z&se=2042-10-14T14:27:00Z&sv=2021-06-08&sig=hImxzL23fUPqya2j6l2SKykl7Ij5pEEagZB3rlz%2F1tQ%3D&tn=TableTest'
var tableService = AzureStorage.Table.createTableServiceWithSas(tableUri, sas);

var ctx1 = document.getElementById("chart").getContext("2d");

var str;
var charting;
let selected = 'data.ph';
let deviceActive = false;
let key;
let i = 0;
var Ph = 0;
var Ntu = 0;
var Tds = 0;
var Temp = 0;
const phArray = [];
const tdsArray = [];
const ntuArray = [];
const tempArray = [];
const days = [];

function getDatanumbers(){
  const dataNumbers = days.map((day, index)  => {
    let dayObject = {};
    dayObject.day = day;
    dayObject.data = {};
    dayObject.data.ph = phArray[index];
    dayObject.data.ntu = ntuArray[index];
    dayObject.data.tds = tdsArray[index];
    dayObject.data.temp = tempArray[index];
    return dayObject;
  })
  return dataNumbers;
}

function conexão(){
  registry.getTwin('ESP8266', function(err, twin){
    if (err) {
        console.error(err.constructor.name + ': ' + err.message);
    } else {
        console.log(twin.connectionState);
        let con = String(twin.connectionState);
        if(con == "Connected"){
          deviceActive = true;
        }else{
          deviceActive = false;
        }
    }
  });
}

function datas(){
    var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);
    var dataNum = getDatanumbers();
    gradientStroke1.addColorStop(1, 'rgba(94, 114, 228, 0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(94, 114, 228, 0.0)');
    gradientStroke1.addColorStop(0, 'rgba(94, 114, 228, 0)');
    charting = new Chart(ctx1, {
      type: "line",
      data: {
        datasets: [{
          label: "",
          tension: 0.2,
          borderWidth: 0,
          pointRadius: 0,
          borderColor: "#5e72e4",
          backgroundColor: gradientStroke1,
          borderWidth: 3,
          fill: true,
          data: dataNum,
          maxBarThickness: 6,
          parsing: {
            xAxisKey: 'day',
            yAxisKey: selected
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5]
            },
            ticks: {
              display: true,
              padding: 10,
              color: '#fbfbfb',
              font: {
                size: 11,
                family: "Open Sans",
                style: 'normal',
                lineHeight: 1
              },
            }
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              borderDash: [5, 5]
            },
            ticks: {
              display: true,
              color: '#ccc',
              padding: 20,
              font: {
                size: 11,
                family: "Open Sans",
                style: 'normal',
                lineHeight: 1
              },
            }
          },
        },
      },
    });
  if(deviceActive == true)
  {
    console.log("PH: ");
    console.log(Ph);
    document.getElementById("PH").innerHTML = String(Ph+" ph");
    if(isNaN(Ph)){
      let aa = document.getElementById("PHstatus");
      aa.classList.add('bg-gradient-danger'); 
      aa.innerHTML = "No signal";
    }else{
      let aa = document.getElementById("PHstatus");
      aa.innerHTML = "Working";
      aa.classList.add('bg-gradient-success');
    }
    console.log("NTU: ");
    console.log(Ntu);
    document.getElementById("NTU").innerHTML = String(Ntu+" ntu");
    if(isNaN(Ntu)){
      let aa = document.getElementById("NTUstatus");
      aa.innerHTML = "No signal";
      aa.classList.add("bg-gradient-danger"); 
    }else{
      let aa = document.getElementById("NTUstatus");
      aa.innerHTML = "Working";
      aa.classList.add("bg-gradient-success");
    }
    console.log("TDS: ");
    console.log(Tds);
    document.getElementById("TDS").innerHTML = String(Tds+" ppm");
    if(isNaN(Tds)){
      let aa = document.getElementById("TDSstatus");
      aa.innerHTML = "No signal";
      aa.classList.add("bg-gradient-danger");
    }else{
      let aa = document.getElementById("TDSstatus");
      aa.innerHTML = "Working";
      aa.classList.add("bg-gradient-success");
    }
    console.log("Temperatura: ");
    console.log(Temp);
    document.getElementById("Temp").innerHTML = String(Temp+" °C");
    if(isNaN(Temp)){
      let aa = document.getElementById("Tempstatus");
      aa.innerHTML = "No signal";
      aa.classList.add("bg-gradient-danger"); 
    }else{
      let aa = document.getElementById("Tempstatus");
      aa.innerHTML = "Working";
      aa.classList.add("bg-gradient-success");
    }
  }else{
    document.getElementById("PHstatus").innerHTML = "Off"
    document.getElementById("PHstatus").classList.add("bg-gradient-info");
    document.getElementById("NTUstatus").innerHTML = "Off"
    document.getElementById("NTUstatus").classList.add("bg-gradient-info");
    document.getElementById("TDSstatus").innerHTML = "Off"
    document.getElementById("TDSstatus").classList.add("bg-gradient-info");
    document.getElementById("Tempstatus").innerHTML = "Off"
    document.getElementById("Tempstatus").classList.add("bg-gradient-info");
    document.getElementById("PH").innerHTML = "n/d"
    document.getElementById("NTU").innerHTML = "n/d"
    document.getElementById("TDS").innerHTML = "n/d"
    document.getElementById("Temp").innerHTML = "n/d"
  }
}
function main(){
  var tableQuery = new AzureStorage.Table.TableQuery().top(200);
  tableService.queryEntities('TableTest', tableQuery, null, function(error, result) {
    if (error) {
        console.log("table error");
    } else {
        for (var i = 0, entity; entity = result.entries[i]; i++) {
          console.log(entity.Timestamp._);
          key = (entity.PartitionKey._);
          Ph = Number(entity.ph._);
          Ntu = Number(entity.ntu._);
          Tds = Number(entity.tds._);
          Temp = Number(entity.temp._);
          phArray[i] = Number(entity.ph._);
          ntuArray[i] = Number(entity.ntu._);
          tdsArray[i] = Number(entity.tds._);
          tempArray[i] = Number(entity.temp._);
          str = String(entity.Timestamp._);
          let mes = str.substring(4, 7);
          let dia = str.substring(8, 10);
          let ano = str.substring(11, 15);
          let hora = str.substring(16, 24);
          let mesInt = String(parseInt(meses.indexOf(mes)) + 1);
          if(parseInt(mesInt) < 10){
            mesInt = "0" + mesInt;
          }
          let strDay = String(dia + "/" + mesInt + "/" + ano + "-" + hora);
          days[i] = strDay;
        }
    }
    datas();
  });
}
conexão();
main();

function filtroNtu(){ 
  charting.data.datasets[0].parsing.yAxisKey = 'data.ntu';
  charting.update();
}
var btNTU = document.getElementById('btnNTU');
btNTU.addEventListener('click', filtroNtu);

function filtroTds(){ 
  charting.data.datasets[0].parsing.yAxisKey = 'data.tds';
  charting.update();
}
var btTDS = document.getElementById('btnTDS');
btTDS.addEventListener('click', filtroTds);

function filtroPh(){ 
  charting.data.datasets[0].parsing.yAxisKey = 'data.ph';
  charting.update();
}
var btPH = document.getElementById('btnPH');
btPH.addEventListener('click', filtroPh);

function filtroTemp(){ 
  charting.data.datasets[0].parsing.yAxisKey = 'data.temp';
  charting.update();
}
var btTemp = document.getElementById('btnTemp');
btTemp.addEventListener('click', filtroTemp);

var btnContainer = document.getElementById("btnContainer");
var btns = btnContainer.getElementsByClassName("btnFilter");
for (var j = 0; j < btns.length; j++) {
  btns[j].addEventListener("click", function(){
    var current = document.getElementsByClassName("active btnFilter");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}