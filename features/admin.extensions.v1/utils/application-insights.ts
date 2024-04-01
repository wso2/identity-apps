/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { ITelemetryItem } from "@microsoft/applicationinsights-core-js";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { v4 as uuidv4 } from "uuid";
import { history } from "../../admin.core.v1/helpers/history";
import { store } from "../../admin.core.v1/store";

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
    private isWSO2User: boolean|undefined;

    private isDependencyTrackingEnabled: boolean;

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

        this.isDependencyTrackingEnabled = window["AppUtils"].getConfig()
            .analytics?.metrics?.dependencyTrackingEnabled
            ? window["AppUtils"].getConfig().analytics.metrics.dependencyTrackingEnabled
            : false;

        this.userId = store.getState().profile.profileInfo.userId;
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

    /**
     * Returns an instance of the App Insights class.
     *
     * @returns App Insights instance
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
     * @returns boolean - True if initialization successful. Else false.
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
                // App Insights cookies are turned off by default
                // They are enabled only after the user consent is obtained
                cookieCfg: {
                    enabled: false
                },
                disableAjaxTracking: true,
                extensionConfig: {
                    [this.reactPlugin.identifier]: { history: history }
                },
                extensions: [ this.reactPlugin ],
                instrumentationKey: instrumentationKey,
                maxBatchInterval: 30000
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

            this.telemetryInitializer = (envelope: ITelemetryItem) => {

                envelope.data = {
                    ...envelope.data,
                    isWSO2User: this.isWSO2User,
                    tenant: this.tenantId
                };

                if (envelope.baseType === "ExceptionData") {
                    const errMsg: any = envelope.baseData.properties?.message;

                    envelope.data = {
                        ...envelope.data,
                        exceptionType: errMsg.substring(0,errMsg.indexOf(":")),
                        pageTitle: document.title
                    };
                }

                return true;
            };

            this.externalAppInsightsInstance.addTelemetryInitializer(this.telemetryInitializer);

            this.externalAppInsightsInstance.trackPageView();

            // toogle cookie enabled option based on "cookie-pref-change" event
            window.addEventListener("cookie-pref-change",function (e: any){
                const updatedPreferences: any = e["pref"];

                if (updatedPreferences.includes("C0002")){
                    this.externalAppInsightsInstance.getCookieMgr().setEnabled(true);
                } else {
                    this.externalAppInsightsInstance.getCookieMgr().setEnabled(false);
                }
            });

        }

        this.isInitialized = true;

        return true;
    }

    /**
     * Function to perform app insights related computations.
     *
     * @param computation - Computation to perform.
    */
    public compute = (computation: () => void): void => {

        if (!this.isEnabled) {
            return;
        }

        computation();
    }

    /**
     * Send custom event data to insights server.
     *
     * @param eventId - Event identifier string.
     * @param customProperties - Any custom properties (optional).
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

        // If the user ID is not initialized, reinitialize
        if (!this.userId) {
            this.userId = store.getState().profile.profileInfo.userId;
        }

        if (this.userId) {
            properties.UUID = this.userId;
        }

        if (customProperties) {
            properties.data = customProperties;
        }

        /**
         * Send telemetry to the server.
         */
        this.externalAppInsightsInstance.trackEvent({ name: eventId }, properties);
    }

    /**
     * Send dependency (network request) data to insights server.
     *
     * @param pathname - endpoint name
     * @param startTimeInMs - when the request started
     * @param duration - network request duration
     * @param responseCode - server response status
     * @param isSuccess - whether the reuqest was successful
     * @param customProperties - any custom properties (optional)
    */
    public trackDependency(pathname: string, startTimeInMs: number, duration: number, responseCode: number,
        isSuccess: boolean,
        customProperties?: { [key: string]: any }): void{
        if (!this.isEnabled) {
            return;
        }

        const properties: { [key: string]: any } = {};

        if (!this.isInitialized) {
            if (!this.init()) {
                return;
            }
        }

        if (!this.isDependencyTrackingEnabled && isSuccess){
            return;
        }

        if (startTimeInMs){
            properties.startTime = new Date(startTimeInMs);
        }

        // If the user ID is not initialized, reinitialize
        if (!this.userId) {
            this.userId = store.getState().profile.profileInfo.userId;
        }

        if (this.userId) {
            properties.UUID = this.userId;
        }

        if (customProperties) {
            properties.data = customProperties;
        }

        this.externalAppInsightsInstance.trackDependencyData({
            duration: duration,
            id: uuidv4(),
            name: pathname,
            properties,
            responseCode: responseCode,
            success: isSuccess
        });
    }
}
