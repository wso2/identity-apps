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

import { BrandingPreferenceInterface } from "features/admin.branding.v1/models";
import { Context, createContext } from "react";

/**
 * Props interface for AIBrandingFeatureContext.
 */
export interface AIBrandingFeatureContextProps {

    brandingGenerationCompleted: boolean;
    handleGenerate: (data: any) => void;
    isGeneratingBranding: boolean;
    mergedBrandingPreference: BrandingPreferenceInterface;
    operationId: string;
    setBrandingGenerationCompleted: (status: boolean) => void;
    setGeneratingBranding: (status: boolean) => void;
    setOperationId: (id: string) => void;
}

/**
 * Context object for managing AI Branding feature.
 */
const AIBrandingFeatureContext: Context<AIBrandingFeatureContextProps> = createContext<
    null | AIBrandingFeatureContextProps
>(
    null
);

/**
 * Display name for the AIBrandingFeatureContext.
 */
AIBrandingFeatureContext.displayName = "AIBrandingFeatureContext";

export default AIBrandingFeatureContext;
