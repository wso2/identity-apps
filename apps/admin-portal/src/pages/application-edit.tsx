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
import React, { FunctionComponent, useEffect, useState } from "react";
import { getApplicationDetails } from "../api";
import { EditApplication } from "../components";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import { ApplicationInterface, emptyApplication } from "../models";

/**
 * Application Edit page.
 *
 * @return {JSX.Element}
 */
export const ApplicationEditPage: FunctionComponent<any> = (): JSX.Element => {

    const [ application, setApplication ] = useState<ApplicationInterface>(emptyApplication);
    const [ isApplicationRequestLoading, setApplicationRequestLoading ] = useState<boolean>(false);

    const getApplication = (id: string) => {
        setApplicationRequestLoading(true);

        getApplicationDetails(id)
            .then((response) => {
                setApplication(response);
            })
            .catch((error) => {
                // TODO add to notifications
            })
            .finally(() => {
                setApplicationRequestLoading(false);
            });
    };

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getApplication(id);
    }, []);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push("/applications");
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
            <EditApplication application={ application } isLoading={ isApplicationRequestLoading } />
        </PageLayout>
    );
};
