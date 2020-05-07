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
import { ResourceTab } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Image } from "semantic-ui-react";
import { getAClaim } from "../api";
import {
    AvatarBackground,
    EditAdditionalPropertiesLocalClaims,
    EditBasicDetailsLocalClaims,
    EditMappedAttributesLocalClaims
} from "../components";
import { LOCAL_CLAIMS_PATH } from "../constants";
import { history } from "../helpers";
import { PageLayout } from "../layouts"
import { AlertLevels, Claim } from "../models";

/**
 * This renders the edit local claims page
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LocalClaimsEditPage = (props): ReactElement => {

    const claimID = props.match.params.id;

    const [ claim, setClaim ] = useState<Claim>(null);
    const [ isLocalClaimDetailsRequestLoading, setIsLocalClaimDetailsRequestLoading ] = useState<boolean>(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Fetches the local claim.
     */
    const getClaim = () => {
        setIsLocalClaimDetailsRequestLoading(true);

        getAClaim(claimID)
            .then((response) => {
                setClaim(response);
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("devPortal:components.claims.local.notifications.getAClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.local.notifications.getAClaim.genericError.message")
                })
                );
            })
            .finally(() => {
                setIsLocalClaimDetailsRequestLoading(false);
            });
    };

    useEffect(() => {
        getClaim();
    }, []);

    /**
     * Contains the data of the panes
     */
    const panes = [
        {
            menuItem: t("devPortal:components.claims.local.pageLayout.edit.tabs.general"),
            render: () => (
                <EditBasicDetailsLocalClaims
                    claim={ claim }
                    update={ getClaim } />
            )
        },
        {
            menuItem: t("devPortal:components.claims.local.pageLayout.edit.tabs.mappedAttributes"),
            render: () => (
                <EditMappedAttributesLocalClaims
                    claim={ claim }
                    update={ getClaim }
                />
            )
        },
        {
            menuItem: t("devPortal:components.claims.local.pageLayout.edit.tabs.additionalProperties"),
            render: () => (
                <EditAdditionalPropertiesLocalClaims
                    claim={ claim }
                    update={ getClaim }
                />
            )
        }
    ];

    /**
     * This generates the first letter of a claim
     * @param {string} name 
     * @return {string} The first letter of a claim
     */
    const generateClaimLetter = (name: string): string => {
        const stringArray = name?.replace("http://", "")?.split("/");
        return stringArray[ stringArray?.length - 1 ][ 0 ]?.toLocaleUpperCase();
    };

    return (
        <PageLayout
            isLoading={ isLocalClaimDetailsRequestLoading }
            image={
                <Image
                    floated="left"
                    verticalAlign="middle"
                    rounded
                    centered
                    size="tiny"
                >
                    <AvatarBackground />
                    <span className="claims-letter">
                        { claim && generateClaimLetter(claim?.claimURI) }
                    </span>
                </Image>
            }
            title={ claim?.displayName }
            description={ t("devPortal:components.claims.local.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(LOCAL_CLAIMS_PATH);
                },
                text: t("devPortal:components.claims.local.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <ResourceTab panes={ panes } />
        </PageLayout>
    )
};
