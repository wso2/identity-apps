/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { history } from "../../helpers/history";
import { store } from "../../store";

/**
 * App Insights class to perform application insights related functions.
*/
export class AppInsights {
    private static appInsightsInstance: AppInsights;
    private isEnabled: boolean;
    private isInitialized: boolean;

    private reactPlugin: ReactPlugin;
    private externalAppInsightsInstance: ApplicationInsights;
    private userId: string;
    private tenantId: string;

    /**
     * Private constructor to avoid object initialization from 
     * outside the class.
    */
    private constructor() {
        this.isEnabled = window["AppUtils"].getConfig().extensions.applicationInsightsEnabled;
        this.isInitialized = false;
    }

    /**
     * Returns an instance of the App Insights class.
     * 
     * @returns {AppInsights}
    */
    public static getInstance(): AppInsights {
        if(!this.appInsightsInstance) {
            this.appInsightsInstance = new AppInsights();
        }

        return this.appInsightsInstance;
    }

    /**
     * Initialize application insights and other needed common variables.
     * 
     * @returns {boolean} True if initialization successful. Else false.
    */
    public init(): boolean {
        if(!this.isEnabled) {
            return false;
        }

        // Create react plugin if not already created.
        if(!this.reactPlugin) {
            this.reactPlugin = new ReactPlugin();
        }

        // Create application insights instance if not already created.
        if(!this.externalAppInsightsInstance) {
            const endpointUrl: string = window["AppUtils"].getConfig()
                .extensions.applicationInsightsProxyEndpoint;
            const instrumentationKey: string = window["AppUtils"].getConfig()
                .extensions.applicationInsightsInstrumentationKey;

            // Disable if the instrumentation key is not provided.
            if(instrumentationKey == "") {
                // TODO: Use the logger when implemented.
                // Log message: "Couldn't find an instrumentation key. Disabling application insights"

                this.isEnabled = false;
                return false;
            }

            if(endpointUrl == "") {
                this.externalAppInsightsInstance = new ApplicationInsights({
                    config: {
                        instrumentationKey: instrumentationKey,
                        extensions: [this.reactPlugin],
                        extensionConfig: {
                            [this.reactPlugin.identifier]: { history: history }
                        }
                    }
                });
            } else {
                this.externalAppInsightsInstance = new ApplicationInsights({
                    config: {
                        endpointUrl: endpointUrl,
                        instrumentationKey: instrumentationKey,
                        extensions: [this.reactPlugin],
                        extensionConfig: {
                            [this.reactPlugin.identifier]: { history: history }
                        }
                    }
                });
            }

            this.externalAppInsightsInstance.loadAppInsights();

            /**
             * Uncomment if need to track all page visits.
            */
            // this.externalAppInsightsInstance.trackPageView();
        }

        // Load userId and tenantId if not already loaded.
        if(this.userId == undefined) {
            this.userId = store.getState().authenticationInformation.profileInfo.id;
            this.tenantId = store.getState().authenticationInformation.tenantDomain;
        }

        this.isInitialized = true;
        return true;
    }

    /**
     * Send analytics data to insights server.
     * 
     * @param {string} eventId - Event identifier string.
     * @param { [key: string]: string } [customProperties] - Any custom properties (optional).
    */
    public trackEvent(eventId: string, customProperties?: { [key: string]: string }): void {
        if(!this.isEnabled) {
            return;
        }

        const properties: { [key: string]: string } = {
            ...customProperties
        };

        if(!this.isInitialized) {
            if(!this.init()) {
                return;
            }
        }

        if(this.userId) {
            properties.UUID = this.userId;
        }
        if(this.tenantId) {
            properties.tenant = this.tenantId;
        }

        /**
         * Send telemetry to the server.
        */
        this.externalAppInsightsInstance.trackEvent({ name: eventId }, properties);
    }
}
