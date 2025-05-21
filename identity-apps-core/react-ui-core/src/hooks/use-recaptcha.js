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

import { useCallback, useEffect, useRef, useState } from "react";
import {
    DEFAULT_RECAPTCHA_SCRIPT_URL,
    DEFAULT_RECAPTCHA_SCRIPT_URL_PARAMS,
    RECAPTCHA_V2_SCRIPT_ID
} from "../constants/captcha-constants";
import { loadCaptchaApi } from "../utils/captcha-utils";

/**
 * Hook to load and manage the Google reCAPTCHA V2 widget.
 */
const useReCaptcha = (siteKey = "", reCaptchaScriptUrl) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [ scriptLoaded, setScriptLoaded ] = useState(false);
    const [ token, setToken ] = useState(null);
    const [ widgetReady,  setWidgetReady  ] = useState(false);
    const reCaptchaUrl = reCaptchaScriptUrl + DEFAULT_RECAPTCHA_SCRIPT_URL_PARAMS || DEFAULT_RECAPTCHA_SCRIPT_URL;

    useEffect(() => {
        if (!siteKey) return;

        loadCaptchaApi(reCaptchaUrl, RECAPTCHA_V2_SCRIPT_ID)
            .then((grecaptcha) => {
                widgetIdRef.current = grecaptcha.render(containerRef.current, {
                    callback: setToken,
                    sitekey: siteKey,
                    size:    "invisible"
                });
                setWidgetReady(true);
                setScriptLoaded(true);
            });
    }, [ siteKey ]);

    const execute = useCallback(() => {
        if (scriptLoaded && widgetIdRef.current !== null) {
            window.grecaptcha.execute(widgetIdRef.current);

            return new Promise((resolve) => {
                const checkToken = setInterval(() => {
                    if (token) {
                        clearInterval(checkToken);
                        resolve(token);
                    }
                }, 100);
            });
        }

        return Promise.reject("ReCAPTCHA not ready");
    }, [ widgetReady, token ]);

    const reset = useCallback(() => {
        if (scriptLoaded && widgetIdRef.current !== null) {
            window.grecaptcha.reset(widgetIdRef.current);
            setToken(null);
        }
    }, [ widgetReady ]);

    return { execute, reset, containerRef, scriptLoaded, token };
};

export default useReCaptcha;
