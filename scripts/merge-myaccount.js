const fs = require('fs');
const vm = require('vm');
const path = require('path');

const enPath = path.resolve(process.cwd(), 'modules/i18n/src/translations/en-US/portals/myaccount.ts');
const nlPath = path.resolve(process.cwd(), 'modules/i18n/src/translations/nl-NL/portals/myaccount.ts');

function tsToJsObject(code) {
    // Remove import lines
    code = code.replace(/^import .*$/gm, '');
    // Remove eslint comments
    code = code.replace(/\/\*\s*eslint-[\s\S]*?\*\//g, '');
    // Replace the export statement to expose the myAccount object
    code = code.replace(/export\s+const\s+myAccount\s*:\s*[^=]+=/, 'const myAccount =');
    // Wrap and return object via vm
    const wrapped = code + '\n;\nmodule.exports = myAccount;';
    // write transformed code for debugging
    try { fs.writeFileSync(path.resolve(process.cwd(), 'scripts', 'merge-myaccount.transformed.js'), wrapped, 'utf8'); } catch (e) {}
    const script = new vm.Script(wrapped, { filename: 'tmp.js' });
    const sandbox = { module: {}, exports: {} };
    script.runInNewContext(sandbox);
    return sandbox.module.exports;
}

function merge(en, nl) {
    if (typeof en !== 'object' || en === null) return nl === undefined ? en : nl;
    const out = Array.isArray(en) ? [] : {};
    for (const k of Object.keys(en)) {
        if (nl && Object.prototype.hasOwnProperty.call(nl, k)) {
            out[k] = merge(en[k], nl[k]);
        } else {
            out[k] = en[k];
        }
    }
    // also copy keys present only in nl
    if (nl) {
        for (const k of Object.keys(nl)) {
            if (!Object.prototype.hasOwnProperty.call(out, k)) out[k] = nl[k];
        }
    }
    return out;
}

const enCode = fs.readFileSync(enPath, 'utf8');
const nlCode = fs.readFileSync(nlPath, 'utf8');

const enObj = tsToJsObject(enCode);
const nlObj = tsToJsObject(nlCode);

const merged = merge(enObj, nlObj);

// Build output TS file
const header = `/**\n * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).\n *\n * WSO2 LLC. licenses this file to you under the Apache License,\n * Version 2.0 (the "License"); you may not use this file except\n * in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing,\n * software distributed under the License is distributed on an\n * \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\n * KIND, either express or implied. See the License for the\n * specific language governing permissions and limitations\n * under the License.\n */\n\nimport { MyAccountNS } from \"../../../models\";\n\n/* eslint-disable max-len */\n`;

const body = 'export const myAccount: MyAccountNS = ' + JSON.stringify(merged, null, 4) + ';\n';

fs.writeFileSync(nlPath, header + body, 'utf8');
console.log('Merged and updated', nlPath);
