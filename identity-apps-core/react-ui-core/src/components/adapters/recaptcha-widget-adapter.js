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

import PropTypes from "prop-types";
import React, { forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import useReCaptcha from "../../hooks/use-recaptcha";

const RecaptchaAdapter = ({ component }, ref) => {
    const { containerRef, ready, execute, reset, token } = useReCaptcha(
        component.config.recaptchaType,
        component.config.captchaKey,
        component.config.captchaURL
    );

    useImperativeHandle(
        ref,
        () => ({
            execute,
            reset,
            ready,
            token
        }),
        [ execute, reset, ready, token ]
    );

    return (
        createPortal(
            <div
                ref={ containerRef }
                className="g-recaptcha"
                data-sitekey={ component.config.captchaKey }
                data-componentid="registeration-page-g-recaptcha"
                data-theme="light"
                data-tabindex="-1"
                data-size="invisible"
                data-callback="onRecaptcha"
            />,
            document.body
        )
    );
};

RecaptchaAdapter.propTypes = {
    component: PropTypes.shape({
        config: PropTypes.shape({
            captchaKey: PropTypes.string.isRequired,
            captchaURL: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default forwardRef(RecaptchaAdapter);
