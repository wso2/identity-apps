/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { MonacoWorkerFactoriesInterface, resolveMonacoWorker } from "../monaco-workers";

class StubWorker {
    public readonly kind: string;

    public constructor(kind: string) {
        this.kind = kind;
    }
}

class EditorStub extends StubWorker {
    public constructor() {
        super("editor");
    }
}

class JsonStub extends StubWorker {
    public constructor() {
        super("json");
    }
}

class TypescriptStub extends StubWorker {
    public constructor() {
        super("typescript");
    }
}

const factories: MonacoWorkerFactoriesInterface<StubWorker> = {
    editor: EditorStub,
    json: JsonStub,
    typescript: TypescriptStub
};

describe("resolveMonacoWorker", () => {
    it("serves the JSON worker for json", () => {
        expect(resolveMonacoWorker("json", factories).kind).toBe("json");
    });

    it("serves the TypeScript worker for javascript and typescript", () => {
        expect(resolveMonacoWorker("javascript", factories).kind).toBe("typescript");
        expect(resolveMonacoWorker("typescript", factories).kind).toBe("typescript");
    });

    it("falls back to the editor worker for every other label", () => {
        expect(resolveMonacoWorker("editorWorkerService", factories).kind).toBe("editor");
        expect(resolveMonacoWorker("xml", factories).kind).toBe("editor");
    });

    it("creates a new worker on every call", () => {
        expect(resolveMonacoWorker("json", factories)).not.toBe(resolveMonacoWorker("json", factories));
    });
});
