let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var keypress = require("keypress");
 
const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";
 
// Load protobuf
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/g29Signal.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

keypress(process.stdin);

function getAngle(call){
	process.stdin.on('keypress', function (ch, key) {
		console.log("key pressed : ", key.name);
		for (var i =0;i<2;i++){
		call.write({key:key.name});
		}
	});
	/*
	var an = 5;
	call.write({ang:an});*/
	/*
	for (var i=0;i<5;i++){
		var an =5;
		call.write({ang:an});
	}
	for (var i=0;i<5;i++){
		var an =7;
		call.write({ang:an});
	}*/
}

/***** make a grpc server *****/
function getServer() {
	var server = new grpc.Server();
	server.addService(proto.CDV.sendData.service, {
	getAngle: getAngle
	});
	return server;
}

function main(){
	var CDVServer = getServer();
	CDVServer.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
	CDVServer.start();
	console.log("server is running on " + SERVER_ADDRESS);
}

main();