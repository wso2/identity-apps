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
import ConsoleSettingsContext, { ConsoleSettingsContextProps } from "../context/console-settings-context";

/**
 * Props interface of {@link useConsoleSettings}
 */
export type UseConsoleSettingsInterface = ConsoleSettingsContextProps;

/**
 * Hook that provides access to the Console settings context.
 * @returns An object containing the context values of {@link ConsoleSettingsContext}.
 */
const useConsoleSettings = (): UseConsoleSettingsInterface => {
    const context: ConsoleSettingsContextProps = useContext(ConsoleSettingsContext);

    if (context === undefined) {
        throw new Error("useConsoleSettings must be used within a ConsoleSettingsProvider");
    }

    return context;
};

export default useConsoleSettings;
