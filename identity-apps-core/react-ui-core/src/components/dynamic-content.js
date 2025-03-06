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
import Field from "./field";
import Form from "./form";

const DynamicContent = ({ elements, handleRequestBody }) => {

    const renderForm = (form) => {
        if (!form) return null;

        if (form.components && form.components.length > 0) {
            return (
                <Form
                    key={ form.id }
                    formSchema={ form.components }
                    onSubmit={ (action, formValues) => handleRequestBody(action, formValues) }
                />
            );
        }

        return null;
    };

    const renderElement = (element) => {
        return <Field key={ element.id } component={ element } />;
    };

    const renderElements = () => {
        return elements.map((element) => {
            if (element.type === "FORM" && Array.isArray(element.components)) {
                return renderForm(element);
            }

            return renderElement(element);
        });
    };

    return <>{ renderElements() }</>;
};

DynamicContent.propTypes = {
    elements: PropTypes.array.isRequired,
    handleRequestBody: PropTypes.func.isRequired
};

export default DynamicContent;
