var tableUri = "https://" + "storagebylucas" + ".table.core.windows.net";
var sas =
  "sp=raud&st=2022-10-17T12:20:37Z&se=2042-10-18T12:20:00Z&spr=https&sv=2021-06-08&sig=PWxmEdQhzhcM29rNIw7nqqa2lOuh092Diev2w2Fzv%2FQ%3D&tn=TableReservatory";
var tableService = AzureStorage.Table.createTableServiceWithSas(tableUri, sas);

function main() {
  var tableQuery = new AzureStorage.Table.TableQuery().top(200);

  let entidade;
  let key;
  let vol;
  let temp;

  tableService.queryEntities(
    "TableReservatory",
    tableQuery,
    null,
    function (error, result) {
      if (error) {
        console.log("table error");
      } else {
        for (var i = 0, entity; (entity = result.entries[i]); i++) {
          let tr = document.createElement("tr");
          let tdVol = document.createElement("td");
          let tdTemp = document.createElement("td");
          let tdTimes = document.createElement("td");

          tdVol.classList.add(
            "text-center",
            "text-xs",
            "font-weight-bold",
            "mb-0"
          );
          tdTemp.classList.add(
            "text-center",
            "text-xs",
            "font-weight-bold",
            "mb-0"
          );
          tdTimes.classList.add(
            "text-center",
            "text-xs",
            "font-weight-bold",
            "mb-0"
          );

          entidade = i;

          key = entity.PartitionKey._;

          timestamp = entity.Timestamp._;
          tdTimes.textContent = String(timestamp).substring(0, 21);

          vol = entity.vol._;
          tdVol.textContent = String(vol + " %");

          temp = entity.temp._;
          tdTemp.textContent = String(temp + " °C");

          tr.appendChild(tdVol);
          tr.appendChild(tdTemp);
          tr.appendChild(tdTimes);

          document.getElementById("TRes").appendChild(tr);
        }
      }
    }
  );
}

main();
