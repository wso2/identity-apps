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
import React from "react";

import ButtonFieldAdapter from "./adapters/button-field-adapter";
import CaptchaWidgetAdapter from "./adapters/captcha-widget-adapter";
import ImageFieldAdapter from "./adapters/image-field-adapter";
import InputFieldAdapter from "./adapters/input-field-adapter";
import RichTextAdapter from "./adapters/rich-text-field-adapter";
import TypographyAdapter from "./adapters/typography-field-adapter";
import DividerAdapter from "./divider";

const Field = ({
    component,
    formState,
    formStateHandler,
    formFieldError,
    flowActionHandler,
    recaptchaRef
}) => {

    switch (component.type) {
        case "TYPOGRAPHY":
            return <TypographyAdapter component={ component } />;
        case "RICH_TEXT":
            return <RichTextAdapter component={ component } />;
        case "INPUT":
            return (
                <InputFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    formFieldError={ formFieldError }
                />
            );
        case "BUTTON":
            return <ButtonFieldAdapter component={ component } handleButtonAction={ flowActionHandler } />;
        case "DIVIDER":
            return <DividerAdapter component={ component } />;
        case "CAPTCHA":
            return <CaptchaWidgetAdapter component={ component } ref={ recaptchaRef } />;
        case "IMAGE":
            return <ImageFieldAdapter component={ component } />;
        default:
            return (
                <InputFieldAdapter
                    component={ component }
                    formState={ formState }
                    formStateHandler={ formStateHandler }
                    formFieldError={ formFieldError }
                />
            );
    }
};

Field.propTypes = {
    component: PropTypes.object.isRequired,
    flowActionHandler: PropTypes.func,
    formFieldError: PropTypes.func,
    formState: PropTypes.object,
    formStateHandler: PropTypes.func,
    recaptchaRef: PropTypes.object,
    setRecaptchaRef: PropTypes.func
};

export default Field;
