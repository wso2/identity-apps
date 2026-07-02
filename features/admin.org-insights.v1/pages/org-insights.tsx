/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, Hint, PageLayout, useDocumentation } from "@wso2is/react-components";
import dayjs from "dayjs";
import React, { FunctionComponent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Tab, TabProps } from "semantic-ui-react";
import { enableAdvancedAnalytics } from "../api/enable-advanced-analytics";
import AdvancedAnalyticsUpgradeCard from "../components/advanced-analytics-upgrade-card";
import { InsightsView } from "../components/insights-view";
import { OrgInsightsConstants } from "../constants/org-insights";
import { OrgInsightsContext } from "../contexts/org-insights";
import { ActivityType, DurationDropdownOption } from "../models/insights";
import { isM2MInsightsFeatureEnabled } from "../utils/insights";

interface OrgInsightsPagePropsInterface {
    moesifTermsOfServiceUrl?: string;
    showUpgradeCard?: boolean;
    termsOfServiceUrl?: string;
}

const OrgInsightsPage: FunctionComponent<OrgInsightsPagePropsInterface> = (
    {
        moesifTermsOfServiceUrl = "",
        showUpgradeCard = false,
        termsOfServiceUrl = ""
    }: OrgInsightsPagePropsInterface
) => {
    const dispatch: Dispatch = useDispatch();
    const [ isEnablingAdvanced, setIsEnablingAdvanced ] = useState<boolean>(false);
    const [ duration, setDuration ] = useState<number>(OrgInsightsConstants.DURATION_OPTIONS[0].value);
    const [ filterQuery, setFilterQuery ] = useState<string>("");
    const [ lastFetchTimestamp, setLastFetchTimestamp ] = useState<string>(() => dayjs().format("HH:mm:ss"));
    const [ selectedActivityType, setSelectedActivityType ] = useState<ActivityType>(ActivityType.LOGIN);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const handleEnableAdvancedAnalytics: () => Promise<void> = useCallback(async (): Promise<void> => {
        setIsEnablingAdvanced(true);

        try {
            await enableAdvancedAnalytics();

            dispatch(addAlert({
                description: t("insights:advancedAnalytics.notifications.enableSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("insights:advancedAnalytics.notifications.enableSuccess.message")
            }));
        } catch (error: unknown) {
            const serverDescription: string | undefined =
                (error as { response?: { data?: { description?: string } } })?.response?.data?.description;

            dispatch(addAlert({
                description: serverDescription
                    ?? t("insights:advancedAnalytics.notifications.enableError.description"),
                level: AlertLevels.ERROR,
                message: t("insights:advancedAnalytics.notifications.enableError.message")
            }));
        } finally {
            setIsEnablingAdvanced(false);
        }
    }, [ dispatch, t ]);


    const handleDurationChange = (event: SelectChangeEvent) => {
        setDuration(Number(event.target.value));
    };

    const m2mInsightsEnabled: boolean = isM2MInsightsFeatureEnabled();

    const tabIndexToActivityTypeMap: Record<number, ActivityType> = useMemo(() => {
        const map: Record<number, ActivityType> = {
            0: ActivityType.LOGIN,
            1: ActivityType.REGISTRATION
        };

        if (m2mInsightsEnabled) {
            map[Object.keys(map).length] = ActivityType.M2M;
        }

        return map;
    }, [ m2mInsightsEnabled ]);

    const panes: any = useMemo(() => {
        const basePanes: any[] = [
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

        if (m2mInsightsEnabled) {
            basePanes.push({
                menuItem: "M2M",
                render: () => (
                    <InsightsView
                        selectedActivityType={ selectedActivityType }
                    />
                )
            });
        }

        return basePanes;
    }, [ m2mInsightsEnabled, selectedActivityType ]);

    return (
        <PageLayout
            data-componentid="asgardeo-insights"
            pageTitle={ t("insights:pageTitle") }
            title={ t("insights:title") }
            description={ (
                <>
                    { t("insights:description") }
                    <DocumentationLink
                        link={ getLink("manage.insights.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
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
            { showUpgradeCard && (
                <AdvancedAnalyticsUpgradeCard
                    data-componentid="org-insights-upgrade-card"
                    isEnabling={ isEnablingAdvanced }
                    onEnable={ handleEnableAdvancedAnalytics }
                    termsOfServiceUrl={ termsOfServiceUrl }
                    moesifTermsOfServiceUrl={ moesifTermsOfServiceUrl }
                />
            ) }
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
