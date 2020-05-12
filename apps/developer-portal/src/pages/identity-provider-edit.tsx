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
import { AppAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getIdentityProviderDetail } from "../api";
import { EditIdentityProvider } from "../components";
import { IdentityProviderConstants } from "../constants";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import { IdentityProviderInterface, emptyIdentityProvider } from "../models";

/**
 * Identity Provider Edit page.
 *
 * @return {ReactElement}
 */
export const IdentityProviderEditPage: FunctionComponent<{}> = (): ReactElement => {

    const [ identityProvider, setIdentityProvider ] = useState<IdentityProviderInterface>(emptyIdentityProvider);
    const [ isIdentityProviderRequestLoading, setIdentityProviderRequestLoading ] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * Retrieves idp details from the API.
     *
     * @param {string} id - IDP id.
     */
    const getIdentityProvider = (id: string): void => {
        setIdentityProviderRequestLoading(true);

        getIdentityProviderDetail(id)
            .then((response) => {
                setIdentityProvider(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("devPortal:components.idp.notifications.getIDP.error.description",
                            { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.idp.notifications.getIDP.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.idp.notifications.getIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.idp.notifications.getIDP.genericError.message")
                }));
            })
            .finally(() => {
                setIdentityProviderRequestLoading(false);
            });
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(IdentityProviderConstants.PATHS.get("IDENTITY_PROVIDERS"));
    };

    /**
     * Called when an idp is deleted.
     */
    const handleIdentityProviderDelete = (): void => {
        history.push(IdentityProviderConstants.PATHS.get("IDENTITY_PROVIDERS"));
    };

    /**
     * Called when an idp updates.
     *
     * @param {string} id - IDP id.
     */
    const handleIdentityProviderUpdate = (id: string): void => {
        getIdentityProvider(id);
    };

    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getIdentityProvider(id);
    }, []);

    return (
        <PageLayout
            isLoading={ isIdentityProviderRequestLoading }
            title={ identityProvider.name }
            contentTopMargin={ true }
            description={ identityProvider.description }
            image={ (
                <AppAvatar
                    name={ identityProvider.name }
                    image={ identityProvider.image }
                    size="tiny"
                    spaced="right"
                />
            ) }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("devPortal:pages.idpTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <EditIdentityProvider
                identityProvider={ identityProvider }
                isLoading={ isIdentityProviderRequestLoading }
                onDelete={ handleIdentityProviderDelete }
                onUpdate={ handleIdentityProviderUpdate }
            />
        </PageLayout>
    );
};
