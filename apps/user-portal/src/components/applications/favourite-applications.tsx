/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Header } from "semantic-ui-react";
import { Application } from "../../models";
import { ApplicationList } from "./application-list";

/**
 * Proptypes for the favourite applications component.
 */
interface FavouriteApplicationsProps {
    favouriteApps: Application[];
}

/**
 * Favourite applications component.
 *
 * @return {JSX.Element}
 */
export const FavouriteApplications: FunctionComponent<FavouriteApplicationsProps> = (
    props: FavouriteApplicationsProps
): JSX.Element => {
    const { favouriteApps } = props;
    const { t } = useTranslation();

    return (
        <>
            <Header as="h2">{ t("views:components.applications.favourite.heading") }</Header>
            <Divider hidden />
            <ApplicationList apps={ favouriteApps } isFavouritesList={ true } />
        </>
    );
};
