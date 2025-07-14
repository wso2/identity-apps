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

import debounce from "lodash-es/debounce";
import VisualFlowConstants from "../constants/visual-flow-constants";

/**
 * PluginRegistry is a singleton class that manages the registration and execution of plugins.
 */
class PluginRegistry {
    private static instance: PluginRegistry;

    private asyncPlugins: Map<string, Map<string, (...args: any[]) => Promise<boolean>>> = new Map();
    private syncPlugins: Map<string, Map<string, (...args: any[]) => boolean>> = new Map();

    private constructor() {
        // Private constructor to prevent instantiation.
    }

    public static getInstance(): PluginRegistry {
        if (!PluginRegistry.instance) {
            PluginRegistry.instance = new PluginRegistry();
        }

        return PluginRegistry.instance;
    }


    /**
     * Register an async plugin for the given event.
     *
     * @param eventName - The name of the event to register the plugin for.
     * @param handler - The async handler function to be executed when the event is triggered.
     */
    public registerAsync(eventName: string, handler: (...args: any[]) => Promise<boolean>): void {

        if (!handler[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]) {
            throw new Error("Handler function must have the `uniqueName` property.");
        }

        if (!this.asyncPlugins.has(eventName)) {
            this.asyncPlugins.set(eventName, new Map());
        }
        this.asyncPlugins.get(eventName)!.set(
            handler[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER], handler);
    };

    /**
     * Register an sync plugin for the given event.
     *
     * @param eventName - The name of the event to register the plugin for.
     * @param handler - The sync handler function to be executed when the event is triggered.
     */
    public registerSync(eventName: string, handler: (...args: any[]) => boolean): void {

        if (!handler[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER]) {
            throw new Error("Handler function must have the `uniqueName` property.");
        }

        if (!this.syncPlugins.has(eventName)) {
            this.syncPlugins.set(eventName, new Map());
        }
        this.syncPlugins.get(eventName)!.set(
            handler[VisualFlowConstants.FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER], handler);
    };

    /**
     * Unregister a plugin with the given name and event.
     *
     * @param eventName - The name of the event to unregister the plugin from.
     * @param handlerName - The name of the handler function to be removed.
     */
    public unregister(eventName: string, handlerName: string): void {

        const removeHandler = (map: Map<string, Map<string, (...args: any[]) => Promise<boolean> | boolean>>) => {
            if (map.has(eventName)) {
                const handlers: Map<string, (...args: any[]) => Promise<boolean> | boolean> = map.get(eventName);

                if (handlers && handlers.has(handlerName)) {
                    handlers.delete(handlerName);
                    if (handlers.size === 0) {
                        map.delete(eventName); // Remove the event if no handlers are left.
                    }
                }
            }
        };

        removeHandler(this.asyncPlugins);
        removeHandler(this.syncPlugins);
    };

    /**
     * Executes all registered plugins for the given event with the provided arguments.
     *
     * @param eventName - The name of the event to execute plugins for.
     * @param args - The arguments to pass to the plugin handlers.
     * @returns True if all plugins returned true, false otherwise.
     */
    public executeSync(eventName: string, ...args: any[]): boolean {

        const handlers: IterableIterator<(...args: any[]) => boolean> = this.syncPlugins.get(eventName)?.values();

        if (!handlers) {
            return true; // No plugins registered, consider it a success.
        }

        for (const handler of handlers) {
            if (!handler(...args)) {
                return false; // If any plugin returns false, stop execution and return false.
            }
        }

        return true; // All plugins executed successfully.
    }

    /**
     * Executes all registered plugins for the given event with the provided arguments.
     *
     * @param eventName - The name of the event to execute plugins for.
     * @param args - The arguments to pass to the plugin handlers.
     * @returns True if all plugins returned true, false otherwise.
     */
    public executeAsync(eventName: string, ...args: any[]): Promise<boolean>;

    /**
     * Executes all registered plugins for the given event with the provided arguments and debounces the execution.
     *
     * @param eventName - The name of the event to execute plugins for.
     * @param debounceTime - The time in milliseconds to debounce the execution of plugins.
     * @param args - The arguments to pass to the plugin handlers.
     * @returns True if all plugins returned true, false otherwise.
     */
    public executeAsync(eventName: string, debounceTime: number, ...args: any[]): Promise<boolean>;

    public executeAsync(eventName: string, ...args: any[]): Promise<boolean> {
        // Check if the first argument is a number (debounce time).
        if (args.length > 1 && typeof args[0] === "number") {
            const debounceTime: number = args.shift() as number;

            return debounce(() => {
                return this.executeAllAsync(eventName, ...args);
            }, debounceTime)(); // Debounce execution to avoid rapid calls.
        } else {
            // If no debounce time is provided, execute the plugins immediately.
            return this.executeAllAsync(eventName, ...args);
        }
    }

    /**
     * Executes all registered plugins for the given event with the provided arguments.
     *
     * @param eventName - The name of the event to execute plugins for.
     * @param args - The arguments to pass to the plugin handlers.
     * @returns True if all plugins returned true, false otherwise.
     */
    private async executeAllAsync(eventName: string, ...args: any[]): Promise<boolean> {
        const handlers: IterableIterator<(...args: any[]) => Promise<boolean>> =
            this.asyncPlugins.get(eventName)?.values();

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
}

export default PluginRegistry;
