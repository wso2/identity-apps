/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import AIBrandingPreferenceProvider from "@wso2is/admin.branding.ai.v1/providers/ai-branding-preference-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import BrandingPageLayout from "../components/branding-page-layout";
import BrandingPreferenceProvider from "../providers/branding-preference-provider";

/**
 * Prop-types for the branding page component.
 */
type BrandingPageInterface = IdentifiableComponentInterface;

/**
 * Branding page.
 *
 * @returns Branding page component.
 */
const BrandingPage: FunctionComponent<BrandingPageInterface> = (
): ReactElement => {

    return (
        <BrandingPreferenceProvider>
            <AIBrandingPreferenceProvider>
                <BrandingPageLayout />
            </AIBrandingPreferenceProvider>
        </BrandingPreferenceProvider>
    );
};

export default BrandingPage;
