/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import M2MApplicationQuickStart, { M2MApplicationQuickStartPropsInterface }  from "../quick-start";

describe("M2MApplicationQuickStart", () => {
    const defaultProps: M2MApplicationQuickStartPropsInterface = {
        application: {
            name: "Test Application"
        },
        defaultTabIndex: 0,
        inboundProtocolConfig: {},
        onApplicationUpdate: jest.fn(),
        onTriggerTabUpdate: jest.fn(),
        template: {
            id: "test-template-id",
            name: "M2MApplication"
        }
    };

    it("renders the M2MApplicationQuickStart component", () => {
        render(<M2MApplicationQuickStart { ...defaultProps } />, { });

        const m2mGuide: Element = screen.getByTestId("m2m-app-quick-start");

        expect(m2mGuide).toBeInTheDocument();
    });
});
