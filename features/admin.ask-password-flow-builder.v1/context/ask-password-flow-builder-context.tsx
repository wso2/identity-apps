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

import { AskPasswordFormValuesInterface } from "@wso2is/admin.server-configurations.v1/models/ask-password";
import { Context, Dispatch, SetStateAction, createContext } from "react";
import { GovernanceConnectorInterface } from "../../admin.connections.v1";
import { Attribute } from "../models/attributes";

/**
 * Props interface of {@link AskPasswordFlowBuilderContext}
 */
export interface AskPasswordFlowBuilderContextProps {
    /**
     * Flag denoting whether the password recovery flow builder is enabled or not.
     */
    isNewAskPasswordPortalEnabled: boolean;
    /**
     * Is the password recovery flow publishing.
     */
    isPublishing: boolean;
    /**
     * Callback to publish the flow.
     */
    onPublish: () => Promise<boolean>;
    /**
     * The set of attributes that are selected for the flow that are maintained per node.
     */
    selectedAttributes: {
        [key: string]: Attribute[];
    };
    /**
     * Sets the selected attributes for the flow.
     */
    setSelectedAttributes: Dispatch<SetStateAction<{ [key: string]: Attribute[] }>>;
    /**
     * Supported attributes for the ask password flow.
     */
    supportedAttributes: Attribute[];
    /**
     * Is the invite user registration configs are updated.
     */
    isInvitedUserRegistrationConfigUpdated: boolean;
    /**
     * Sets the invite user registration configs are updated.
     */
    setIsInvitedUserRegistrationConfigUpdated: Dispatch<SetStateAction<boolean>>;
    /**
     * Invited user registration configuration properties.
     */
    invitedUserRegistrationConfig: AskPasswordFormValuesInterface | null;
    /**
     * Sets the invited user registration configuration properties.
     */
    setInvitedUserRegistrationConfig: Dispatch<SetStateAction<AskPasswordFormValuesInterface | null>>;
    /**
     * Coneector associated with the flow.
     * @remarks This will be null if the flow is not associated with any connector.
     */
    connector?: GovernanceConnectorInterface | null;
    /**
     * Sets the connector associated with the flow.
     * @remarks This will be null if the flow is not associated with any connector.
     */
    setConnector?: Dispatch<SetStateAction<GovernanceConnectorInterface | null>>;
}

/**
 * Context object for managing the Password Recovery flow builder context.
 */
const AskPasswordFlowBuilderContext: Context<
    AskPasswordFlowBuilderContextProps
> = createContext<null | AskPasswordFlowBuilderContextProps>(
    {
        invitedUserRegistrationConfig: null,
        isInvitedUserRegistrationConfigUpdated: false,
        isNewAskPasswordPortalEnabled: false,
        isPublishing: false,
        onPublish: () => Promise.resolve(false),
        selectedAttributes: {},
        setInvitedUserRegistrationConfig: () => {},
        setIsInvitedUserRegistrationConfigUpdated: () => {},
        setSelectedAttributes: () => {},
        supportedAttributes: []
    }
);

AskPasswordFlowBuilderContext.displayName = "AskPasswordFlowBuilderContext";

export default AskPasswordFlowBuilderContext;
