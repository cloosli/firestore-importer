#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as fs from 'fs-extra';
import * as args from 'commander';
import * as csv from 'csvtojson';

var serviceAccount = require("../credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

