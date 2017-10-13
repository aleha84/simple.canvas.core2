SCG.AI = {
    initialize(){
        if(SCG.AI.worker){
            SCG.AI.worker.terminate();
            SCG.AI.worker = undefined;
    
            URL.revokeObjectURL(SCG.AI.blobURL);
        }
    
        var as = SCG.scenes.activeScene;
        if(as && as.AI){
            SCG.AI.blobURL = URL.createObjectURL( new Blob([ '(',
                "function(){var queue = [];\nconsole.log('worker start');\n" +
                    "var queueProcesser =\n"+
                    (as.AI.queueProcesser != undefined && isFunction(as.AI.queueProcesser) 
                    ? as.AI.queueProcesser.toString() 
                    : "function(){}")+
    
                    "\nfunction processMessageQueue(){\nif(queue.length > 0){\n"+
                            "queueProcesser();\n" +
                        "}\nsetTimeout(processMessageQueue, 100);\n}\n" +
    
                    "self.onmessage = function(e){\n" +
                        "var msg = e.data;\n"+
                        "switch(msg.command){\n"+
                            "case 'event':\n"+
                                "queue.push(msg.event);\n"+
                                "break;\n"+
                            "case 'initialize':\n"+
                                "\tself.environment=msg.environment;\n"+
                                "\tif(msg.scripts && msg.scripts.length) {"+
                                "\t\tfor(let si = 0; si <msg.scripts.length; si++) { self.importScripts(msg.scripts[si]); }" +
                                "\t}" +
                                "\t//self.importScripts(msg.url + 'utils.min.js');\n" +
                                "\tqueue.push({type: 'start', message: undefined})\n" +
                                "\tbreak;\n"+
                            "default:\n"+
                                "break;\n"+
                        "}\n"+
                    "}\n"+
    
                    "processMessageQueue();\n"+
                    
                "}",
    
                
            ')()' ], { type: 'application/javascript' } ) );
    
            SCG.AI.worker = new Worker(SCG.AI.blobURL); 
        }
    
        if(SCG.AI.worker && as.AI.messagesProcesser != undefined && isFunction(as.AI.messagesProcesser)){
            SCG.AI.worker.onmessage = function(e) {
                as.AI.messagesProcesser(e.data);
            };
        }
    },
    initializeEnvironment(environment) {
        var url =  document.location.href;
        var index = url.indexOf('index');
        if (index != -1) {
          url = url.substring(0, index);
        }

        // TODO: pass scrips paths to worker
        // TODO: process ../ in relative paths

        SCG.AI.worker.postMessage({ command: "initialize", environment: environment, url:url });
    },
    sendEvent(event) {
        SCG.AI.worker.postMessage({ command: "event", event: event });
    }
};

// SCG.AI.initialize = function(){
// 	if(SCG.AI.worker){
// 		SCG.AI.worker.terminate();
// 		SCG.AI.worker = undefined;

// 		URL.revokeObjectURL(SCG.AI.blobURL);
// 	}

// 	var as = SCG.scenes.activeScene.game;
// 	if(as && as.AI){
// 		SCG.AI.blobURL = URL.createObjectURL( new Blob([ '(',
// 			"function(){var queue = [];\nconsole.log('worker start');\n" +
// 				"var queueProcesser =\n"+
// 				(as.AI.queueProcesser != undefined && isFunction(as.AI.queueProcesser) 
// 				? as.AI.queueProcesser.toString() 
// 				: "function(){}")+

// 				"\nfunction processMessageQueue(){\nif(queue.length > 0){\n"+
// 						"queueProcesser();\n" +
// 					"}\nsetTimeout(processMessageQueue, 100);\n}\n" +

// 				"self.onmessage = function(e){\n" +
// 					"var msg = e.data;\n"+
// 					"switch(msg.command){\n"+
// 						"case 'event':\n"+
// 							"queue.push(msg.event);\n"+
// 							"break;\n"+
// 						"case 'initialize':\n"+
// 							"self.environment=msg.environment;\n"+
// 							"self.importScripts(msg.url + 'utils.min.js');\n" +
// 							"queue.push({type: 'start', message: undefined})\n" +
// 							"break;\n"+
// 						"default:\n"+
// 							"break;\n"+
// 					"}\n"+
// 				"}\n"+

// 				"processMessageQueue();\n"+
				
// 			"}",

			
// 		')()' ], { type: 'application/javascript' } ) );

// 		SCG.AI.worker = new Worker(SCG.AI.blobURL); 
// 	}

// 	if(SCG.AI.worker && as.AI.messagesProcesser != undefined && isFunction(as.AI.messagesProcesser)){
// 		SCG.AI.worker.onmessage = function(e) {
// 			as.AI.messagesProcesser(e.data);
// 		};
// 	}
// }

// SCG.AI.initializeEnvironment = function (environment) {
// 	var url =  document.location.href;
// 	var index = url.indexOf('index');
//     if (index != -1) {
//       url = url.substring(0, index);
//     }
// 	SCG.AI.worker.postMessage({ command: "initialize", environment: environment, url:url });
// }

// SCG.AI.sendEvent = function (event) {
// 	SCG.AI.worker.postMessage({ command: "event", event: event });
// }
