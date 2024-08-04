/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import {
    IdentityProviderActionTypes,
    SetAvailableAuthenticatorsMetaInterface,
    SetAvailableIDPTemplateInterface
} from "./types";
import { FederatedAuthenticatorListItemInterface, IdentityProviderTemplateItemInterface } from "../../models";

/**
 * Redux action to set the list of available authenticators.
 *
 * @param {FederatedAuthenticatorMetaInterface} meta - Inbound auth protocol meta.
 * @return {SetAvailableAuthenticatorsMetaInterface} An action of type `SET_AVAILABLE_AUTHENTICATOR_META`
 */
export const setAvailableAuthenticatorsMeta = (
    meta: FederatedAuthenticatorListItemInterface[]
): SetAvailableAuthenticatorsMetaInterface => ({
    payload: meta,
    type: IdentityProviderActionTypes.SET_AVAILABLE_AUTHENTICATOR_META
});

/**
 * Redux action to set the IDP templates.
 *
 * @param {IdentityProviderTemplateItemInterface[]} templates - IDP templates list.
 * @param {boolean} isGrouped - Specify whether templates are grouped or not. Default is false.
 * @return {SetApplicationTemplatesActionInterface}
 */
export const setIdentityProviderTemplates = (
    templates: IdentityProviderTemplateItemInterface[],
    isGrouped: boolean = false
): SetAvailableIDPTemplateInterface => ({
    payload: templates,
    type: isGrouped ?
        IdentityProviderActionTypes.SET_GROUPED_IDP_TEMPLATES :
        IdentityProviderActionTypes.SET_AVAILABLE_IDP_TEMPLATES
});
