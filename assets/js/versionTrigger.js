'use strict';

var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
const { ContainerClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

var connectionString = 'HostName=PoolReserv.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=kB4kJPo6KFlC1WY4uRWlXNLjdyqYNQavMybj843dw7w=';
var targetDevice = 'ESP8266';

var serviceClient = Client.fromConnectionString(connectionString);
let h = "";

require("dotenv").config();

function printResultFor(op) {
    return function printResult(err, res) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function receiveFeedback(err, receiver){
    receiver.on('message', function (msg) {
      console.log('Feedback message:')
      console.log(msg.getData().toString('utf-8'));
    });
}

function sendMessage(f){
    serviceClient.open(function (err) {
        if (err) {
          console.error('Could not connect: ' + err.message);
        } else {
          console.log('Service client connected');
          serviceClient.getFeedbackReceiver(receiveFeedback);
          var message = new Message(f);
          message.ack = 'full';
          message.messageId = "My Message ID";
          console.log('Sending message: ' + message.getData());
          serviceClient.send(targetDevice, message, printResultFor('send'));
          setTimeout(function(){
            console.log("Message sent");
            process.exit();
          }, 15000);
        }
      });
}

async function version() {
    const account = "storagebylucas";
    const accountKey = "SFily9R6UeivFg8sBiAjci4SXzWT1Qcr78ZS7I2I5vQOICccP1Q/FHRkE4fpNz9il2/gipfCNSTW+AStlnw7Yg==";
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const containerName = `uploads`;
    const containerClient = new ContainerClient(
        `https://${account}.blob.core.windows.net/${containerName}`,
        sharedKeyCredential
    );
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log(`- ${blob.name}`);
        h = String(blob.name).substring(1, 4);
    }
    console.log("H: " + h);
    sendMessage(h);
}

version();