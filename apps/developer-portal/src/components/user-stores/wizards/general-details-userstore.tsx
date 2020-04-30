/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { ReactElement, useState } from "react";
import { Button, Divider, Grid, Header, Icon } from "semantic-ui-react";
import { testConnection } from "../../../api";
import { JDBC } from "../../../constants";
import { TestConnection, TypeProperty, UserstoreType } from "../../../models";

/**
 * Prop types of the `GeneralDetails` component 
 */
interface GeneralDetailsUserstorePropsInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Submits values
     */
    onSubmit: (values: Map<string, FormValue>) => void;
    /**
     * The saved values
     */
    values: Map<string, FormValue>;
    /**
     * The type of the userstore chosen by the user
     */
    type: UserstoreType;
    /**
     * Connection properties.
     */
    connectionProperties: TypeProperty[];
    /**
     * Basic properties.
     */
    basicProperties: TypeProperty[];
}

/**
 * This component renders the General Details step of the wizard
 * @param {GeneralDetailsUserstorePropsInterface} props
 * @returns {Promise<any>}
 */
export const GeneralDetailsUserstore = (
    props: GeneralDetailsUserstorePropsInterface
): ReactElement => {

    const { submitState, onSubmit, values, type, connectionProperties, basicProperties } = props;

    const [ connectionFailed, setConnectionFailed ] = useState(false);
    const [ connectionSuccessful, setConnectionSuccessful ] = useState(false);
    const [ formValue, setFormValue ] = useState<Map<string, FormValue>>(null);
    const [ isTesting, setIsTesting ] = useState(false);

    /**
     * Enum containing the icons a test connection button can have 
     */
    enum TestButtonIcon {
        TESTING = "spinner",
        FAILED = "remove",
        SUCCESSFUL = "check",
        INITIAL = "bolt"
    }

    /**
     * This returns of the icon for the test button.
     * 
     * @returns {TestButtonIcon} The icon of the test button.
     */
    const findTestButtonIcon = (): TestButtonIcon => {
        if (isTesting) {
            return TestButtonIcon.TESTING
        } else if (connectionSuccessful) {
            return TestButtonIcon.SUCCESSFUL
        } else if (connectionFailed) {
            return TestButtonIcon.FAILED
        } else {
            return TestButtonIcon.INITIAL
        }
    };

    /**
     * Enum containing the colors the test button can have
     */
    enum TestButtonColor {
        TESTING,
        INITIAL,
        SUCCESSFUL,
        FAILED
    }

    /**
     * This finds the right color for the test button
     * 
     * @return {TestButtonColor} The color of the test button.
     */
    const findTestButtonColor = (): TestButtonColor => {
        if (isTesting) {
            return TestButtonColor.TESTING
        } else if (connectionSuccessful) {
            return TestButtonColor.SUCCESSFUL
        } else if (connectionFailed) {
            return TestButtonColor.FAILED
        } else {
            return TestButtonColor.INITIAL
        }
    }

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            onSubmit(values);
                        } }
                        submitState={ submitState }
                        onChange={ (isPure, values) => {
                            setFormValue(values);
                        } }
                    >
                        <Field
                            label="Name"
                            name="name"
                            type="text"
                            required={ true }
                            requiredErrorMessage="Name is a required field"
                            placeholder="Enter a name"
                            value={ values?.get("name")?.toString() }
                        />
                        <Field
                            label="Description"
                            name="description"
                            type="text"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a description"
                            value={ values?.get("description")?.toString() }
                        />
                        {
                            basicProperties?.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const name = selectedTypeDetail.description.split("#")[ 0 ];
                                    const isPassword = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type").value === "password";
                                    const toggle = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
                                    return (
                                        isPassword
                                            ? (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    type="password"
                                                    required={ true }
                                                    requiredErrorMessage={ name + " is a required field" }
                                                    placeholder={ "Enter a " + name }
                                                    showPassword="Show Password"
                                                    hidePassword='Hide Password'
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                />
                                            )
                                            : toggle
                                                ? (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="toggle"
                                                        required={ false }
                                                        requiredErrorMessage={ name + " is a required field" }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        toggle
                                                    />
                                                ) :
                                                (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="text"
                                                        required={ true }
                                                        requiredErrorMessage={ name + " is a required field" }
                                                        placeholder={ "Enter a " + name }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                    />
                                                )
                                    );
                                })
                        }
                        <Divider hidden/>
                        {
                            connectionProperties?.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const name = selectedTypeDetail.description.split("#")[ 0 ];
                                    const isPassword = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type").value === "password";
                                    const toggle = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
                                    return (
                                        isPassword
                                            ? (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    type="password"
                                                    required={ true }
                                                    requiredErrorMessage={ name + " is a required field" }
                                                    placeholder={ "Enter a " + name }
                                                    showPassword="Show Password"
                                                    hidePassword='Hide Password'
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                />
                                            )
                                            : toggle
                                                ? (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="toggle"
                                                        required={ false }
                                                        requiredErrorMessage={ name + " is a required field" }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        toggle
                                                    />
                                                ) :
                                                (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="text"
                                                        required={ true }
                                                        requiredErrorMessage={ name + " is a required field" }
                                                        placeholder={ "Enter a " + name }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                    />

                                                )
                                    );
                                })
                        }
                    </Forms>
                    <Divider hidden />
                    {
                        type?.typeName.includes(JDBC) && (
                            <Button
                                className="test-button"
                                basic
                                onClick={
                                    () => {
                                        setIsTesting(true);
                                        const testData: TestConnection = {
                                            connectionPassword: formValue?.get("password").toString(),
                                            connectionURL: formValue?.get("url").toString(),
                                            driverName: formValue?.get("driverName").toString(),
                                            username: formValue?.get("userName").toString()
                                        };
                                        testConnection(testData).then(() => {
                                            setIsTesting(false);
                                            setConnectionFailed(false);
                                            setConnectionSuccessful(true);
                                        }).catch(() => {
                                            setIsTesting(false);
                                            setConnectionSuccessful(false);
                                            setConnectionFailed(true);
                                        })
                                    }
                                }
                                color={
                                    findTestButtonColor() === TestButtonColor.SUCCESSFUL
                                        ? "green"
                                        : findTestButtonColor() === TestButtonColor.FAILED
                                            ? "red"
                                            : null
                                }
                            >
                                <Icon
                                    size="small"
                                    loading={ isTesting }
                                    name={ findTestButtonIcon() }
                                    color={
                                        findTestButtonColor() === TestButtonColor.SUCCESSFUL
                                            ? "green"
                                            : findTestButtonColor() === TestButtonColor.FAILED
                                                ? "red"
                                                : null
                                    }
                                />
                                Test Connection
                            </Button>
                        )
                    }
                    { connectionFailed
                        && (
                            <Header as="h6" color="red">
                                Please ensure the provided connection URL, name, password and driver
                                name are accurate
                            </Header>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
