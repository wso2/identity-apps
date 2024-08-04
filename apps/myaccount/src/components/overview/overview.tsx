/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Divider, Grid, SemanticWIDTHS } from "semantic-ui-react";
import { AccountSecurityWidget, AccountStatusWidget, ConsentManagementWidget, UserSessionsWidget } from "./widgets";
import { ProfileWidget } from "./widgets/profile-widget";
import { AppConstants } from "../../constants";
import { commonConfig } from "../../extensions";
import { FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";

/**
 * Prop types for the overview edit component.
 */
interface OverviewPropsInterface extends TestableComponentInterface {
    userSource?: string;
    enableAlternateWidgetLayout?: boolean;
    userStore?: string
}

/**
 * Overview Component
 * @param props - Props injected to the component.
 */
export const Overview: FunctionComponent<OverviewPropsInterface> = (
    props: OverviewPropsInterface
): ReactElement => {

    const {
        userSource,
        enableAlternateWidgetLayout,
        userStore
    } = props;

    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const hasLocalAccount: boolean = useSelector((state: AppState) => state.authenticationInformation.hasLocalAccount);

    /**
     * Profile status widget with link to profile.
     * @param widthComputer - Width for the computer screens.
     * @param widthMobile - Width for the mobile screens.
     */
    const profileStatus = (widthComputer: SemanticWIDTHS, widthMobile: SemanticWIDTHS): React.ReactElement => {
        return (
            <>
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_ACCOUNT_STATUS"))
                    && (
                        <Grid.Column computer={ widthComputer } mobile={ widthMobile }>
                            <ProfileWidget
                                userSource={ userSource }
                            />
                        </Grid.Column>
                    )
                }
            </>
        );
    };

    /**
     * Account Security Widget
     * @param widthComputer - Width for the computer screens.
     * @param widthMobile - Width for the mobile screens.
     */
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

    /**
     * Account Status widget with shield (Currently not displayed).
     * @param widthComputer - Width for the computer screens.
     * @param widthMobile - Width for the mobile screens.
     */
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

    /**
     * Session Management Widget (Currently not displayed).
     * @param widthComputer - Width for the computer screens.
     * @param widthMobile - Width for the mobile screens.
     */
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

    /**
     * Consent Management Widget (Currently not displayed).
     * @param widthComputer - Width for the computer screens.
     * @param widthMobile - Width for the mobile screens.
     */
    const consents = (widthComputer: SemanticWIDTHS, widthMobile: SemanticWIDTHS): React.ReactElement => {
        return (
            <>
                {
                    hasLocalAccount &&
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
                { !enableAlternateWidgetLayout
                    ?
                    (<>
                        { accountStatus(9, 16) }
                        { accountActivity(7, 16) }
                        { accountSecurity(8, 16) }
                        { consents(8, 16) }
                    </>)
                    : !commonConfig.utils.isShowAdditionalWidgetAllowed(userStore)
                        ?
                        (<>
                            { profileStatus(8, 16) }
                            { accountSecurity(8, 16) }
                        </>)
                        : (<Grid>
                            <Grid.Row>
                                { profileStatus(8, 16) }
                                { accountSecurity(8, 16) }
                            </Grid.Row>
                            <Grid.Row>
                                { accountActivity(8, 16) }
                                { consents(8, 16) }
                            </Grid.Row>
                        </Grid>)
                }
            </Grid.Row>
        </Grid>
    );
};
