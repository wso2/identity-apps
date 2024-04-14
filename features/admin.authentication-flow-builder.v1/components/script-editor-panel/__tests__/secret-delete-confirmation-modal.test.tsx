/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import "@testing-library/jest-dom";
import { fullPermissions } from "./__mocks__/permissions";
import { render, screen } from "../../../../test-configs/utils";
import SecretDeleteConfirmationModal, {
    SecretDeleteConfirmationModalPropsInterface
} from "../secret-delete-confirmation-modal";

describe.skip("SecretDeleteConfirmationModal", () => {
    const defaultProps: SecretDeleteConfirmationModalPropsInterface = {
        deletingSecret: {
            created: "2023-08-07 16:25:27.977",
            description: "NPM publish token",
            lastModified: "2023-08-07 16:25:27.977",
            secretId: "342234-5f41-46c3-a646-53187e091b1e",
            secretName: "NPM_TOKEN",
            type: "ADAPTIVE_AUTH_CALL_CHOREO"
        },
        // unable to pass `open` prop for some reason
        // open: true
    };

    it("renders the SecretDeleteConfirmationModal component", () => {
        render(<SecretDeleteConfirmationModal { ...defaultProps } />, { allowedScopes: fullPermissions });

        const secretDeleteConfirmationModal: Element = screen.getByTestId("secret-delete-confirmation-modal");

        expect(secretDeleteConfirmationModal).toBeInTheDocument();
    });
});
