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
import { Field, Forms } from "@wso2is/forms";
import { DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { deleteApplication, updateApplicationDetails } from "../../api";
import { history } from "../../helpers";
import { ApplicationInterface } from "../../models";

interface GeneralSettingsProps {
    appId?: string;
    name: string;
    description?: string;
    imageUrl?: string;
    accessUrl?: string;
}

/**
 * Component to edit general details of the application.
 *
 * @param props GeneralSettingsProps.
 */
export const GeneralDetailsApplication: FunctionComponent<GeneralSettingsProps> = (props): JSX.Element => {

    const dispatch = useDispatch();

    const {
        appId,
        name,
        description,
        imageUrl,
        accessUrl
    } = props;

    const handleSubmit = (values) => {
        const submit: ApplicationInterface = {
            accessUrl: values.get("accessUrl").toString(),
            description: values.get("description").toString(),
            id: appId,
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString(),
        };

        updateApplicationDetails(submit)
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
                dispatch(addAlert({
                    description: "An error occurred while deleting the application",
                    level: AlertLevels.ERROR,
                    message: "Delete Error"
                }));
            });
    };

    return (
        <>
            { appId && (
                <>
                    <Forms
                        onSubmit={ (values) => {
                            handleSubmit(values);
                        } }
                    >
                        <Grid>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="protocolColumn">
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
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="protocolColumn">
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
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="protocolColumn">
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
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="protocolColumn">
                                    <Field
                                        name="accessUrl"
                                        label="Access URL"
                                        required={ false }
                                        requiredErrorMessage=""
                                        placeholder="Provide the access url for the application login page"
                                        type="text"
                                        value={ accessUrl }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="protocolColumn">
                                    <Button primary type="submit" size="small" className="form-button">
                                        Update
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms>
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle="Delete application"
                            header="Delete the application"
                            subheader="This action is irreversible. Please proceed with caution."
                            onActionClick={ handleApplicationDelete }
                        />
                    </DangerZoneGroup>
                </>
            ) }
        </>
    );
};
