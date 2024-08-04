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

import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { useCallback } from "react";

/**
 * Hook to set the connection templates.
 *
 * @returns {((templates: Record<string, any>[]) => void)}
 */
export const useSetConnectionTemplates = (): ((templates: Record<string, any>[]) => void) => {
    const { setUIConfig, UIConfig } = useUIConfig();

    return useCallback(
        (templates: Record<string, any>[]) => {
            if (!UIConfig) {
                return;
            }

            if (!templates) {
                return;
            }

            setUIConfig({
                ...UIConfig,
                connectionTemplates: templates
            });
        },
        [ setUIConfig, UIConfig ]
    );
};
