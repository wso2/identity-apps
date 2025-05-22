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

/**
 * Utility function to load the Captcha API.
 *
 * @param {*} captchaScriptURL
 * @returns
 */
export function loadCaptchaApi(captchaScriptURL, captchaScriptId) {
    if (window.grecaptcha && window.grecaptcha.render) {
        return Promise.resolve(window.grecaptcha);
    }

    return new Promise((resolve, reject) => {
        const existing = document.getElementById(captchaScriptId);

        if (existing) {
            return window.grecaptcha.ready(() => resolve(window.grecaptcha));
        }

        const script = document.createElement("script");

        script.id    = captchaScriptId;
        script.src   = captchaScriptURL;
        script.async = true;
        script.defer = true;

        script.onerror = () => {
            reject(new Error("Failed to load reCAPTCHA API"));
        };

        script.onload = () => {
            if (!window.grecaptcha || !window.grecaptcha.ready) {
                return reject(new Error("reCAPTCHA API loaded, but no grecaptcha.ready"));
            }
            window.grecaptcha.ready(() => resolve(window.grecaptcha));
        };

        document.head.appendChild(script);
    });
}
