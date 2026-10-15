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

import { describe, expect, it } from "vitest";
import { ExtensionExecutorInterface } from "../../models/metadata";
import { Step } from "../../models/steps";
import buildExtensionExecutorSteps from "../build-extension-executor-steps";

describe("buildExtensionExecutorSteps", () => {
    it.each([ "PresentationExecutor", " PresentationExecutor ", "", "   ", undefined, null ])(
        "formats the executor name when the display name is %s",
        (displayName: string | null | undefined) => {
            // Include incomplete server metadata even though the API declares displayName as required.
            const executor: ExtensionExecutorInterface = {
                displayName: displayName,
                name: "PresentationExecutor"
            } as ExtensionExecutorInterface;
            const steps: Step[] = buildExtensionExecutorSteps([ executor ]);

            expect(steps[0].display.label).toBe("Presentation Executor");
            expect(steps[0].data.action.executor.name).toBe("PresentationExecutor");
            expect(executor.displayName).toBe(displayName);
        }
    );

    it("preserves a custom display name, including its capitalization", () => {
        const steps: Step[] = buildExtensionExecutorSteps([ {
            displayName: "Verify with OpenID4VP",
            name: "PresentationExecutor"
        } ]);

        expect(steps[0].display.label).toBe("Verify with OpenID4VP");
    });

    it("preserves acronyms when formatting a technical name", () => {
        const steps: Step[] = buildExtensionExecutorSteps([ {
            displayName: "HTTPRequestExecutor",
            name: "HTTPRequestExecutor"
        } ]);

        expect(steps[0].display.label).toBe("HTTP Request Executor");
    });

    it("preserves the executor configuration when formatting its label", () => {
        const steps: Step[] = buildExtensionExecutorSteps([ {
            description: "Verify a presentation",
            displayName: "PresentationExecutor",
            icon: "assets/images/icons/wallet.svg",
            name: "PresentationExecutor",
            requiresConnection: true
        } ]);

        expect(steps[0].display.description).toBe("Verify a presentation");
        expect(steps[0].display.image).toBe("assets/images/icons/wallet.svg");
        expect(steps[0].data.action.executor).toEqual({
            meta: { idpName: "" },
            name: "PresentationExecutor"
        });
    });
});
