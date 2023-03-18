var iothub = require('azure-iothub');
var connectionString = 'HostName=PoolReserv.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=kB4kJPo6KFlC1WY4uRWlXNLjdyqYNQavMybj843dw7w=';
var registry = iothub.Registry.fromConnectionString(connectionString);

var blobUri = 'https://' + 'storagebylucas' + '.blob.core.windows.net';
blobSas = 'sp=racwdli&st=2022-10-14T14:36:06Z&se=2042-10-14T22:36:06Z&sv=2021-06-08&sr=c&sig=EtOhZIuNpnmkDLBHR4U6l14KPXlgn2JTgTwKD8cy6Pg%3D'
var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, blobSas);
var tableUri = 'https://' + 'storagebylucas' + '.table.core.windows.net';
tableSas = 'sp=raud&st=2022-10-14T14:27:06Z&se=2042-10-14T14:27:00Z&sv=2021-06-08&sig=hImxzL23fUPqya2j6l2SKykl7Ij5pEEagZB3rlz%2F1tQ%3D&tn=TableTest'
var tableService = AzureStorage.Table.createTableServiceWithSas(tableUri, tableSas);

let deviceActive = false;

let latest;
let actual;

let xhr = new XMLHttpRequest();

// POST https://management.azure.com/subscriptions/77118beb-9fb5-441c-930e-9e713cbaa314/resourceGroups/poolappservice_group/providers/Microsoft.Web/sites/poolappservice/triggeredwebjobs/upload1/run?api-version=2022-03-01
// Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzdiYmI1NTVkLTkxZjUtNDkyZC1hZGI1LTczMzk3OGVkNTJhNy8iLCJpYXQiOjE2NjYxMDU0NzAsIm5iZiI6MTY2NjEwNTQ3MCwiZXhwIjoxNjY2MTA5Njc2LCJhY3IiOiIxIiwiYWlvIjoiQVdRQW0vOFRBQUFBQWFnZEhUOW1EZE5aVjRFWkE1YXd2VEM2aVQ1YmxtTlc3dm83UkliYWtqYUozdG9pVnJVN1VxN2pxZVBSUjFRTDNuNmtpUVJoeHdrOUo4TThwN1dJSTlWR3RBc2NGRGdpa0s2TlpMK0Y5RmJiaFI5elNDMko4b1U0SFdCY3psT3EiLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwMzdGRkVDQTc0RTMwNiIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIxOGZiY2ExNi0yMjI0LTQ1ZjYtODViMC1mN2JmMmIzOWIzZjMiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6Imx1Y2FzcGlub3R0aWJyaXRvQGdtYWlsLmNvbSIsImZhbWlseV9uYW1lIjoiUGlub3R0aSBkZSBCcml0byIsImdpdmVuX25hbWUiOiJMdWNhcyIsImdyb3VwcyI6WyI2YmM1NzMwNS1hMjcxLTRiZjUtYTViNi0wNDliMDU4ZjFlOTkiXSwiaWRwIjoibGl2ZS5jb20iLCJpcGFkZHIiOiIyMDEuMTMuMTgwLjI1NCIsIm5hbWUiOiJMdWNhcyBQaW5vdHRpIGRlIEJyaXRvIiwib2lkIjoiMzk3ZDI2YmQtODhhYS00NmYxLTliZWUtMWY5NTI0OGI2MTY0IiwicHVpZCI6IjEwMDMyMDAyMzMzMkY1OEQiLCJyaCI6IjAuQVgwQVhWVzdlX1dSTFVtdHRYTTVlTzFTcDBaSWYza0F1dGRQdWtQYXdmajJNQk9jQUl3LiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjRac3NoTjJXampKR2JTUFZIZzhsLW41NkJ3NVM5LUlqZ2d2bllDbU81RUEiLCJ0aWQiOiI3YmJiNTU1ZC05MWY1LTQ5MmQtYWRiNS03MzM5NzhlZDUyYTciLCJ1bmlxdWVfbmFtZSI6ImxpdmUuY29tI2x1Y2FzcGlub3R0aWJyaXRvQGdtYWlsLmNvbSIsInV0aSI6IjI2UXg2eWRYVEVtdnNfM083UGlYQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfdGNkdCI6MTY2Mzc4NDEzM30.HEIIqkvNLVNoknFhkYn4v7h8wF7l04fmP2aC6Yvlw85mMITcBNCcJafA3Dw7fh-JxK3JgbHlASHii-5u9mVbKtiFsBh2MLHrIHLEMOtY5hwGtldyPSwL_WvZbi4FvHqmwvK35815SridQq3den5NjDbaH1nM7V5ADRvyPkKoDTIOTcfu-A9GK0nuM2PqS9mq2up8PfRtsqqPAjVYqtHhJCHbmDM2Sp8IbHxVCpsKEyBP9VJLmTIvezVxI_lFEoqtnlWRjTpgdZYP7tpn6Bn4xYa87jpoouLWI54Koza0E-PhuikF7VQQrDU_Nf6bMOhzFa2XZafJhgypfASQHg4Nrg
// Content-type: application/json

let Auth = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzdiYmI1NTVkLTkxZjUtNDkyZC1hZGI1LTczMzk3OGVkNTJhNy8iLCJpYXQiOjE2NjYxMDY0MDUsIm5iZiI6MTY2NjEwNjQwNSwiZXhwIjoxNjY2MTExMDk5LCJhY3IiOiIxIiwiYWlvIjoiQVdRQW0vOFRBQUFBcXUvNW90OGJCME5wTG9UZ0JuemJQV2wyNHdTNnlqaHpDaFRRUFpRaVNkYURqVDVFckFVNDFFSG8zRGwybHlpWkdlQ3VxdTE5OWNkRHFNSCtqTDZLcEZtWUtJRFlDZC9Udno2UmRBb2JBTTViSEp1Z0tMY2xqdkI3ZkZJMHhDSHEiLCJhbHRzZWNpZCI6IjE6bGl2ZS5jb206MDAwMzdGRkVDQTc0RTMwNiIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIxOGZiY2ExNi0yMjI0LTQ1ZjYtODViMC1mN2JmMmIzOWIzZjMiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6Imx1Y2FzcGlub3R0aWJyaXRvQGdtYWlsLmNvbSIsImZhbWlseV9uYW1lIjoiUGlub3R0aSBkZSBCcml0byIsImdpdmVuX25hbWUiOiJMdWNhcyIsImdyb3VwcyI6WyI2YmM1NzMwNS1hMjcxLTRiZjUtYTViNi0wNDliMDU4ZjFlOTkiXSwiaWRwIjoibGl2ZS5jb20iLCJpcGFkZHIiOiIyMDEuMTMuMTgwLjI1NCIsIm5hbWUiOiJMdWNhcyBQaW5vdHRpIGRlIEJyaXRvIiwib2lkIjoiMzk3ZDI2YmQtODhhYS00NmYxLTliZWUtMWY5NTI0OGI2MTY0IiwicHVpZCI6IjEwMDMyMDAyMzMzMkY1OEQiLCJyaCI6IjAuQVgwQVhWVzdlX1dSTFVtdHRYTTVlTzFTcDBaSWYza0F1dGRQdWtQYXdmajJNQk9jQUl3LiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjRac3NoTjJXampKR2JTUFZIZzhsLW41NkJ3NVM5LUlqZ2d2bllDbU81RUEiLCJ0aWQiOiI3YmJiNTU1ZC05MWY1LTQ5MmQtYWRiNS03MzM5NzhlZDUyYTciLCJ1bmlxdWVfbmFtZSI6ImxpdmUuY29tI2x1Y2FzcGlub3R0aWJyaXRvQGdtYWlsLmNvbSIsInV0aSI6Ilc3bHBiaWgxOTBxUFdiTkpHdkI0QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfdGNkdCI6MTY2Mzc4NDEzM30.nO15YZVMgcwivblOlyyrF6sgmx02CtPG5l9VFqEM7PuyzHKpdwoqkpv_44VQQ8BpNnM-76faTV7TcUwE0xtiA9GamNTcSqONrQsXLnVsWC3xd9Y04975IX-yibgknRniey7tS7bxaFArB8M75J-xyayKd2BUEQ-niQwWvVk-Zqz5Fn_i2sPrOu2hRAS6301gz0K0jy17v2pnOEAnL7_HDOqZkFj34Gt7IigSOF0qi3faJ5Rd7YRT6KU8w2Ww0EsaV8Ww6nVfLgCFMXbmHtnQMAPoDgaiUcMKkVKNBfpINeQWjkNTaYIcNhvnHw5mqLpEBjquGR1GrVewAb84gha35g";

function func(){
  xhr.open("POST", "https://management.azure.com/subscriptions/77118beb-9fb5-441c-930e-9e713cbaa314/resourceGroups/poolappservice_group/providers/Microsoft.Web/sites/poolappservice/triggeredwebjobs/update1/run?api-version=2022-03-01");
  xhr.setRequestHeader("Authorization", Auth);
  xhr.setRequestHeader("Content-Type", "application/json");
  console.log("button pressed");
  xhr.send();
}

let btn = document.getElementById("btUp");
btn.addEventListener("click", func);

function conexão(){
  registry.getTwin('ESP8266', function(err, twin){
    if (err) {
        console.error(err.constructor.name + ': ' + err.message);
    } else {
        console.log(twin.connectionState);
        let con = String(twin.connectionState);
        if(con == "Connected"){
          deviceActive = true;
          let f = document.getElementById("conState");
          f.innerHTML = "Connected";
          f.classList.add("text-success");
        }else{
          deviceActive = false;
          let f = document.getElementById("conState");
          f.innerHTML = "Disconnected";
          f.classList.add("text-danger");
        }
    }
  });
}

function lastV(){
  blobService.listBlobsSegmented('uploads', null, function (error, results) {
    let h;
    if (error) {
        console.log("blob error");
    } else {
        for (var i = 0, blob; blob = results.entries[i]; i++) {
            h = String(results.entries[i].name).substring(1 , 4);
            console.log(results.entries[i].lastModified); 
            console.log(results.entries[i].name);
  
            let tbody = document.getElementById("tb");
            let row = document.createElement("tr");
  
            let version = document.createElement("td");
            let date = document.createElement("td");
  
            version.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');
            date.classList.add('text-center', 'text-xs', 'font-weight-bold', 'mb-0');
  
            version.textContent = h;
            date.textContent = String(results.entries[i].lastModified);
  
            row.appendChild(version);
            row.appendChild(date);
  
            tbody.appendChild(row);
        }
        return h;
    }
  });
}

function actualV(){
  let h;
  var tableQuery = new AzureStorage.Table.TableQuery().top(200);
  tableService.queryEntities('TableTest', tableQuery, null, function(error, result) {
    if (error) {
        console.log("table errror");
    } else {
        for (var i = 0, entity; entity = result.entries[i]; i++) {
          h = (entity.version._);
        }
        document.getElementById("actVer").innerHTML = h;
        return h;
    }
  });
}

conexão();
latest = lastV();
actual = actualV();