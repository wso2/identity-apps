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
import { ContentLoader, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { deleteApplication, updateApplicationDetails } from "../../api";
import { GlobalConfig } from "../../configs";
import { history } from "../../helpers";
import { ApplicationInterface } from "../../models";
import { GeneralDetailsForm } from "./forms";

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

    const handleFormSubmit = (updatedDetails: ApplicationInterface) => {

        updateApplicationDetails(updatedDetails)
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

    return (
        <>
            {
                !isLoading
                    ? (
                        <>
                            <GeneralDetailsForm
                                name={ name }
                                appId={ appId }
                                description={ description }
                                discoverability={ discoverability }
                                onSubmit={ handleFormSubmit }
                                imageUrl={ imageUrl }
                                accessUrl={ accessUrl }
                            />
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
                    : <ContentLoader/>
            }
        </>
    );
};
