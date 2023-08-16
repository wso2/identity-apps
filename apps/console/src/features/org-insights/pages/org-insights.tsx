/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { SelectChangeEvent } from "@mui/material";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import { Hint, PageLayout } from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, Menu, Tab, TabProps } from "semantic-ui-react";
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
        },
        {
            menuItem: <Menu.Item disabled>User recovery <Label>{ t("common:comingSoon") }</Label></Menu.Item>,
            render: () => (
                <InsightsView
                    selectedActivityType={ selectedActivityType }
                    isComingSoon 
                />
            )
        }
    ];

    return (
        <PageLayout
            data-componentid="asgardeo-insights"
            pageTitle={ t("console:manage.features.insights.pageTitle") }
            title={ t("console:manage.features.insights.title") }
            description={ t("console:manage.features.insights.description") }
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
                            { t("console:manage.features.insights.lastFetchedMessage.tooltipText") }
                        </Hint>
                        <p>
                            { t("console:manage.features.insights.lastFetchedMessage.label", {
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
