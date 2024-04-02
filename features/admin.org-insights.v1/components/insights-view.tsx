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

import CancelIcon from "@mui/icons-material/Cancel";
import Chip from "@oxygen-ui/react/Chip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { Trans } from "react-i18next";
import { Tab } from "semantic-ui-react";
import { InsightsFilter } from "./insights-filter";
import { LoginInsights } from "./login-insights";
import { SignupInsights } from "./signup-insights";
import { OrgInsightsContext } from "../contexts/org-insights";
import { ActivityType, DurationOption } from "../models/insights";
import { getTimestamps } from "../utils/insights";

interface InsightViewProps extends IdentifiableComponentInterface {
    selectedActivityType: ActivityType;
    isComingSoon?: boolean;
}

export const InsightsView: React.FunctionComponent<PropsWithChildren<InsightViewProps>> = 
(props: InsightViewProps): ReactElement => {
    const { isComingSoon, selectedActivityType } = props;

    const [ displayingFilterQuery, setDisplayingFilterQuery ] = useState<string>("");

    const insightViews: any = {
        [ActivityType.LOGIN]: <LoginInsights />,
        [ActivityType.REGISTRATION]: <SignupInsights />
    };

    const { filterQuery, setFilterQuery, duration } = React.useContext(OrgInsightsContext);
    
    return isComingSoon ? 
        <p>Coming soon</p> 
        :(
            <>
                <div className="org-insights-duration-notice-container">
                    <p data-componentid="org-insights-helper-text" className="org-insights-helper-text">
                        <Trans
                            i18nKey={ "insights:durationMessage" }
                            tOptions={ {
                                endTimestamp: new Date(
                                    getTimestamps(duration as DurationOption, { forDisplay: true }).endTimestamp
                                ).toLocaleString("EN-us", { day: "numeric", month: "short", year: "numeric" }),
                                filterQueryForDisplay: displayingFilterQuery,
                                startTimestamp: new Date(
                                    getTimestamps(duration as DurationOption, { forDisplay: true }).startTimestamp
                                ).toLocaleString("EN-us", { day: "numeric", month: "short", year: "numeric" })
                            } }
                        >
                            Showing results from
                            <strong>
                                { getTimestamps(duration as DurationOption, { forDisplay: true }).startTimestamp }
                            </strong>
                            to{ " " }
                            <strong>
                                { getTimestamps(duration as DurationOption, { forDisplay: true }).endTimestamp }
                            </strong>
                        </Trans>
                    </p>
                    <div style={ { flexGrow: 1 } } />

                    { filterQuery && (
                        <Chip
                            data-componentid="org-insights-filter-chip"
                            color="primary"
                            className="org-insights-filter-chip"
                            label={ 
                                (<p style={ { fontSize: "1rem" } }>
                                    { displayingFilterQuery }
                                </p>) 
                            }
                            deleteIcon={ <CancelIcon /> }
                            onDelete={ () => {
                                setFilterQuery("");
                                setDisplayingFilterQuery("");
                            } }
                        />
                    ) }
                    <InsightsFilter
                        onFilteringQuerySubmitted={ (filteringQuery: string, displayFilterQuery: string) => {
                            setFilterQuery(filteringQuery);
                            setDisplayingFilterQuery(displayFilterQuery);
                        } }
                        selectedActivityType={ selectedActivityType }
                        data-componentid="org-insights-advanced-filter"
                        showResetButton={ filterQuery !== "" }
                    />
                </div>

                <Tab.Pane
                    active
                    attached={ false } 
                    className="org-insights-tab-view"
                >  
                    { insightViews[selectedActivityType] }
                </Tab.Pane>
            </>
        );
};
