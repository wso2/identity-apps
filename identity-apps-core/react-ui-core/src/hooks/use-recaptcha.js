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
    DEFAULT_RECAPTCHA_SCRIPT_URL_PARAMS
} from "../constants/captcha-constants";
import { loadCaptchaApi } from "../utils/captcha-utils";

const useReCaptcha = (siteKey = "", reCaptchaScriptUrl) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const [ ready, setReady ] = useState(false);
    const [ token, setToken ] = useState(null);
    const reCaptchaUrl = reCaptchaScriptUrl + DEFAULT_RECAPTCHA_SCRIPT_URL_PARAMS || DEFAULT_RECAPTCHA_SCRIPT_URL;

    useEffect(() => {
        let mounted = true;

        if (!siteKey) {
            return;
        }

        loadCaptchaApi(reCaptchaUrl).then((grecaptcha) => {
            if (!mounted || !containerRef.current) return;

            widgetIdRef.current = grecaptcha.render(containerRef.current, {
                sitekey: siteKey,
                size: "invisible",
                callback: (recaptchaToken) => {
                    setToken(recaptchaToken);
                }
            });

            setReady(true);
        });

        return () => {
            mounted = false;
        };
    }, [ siteKey ]);

    const execute = useCallback(() => {
        if (ready && widgetIdRef.current !== null) {
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
    }, [ ready, token ]);

    const reset = useCallback(() => {
        if (ready && widgetIdRef.current !== null) {
            window.grecaptcha.reset(widgetIdRef.current);
            setToken(null);
        }
    }, [ ready ]);

    return { execute, reset, containerRef, ready, token };
};

export default useReCaptcha;
