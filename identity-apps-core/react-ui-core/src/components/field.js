/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";

import ButtonFieldAdapter from "./adapters/button-field-adapter";
import InputFieldAdapter from "./adapters/input-field-adapter";
import TypographyAdapter from "./adapters/typography-field-adapter";
import DividerAdapter from "./divider";

const Field = ({ component, formStateHandler, formErrorHandler }) => {

    switch (component.type) {
        case "TYPOGRAPHY":
            return <TypographyAdapter component={ component } />;
        case "INPUT":
            return (
                <InputFieldAdapter
                    component={ component }
                    formStateHandler={ formStateHandler }
                    formErrorHandler={ formErrorHandler }
                />
            );
        case "BUTTON":
            return <ButtonFieldAdapter component={ component } />;
        case "DIVIDER":
            return <DividerAdapter component={ component } />;
        default:
            return null;
    }
};

export default Field;
