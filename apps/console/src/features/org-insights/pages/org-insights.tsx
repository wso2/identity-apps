/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { SelectChangeEvent } from "@mui/material";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import { Hint, PageLayout } from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, TabProps } from "semantic-ui-react";
import { InsightsView } from "../components/insights-view";
import { OrgInsightsConstants } from "../constants/org-insights";
import { OrgInsightsContext } from "../contexts/org-insights";
import { ActivityType, DurationDropdownOption } from "../models/insights";

const tabIndexToActivityTypeMap: Record<number,ActivityType> = {
    0: ActivityType.LOGIN,
    1: ActivityType.REGISTRATION,
    2: ActivityType.USER_RECOVERY
};

const OrgInsightsPage: FunctionComponent = () => {
    const [ duration, setDuration ] = useState<number>(OrgInsightsConstants.DURATION_OPTIONS[0].value);
    const [ filterQuery, setFilterQuery ] = useState<string>("");
    const [ lastFetchTimestamp, setLastFetchTimestamp ] = useState<string>(moment().format("HH:mm:ss"));
    const [ selectedActivityType, setSelectedActivityType ] = useState<ActivityType>(ActivityType.LOGIN);

    const { t } = useTranslation();

    const handleDurationChange = (event: SelectChangeEvent) => {
        setDuration(Number(event.target.value));
    };

    const panes: any = [
        {
            menuItem: "Login",
            render: () => (
                <InsightsView 
                    selectedActivityType={ selectedActivityType }
                />    
            )
        },
        {
            menuItem: "Registration",
            render: () => (
                <InsightsView
                    selectedActivityType={ selectedActivityType }
                />
            )
        }
    ];

    return (
        <PageLayout
            data-componentid="asgardeo-insights"
            pageTitle={ t("insights:pageTitle") }
            title={ t("insights:title") }
            description={ t("insights:description") }
            action={
                (<>
                    <Select
                        className="org-insights-duration-dropdown"
                        data-componentid="org-insights-duration-dropdown"
                        defaultValue={ duration }
                        onChange={ handleDurationChange }
                        renderValue={ (value: string) => <p>Duration: Last { value } days</p> }
                    >
                        { OrgInsightsConstants.DURATION_OPTIONS.map((option: DurationDropdownOption) => (
                            <MenuItem
                                key={ option.key }
                                value={ option.value }
                                data-componentid={ `org-insights-duration-${option.value}` }
                            >
                                { t(option.text, {
                                    duration: option.value
                                }) }
                            </MenuItem>
                        )) }
                    </Select>

                    <div className="org-insights-last-fetched-warning">
                        <Hint icon="warning sign" popup compact warning>
                            { t("insights:lastFetchedMessage.tooltipText") }
                        </Hint>
                        <p>
                            { t("insights:lastFetchedMessage.label", {
                                time: lastFetchTimestamp
                            }) }
                        </p>
                    </div>
                </>)
            }
        >
            <OrgInsightsContext.Provider
                value={ {
                    duration,
                    filterQuery,
                    setFilterQuery,
                    setLastFetchTimestamp
                } }
            >            
                <Tab
                    className="tabs resource-tabs"
                    menu={ { pointing: true, secondary: true } }
                    panes={ panes }
                    onTabChange={ (event: React.SyntheticEvent, data: TabProps) => {
                        setFilterQuery("");
                        setSelectedActivityType(tabIndexToActivityTypeMap[data.activeIndex]);
                    } }/>
            </OrgInsightsContext.Provider>
        </PageLayout>
    );
};

export default OrgInsightsPage;
