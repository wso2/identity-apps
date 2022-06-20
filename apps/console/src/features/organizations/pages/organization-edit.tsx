/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/src/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { history } from "../../core";
import { getOrganization } from "../api";
import { EditOrganization } from "../components/edit-organization";
import { OrganizationIcon } from "../configs";
import { OrganizationResponseInterface } from "../models";

/**
 * User Edit page.
 *
 * @return {React.ReactElement}
 */
const OrganizationEditPage = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ organization, setOrganization ] = useState<OrganizationResponseInterface>();

    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[path.length - 1];

        console.log(`Org Id: ${id}`);

        getOrganization(id)
            .then((organization) => {
                setOrganization(organization);
            }).catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("Error getting organization details")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("Error getting organization details"),
                    level: AlertLevels.ERROR,
                    message: t("Error getting organization details")
                }));
            });
    }, []);

    return (
        <PageLayout
            isLoading={ false }
            title={ organization?.name ?? "Organization" }
            description={ "Edit Organization" }
            image={ (
                <GenericIcon
                    defaultIcon
                    relaxed="very"
                    shape="rounded"
                    size="x50"
                    icon={ OrganizationIcon }
                />
            ) }
            backButton={ {
                "data-testid": "org-mgt-edit-org-back-button",
                onClick: () => console.log("BACK"),
                text: "BACK"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditOrganization
                organization={ organization }
                handleOrganizationUpdate={ (orgId) => console.log(orgId) }/>
        </PageLayout>
    );
};

export default OrganizationEditPage;
