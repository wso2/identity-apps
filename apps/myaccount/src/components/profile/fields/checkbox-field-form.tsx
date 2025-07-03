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

import { Field, FormValue, Forms } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid, List } from "semantic-ui-react";
import { CheckBoxFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

const CheckboxFieldForm: FunctionComponent<CheckBoxFieldFormPropsInterface> = ({
    fieldSchema: schema,
    initialValue,
    fieldLabel,
    setIsProfileUpdating,
    handleSubmit,
    isUpdating,
    ["data-componentid"]: testId
}: CheckBoxFieldFormPropsInterface): ReactElement => {

    const onFormSubmit = (values: Map<string, FormValue>): void => {
        setIsProfileUpdating(true);

        const selectedCheckBoxValues: string[] = (values?.get(schema.name) ?? []) as string[];
        const isChecked: boolean = !isEmpty(selectedCheckBoxValues) && selectedCheckBoxValues.includes(schema.name);

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
                            <Forms
                                onSubmit={ onFormSubmit }
                                onChange={ (_: boolean, values: Map<string, FormValue>) => onFormSubmit(values) }
                            >
                                <Grid verticalAlign="middle" textAlign="left">
                                    <Grid.Row columns={ 2 } className="p-0">
                                        <Grid.Column width={ 10 }>
                                            <Field
                                                label=""
                                                name={ schema.name }
                                                data-testid= {
                                                    `${testId}-${schema.name.replace(".", "-")}-checkbox-field` }
                                                data-componentid= {
                                                    `${testId}-${schema.name.replace(".", "-")}-checkbox-field` }
                                                type="checkbox"
                                                value={ String(initialValue) === "true" ? [ schema.name ] : [] }
                                                children={ [
                                                    {
                                                        label: "",
                                                        value: schema.name
                                                    }
                                                ] }
                                                disabled={ isUpdating }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Forms>
                        </List.Description>
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    return (
        <EditSection data-testid={ "profile-schema-editing-section" }>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
                    <Grid.Column width={ 12 }>
                        <Forms onSubmit={ onFormSubmit }>
                            <Grid verticalAlign="middle" textAlign="right">
                                <Grid.Row columns={ 2 } className="p-0">
                                    <Grid.Column width={ 10 }>
                                        <Field
                                            autoFocus={ true }
                                            label=""
                                            name={ schema.name }
                                            data-testid= {
                                                `${testId}-${schema.name.replace(".", "-")}-checkbox-field` }
                                            data-componentid= {
                                                `${testId}-${schema.name.replace(".", "-")}-checkbox-field` }
                                            type="checkbox"
                                            value={ String(initialValue) === "true" ? [ schema.name ] : [] }
                                            children={ [
                                                {
                                                    label: "",
                                                    value: schema.name
                                                }
                                            ] }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Forms>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    );
};

export default CheckboxFieldForm;
