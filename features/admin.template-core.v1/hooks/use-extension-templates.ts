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

import { useContext } from "react";
import ExtensionTemplatesContext, {
    ExtensionTemplatesContextProps
} from "../context/extension-templates-context";

/**
 * Interface for the return type of the `useExtensionTemplates` hook.
 */
export type UseExtensionTemplatesInterface = ExtensionTemplatesContextProps;

/**
 * Hook that provides access to the extension templates context.
 * @returns An object containing the set of extension templates.
 */
const useExtensionTemplates = (): UseExtensionTemplatesInterface => {
    const context: ExtensionTemplatesContextProps = useContext(ExtensionTemplatesContext);

    if (context === undefined) {
        throw new Error("useExtensionTemplates hook must be used within a ExtensionTemplatesProvider");
    }

    return context;
};

export default useExtensionTemplates;
