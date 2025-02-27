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

import isEmpty from "lodash-es/isEmpty";
import useFlowComponentId from "./use-flow-component-id";
import { Element } from "../models/elements";

/**
 * Props interface of {@link useGenerateStepElement}
 */
export type UseGenerateStepElement = {
    generateStepElement: (element: Element) => Element;
};

/**
 * Hook that provides access to the Authentication Flow Builder Core context.
 *
 * This hook allows components to access authentication flow builder core-related data and functions
 * provided by the {@link AuthenticationFlowBuilderCoreProvider}. It returns an object containing
 * the context values defined in {@link AuthenticationFlowBuilderCoreContext}.
 *
 * @returns An object containing the context values of {@link AuthenticationFlowBuilderCoreContext}.
 *
 * @throws Will throw an error if the hook is used outside of an AuthenticationFlowBuilderCoreProvider.
 *
 * @example
 * ```tsx
 * const { generate } = useFlowComponentId();
 * const id = generate("element", 4); // Generates an ID like "element_374d"
 * ```
 */
const useGenerateStepElement = (): UseGenerateStepElement => {
    // TODO: Use from `@oxygen-ui/react/dnd`.
    const { generate } = useFlowComponentId();

    const generateStepElement = (element: Element): Element => {
        let updatedElement: Element = {
            ...element,
            id: generate(element.category.toLowerCase())
        };

        // If the component has variants, add the default variant to the root.
        if (!isEmpty(updatedElement?.variants)) {
            const defaultVariantType: string =
                updatedElement?.display?.defaultVariant ?? updatedElement?.variants[0]?.variant;
            const defaultVariant: Element = updatedElement.variants.find(
                (variant: Element) => variant.variant === defaultVariantType
            );

            updatedElement = {
                ...updatedElement,
                ...defaultVariant
            };
        }

        return updatedElement;
    };

    return {
        generateStepElement
    };
};

export default useGenerateStepElement;
