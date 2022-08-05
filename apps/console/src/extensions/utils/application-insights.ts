/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com).
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ITelemetryItem } from "@microsoft/applicationinsights-core-js";
import { history } from "../../features/core/helpers/history";
import { store } from "../../features/core/store";

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
    private isWSO2User: boolean;

    private telemetryInitializer: (item: ITelemetryItem) => boolean | void;

    /**
     * Private constructor to avoid object initialization from 
     * outside the class.
    */
    private constructor() {

        this.isEnabled = window["AppUtils"].getConfig().extensions?.applicationInsightsEnabled
            ? window["AppUtils"].getConfig().extensions.applicationInsightsEnabled
            : false;
        this.isInitialized = false;
        this.isWSO2User = false;
    }

    /**
     * Returns an instance of the App Insights class.
     * 
     * @returns {AppInsights}
    */
    public static getInstance(): AppInsights {

        if (!this.appInsightsInstance) {
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

        if (!this.isEnabled) {
            return false;
        }

        // Create react plugin if not already created.
        if (!this.reactPlugin) {
            this.reactPlugin = new ReactPlugin();
        }

        // Create application insights instance if not already created.
        if (!this.externalAppInsightsInstance) {
            // Read configuration values.
            const endpointUrl: string = window["AppUtils"].getConfig().extensions?.applicationInsightsProxyEndpoint
                ? window["AppUtils"].getConfig().extensions.applicationInsightsProxyEndpoint
                : "";
            const instrumentationKey: string = window["AppUtils"].getConfig()
                .extensions?.applicationInsightsInstrumentationKey
                ? window["AppUtils"].getConfig().extensions.applicationInsightsInstrumentationKey
                : "";
            const cookieDomain: string = window["AppUtils"].getConfig().extensions?.applicationInsightsCookieDomain
                ? window["AppUtils"].getConfig().extensions.applicationInsightsCookieDomain
                : "";
            const cookiePostfix: string = window["AppUtils"].getConfig().extensions?.applicationInsightsCookiePostfix
                ? window["AppUtils"].getConfig().extensions.applicationInsightsCookiePostfix
                : "";

            // Disable if the instrumentation key is not provided.
            if (instrumentationKey == "") {
                // TODO: Use the logger when implemented.
                // Log message: "Couldn't find an instrumentation key. Disabling application insights"
                this.isEnabled = false;
                return false;
            }

            // Construct the config object.
            const config: { [key: string]: any } = {
                instrumentationKey: instrumentationKey,
                extensions: [this.reactPlugin],
                extensionConfig: {
                    [this.reactPlugin.identifier]: { history: history }
                },
                disableAjaxTracking: true
            };

            if (endpointUrl !== "") {
                config.endpointUrl = endpointUrl;
            }
            if (cookieDomain !== "") {
                config.cookieDomain = cookieDomain;
            }
            if (cookiePostfix !== "") {
                config.sessionCookiePostfix = cookiePostfix;
                config.userCookiePostfix = cookiePostfix;
            }

            this.externalAppInsightsInstance = new ApplicationInsights({
                config: config
            });

            this.externalAppInsightsInstance.loadAppInsights();

            /**
             * Disabling automatic publish of pageview data.
             * This feature is temporary disabled due to below issue.
             * https://github.com/wso2-enterprise/asgardeo-product/issues/5200
             * 
             * TODO: Need to fix this and re-enable.
            */
            this.telemetryInitializer = (envelope: ITelemetryItem) => {
                if (envelope.baseType === "PageviewData") {
                    return false;
                }
                if (envelope.baseType === "PageviewPerformanceData") {
                    return false;
                }
                return true;
            };

            this.externalAppInsightsInstance.addTelemetryInitializer(this.telemetryInitializer);

            /**
             * Uncomment if need to track all page visits.
            */
            // this.externalAppInsightsInstance.trackPageView();
        }

        // Load userId, tenantId and isWSO2User if not already loaded.
        if (this.userId == undefined) {
            this.userId = store.getState().profile.profileInfo.id;
            this.tenantId = store.getState().auth.tenantDomain;

            const WSO2_USER_REGEX: RegExp = /.+ws[o|0]2\.com.*/;
            const uid: string = store.getState().auth.email ?? store.getState().profile.profileInfo.userName;
            
            if (!uid) {
                this.isWSO2User = undefined;
            } else if (uid.match(WSO2_USER_REGEX)) {
                this.isWSO2User = true;
            } else {
                this.isWSO2User = false;
            }
        }

        this.isInitialized = true;
        return true;
    }

    /**
     * Function to perform app insights related computations.
     * 
     * @param {any} computation - Computation to perform.
    */
    public compute = (computation: () => void): void => {

        if (!this.isEnabled) {
            return;
        }

        computation();
    }

    /**
     * Send analytics data to insights server.
     * 
     * @param {string} eventId - Event identifier string.
     * @param { [key: string]: string | Record<string, unknown> | number } [customProperties] - 
     *     Any custom properties (optional).
    */
    public trackEvent(eventId: string, customProperties?: { [key: string]: string | Record<string, unknown> |
            number}): void {

        if (!this.isEnabled) {
            return;
        }

        const properties: { [key: string]: any } = {};

        if (!this.isInitialized) {
            if (!this.init()) {
                return;
            }
        }

        // If user id is not defined at this time, reinitialize....
        if (!this.userId) {
            this.userId = store.getState().profile.profileInfo.id;
        }

        if (this.userId) {
            properties.UUID = this.userId;
        }
        if (this.tenantId) {
            properties.tenant = this.tenantId;
        }
        properties.isWSO2User = this.isWSO2User;
        
        if (customProperties) {
            properties.data = customProperties;
        }

        /**
         * Send telemetry to the server.
        */
        this.externalAppInsightsInstance.trackEvent({ name: eventId }, properties);
    }
}
