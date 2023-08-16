/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Grid from "@oxygen-ui/react/Grid";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { InsightsGraph } from "./insight-graph";
import { ResourceType } from "../models/insights";

export const SignupInsights: FunctionComponent = () => {
    const { t } = useTranslation();
    
    return (
        <Grid container spacing={ 2 }>
            <Grid xs={ 12 }>
                <InsightsGraph
                    hint={ (
                        <Hint icon="question circle" popup inline className="org-insights-mau-tooltip">
                            { t("console:manage.features.insights.graphs.signups.titleHint") }
                        </Hint>
                    ) }
                    graphTitle={ t("console:manage.features.insights.graphs.signups.title") }
                    resourceType={ ResourceType.USER_REGISTRATION }
                    data-componentid="org-insights-signup-graph"
                />
            </Grid>
        </Grid>
    );
};
