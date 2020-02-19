/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, FormValue } from "@wso2is/forms";
import { ContentLoader, DangerZone, DangerZoneGroup, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid, Icon } from "semantic-ui-react";
import { deleteApplication, updateApplicationDetails } from "../../api";
import { GlobalConfig } from "../../configs";
import { history } from "../../helpers";
import { ApplicationInterface } from "../../models";

/**
 * Proptypes for the applications general details component.
 */
interface GeneralSettingsProps {
    accessUrl?: string;
    appId?: string;
    description?: string;
    discoverability?: boolean;
    imageUrl?: string;
    isLoading?: boolean;
    name: string;
}

/**
 * Component to edit general details of the application.
 *
 * @param props GeneralSettingsProps.
 */
export const GeneralDetailsApplication: FunctionComponent<GeneralSettingsProps> = (props): JSX.Element => {

    const {
        appId,
        name,
        description,
        discoverability,
        imageUrl,
        accessUrl,
        isLoading
    } = props;

    const [ isDiscoverable, setDiscoverability ] = useState<boolean>(discoverability);
    const dispatch = useDispatch();

    const handleApplicationDelete = () => {
        deleteApplication(appId)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully deleted the application",
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                history.push("/applications");
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Delete Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting the application",
                    level: AlertLevels.ERROR,
                    message: "Application Delete Error"
                }));
            });
    };

    const handleFormSubmit = (values: Map<string, FormValue>) => {
        const editingApplication: ApplicationInterface = {
            accessUrl: values.get("accessUrl").toString(),
            advancedConfigurations: {
                discoverableByEndUsers: !!values.get("discoverableByEndUsers").includes("discoverable"),
            },
            description: values.get("description").toString(),
            id: appId,
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString(),
        };

        updateApplicationDetails(editingApplication)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    const handleFormValuesOnChange = (isPure: boolean, values: Map<string, FormValue>) => {
        // Set the discoverability based on the checkbox toggle.
        if (values.get("discoverableByEndUsers").includes("discoverable") !== isDiscoverable) {
            setDiscoverability(!!values.get("discoverableByEndUsers").includes("discoverable"));
        }
    };

    return (
        <>
            {
                !isLoading
                    ? (
                        <>
                            <Forms
                                onSubmit={ handleFormSubmit }
                                onChange={ handleFormValuesOnChange }
                            >
                                <Grid>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                            <Field
                                                name="name"
                                                label="Application Name"
                                                required={ true }
                                                requiredErrorMessage="Application name is required"
                                                placeholder={ name }
                                                type="text"
                                                value={ name }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                            <Field
                                                name="description"
                                                label="Description"
                                                required={ false }
                                                requiredErrorMessage=""
                                                placeholder="Enter a description for the application"
                                                type="textarea"
                                                value={ description }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                            <Field
                                                name="imageUrl"
                                                label="Application Image"
                                                required={ false }
                                                requiredErrorMessage=""
                                                placeholder="Enter a image url for the application"
                                                type="text"
                                                value={ imageUrl }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                            <Field
                                                name="discoverableByEndUsers"
                                                required={ false }
                                                requiredErrorMessage=""
                                                type="checkbox"
                                                children={ [
                                                    {
                                                        label: "Discoverable application",
                                                        value: "discoverable"
                                                    }
                                                ] }
                                                value={ isDiscoverable ? [ "discoverable" ] : [] }
                                            />
                                            <Field
                                                name="accessUrl"
                                                label="Access URL"
                                                required={ isDiscoverable }
                                                requiredErrorMessage={ "A valid access URL needs to be defined for" +
                                                " an application to be marked as discoverable" }
                                                placeholder="Enter access url for the application login page"
                                                type="text"
                                                value={ accessUrl }
                                            />
                                            <Hint>
                                                Applications flagged as discoverable are visible for end users.
                                            </Hint>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                            <Button primary type="submit" size="small" className="form-button">
                                                Update
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Forms>
                            { !(GlobalConfig.doNotDeleteApplications.includes(name)) &&
                            (
                                <DangerZoneGroup sectionHeader="Danger Zone">
                                    <DangerZone
                                        actionTitle="Delete application"
                                        header="Delete the application"
                                        subheader="This action is irreversible. Please proceed with caution."
                                        onActionClick={ handleApplicationDelete }
                                    />
                                </DangerZoneGroup>
                            )
                            }
                        </>
                    )
                    : <ContentLoader />
            }
        </>
    );
};
