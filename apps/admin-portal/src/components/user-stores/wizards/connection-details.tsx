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

import { AlertLevels, TestConnection, Type, TypeProperty } from "../../../models";
import { Divider, Grid, Message } from "semantic-ui-react";
import { Field, Forms, FormValue } from "@wso2is/forms";
import { getAType, testConnection } from "../../../api";
import React, { useEffect, useState } from "react";

import { addAlert } from "@wso2is/core/store";
import { JDBC_ID } from "../../../constants";
import { PrimaryButton } from "@wso2is/react-components";
import { useDispatch } from "react-redux";

/**
 * Prop types of the `ConnectionDetails` component 
 */
interface ConnectionDetailsPropsInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Submits values
     */
    onSubmit: (values: Map<string, FormValue>, type: Type) => void;
    /**
     * The saved values
     */
    values: Map<string, FormValue>;
    /**
     * The type ID chosen by the user
     */
    typeId: string;
}

/**
 * This component renders the Connection Details step of the wizard
 * @param {ConnectionDetailsPropsInterface} props
 * @return {Promise<any>}
 */
export const ConnectionDetails = (
    props: ConnectionDetailsPropsInterface
): React.ReactElement => {

    const { submitState, onSubmit, values, typeId } = props;

    const [ type, setType ] = useState<Type>(null);
    const [ connectionFailed, setConnectionFailed ] = useState(false);
    const [ connectionSuccessful, setConnectionSuccessful ] = useState(false);
    const [ formValue, setFormValue ] = useState<Map<string, FormValue>>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (typeId !== null) {
            getAType(typeId, null).then(response => {
                setType(response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description,
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }))
            })
        }
    }, [ typeId ]);

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            onSubmit(values, type);
                        } }
                        submitState={ submitState }
                        onChange={ (isPure, values) => {
                            setFormValue(values);
                        } }
                    >
                        {
                            type?.properties?.Mandatory?.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const name = selectedTypeDetail.description.split("#")[ 0 ];
                                    const isPassword = selectedTypeDetail.name
                                        .toLocaleLowerCase()
                                        .includes("password");
                                    return (
                                        !isPassword
                                            ? (
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
                                            : (
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
                                    );
                                })
                        }
                    </Forms>
                    <Divider hidden />
                    {
                        type?.typeId === JDBC_ID && (
                            <PrimaryButton
                                onClick={
                                    () => {
                                        const testData: TestConnection = {
                                            connectionPassword: formValue?.get("password").toString(),
                                            connectionURL: formValue?.get("url").toString(),
                                            driverName: formValue?.get("driverName").toString(),
                                            username: formValue?.get("userName").toString()
                                        };
                                        testConnection(testData).then(() => {
                                            setConnectionFailed(false);
                                            setConnectionSuccessful(true);
                                        }).catch(() => {
                                            setConnectionSuccessful(false);
                                            setConnectionFailed(true);
                                        })
                                    }
                                }
                            >
                                Test Connection
                            </PrimaryButton>
                        )
                    }
                    { connectionFailed
                        ? (
                            <Message negative>
                                <Message.Header>
                                    Connection failed!
                            </Message.Header>
                                <Message.Content>
                                    Please ensure the provided connection URL, name, password and driver
                                    name are accurate
                            </Message.Content>
                            </Message>
                        )
                        : connectionSuccessful && (
                            <Message positive>
                                <Message.Header>
                                    Connection Successful!
                            </Message.Header>
                                <Message.Content>
                                    The connection is healthy.
                            </Message.Content>
                            </Message>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
