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
import React, { useMemo, useRef } from "react";
import { Message } from "semantic-ui-react";
import CountDownAdapter from "./adapters/count-down-adapter";
import Field from "./field";
import Form from "./form";
import { useTranslations } from "../hooks/use-translations";
import { resolveElementText } from "../utils/i18n-utils";

const DynamicContent = ({ contentData, state, handleFlowRequest, error }) => {
    const recaptchaRef = useRef(null);
    const { translations } = useTranslations();

    const captchaNode = useMemo(() => contentData.components.find(el => el.type === "CAPTCHA"),
        [ contentData.components ]);

    const isCaptchaEnabled = !!(
        contentData.additionalData &&
        contentData.additionalData.captchaEnabled &&
        contentData.additionalData.captchaEnabled === "true"
    );

    const handleFlowExecution = async (actionId, formValues) => {
        let finalValues = { ...formValues };

        if (isCaptchaEnabled && captchaNode && recaptchaRef.current.ready) {
            try {
                const token = await recaptchaRef.current.execute();

                finalValues = { ...finalValues, captchaResponse: token };
            } catch (e) {
                console.error("ReCAPTCHA failed", e);
            }
        }

        return handleFlowRequest(actionId, finalValues);
    };

    const renderForm = (form) => {
        if (!form) return null;

        if (form.components && form.components.length > 0) {
            return (
                <>
                    { error && (
                        <Message negative>
                            <p>{ resolveElementText(translations, error) }</p>
                        </Message>
                    ) }
                    <Form
                        key={ form.id }
                        formSchema={ form.components }
                        onSubmit={ (action, formValues) => handleFlowExecution(action, formValues) }
                        recaptchaRef={ recaptchaRef }
                    />
                </>
            );
        }

        return null;
    };

    const renderElement = (element) => {
        return (
            <Field
                key={ element.id }
                component={ element }
                flowActionHandler={ (action, formValues) => handleFlowExecution(action, formValues) }
                recaptchaRef={ recaptchaRef }
            />
        );
    };

    const renderCountDown = () => {
        return <CountDownAdapter redirection={ state.countDownRedirection } />;
    };

    const renderElements = () => {
        if (!contentData || !contentData.components || contentData.components.length === 0) {
            // If it's the last component, append the countdown timer if applicable.
            if (state && state.countDownRedirection) {
                return renderCountDown();
            }

            return (
                <div className="content-container loading hidden">
                    <div className="spinner"></div>
                </div>
            );
        }

        return contentData.components && contentData.components.map((component, index) => {
            if (component.type === "FORM" && Array.isArray(component.components)) {
                return renderForm(component);
            }

            if (index === contentData.components.length - 1 && state && state.countDownRedirection) {
                return (
                    <>
                        { renderElement(component) }
                        { renderCountDown() }
                    </>
                );
            }

            return renderElement(component);
        });
    };

    return <>{ renderElements() }</>;
};

DynamicContent.propTypes = {
    contentData: PropTypes.object.isRequired,
    error: PropTypes.string,
    handleFlowRequest: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired
};

export default DynamicContent;
