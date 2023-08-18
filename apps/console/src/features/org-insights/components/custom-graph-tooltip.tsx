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
