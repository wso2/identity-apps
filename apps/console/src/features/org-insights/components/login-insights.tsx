/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import Grid from "@oxygen-ui/react/Grid";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { InsightsGraph } from "./insight-graph";
import { OrgInsightsConstants } from "../constants/org-insights";
import { ResourceType } from "../models/insights";

export const LoginInsights: FunctionComponent = () => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={ 2 }>
            <Grid xs={ 12 }>
                <InsightsGraph
                    hint={ (
                        <Hint icon="question circle" popup inline className="org-insights-mau-tooltip">
                            { t("insights:graphs.activeUsers.titleHint") }
                        </Hint>) 
                    }
                    graphTitle={ t("insights:graphs.activeUsers.title") }
                    resourceType={ ResourceType.MONTHLY_ACTIVE_USERS }
                    data-componentid="org-insights-mau-graph"
                />
            </Grid>
            <Grid xs={ 6 }>
                <InsightsGraph
                    hint={ (
                        <Hint icon="question circle" popup inline className="org-insights-mau-tooltip">
                            { t("insights:graphs.successLogins.titleHint") }
                        </Hint>) 
                    }
                    graphTitle={ t("insights:graphs.successLogins.title") }
                    data-componentid="org-insights-success-logins-graph"
                    resourceType={ ResourceType.LOGIN_SUCCESS }
                />
            </Grid>
            <Grid xs={ 6 }>
                <InsightsGraph
                    graphTitle={ t("insights:graphs.failedLogins.title") }
                    data-componentid="org-insights-failed-logins-graph"
                    resourceType={ ResourceType.LOGIN_FAILURE }
                    primaryGraphColor={ OrgInsightsConstants.FAILED_LOGIN_GRAPH_COLOR }
                />
            </Grid> 
        </Grid>
    );
};
