/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { BrandingPreferenceLayoutInterface } from "../../../models";
import { DesignFormValuesInterface } from "../design-form";

/**
 * Prop-types for the Layout Design Extension Components.
 */
export interface LayoutDesignExtensionInterface extends IdentifiableComponentInterface {
    /**
     * Design form initial values.
     */
    initialValues: DesignFormValuesInterface;
    /**
     * Layout instance details.
     */
    layout: BrandingPreferenceLayoutInterface;
    /**
     * Function for set the layout instance details.
     */
    setLayout: (value: BrandingPreferenceLayoutInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * i18N translation function.
     */
    t?: string | any;
}
