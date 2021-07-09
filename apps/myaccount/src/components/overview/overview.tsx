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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Divider, Grid, SemanticWIDTHS } from "semantic-ui-react";
import { AccountSecurityWidget, AccountStatusWidget, ConsentManagementWidget, UserSessionsWidget } from "./widgets";
import { AppConstants } from "../../constants";
import { commonConfig } from "../../extensions";
import { FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";

/**
 * Proptypes for the user sessions edit component.
 * Also see {@link UserSessionsEdit.defaultProps}
 */
interface OverviewPropsInterface extends TestableComponentInterface {
    enableThreeWidgetLayout?: boolean;
}

/**
 * Overview component.
 *
 * @return {JSX.Element}
 */
export const Overview: FunctionComponent<OverviewPropsInterface> = (
    props: OverviewPropsInterface
): ReactElement => {

    const {
        enableThreeWidgetLayout
    } = props;
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    const accountStatus = (widthComputer: SemanticWIDTHS, widthMobile: SemanticWIDTHS): React.ReactElement => {
        return (
            <>
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_ACCOUNT_STATUS"))
                    && (
                        <Grid.Column computer={ widthComputer } mobile={ widthMobile }>
                            <AccountStatusWidget/>
                        </Grid.Column>
                    )
                }
            </>
        );
    };

    const accountActivity = (widthComputer: SemanticWIDTHS, widthMobile: SemanticWIDTHS): React.ReactElement => {
        return (
            <>
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_ACCOUNT_ACTIVITY"))
                    && (
                        <Grid.Column computer={ widthComputer } mobile={ widthMobile }>
                            <UserSessionsWidget/>
                        </Grid.Column>
                    )
                }
            </>
        );
    };

    const accountSecurity = (widthComputer: SemanticWIDTHS, widthMobile: SemanticWIDTHS): React.ReactElement => {
        return (
            <>
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_ACCOUNT_SECURITY"))
                    && (
                        <Grid.Column computer={ widthComputer } mobile={ widthMobile }>
                            <AccountSecurityWidget/>
                        </Grid.Column>
                    )
                }
            </>
        );
    };

    const consents = (widthComputer: SemanticWIDTHS, widthMobile: SemanticWIDTHS): React.ReactElement => {
        return (
            <>
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_CONSENTS"))
                    && (
                        <Grid.Column computer={ widthComputer } mobile={ widthMobile }>
                            <ConsentManagementWidget/>
                        </Grid.Column>
                    )
                }
            </>
        );
    };


    return (
        <Grid className="overview-page">
            <Divider hidden />
            <Grid.Row>
                {
                    enableThreeWidgetLayout ? (
                            <>
                                { accountStatus(9,16) }
                                { accountSecurity(7, 16) }
                                { accountActivity(16, 16) }
                            </>

                        ) :
                        (
                            <>
                                { accountStatus(9,16) }
                                { accountActivity(7, 16) }
                                { accountSecurity(8, 16) }
                                { consents(8, 16) }
                            </>
                        )
                }

            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
Overview.defaultProps = {
    enableThreeWidgetLayout: commonConfig.OverviewPage.enableThreeWidgetLayout
};
