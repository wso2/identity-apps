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

import { FormValue } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid, List } from "semantic-ui-react";
import {
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    FormState,
    SwitchFieldAdapter
} from "../../../../../../modules/form/src";
import { SwitchFieldFormPropsInterface } from "../../../models/profile-ui";

const SwitchFieldForm: FunctionComponent<SwitchFieldFormPropsInterface> = ({
    fieldSchema: schema,
    initialValue,
    fieldLabel,
    isEditable,
    setIsProfileUpdating,
    handleSubmit,
    isUpdating,
    ["data-componentid"]: componentId
}: SwitchFieldFormPropsInterface): ReactElement => {

    const onFormSubmit = (values: Record<string, boolean>): void => {
        setIsProfileUpdating(true);

        const isChecked: boolean = values[schema.name] ?? false;

        handleSubmit(schema.name, isChecked as unknown as FormValue);
    };

    return (
        <Grid padded={ true }>
            <Grid.Row columns={ 3 }>
                <Grid.Column mobile={ 6 } computer={ 4 } className="first-column">
                    <List.Content className="vertical-align-center">{ fieldLabel }</List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 8 } computer={ 10 }>
                    <List.Content>
                        <List.Description className="with-max-length">
                            <FinalForm
                                onSubmit={ onFormSubmit }
                                render={ ({ handleSubmit }: FormRenderProps) => {
                                    return (
                                        <form onSubmit={ handleSubmit }>
                                            <FinalFormField
                                                component={ SwitchFieldAdapter }
                                                initialValue={ initialValue ?? false }
                                                name={ schema.name }
                                                readOnly={ !isEditable || isUpdating }
                                                disabled={ !isEditable || isUpdating }
                                                data-testid= {
                                                    `${componentId}-${schema.name.replace(".", "-")}-switch-field` }
                                                data-componentid= {
                                                    `${componentId}-${schema.name.replace(".", "-")}-switch-field` }
                                            />
                                            <FormSpy
                                                subscription={ { dirty: true, values: true } }
                                                onChange={ ({ values, dirty }: FormState<Record<string, boolean>>) => {
                                                    if (dirty) {
                                                        handleSubmit(values);
                                                    }
                                                } }
                                            />
                                        </form>
                                    );
                                } }
                            />
                        </List.Description>
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default SwitchFieldForm;
