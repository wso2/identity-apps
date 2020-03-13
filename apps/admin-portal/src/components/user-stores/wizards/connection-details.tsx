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

import React, { useEffect, useState } from "react";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { TypeProperty, Type, AlertLevels, TestConnection } from "../../../models";
import { Grid, Message } from "semantic-ui-react";
import { getAType, testConnection } from "../../../api";
import { addAlert } from "@wso2is/core/store";
import { useDispatch } from "react-redux";

interface ConnectionDetailsPropsInterface {
    submitState: boolean;
    onSubmit: (values: Map<string, FormValue>) => void;
    values: Map<string, FormValue>;
    typeId: string;
}
export const ConnectionDetails = (
    props: ConnectionDetailsPropsInterface
): React.ReactElement => {

    const { submitState, onSubmit, values, typeId } = props;

    const [type, setType] = useState<Type>(null);
    const [connectionFailed, setConnectionFailed] = useState(false);
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
    }, [typeId]);
    
    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            if (values.get("type").toString() === "SkRCQ1VzZXJTdG9yZU1hbmFnZXI") {
                                const testData: TestConnection = {
                                    driverName: values.get("driverName").toString(),
                                    connectionURL: values.get("url").toString(),
                                    username: values.get("userName").toString(),
                                    connectionPassword: values.get("password").toString()
                                };
                                testConnection(testData).then(() => {
                                    onSubmit(values);
                                }).catch(() => {
                                    setConnectionFailed(true);
                                })
                            }
                        } }
                        submitState={ submitState }
                    >
                    {
                        type?.properties?.Mandatory?.map(
                            (selectedTypeDetail: TypeProperty, index: number) => {
                                const name = selectedTypeDetail.description.split("#")[0];
                                const isPassword = selectedTypeDetail.name === "password";
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
                                                value={ values?.get(selectedTypeDetail?.name)?.toString() }
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
                                                value={ values?.get(selectedTypeDetail?.name)?.toString() }
                                            />
                                        )
                                );
                            })
                        }
                    </Forms>
                    {connectionFailed
                        ? (
                            <Message negative>
                                <Message.Header>
                                    Connection failed!
                            </Message.Header>
                                <Message.Content>
                                    Please ensure the provided connection URL, name, password and driver name are accurate
                            </Message.Content>
                            </Message>
                        )
                        : null
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
