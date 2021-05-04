/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { ReactElement, cloneElement } from "react";
import { Form as FinalForm, FormProps } from "react-final-form";
import { Grid, Form as SemanticForm } from "semantic-ui-react";

export interface FormPropsInterface extends FormProps {
    /**
     * Function to trigger form submit externally.
     */
    triggerSubmit?: any;
}

/**
 * Implementation of the Form component.
 * @param props
 */
export const Form = (props: FormProps): ReactElement => {

    // eslint-disable-next-line prefer-const
    let { triggerSubmit, ...other } = props;
    const { children, onSubmit, ...rest } = other;

    const childNodes = React.Children.toArray(children);

    return (
        <FinalForm
            onSubmit={ (values, form) => {
                onSubmit(values, form);
            } }
            keepDirtyOnReinitialize={ true }
            render={ ({ handleSubmit, form, submitting, pristine, values }) => {

                if (triggerSubmit && typeof triggerSubmit === "function") {
                    triggerSubmit(handleSubmit);
                }

                return (
                    <form
                        onSubmit={ handleSubmit }
                    >
                        <SemanticForm>
                            <Grid className="form-container with-max-width">
                                {
                                    childNodes.map((child: any, index: number) => {
                                        if (!child) {
                                            return null;
                                        }

                                        const parentFormProps = { form, handleSubmit, pristine, submitting, values };
                                        const childFieldProps = child.props;

                                        const childProps = {
                                            childFieldProps,
                                            parentFormProps
                                        };

                                        if (!childProps.childFieldProps.hidden) {
                                            return (
                                                <Grid.Row key={ index }>
                                                    <Grid.Column width={ childProps.childFieldProps.width }>
                                                        { cloneElement(child, childProps) }
                                                    </Grid.Column>
                                                </Grid.Row>
                                            );
                                        }
                                    })
                                }
                            </Grid>
                        </SemanticForm>
                    </form>
                );
            } }
            { ...rest }
        />
    );
};
