var tableUri = 'https://' + 'storagebylucas' + '.table.core.windows.net';
var sas = 'sp=raud&st=2022-10-14T14:27:06Z&se=2042-10-14T14:27:00Z&sv=2021-06-08&sig=hImxzL23fUPqya2j6l2SKykl7Ij5pEEagZB3rlz%2F1tQ%3D&tn=TableTest'
var tableService = AzureStorage.Table.createTableServiceWithSas(tableUri, sas);

function main(){
  var tableQuery = new AzureStorage.Table.TableQuery().top(200);

  let entidade;
  let key;
  let ph;
  let ntu;
  let tds;
  let temp;

  tableService.queryEntities('TableTest', tableQuery, null, function(error, result) {
    if (error) {
        console.log("table error");
    } else {
      for (var i = 0, entity; entity = result.entries[i]; i++) {

      let tr = document.createElement('tr');
      let tdPH = document.createElement('td');
      let tdNTU = document.createElement('td');
      let tdTDS = document.createElement('td');
      let tdTemp = document.createElement('td');
      let tdTimes = document.createElement('td');

      tdPH.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');
      tdNTU.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');
      tdTDS.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');
      tdTemp.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');
      tdTimes.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');

      entidade = (i);

      key = (entity.PartitionKey._);

      timestamp = (entity.Timestamp._);
      tdTimes.textContent = (String(timestamp)).substring(0,21);

      ph = (entity.ph._);
      tdPH.textContent = String(ph + " ph");

      ntu = (entity.ntu._);
      tdNTU.textContent = String(ntu + " ntu");

      tds = (entity.tds._);
      tdTDS.textContent = String(tds + " ppm");

      temp = (entity.temp._);
      tdTemp.textContent = String(temp + " °C");

      tr.appendChild(tdPH);
      tr.appendChild(tdNTU);
      tr.appendChild(tdTDS);
      tr.appendChild(tdTemp);
      tr.appendChild(tdTimes);

      document.getElementById('TPool').appendChild(tr);
      }
    }
  })
}
main();