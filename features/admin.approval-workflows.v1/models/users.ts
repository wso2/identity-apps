/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { RolesInterface } from "@wso2is/core/models";
import { ApprovalSteps } from "./ui";

/**
 * Props for the editable sections of an approval step.
 */
export interface StepEditSectionsInterface {

    /**
     * Whether the step is in read-only mode.
     */
    isReadOnly: boolean;

    /**
     * Active user store identifier.
     *
     * Used to determine if user store logic is handled outside the component.
     */
    activeUserStore?: string;

    /**
     * Type of the active role store.
     */
    activeRoleType?: string;

    /**
     * Initial values for the approval step.
     */
    initialValues?: ApprovalSteps;

    /**
     * Callback to handle user updates.
     */
    onUsersChange?: (users: UserBasicInterface[]) => void;

    /**
     * Callback to handle role updates.
     */
    onRolesChange?: (roles: RolesInterface[]) => void;

    /**
     * Whether to show validation error messages.
     */
    showValidationError?: boolean;
}
