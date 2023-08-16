/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import Card from "@oxygen-ui/react/Card";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Dispatch } from "redux";
import { Placeholder } from "semantic-ui-react";
import { CustomGraphTooltip } from "./custom-graph-tooltip";
import { AppState, getThemeVariables } from "../../core";
import { OrgInsightsConstants } from "../constants/org-insights";
import { OrgInsightsContext } from "../contexts/org-insights";
import { ChartDataPoint, DurationOption, GraphLineType, InsightsData, ResourceType } from "../models/insights";
import { 
    formatXAxisValue, 
    formatYAxisValue, 
    getInsightsForSelectedPeriod,
    shouldDateBeShownInXAxis 
} from "../utils/insights";

/**
 * Proptypes for the insights graph component.
 */
interface InsightsGraphProps extends IdentifiableComponentInterface {
    /**
     * Title of the graph.
     */
    graphTitle: string;
    /**
     * Title hint popup.
     */
    hint?: ReactElement;
    /**
     * Resource type of the graph.
     */
    resourceType: ResourceType;
    /**
     * Graph color of the primary (current trend) graph.
     */
    primaryGraphColor?: string;
}

/**
 * Insights graph component.
 * 
 * @param props - Props injected to the component.
 * 
 * @returns Insights graph component. 
 */
export const InsightsGraph: FunctionComponent<InsightsGraphProps> = (props: InsightsGraphProps): ReactElement => {
    const {
        graphTitle,
        hint,
        resourceType,
        primaryGraphColor: primaryGraphColorProp,
        ["data-componentid"]: componentId
    } = props;

    const { filterQuery, duration, setLastFetchTimestamp } = 
        useContext(OrgInsightsContext);
    
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ insightsData,setInsightsData ] = useState<InsightsData>();
    const [ isInsightsLoading, setIsInsightsLoading ] = useState<boolean>(true);
    const [ primaryGraphColor, setPrimaryGraphColor ] = useState<string>();

    const themeName: string = useSelector((state: AppState) => state.config.ui.theme?.name);

    useEffect(() => {
        async function fetchThemeConfig() {
            const themeConfigValues: void | Record<string, string> = await getThemeVariables(themeName);

            if (primaryGraphColorProp) {
                setPrimaryGraphColor(primaryGraphColorProp);

                return;
            } else {
                setPrimaryGraphColor(themeConfigValues?.["primaryColor"]);
            }
        }

        fetchThemeConfig();
    },[ themeName ]);

    useEffect(() => {
        if (duration) {
            setIsInsightsLoading(true);
            getInsightsForSelectedPeriod(duration as DurationOption, resourceType, filterQuery)
                .then((resp: InsightsData) => {
                    setInsightsData(resp);
                    setLastFetchTimestamp(moment().format("HH:mm:ss"));
                }).catch((error: Error) => {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.insights.notifications.fetchInsights.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.insights.notifications.fetchInsights.genericError.message")
                    }));

                    throw error;
                }).finally(() => {
                    setIsInsightsLoading(false);
                });
        }
    },[ duration, filterQuery, resourceType ]);

    return (
        <>  
            { 
                isInsightsLoading 
                    ? (
                        <Placeholder fluid className="org-insights-graph-placeholder">
                            <Placeholder.Image />
                        </Placeholder>
                    ) : (
                        <Card className="org-insights-graph-container" data-componentid={ componentId }>
                            <h5>
                                { graphTitle }
                                { hint }
                            </h5>
                            <h1 className="org-insights-graph-total-count">
                                { insightsData?.totalUsageForCurretPeriod
                                    ? Number(insightsData?.totalUsageForCurretPeriod).toLocaleString("en-US")
                                    : 0 }
                            </h1>
                            <ResponsiveContainer width="100%" height={ 200 }>
                                <LineChart 
                                    data={ insightsData?.usageData }
                                >
                                    <XAxis 
                                        dataKey="date" 
                                        tickLine={ false } 
                                        padding={ { left: 10, right: 10 } } 
                                        axisLine={ false } 
                                        dy={ 10 }
                                        tickFormatter={ formatXAxisValue }
                                        ticks={ insightsData?.usageData?.map(
                                            (record: ChartDataPoint, index: number) => {
                                                if ( shouldDateBeShownInXAxis(index,duration) ) {
                                                    return record.date;
                                                }
                                            }) }
                                        tick={ { fontSize: 12 } }
                                    />
                                    <Tooltip content={ CustomGraphTooltip } />
                                    <YAxis 
                                        allowDecimals={ false } 
                                        tickLine={ false } 
                                        axisLine={ false }
                                        width={ 30 }
                                        tickFormatter={ formatYAxisValue }
                                    />
                                    <CartesianGrid vertical={ false } />
                                    <Line 
                                        type="linear" 
                                        dataKey={ GraphLineType.CURRENT } 
                                        stroke={ primaryGraphColor ?? OrgInsightsConstants.CURRENT_PERIOD_GRAPH_COLOR } 
                                        strokeWidth={ 2 }
                                    />
                                </LineChart>
                            </ResponsiveContainer>                    
                        </Card>
                    )
            }
        </>
    );
};
