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

import { Context, Dispatch, SetStateAction, createContext } from "react";
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
}

/**
 * Context object for managing the Password Recovery flow builder context.
 */
const AskPasswordFlowBuilderContext: Context<
    AskPasswordFlowBuilderContextProps
> = createContext<null | AskPasswordFlowBuilderContextProps>(
    {
        isNewAskPasswordPortalEnabled: false,
        isPublishing: false,
        onPublish: () => Promise.resolve(false),
        selectedAttributes: {},
        setSelectedAttributes: () => {},
        supportedAttributes: []
    }
);

AskPasswordFlowBuilderContext.displayName = "AskPasswordFlowBuilderContext";

export default AskPasswordFlowBuilderContext;
