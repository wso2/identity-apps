/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AccountSecurityWidget, AccountStatusWidget, ConsentManagementWidget, UserSessionsWidget } from "./widgets";
import { AppConstants } from "../../constants";
import { FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";

/**
 * Overview component.
 *
 * @return {JSX.Element}
 */
export const FederatedUserOverview: FunctionComponent<FederatedUserOverviewPropsInterface> = (props: FederatedUserOverviewPropsInterface): JSX.Element => {
    const accessConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    return (
        <Grid className="overview-page">
            <Divider hidden />
            <Grid.Row>
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_ACCOUNT_SECURITY"))
                    && (
                        <Grid.Column computer={ 8 } mobile={ 16 }>
                            <AccountSecurityWidget/>
                        </Grid.Column>
                    )
                }
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_CONSENTS"))
                    && (
                        <Grid.Column computer={ 8 } mobile={ 16 }>
                            <ConsentManagementWidget/>
                        </Grid.Column>
                    )
                }
                {
                    hasRequiredScopes(accessConfig?.overview, accessConfig?.overview?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(accessConfig?.overview,
                        AppConstants.FEATURE_DICTIONARY.get("OVERVIEW_ACCOUNT_ACTIVITY"))
                    && (
                        <Grid.Column computer={ 16 } mobile={ 16 }>
                            <UserSessionsWidget/>
                        </Grid.Column>
                    )
                }
            </Grid.Row>
        </Grid>
    );
};
