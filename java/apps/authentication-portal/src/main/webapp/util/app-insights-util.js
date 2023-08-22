/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 * 
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }

        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * App Insights class to perform application insights related functions.
*/
var AppInsights = /** @class */ ( function () {

    function AppInsights() {

        this.isEnabled = false;
    }

    /**
     * Returns an instance of the App Insights class.
     *
     * @returns {AppInsights}
    */
    AppInsights.getInstance = function () {

        if (!this.appInsightsInstance) {
            this.appInsightsInstance = new AppInsights();
        }

        return this.appInsightsInstance;
    };

    /**
     * Initialize application insights.
     * 
     * @param {boolean} isEnabled - Whether app insights is enabled.
     *
    */
    AppInsights.prototype.init = function (isEnabled) {

        this.isEnabled = isEnabled;
    };

    /**
     * Send analytics data to insights server.
     *
     * @param {string} eventId - Event identifier string.
     * @param { [key: string]: string } [customProperties] - Any custom properties (optional).
    */
    AppInsights.prototype.trackEvent = function (eventId, customProperties) {

        if (!this.isEnabled) {
            return;
        }

        if (customProperties) {
            var data = {
                "data": customProperties
            };
        }

        var properties = __assign({}, data);

        /**
         * Send telemetry to the server.
        */
        window.appInsights.trackEvent({
            name: eventId,
            properties: properties
        });
    };

    return AppInsights;

}());
