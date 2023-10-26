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

import { useContext } from "react";
import BrandingPreferenceContext, { BrandingPreferenceContextProps } from "../context/branding-preference-context";

/**
 * Interface for the return type of the `useBrandingPreference` hook.
 */
export type UseBrandingPreferenceInterface = BrandingPreferenceContextProps;

/**
 * Hook that provides access to the branding preference context.
 * @returns An object containing the branding preference.
 */
const useBrandingPreference = (): UseBrandingPreferenceInterface => {
    const context: BrandingPreferenceContextProps = useContext(BrandingPreferenceContext);

    if (context === undefined) {
        throw new Error("UseBrandingPreference must be used within a BrandingPreferenceProvider");
    }

    return context;
};

export default useBrandingPreference;
