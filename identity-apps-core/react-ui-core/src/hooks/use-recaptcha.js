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
const useReCaptcha = (recaptchaType = RECAPTCHA_ENTERPRISE_ID, siteKey, reCaptchaScriptUrl) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [ token, setToken ] = useState(null);
    const [ widgetReady, setWidgetReady ] = useState(false);
    const [ recaptcha, setRecaptcha ] = useState(null);
    const [ error, setError ] = useState(null);
    const resolveRef = useRef(null);
    const reCaptchaUrl = reCaptchaScriptUrl
        ? reCaptchaScriptUrl + DEFAULT_RECAPTCHA_SCRIPT_URL_PARAMS
        : DEFAULT_RECAPTCHA_SCRIPT_URL;

    const getRecaptchaObject = useCallback(() => {
        return new Promise((resolve) => {
            const checkRecaptcha = () => {
                if (window.grecaptcha) {
                    if (recaptchaType === RECAPTCHA_ENTERPRISE_ID) {
                        const checkEnterprise = () => {
                            if (window.grecaptcha.enterprise) {
                                resolve(window.grecaptcha.enterprise);
                            } else {
                                setTimeout(checkEnterprise, 100);
                            }
                        };

                        checkEnterprise();
                    } else {
                        resolve(window.grecaptcha);
                    }
                } else {
                    setTimeout(checkRecaptcha, 100);
                }
            };

            checkRecaptcha();
        });
    }, [ recaptchaType ]);

    useEffect(() => {
        if (!siteKey) {
            setError(new Error("Site key is required"));

            return;
        }

        let mounted = true;

        const initializeRecaptcha = async () => {
            try {
                await loadRecaptchaApi(reCaptchaUrl, RECAPTCHA_V2_SCRIPT_ID);

                if (!mounted) return;

                const recaptchaObject = await getRecaptchaObject();

                setRecaptcha(recaptchaObject);

                try {
                    if (recaptchaType === RECAPTCHA_ENTERPRISE_ID) {
                        await new Promise((resolve) => {
                            window.grecaptcha.enterprise.ready(async () => {
                                try {
                                    // Render the widget first
                                    widgetIdRef.current = window.grecaptcha.enterprise.render(containerRef.current, {
                                        callback: (token) => {
                                            if (!mounted) return;
                                            setToken(token);
                                            if (resolveRef.current) {
                                                resolveRef.current(token);
                                                resolveRef.current = null;
                                            }
                                        },
                                        sitekey: siteKey,
                                        size: "invisible"
                                    });

                                    resolve();
                                } catch (error) {
                                    console.error("ReCAPTCHA Enterprise: Failed to initialize", error);
                                    throw error;
                                }
                            });
                        });
                    } else {
                        widgetIdRef.current = recaptchaObject.render(containerRef.current, {
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
                    }
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
        if (!widgetReady) {
            return Promise.reject(new Error("ReCAPTCHA not ready"));
        }

        return new Promise((resolve, reject) => {
            resolveRef.current = resolve;
            if (recaptchaType === RECAPTCHA_ENTERPRISE_ID) {
                window.grecaptcha.enterprise.ready(async () => {
                    try {
                        const token = await window.grecaptcha.enterprise.execute(widgetIdRef.current);

                        if (token) {
                            setToken(token);
                            if (resolveRef.current) {
                                resolveRef.current(token);
                                resolveRef.current = null;
                            }
                        }
                    } catch (error) {
                        console.error("ReCAPTCHA Enterprise: Failed to execute", error);
                        reject(error);
                    }
                });
            } else {
                recaptcha.execute(widgetIdRef.current);
            }
        });
    }, [ widgetReady, recaptcha, recaptchaType, siteKey ]);

    const reset = useCallback(() => {
        if (widgetReady) {
            if (recaptchaType === RECAPTCHA_ENTERPRISE_ID) {
                setToken(null);
                resolveRef.current = null;
            } else if (widgetIdRef.current !== null) {
                recaptcha.reset(widgetIdRef.current);
                setToken(null);
                resolveRef.current = null;
            }
        }
    }, [ widgetReady, recaptcha, recaptchaType ]);

    return { containerRef, error, execute, ready: widgetReady, reset, token };
};

export default useReCaptcha;
