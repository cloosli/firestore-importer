#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import * as args from 'commander';
import * as csv from 'csvtojson';

args
    .version("0.1.0")
    .option("-s, --src <path>", "Source file path")
    .option("-c, --collection <path>", "Collection path to database")
    .option("-i, --id [id]", "Field to use for document ID")
    .parse(process.argv);

var serviceAccount = require("../credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
    try {
        const colPath = args.collection;
        const file = args.src;

        if (!colPath || !file) return Promise.reject("Missing required data");

        const colRef = db.collection(colPath);


        let data;

        if (file.includes(".json")) {
            data = await fs.readJson(file);
            console.log("parsed json", data.length);
        } else if (file.includes(".csv")) {
            data = await readCSV(file);
        }

        let idx = 0;
        const arrayLength = data.length;
        let batch = db.batch();
        for (const item of data) {
            idx++;
            const id = args.id ? item[args.id].toString() : colRef.doc().id;
            const docRef = colRef.doc(id);

            batch.set(docRef, item);

            if (idx % 500 == 0) {
                await batch.commit();
                console.log(`Commit batch ${idx} / ${arrayLength}`);
                batch = db.batch();
            }
        }

        // Commit the batch
        await batch.commit();
        console.log("Firestore updated");
        console.log("Migration was a success!");
    } catch (error) {
        console.error("Migration failed!", error);
    }
}

function readCSV(path): Promise<any> {
    return new Promise((resolve, reject) => {
        csv()
            .on("error", err => reject(err))
            .fromFile(path)
            .then(data => {
                console.log("CSV parsed:", data.length);
                resolve(data);
            });
    });
}

// Run
migrate();