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

import merge from "lodash-es/merge";
import { Element } from "../models/elements";
import { Resources } from "../models/resources";

const resolveComponentMetadata = (resources: Resources, components: Element[]): Element[] => {
    const updateComponentResourceType = (component: Element): Element => {
        let updatedComponent = { ...component };

        resources.elements.forEach((componentWithMeta: Element) => {
            if (component.category === componentWithMeta.category && component.type === componentWithMeta.type) {
                if (component.variant) {
                    // If the component metadata has a variants array, merge.
                    if (componentWithMeta.variants) {
                        updatedComponent = merge({}, componentWithMeta, updatedComponent);

                        return;
                    }

                    // If the component metadata has a high level variant, merge.
                    if (componentWithMeta.variant && (component.variant === componentWithMeta.variant)) {
                        updatedComponent = merge({}, componentWithMeta, updatedComponent);
                    }
                } else {
                    updatedComponent = merge({}, componentWithMeta, updatedComponent);
                }
            }
        });

        if (updatedComponent.components) {
            updatedComponent.components = updatedComponent.components.map(updateComponentResourceType);
        }

        return updatedComponent;
    };

    return components?.map(updateComponentResourceType);
};

export default resolveComponentMetadata;
