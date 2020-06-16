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

import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, PageLayout, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Image } from "semantic-ui-react";
import { getAClaim } from "../../api";
import {
    EditAdditionalPropertiesLocalClaims,
    EditBasicDetailsLocalClaims,
    EditMappedAttributesLocalClaims
} from "../../components";
import { AppConstants } from "../../constants";
import { history } from "../../helpers";

/**
 * Props for the Local Claims edit page.
 */
type LocalClaimsEditPageInterface = TestableComponentInterface;

/**
 * Route parameters interface.
 */
interface RouteParams {
    id: string;
}

/**
 * This renders the edit local claims page
 *
 * @param {LocalClaimsEditPageInterface & RouteComponentProps<RouteParams>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LocalClaimsEditPage: FunctionComponent<LocalClaimsEditPageInterface> = (
    props: LocalClaimsEditPageInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const claimID = match.params.id;

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
                        || t("adminPortal:components.claims.local.notifications.getAClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("adminPortal:components.claims.local.notifications.getAClaim.genericError.message")
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
            menuItem: t("adminPortal:components.claims.local.pageLayout.edit.tabs.general"),
            render: () => (
                <EditBasicDetailsLocalClaims
                    claim={ claim }
                    update={ getClaim }
                    data-testid="local-claims-basic-details-edit"
                />
            )
        },
        {
            menuItem: t("adminPortal:components.claims.local.pageLayout.edit.tabs.mappedAttributes"),
            render: () => (
                <EditMappedAttributesLocalClaims
                    claim={ claim }
                    update={ getClaim }
                    data-testid={ `${ testId }-edit-local-claims-mapped-attributes` }
                />
            )
        },
        {
            menuItem: t("adminPortal:components.claims.local.pageLayout.edit.tabs.additionalProperties"),
            render: () => (
                <EditAdditionalPropertiesLocalClaims
                    claim={ claim }
                    update={ getClaim }
                    data-testid={ `${ testId }-edit-local-claims-additional-properties` }
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
                    <AnimatedAvatar />
                    <span className="claims-letter">
                        { claim && generateClaimLetter(claim?.claimURI) }
                    </span>
                </Image>
            }
            title={ claim?.displayName }
            description={ t("adminPortal:components.claims.local.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.PATHS.get("LOCAL_CLAIMS"));
                },
                text: t("adminPortal:components.claims.local.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            <ResourceTab panes={ panes } data-testid={ `${ testId }-tabs` } />
        </PageLayout>
    )
};

/**
 * Default proptypes for the component.
 */
LocalClaimsEditPage.defaultProps = {
    "data-testid": "edit-local-claims"
};
