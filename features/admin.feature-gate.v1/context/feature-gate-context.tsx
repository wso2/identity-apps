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

/**
 * Props interface of {@link FeatureGateContext}
 */
export interface FeatureGateContextProps {
    /**
     * Flag to determine whether the preview features modal should be shown or not.
     */
    showPreviewFeaturesModal: boolean;
    /**
     * Setter to set the showPreviewFeaturesModal flag.
     */
    setShowPreviewFeaturesModal: Dispatch<SetStateAction<boolean>>;
    selectedPreviewFeatureToShow: string;
    setSelectedPreviewFeatureToShow: Dispatch<SetStateAction<string>>;
}

/**
 * Context object for managing the Feature Gate context.
 */
const FeatureGateContext: Context<
    FeatureGateContextProps
> = createContext<null | FeatureGateContextProps>(
    {
        selectedPreviewFeatureToShow: "",
        setSelectedPreviewFeatureToShow: () => {},
        setShowPreviewFeaturesModal: () => {},
        showPreviewFeaturesModal: false
    }
);

FeatureGateContext.displayName = "FeatureGateContext";

export default FeatureGateContext;
