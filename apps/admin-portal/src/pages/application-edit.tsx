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

import { AppAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { getApplicationDetails } from "../api";
import { EditApplication } from "../components";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import { ApplicationInterface, emptyApplication } from "../models";
import { ApplicationConstants } from "../constants";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";

/**
 * Application Edit page.
 *
 * @return {ReactElement}
 */
export const ApplicationEditPage: FunctionComponent<{}> = (): ReactElement => {

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);

    const dispatch = useDispatch();

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

    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getApplication(id);
    }, []);

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
                isLoading={ isApplicationRequestLoading }
                onDelete={ handleApplicationDelete }
                onUpdate={ handleApplicationUpdate }
            />
        </PageLayout>
    );
};
