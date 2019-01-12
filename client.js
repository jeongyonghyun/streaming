let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

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

var angle,key;

const REMOTE_SERVER="0.0.0.0:5001";

function show(a,b){
    console.log("you pressed "+ b + "and the angle was "+ a);
}

function main(){
	let client = new proto.CDV.sendData(
		REMOTE_SERVER,
		grpc.credentials.createInsecure()
	);

	console.log("client has started");

    var channel = client.getAngle({});
    channel.on('data',function(response){
        angle = response.ang;
        key = response.key;
    	console.log("the angle was : ", angle);
        console.log("key pressed :", key);
        show(angle,key);
    });

    
}

main();