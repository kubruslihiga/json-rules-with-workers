import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { Engine, EngineResult } from 'json-rules-engine';
import * as fs from 'fs';

let counter = {success_count : 0 , failed_count : 0};

if (isMainThread) {
    let index = 0;
    let counter = 0;
    while (index < 10) {
        let filename = `${__dirname}/../json/${index}.json`;
        let fileContent = fs.readFileSync(filename);
        const worker = new Worker(__filename, {workerData: { result: fileContent.toString() }});
        worker.on('message', (result) => {
            console.log(result);
            counter++;
            console.log(counter);
        });
        index++;
    }
} else {
    let result = workerData.result;
    let jsonArray:any[] = JSON.parse(result);
    let promises:Promise<EngineResult>[] = [];
    let engine = new Engine();
    engine.addRule({
        conditions: {
            any: [{
                all: [{
                    fact: "footSize",
                    operator: "equal",
                    value: 36
                }]
            }]
            
        },
        event: {
            type: "componentActive",
            params: {
                message: "Whaaaaaat"
            }
        }
    });
    for (let json of jsonArray) {
        engine.run(json).then(result => {
            if (result.events.length > 0) {
                delete json['success-events'];
                if (parentPort) {
                    parentPort.postMessage(json);
                }
            }
        })
    }
}
