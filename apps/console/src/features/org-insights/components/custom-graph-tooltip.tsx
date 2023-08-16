/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import moment from "moment";
import React, { ReactElement } from "react";
import { TooltipProps } from "recharts";
import {
    NameType,
    Payload,
    ValueType
} from "recharts/types/component/DefaultTooltipContent";
import { GraphLineType } from "../models/insights";

type CustomGraphTooltipProps = TooltipProps<ValueType,NameType>;

export const CustomGraphTooltip = ({ active, payload }: CustomGraphTooltipProps): ReactElement | null => {

    const currentPeriod: Payload<ValueType, NameType> = payload.find(
        (chartPoint: Payload<ValueType, NameType>) => chartPoint.name === GraphLineType.CURRENT
    );
    const previousPeriod: Payload<ValueType, NameType> = payload.find(
        (chartPoint: Payload<ValueType, NameType>) => chartPoint.name === GraphLineType.PREVIOUS
    );

    if (active && payload && payload.length) {
        return (
            <div className="org-insights-graph-tooltip">
                <div className="org-insights-tooltip-date-container">
                    <div className="org-insights-current-period-indicator"></div>
                    <p className="org-insights-tooltip-date">{ moment(currentPeriod.payload.date).format("MMM DD") }</p>
                </div>
                <p ><strong>{ currentPeriod.payload.current }</strong></p>                

                { previousPeriod && (
                    <div style={ { marginTop: "5%" } }>
                        <div className="org-insights-tooltip-date-container">
                            <div className="org-insights-previous-period-indicator"></div>
                            <p className="org-insights-tooltip-date">
                                { moment(previousPeriod.payload.lastPeriodDate).format("MMM DD") }
                            </p>
                        </div>
                        <p>
                            <strong>{ previousPeriod.payload.previous }</strong>
                        </p>
                    </div>
                ) }
            </div>
        );
    }
  
    return null;
};
