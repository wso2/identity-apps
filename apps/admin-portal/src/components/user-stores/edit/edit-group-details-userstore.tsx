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

import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { EditSection, LinkButton, PrimaryButton, Section } from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, List } from "semantic-ui-react";
import { patchUserStore } from "../../../api";
import { SettingsSectionIcons } from "../../../configs";
import { AlertLevels, RequiredBinary, TypeProperty, UserstoreType } from "../../../models";

/**
 * Prop types of `EditGroupDetails` component
 */
interface EditGroupDetailsPropsInterface {
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
    /**
     * The type meta data
     */
    type: UserstoreType;
    /**
     * The connection properties.
     */
    properties: RequiredBinary;
}
export const EditGroupDetails = (
    props: EditGroupDetailsPropsInterface
): ReactElement => {

    const { update, id, properties } = props;

    const [ showMore, setShowMore ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);

    const dispatch = useDispatch();

    const requiredProperties = (): ReactElement => (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                const data = properties.required.map((property: TypeProperty) => {
                    return {
                        operation: "REPLACE",
                        path: `/properties/${property.name}`,
                        value: values.get(property.name).toString()
                    }
                });

                patchUserStore(id, data).then(() => {
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
            } }
        >
            <Grid padded={ true }>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        {
                            properties?.required?.map((property: TypeProperty, index: number) => {
                                const name = property.description.split("#")[ 0 ];
                                const isPassword = property.attributes
                                    .find(attribute => attribute.name === "type").value === "password";
                                const toggle = property.attributes
                                    .find(attribute => attribute.name === "type")?.value === "boolean";
                                const master = property.name === "ReadGroups";

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
                                            ? master ? (
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
                                                    listen={ (values: Map<string, FormValue>) => {
                                                        setDisabled(
                                                            values.get(property.name)
                                                                .toString() === "false"
                                                        )
                                                    } }
                                                    toggle
                                                />
                                            ) : (
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
                                                        disabled={ disabled }
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
                                                    disabled={ disabled }
                                                />
                                            )
                                );
                            })
                        }

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <PrimaryButton type="submit">
                            Update
                    </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );

    const optionalProperties = (): ReactElement => (
        <EditSection>
            <Forms
                onSubmit={ (values: Map<string, FormValue>) => {

                    const data = properties.optional.map((property: TypeProperty) => {
                        return {
                            operation: "REPLACE",
                            path: `/properties/${property.name}`,
                            value: values.get(property.name).toString()
                        }
                    });

                    patchUserStore(id, data).then(() => {
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
                } }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            {
                                properties?.optional?.map((property: TypeProperty, index: number) => {
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
                                                        disabled={ disabled }
                                                        toggle
                                                    />
                                                ) :
                                                (
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
                                                        disabled={ disabled }
                                                    />
                                                )
                                    );
                                })
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <PrimaryButton type="submit">
                                Update
                            </PrimaryButton>
                            <LinkButton type="button" onClick={ () => setShowMore(false) }>
                                Close
                            </LinkButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>

        </EditSection>
    );

    return (
        <Grid columns={ 1 }>
            <Grid.Column width={ 10 }>
                <Section
                    description={ "Edit the group details of the userstore." }
                    header={ "Group Details" }
                    iconMini={ SettingsSectionIcons.profileExportMini }
                    iconSize="auto"
                    iconStyle="colored"
                    iconFloated="right"
                    onPrimaryActionClick={ () => setShowMore(true) }
                    primaryAction={ "More" }
                    primaryActionIcon="key"
                    showActionBar={ !showMore && !disabled }
                >
                    <List verticalAlign="middle" className="main-content-inner">
                        <List.Item className="inner-list-item">
                            { requiredProperties() }
                            { showMore && properties.optional.length > 0 && optionalProperties() }
                        </List.Item>
                    </List>
                </Section>
            </Grid.Column>
        </Grid>
    )
};
