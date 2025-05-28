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
    RECAPTCHA_ENTERPRISE_ID,
    RECAPTCHA_V2_SCRIPT_ID
} from "../constants/captcha-constants";
import { loadRecaptchaApi } from "../utils/captcha-utils";

/**
 * Hook to load and manage the Google reCAPTCHA V2 widget.
 */
const useReCaptcha = (recaptchaType, siteKey, reCaptchaScriptUrl) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [ token, setToken ] = useState(null);
    const [ widgetReady, setWidgetReady ] = useState(false);
    const [ recaptcha, setRecaptcha ] = useState(null);
    const [ error, setError ] = useState(null);
    const resolveRef = useRef(null);
    const reCaptchaUrl = reCaptchaScriptUrl + DEFAULT_RECAPTCHA_SCRIPT_URL_PARAMS || DEFAULT_RECAPTCHA_SCRIPT_URL;

    const getRecaptchaObject = useCallback(() => {
        if (!window.grecaptcha) {
            throw new Error("reCAPTCHA API not loaded");
        }

        if (recaptchaType === RECAPTCHA_ENTERPRISE_ID) {
            if (!window.grecaptcha.enterprise) {
                throw new Error("reCAPTCHA Enterprise API not loaded");
            }

            return window.grecaptcha.enterprise;
        }

        return window.grecaptcha;
    }, [ recaptchaType ]);

    useEffect(() => {
        if (!siteKey) {
            setError(new Error("Site key is required"));

            return;
        }

        let mounted = true;

        const initializeRecaptcha = async () => {
            try {
                const recaptchaObject = getRecaptchaObject();

                setRecaptcha(recaptchaObject);

                const grecaptcha = await loadRecaptchaApi(reCaptchaUrl, RECAPTCHA_V2_SCRIPT_ID, recaptchaObject);

                if (!mounted) return;

                try {
                    widgetIdRef.current = grecaptcha.render(containerRef.current, {
                        callback: (recaptchaToken) => {
                            if (!mounted) return;
                                setToken(recaptchaToken);
                            if (resolveRef.current) {
                                resolveRef.current(recaptchaToken);
                                resolveRef.current = null;
                            }
                        },
                        sitekey: siteKey,
                        size: "invisible"
                    });
                    setWidgetReady(true);
                    setError(null);
                } catch (renderError) {
                    console.error("ReCAPTCHA: Failed to render widget", renderError);
                    setError(renderError);
                }
            } catch (initError) {
                console.error("ReCAPTCHA: Failed to initialize", initError);
                setError(initError);
            }
        };

        initializeRecaptcha();

        return () => {
            mounted = false;
            if (widgetIdRef.current !== null && recaptcha) {
                try {
                    recaptcha.reset(widgetIdRef.current);
                } catch (error) {
                    console.error("ReCAPTCHA: Failed to cleanup widget", error);
                }
                widgetIdRef.current = null;
                setWidgetReady(false);
            }
        };
    }, [ siteKey, reCaptchaUrl, getRecaptchaObject ]);

    const execute = useCallback(() => {
        if (!widgetReady || typeof widgetIdRef.current !== "number") {
            return Promise.reject(new Error("ReCAPTCHA not ready"));
        }

        return new Promise((resolve) => {
            resolveRef.current = resolve;
            recaptcha.execute(widgetIdRef.current);
        });
    }, [ widgetReady, recaptcha ]);

    const reset = useCallback(() => {
        if (widgetReady && widgetIdRef.current !== null) {
            recaptcha.reset(widgetIdRef.current);
            setToken(null);
            resolveRef.current = null;
        }
    }, [ widgetReady, recaptcha ]);

    return { containerRef, ready: widgetReady, execute, reset, token, error };
};

export default useReCaptcha;
