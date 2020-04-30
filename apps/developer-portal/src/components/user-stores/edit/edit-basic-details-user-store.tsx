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
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Icon } from "semantic-ui-react";
import { SqlEditor } from "..";
import { patchUserStore, updateUserStore } from "../../../api";
import { AlertLevels, RequiredBinary, TypeProperty, UserStore } from "../../../models";
import { addAlert } from "../../../store/actions";

/**
 * Prop types of `EditBasicDetailsUserStore` component
 */
interface EditBasicDetailsUserStorePropsInterface {
    /**
     * Userstore to be edited
     */
    userStore: UserStore;
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
    /**
     * The connection properties.
     */
    properties: RequiredBinary;
}

/**
 * This renders the edit basic details pane
 * @param {EditBasicDetailsUserStorePropsInterface} props
 * @return {ReactElement}
 */
export const EditBasicDetailsUserStore = (
    props: EditBasicDetailsUserStorePropsInterface
): ReactElement => {

    const { userStore, update, id, properties } = props;

    const [ sql, setSql ] = useState<Map<string, string>>(null);
    const [ showMore, setShowMore ] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (properties) {
            const tempSql = new Map<string, string>();

            properties.optional.sql.delete.forEach(property => {
                tempSql.set(property.name, property.value);
            });

            properties.optional.sql.insert.forEach(property => {
                tempSql.set(property.name, property.value);
            });

            properties.optional.sql.select.forEach(property => {
                tempSql.set(property.name, property.value);
            });

            properties.optional.sql.update.forEach(property => {
                tempSql.set(property.name, property.value);
            });

            setSql(tempSql);
        }
    }, [ properties ]);

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                const data = { ...userStore };
                data.description = values.get("description").toString();
                data.name = values.get("name").toString();
                delete data.typeName;
                delete data.className;

                const requiredData = properties.required.map((property: TypeProperty) => {
                    return {
                        operation: "REPLACE",
                        path: `/properties/${property.name}`,
                        value: values.get(property.name).toString()
                    }
                });

                const optionalNonSqlData = showMore
                    ? properties.optional.nonSql.map((property: TypeProperty) => {
                        return {
                            operation: "REPLACE",
                            path: `/properties/${property.name}`,
                            value: values.get(property.name).toString()
                        }
                    })
                    : null;

                const optionalSqlInsertData = showMore
                    ? properties.optional.sql.insert.map((property: TypeProperty) => {
                        return {
                            operation: "REPLACE",
                            path: `/properties/${property.name}`,
                            value: sql.get(property.name).toString()
                        }
                    })
                    : null;

                const optionalSqlUpdateData = showMore
                    ? properties.optional.sql.update.map((property: TypeProperty) => {
                        return {
                            operation: "REPLACE",
                            path: `/properties/${property.name}`,
                            value: sql.get(property.name).toString()
                        }
                    })
                    : null;

                const optionalSqlDeleteData = showMore
                    ? properties.optional.sql.delete.map((property: TypeProperty) => {
                        return {
                            operation: "REPLACE",
                            path: `/properties/${property.name}`,
                            value: sql.get(property.name).toString()
                        }
                    })
                    : null;

                const optionalSqlSelectData = showMore
                    ? properties.optional.sql.select.map((property: TypeProperty) => {
                        return {
                            operation: "REPLACE",
                            path: `/properties/${property.name}`,
                            value: sql.get(property.name).toString()
                        }
                    })
                    : null;

                const patchData = showMore
                    ? [
                        ...requiredData,
                        ...optionalNonSqlData,
                        ...optionalSqlDeleteData,
                        ...optionalSqlInsertData,
                        ...optionalSqlUpdateData,
                        ...optionalSqlSelectData
                    ]
                    : requiredData;

                updateUserStore(id, data).then(() => {
                    patchUserStore(id, patchData).then(() => {
                        dispatch(addAlert({
                            description: "This userstore has been updated successfully!",
                            level: AlertLevels.SUCCESS,
                            message: "Userstore updated successfully!"
                        }));
                        update();
                    }).catch(error => {
                        dispatch(addAlert({
                            description: error?.description
                                || "An error occurred while updating the userstore.",
                            level: AlertLevels.ERROR,
                            message: error?.message || "Something went wrong"
                        }));
                    });
                }).catch((error) => {
                    dispatch(addAlert({
                        description: error?.description ?? "An error occurred while updating the Userstore",
                        level: AlertLevels.ERROR,
                        message: error?.message ?? "Something went wrong"
                    }));
                });
            } }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <Field
                            label="Name"
                            name="name"
                            type="text"
                            required={ false }
                            requiredErrorMessage="Name is a required field"
                            placeholder="Enter a name"
                            value={ userStore?.name }
                            disabled
                        />
                        <Field
                            label="Type"
                            name="type"
                            type="text"
                            disabled
                            required={ false }
                            requiredErrorMessage="Select a Type"
                            value={ userStore?.typeName }
                        />
                        <Field
                            label="Description"
                            name="description"
                            type="textarea"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a description"
                            value={ userStore?.description }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        {
                            properties?.required?.map((property: TypeProperty, index: number) => {
                                const name = property.description.split("#")[ 0 ];
                                const isPassword = property.attributes
                                    .find(attribute => attribute.name === "type").value === "password";
                                const toggle = property.attributes
                                    .find(attribute => attribute.name === "type")?.value === "boolean";

                                return (
                                    isPassword
                                        ? (
                                            <Field
                                                name={ property.name }
                                                type="password"
                                                key={ index }
                                                required={ true }
                                                label={ name }
                                                requiredErrorMessage={
                                                    `${property.description.split("#")[ 0 ]} is  required`
                                                }
                                                showPassword="Show Password"
                                                hidePassword="Hide Password"
                                            />
                                        )
                                        : toggle
                                            ? (
                                                <Field
                                                    name={ property.name }
                                                    value={ property.value ?? property.defaultValue }
                                                    type="toggle"
                                                    key={ index }
                                                    required={ true }
                                                    label={ property.description.split("#")[ 0 ] }
                                                    requiredErrorMessage={
                                                        `${property.description.split("#")[ 0 ]} is  required`
                                                    }
                                                    toggle
                                                />
                                            ) :
                                            (
                                                <Field
                                                    name={ property.name }
                                                    value={ property.value ?? property.defaultValue }
                                                    type="text"
                                                    key={ index }
                                                    required={ true }
                                                    label={ property.description.split("#")[ 0 ] }
                                                    requiredErrorMessage={
                                                        `${property.description.split("#")[ 0 ]} is  required`
                                                    }
                                                />
                                            )
                                );
                            })
                        }
                    </Grid.Column>
                </Grid.Row>
                {
                    properties?.optional.nonSql.length > 0
                    || properties?.optional.sql.delete.length > 0
                    || properties?.optional.sql.insert.length > 0
                    || properties?.optional.sql.select.length > 0
                    || properties?.optional.sql.update.length > 0
                    &&
                    (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 } textAlign="center">
                                <LinkButton
                                    type="button"
                                    onClick={ () => { setShowMore(!showMore) } }
                                >
                                    <Icon name={ showMore ? "chevron up" : "chevron down" } />
                                    { `Show ${showMore ? "Less" : "More"}` }
                                </LinkButton>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                { showMore && properties.optional.nonSql.length > 0 && (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 8 }>
                                {
                                    properties?.optional?.nonSql.map((property: TypeProperty, index: number) => {
                                        const name = property.description.split("#")[ 0 ];
                                        const isPassword = property.attributes
                                            .find(attribute => attribute.name === "type").value === "password";
                                        const toggle = property.attributes
                                            .find(attribute => attribute.name === "type")?.value === "boolean";

                                        return (
                                            isPassword
                                                ? (
                                                    <Field
                                                        name={ property.name }
                                                        type="password"
                                                        key={ index }
                                                        required={ false }
                                                        label={ name }
                                                        requiredErrorMessage={
                                                            `${property.description.split("#")[ 0 ]} is  required`
                                                        }
                                                        showPassword="Show Password"
                                                        hidePassword="Hide Password"
                                                    />
                                                )
                                                : toggle
                                                    ? (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="toggle"
                                                            key={ index }
                                                            required={ false }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                `${property.description.split("#")[ 0 ]} is  required`
                                                            }
                                                            toggle
                                                        />
                                                    )
                                                    : (
                                                        <Field
                                                            name={ property.name }
                                                            value={ property.value ?? property.defaultValue }
                                                            type="text"
                                                            key={ index }
                                                            required={ false }
                                                            label={ property.description.split("#")[ 0 ] }
                                                            requiredErrorMessage={
                                                                `${property.description.split("#")[ 0 ]} is  required`
                                                            }
                                                        />
                                                    )
                                        );
                                    })
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
                }
                {
                    properties?.optional.sql.delete.length > 0
                    || properties?.optional.sql.insert.length > 0
                    || properties?.optional.sql.select.length > 0
                    || properties?.optional.sql.update.length > 0
                    && (
                        <Grid columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <SqlEditor
                                    onChange={ (name: string, value: string) => {
                                        const tempSql = new Map(sql);
                                        tempSql.set(name, value);
                                    } }
                                    properties={ properties.optional.sql }
                                />
                            </Grid.Column>
                        </Grid>
                    )
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <PrimaryButton>
                            Update
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};
