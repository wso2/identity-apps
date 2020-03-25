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

import _ from "lodash";
import { AppAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { getApplicationDetails } from "../api";
import { EditApplication } from "../components";
import { AppConfig, history } from "../helpers";
import { PageLayout } from "../layouts";
import {
    AppConfigInterface,
    ApplicationInterface,
    ApplicationsSubFeaturesConfigInterface,
    emptyApplication
} from "../models";
import { ApplicationConstants, ApplicationManagementConstants } from "../constants";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";

/**
 * Application Edit page.
 *
 * @return {ReactElement}
 */
export const ApplicationEditPage: FunctionComponent<{}> = (): ReactElement => {

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);
    const [ permissions, setPermissions ] = useState<CRUDPermissionsInterface>(undefined);
    const [ features, setFeatures ] = useState<ApplicationsSubFeaturesConfigInterface>(undefined);

    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getApplication(id);
    }, []);

    /**
     * Called when the app config value changes.
     */
    useEffect(() => {
        if (!appConfig) {
            return;
        }

        setPermissions(_.get(appConfig, ApplicationManagementConstants.CRUD_PERMISSIONS_APP_CONFIG_KEY));
        setFeatures(_.get(appConfig, ApplicationManagementConstants.SUB_FEATURES_APP_CONFIG_KEY));
    }, [ appConfig ]);

    /**
     * Retrieves application details from the API.
     *
     * @param {string} id - Application id.
     */
    const getApplication = (id: string): void => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response) => {
                setApplication(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while retrieving application details",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
            .finally(() => {
                setApplicationRequestLoading(false);
            });
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(ApplicationConstants.PATHS.get("APPLICATIONS"));
    };

    /**
     * Called when an application is deleted.
     */
    const handleApplicationDelete = (): void => {
        history.push(ApplicationConstants.PATHS.get("APPLICATIONS"));
    };

    /**
     * Called when an application updates.
     *
     * @param {string} id - Application id.
     */
    const handleApplicationUpdate = (id: string): void => {
        getApplication(id);
    };

    return (
        <PageLayout
            title={ application.name }
            contentTopMargin={ true }
            description={ application.description }
            image={ (
                <AppAvatar
                    name={ application.name }
                    image={ application.imageUrl }
                    size="tiny"
                    spaced="right"
                />
            ) }
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Go back to applications"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditApplication
                application={ application }
                features={ features }
                isLoading={ isApplicationRequestLoading }
                onDelete={ handleApplicationDelete }
                onUpdate={ handleApplicationUpdate }
                permissions={ permissions }
            />
        </PageLayout>
    );
};
