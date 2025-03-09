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
import { FormField, Form as SemanticForm } from "semantic-ui-react";
import Field from "./field";
import useDynamicForm from "../hooks/use-dynamic-form";

const Form = ({ formSchema, onSubmit }) => {
    const {
        formState,
        handleChange,
        handleFieldError,
        handleSubmit
    } = useDynamicForm(formSchema);

    return (
        <div className="segment-form">
            <SemanticForm noValidate onSubmit={ (event) => handleSubmit(onSubmit)(event) } size="large">
                {
                    formSchema.map((field, index) => (
                        <FormField key={ index } required={ field.config.required }>
                            <Field
                                component={ field }
                                formState={ formState }
                                formStateHandler={ handleChange }
                                formFieldError={ handleFieldError }
                            />
                        </FormField>
                    ))
                }
            </SemanticForm>
        </div>
    );
};

Form.propTypes = {
    formSchema: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default Form;
