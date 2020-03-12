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
import { Modal, Message } from "semantic-ui-react";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { Forms, Field, FormValue, useTrigger } from "@wso2is/forms";
import { getTypes, getAType, testConnection } from "../../api";
import { TypeResponse, AlertLevels, Type, TypeProperty, TestConnection } from "../../models";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";

interface AddEditUserStoreProps {
    open: boolean;
    onClose: () => void;

}
export const AddEditUserStore = (props: AddEditUserStoreProps): React.ReactElement => {

    const { open, onClose } = props;

    const [types, setTypes] = useState<TypeResponse[]>(null);
    const [selectedType, setSelectedType] = useState<string>(null);
    const [selectedTypeDetails, setSelectedTypeDetails] = useState<Type[]>(null);
    const [connectionFailed, setConnectionFailed] = useState(false);

    const dispatch = useDispatch();

    const [submit, setSubmit] = useTrigger();

    useEffect(() => {
        getTypes().then((response) => {
            setTypes(response);
        }).catch((error) => {
            dispatch(addAlert({
                description: error?.description,
                level: AlertLevels.ERROR,
                message: error?.message || "Something went wrong"
            }))
        })
    }, []);

    useEffect(() => {
        if (selectedType !== null) {
            getAType(selectedType, null).then(response => {
                setSelectedTypeDetails(response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description,
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }))
            })
        }
    }, [selectedType]);

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="tiny"
            scrolling
        >
            <Modal.Header>
                Add a User Store
            </Modal.Header>
            <Modal.Content>
                <Forms
                    onSubmit={
                        (values: Map<string, FormValue>) => {
                            if (values.get("type").toString() === "SkRCQ1VzZXJTdG9yZU1hbmFnZXI") {
                                const testData: TestConnection = {
                                    driverName: values.get("driverName").toString(),
                                    connectionURL: values.get("url").toString(),
                                    username: values.get("userName").toString(),
                                    connectionPassword: values.get("password").toString()
                                };
                                testConnection(testData).then(() => {
                                    alert("Connection usccess!");
                                }).catch(() => {
                                    setConnectionFailed(true);
                                })
                            }
                        }
                    }
                    submitState={ submit }
                >
                    <Field
                        label="Name"
                        name="name"
                        type="text"
                        required={ true }
                        requiredErrorMessage="Name is a required field"
                        placeholder="Enter a name"
                    />
                    <Field
                        label="Description"
                        name="description"
                        type="textarea"
                        required={ false }
                        requiredErrorMessage=""
                        placeholder="Enter a description"
                    />
                    <Field
                        search={ true }
                        label="Type"
                        name="type"
                        type="dropdown"
                        required={ true }
                        requiredErrorMessage="Select a Type"
                        children={
                            types?.map(type => {
                                return {
                                    text: type.typeName,
                                    key: type.typeId,
                                    value: type.typeId
                                }
                            })
                        }
                        listen={ (values: Map<string, FormValue>) => {
                            setSelectedType(values.get("type").toString());
                        } }
                    />
                    {
                        selectedTypeDetails && selectedTypeDetails[0]?.properties?.Mandatory?.map(
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
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ () => {
                        onClose();
                    } }
                >
                    Cancel
                </LinkButton>
                <PrimaryButton
                    onClick={ () => {
                        setSubmit();
                    } }
                >
                    Save
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
}
