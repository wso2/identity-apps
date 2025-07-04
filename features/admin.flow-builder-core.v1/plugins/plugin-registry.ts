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

import debounce from "lodash/debounce";

const plugins: Map<string, Map<string, (...args: any[]) => Promise<boolean>>> = new Map();

/**
 * Registers a plugin with the given name and event.
 *
 * @param eventName - The name of the event to register the plugin for.
 * @param handler - The handler function to be called when the event is triggered.
 */
export const registerPlugin = (eventName: string, handler: (...args: any[]) => Promise<boolean>): void => {
    if (!plugins.has(eventName)) {
        plugins.set(eventName, new Map());
    }

    plugins.get(eventName)!.set(handler.name, handler);
};

/**
 * Unregister a plugin with the given name and event.
 *
 * @param eventName - The name of the event to unregister the plugin from.
 * @param handlerName - The name of the handler function to be removed.
 */
export const unregisterPlugin = (eventName: string, handlerName: string): void => {
    if (plugins.has(eventName)) {
        const handlers = plugins.get(eventName);
        if (handlers && handlers.has(handlerName)) {
            handlers.delete(handlerName);
            if (handlers.size === 0) {
                plugins.delete(eventName); // Remove the event if no handlers are left.
            }
        }
    }
};

/**
 * Executes all registered plugins for the given event with the provided arguments (Debounce).
 *
 * @param eventName - The name of the event to execute plugins for.
 * @param args - The arguments to pass to the plugin handlers.
 * @returns True if all plugins returned true, false otherwise.
 */
export const executePluginsWithDebounce = (eventName: string, ...args: any[]): Promise<boolean> => {
   return debounce(() => {
        return execute(eventName, ...args);
    }, 500)(); // Debounce execution to avoid rapid calls.
}

/**
 * Executes all registered plugins for the given event with the provided arguments.
 *
 * @param eventName - The name of the event to execute plugins for.
 * @param args - The arguments to pass to the plugin handlers.
 * @returns True if all plugins returned true, false otherwise.
 */
export const executePlugins = (eventName: string, ...args: any[]): Promise<boolean> => {
    return execute(eventName, ...args);
}

/**
 * Executes all registered plugins for the given event with the provided arguments.
 *
 * @param eventName - The name of the event to execute plugins for.
 * @param args - The arguments to pass to the plugin handlers.
 * @returns True if all plugins returned true, false otherwise.
 */
const execute = async (eventName: string, ...args: any[]): Promise<boolean> => {
    const handlers = plugins.get(eventName)?.values();
    if (!handlers) {
        return true; // No plugins registered, consider it a success.
    }

    for (const handler of handlers) {
        if (!(await handler(...args))) {
            return false; // If any plugin returns false, stop execution and return false.
        }
    }
    return true; // All plugins executed successfully.
}
