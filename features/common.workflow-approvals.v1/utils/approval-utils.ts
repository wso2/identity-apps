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

/**
 * Get the translation key for the operation type.
 *
 * @param operationType - The operation type.
 * @returns The translation key for the operation type.
 */
export const getOperationTypeTranslationKey = (operationType: string): string => {
    switch (operationType) {
        case "ADD_USER":
            return "common:approvalsPage.operationTypes.addUser";
        case "DELETE_USER":
            return "common:approvalsPage.operationTypes.deleteUser";
        case "ADD_ROLE":
            return "common:approvalsPage.operationTypes.addRole";
        case "DELETE_ROLE":
            return "common:approvalsPage.operationTypes.deleteRole";
        case "UPDATE_ROLES_OF_USERS":
            return "common:approvalsPage.operationTypes.updateRolesOfUser";
        case "SELF_REGISTER_USER":
            return "common:approvalsPage.operationTypes.selfRegisterUser";
        default:
            return operationType;
    }
};
