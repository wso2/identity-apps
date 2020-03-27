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
import { UserStore, Type, AlertLevels, UserStoreProperty, TestConnection } from "../../../models";
import { testConnection, patchUserStore } from "../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { Grid } from "semantic-ui-react";
import { Forms, Field, useTrigger, FormValue } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";

/**
 * Type of the property object
 */
interface Property {
    name: string;
    description: string;
    value: string;
}

/**
 * Prop types of `EditConnectionDetails` component
 */
interface EditConnectionDetailsPropsInterface {
    /**
     * User store to be edited
     */
    userStore: UserStore;
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * user store id
     */
    id: string;
    /**
     * The type meta data
     */
    type: Type;
}
const EditConnectionDetails = (
    props: EditConnectionDetailsPropsInterface
): React.ReactElement => {

    const { userStore, update, id, type } = props;

    const [properties, setProperties] = useState<Property[]>([]);

    const dispatch = useDispatch();

    const [submit, setSubmit] = useTrigger();



    useEffect(() => {
        if (type) {
            const mandatory = [];

            for (const property of type.properties.Mandatory) {
                const mandatoryProperty = userStore.properties.find((value: UserStoreProperty) => {
                    return value.name === property.name;
                });

                if (mandatoryProperty) {
                    const tempProperty = { ...mandatoryProperty, description: property.description }
                    mandatory.push(tempProperty);
                } else {
                    mandatory.push({
                        name: property.name,
                        description: property.description,
                        value: property.defaultValue
                    });
                }
            }
            setProperties(mandatory);
        }
    }, [type]);

    const isBoolean = (value: string): boolean => {
        return value === "true" || value === "false" || value === "True" || value === "False";
    }

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <Forms
                        submitState={ submit }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            
                            const data = properties.map((property: Property) => {
                                return {
                                    operation: "REPLACE",
                                    value: values.get(property.name).toString(),
                                    path:`/properties/${property.name}`
                                }
                            });

                            if (type.typeId === "SkRCQ1VzZXJTdG9yZU1hbmFnZXI") {
                                const testData: TestConnection = {
                                    driverName: values.get("driverName").toString(),
                                    connectionURL: values.get("url").toString(),
                                    username: values.get("userName").toString(),
                                    connectionPassword: values.get("password").toString()
                                };
                                testConnection(testData).then(() => {
                                    patchUserStore(id, data).then(() => {
                                        dispatch(addAlert({
                                            message: "User Store updated successfully!",
                                            description: "This user store has been updated successfully!",
                                            level: AlertLevels.SUCCESS
                                        }));
                                        update();
                                    }).catch(error => {
                                        dispatch(addAlert({
                                            message: error?.message || "Something went wrong",
                                            description: error?.description
                                                || "An error occurred while updating the user store.",
                                            level: AlertLevels.ERROR
                                        }));
                                    })
                                }).catch((error) => {
                                    dispatch(addAlert({
                                        message: error?.message || "Something went wrong",
                                        description: error?.description
                                            || "An error occurred while testing the connection to the user store",
                                        level: AlertLevels.ERROR
                                    }));
                                })
                            }
                            
                        } }
                    >
                        {
                            properties?.map((property: Property, index: number) => {
                                const isPassword = property.name === "password";
                                if (isPassword) {
                                    return (
                                        <Field
                                            name={ property.name }
                                            type="password"
                                            key={ index }
                                            required={ true }
                                            label={ property.description.split("#")[0] }
                                            requiredErrorMessage={
                                                `${property.description.split("#")[0]} is  required`
                                            }
                                            showPassword="Show Password"
                                            hidePassword="Hide Password"
                                        />
                                    )
                                } else if (isBoolean(property.value)) {
                                    return (
                                        <Field
                                            name={ property.name }
                                            value={ property.value }
                                            type="toggle"
                                            key={ index }
                                            required={ true }
                                            label={ property.description.split("#")[0] }
                                            requiredErrorMessage={
                                                `${property.description.split("#")[0]} is  required`
                                            }
                                        />
                                    );
                                } else {
                                    return (
                                        <Field
                                            name={ property.name }
                                            value={ property.value }
                                            type="text"
                                            key={ index }
                                            required={ true }
                                            label={ property.description.split("#")[0] }
                                            requiredErrorMessage={
                                                `${property.description.split("#")[0]} is  required`
                                            }
                                        />
                                    );
                                }

                            })
                        }
                    </Forms>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <PrimaryButton onClick={ ()=>{setSubmit()} }>
                        Update
                    </PrimaryButton>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

export const MemoEditConnectionDetails = React.memo(EditConnectionDetails);
