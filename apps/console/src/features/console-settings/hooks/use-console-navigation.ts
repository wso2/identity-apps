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

import { AppConstants } from "../../core/constants/app-constants";
import { history } from "../../core/helpers/history";

/**
 * Props interface of {@link useConsoleNavigation}
 */
export interface UseConsoleNavigation {
    /**
     * Navigate to the Console settings.
     * @param tab - Tab to navigate to.
     */
    navigate: (tab: string) => void;
}

/**
 * Hook to help with navigation to the Console settings.
 * @returns
 */
const useConsoleNavigation = (): UseConsoleNavigation => {
    const navigate = (id?: string): void => {
        history.push(AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", id));
    };

    return {
        navigate
    };
};

export default useConsoleNavigation;
