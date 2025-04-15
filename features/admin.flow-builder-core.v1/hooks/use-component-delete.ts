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

import { useReactFlow } from "@xyflow/react";
import cloneDeep from "lodash-es/cloneDeep";
import { Element } from "../models/elements";

export interface UseComponentDelete {
    deleteComponent: (stepId: string, component: Element) => void;
}

const useComponentDelete = (): UseComponentDelete => {
    const { updateNodeData } = useReactFlow();

    const deleteComponent = (stepId: string, component: Element): void => {
        const updateComponent = (components: Element[]): Element[] => {
            return components?.reduce((acc: Element[], _component: Element) => {
                if (_component.id === component.id) {
                    return acc;
                }

                if (_component.components) {
                    _component.components = updateComponent(_component.components);
                }

                acc.push(_component);

                return acc;
            }, []);
        };

        updateNodeData(stepId, (node: any) => {
            const components: Element[] = updateComponent(cloneDeep(node?.data?.components));

            return {
                components
            };
        });
    };

    return { deleteComponent };
};

export default useComponentDelete;
