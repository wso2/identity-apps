/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, ResourceTab, TabPageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Image } from "semantic-ui-react";
import { attributeConfig } from "../../admin.extensions.v1/configs/attribute";
import { AppConstants, history } from "../../admin.core.v1";
import { getAClaim } from "../api";
import {
    EditAdditionalPropertiesLocalClaims,
    EditBasicDetailsLocalClaims,
    EditMappedAttributesLocalClaims
} from "../components";

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
 * @param props - Props injected to the component.
 *
 * @returns Local claims edit page.
 */
const LocalClaimsEditPage: FunctionComponent<LocalClaimsEditPageInterface> = (
    props: LocalClaimsEditPageInterface & RouteComponentProps<RouteParams>
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId
    } = props;

    const claimID: string = match.params.id;

    const [ claim, setClaim ] = useState<Claim>(null);
    const [ isLocalClaimDetailsRequestLoading, setIsLocalClaimDetailsRequestLoading ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Fetches the local claim.
     */
    const getClaim = () => {
        setIsLocalClaimDetailsRequestLoading(true);

        getAClaim(claimID)
            .then((response: Claim) => {
                setClaim(response);
            })
            .catch((error: any) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("claims:local.notifications.getAClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("claims:local.notifications.getAClaim.genericError.message")
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
     * Contains the data of the panes.
     */
    const panes: {
        menuItem: string;
        render: () => JSX.Element;
    }[] = [
        {
            menuItem: t("claims:local.pageLayout.edit.tabs.general"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation>
                    <EditBasicDetailsLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid="local-claims-basic-details-edit"
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("claims:local.pageLayout.edit.tabs.mappedAttributes"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation>
                    <EditMappedAttributesLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid={ `${ testId }-edit-local-claims-mapped-attributes` }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("claims:local.pageLayout.edit.tabs.additionalProperties"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation>
                    <EditAdditionalPropertiesLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid={ `${ testId }-edit-local-claims-additional-properties` }
                    />
                </ResourceTab.Pane>
            )
        }
    ];

    /**
     * This generates the first letter of a claim.
     * @param name - Name of the claim.
     * @returns The first letter of a claim.
     */
    const generateClaimLetter = (name: string): string => {
        const stringArray: string[] = name?.replace("http://", "")?.split("/");

        return stringArray[ stringArray?.length - 1 ][ 0 ]?.toLocaleUpperCase();
    };

    return (
        <TabPageLayout
            isLoading={ isLocalClaimDetailsRequestLoading }
            image={ (
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
            ) }
            title={ claim?.displayName }
            pageTitle="Edit Attributes"
            description={ t("claims:local.pageLayout.edit.description") }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
                },
                text: t("claims:local.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            { attributeConfig.attributes.showEditTabs
                ? (
                    <ResourceTab 
                        isLoading={ isLocalClaimDetailsRequestLoading }
                        panes={ panes } 
                        data-testid={ `${ testId }-tabs` } />
                ) : (
                    <EditBasicDetailsLocalClaims
                        claim={ claim }
                        update={ getClaim }
                        data-testid="local-claims-basic-details-edit"
                    />
                )
            }
        </TabPageLayout>
    );
};

/**
 * Default proptypes for the component.
 */
LocalClaimsEditPage.defaultProps = {
    "data-testid": "edit-local-claims"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default LocalClaimsEditPage;
