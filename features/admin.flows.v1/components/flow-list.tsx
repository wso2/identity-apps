/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Typography from "@oxygen-ui/react/Typography";
import {
    CircleCheckFilledIcon,
    UserAsteriskIcon,
    UserFlowIcon,
    UserKeyIcon,
    UserPlusIcon
} from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagLabel from "@wso2is/admin.feature-gate.v1/components/feature-flag-label";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import useGetFlowConfigs from "../api/use-get-flow-configs";
import flowData from "../data/flows.json";
import { FlowListItemInterface, FlowTypes } from "../models/flows";
import "./flow-list.scss";

/**
 * Props interface of {@link FlowList}
 */
type FlowListProps = IdentifiableComponentInterface;

/**
 * Flow list component.
 *
 * @param props - Props injected to the component.
 * @returns Flow list component.
 */
const FlowList: FunctionComponent<FlowListProps> = ({
    ["data-componentid"]: componentId = "flow-list"
}: FlowListProps): ReactElement => {

    const flowsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config.ui.features?.flows);

    const { data: flowConfigs } = useGetFlowConfigs();

    /**
     * Resolves the icon based on the flow type.
     * @param flowType - The type of the flow.
     * @returns The icon element for the flow type.
     */
    const resolveFlowTypeIcon = (flowType: string): ReactElement => {
        switch (flowType) {
            case FlowTypes.REGISTRATION:
                return <UserPlusIcon size="small" className="icon" />;
            case FlowTypes.PASSWORD_RECOVERY:
                return <UserFlowIcon size="small" className="icon" />;
            case FlowTypes.INVITED_USER_REGISTRATION:
                return <UserAsteriskIcon size="small" className="icon" />;
            default:
                return <UserKeyIcon size="small" className="icon" />;
        }
    };

    const resolveFlowTypeStatus = (flowType: string): boolean => {

        const config: any = flowConfigs?.find((conf: any) => conf.flowType === flowType);

        return config?.isEnabled ?? false;
    };

    const resolveFlowTypeStatusLabel = (flowType: string): ReactElement => {
        const enabled: any = resolveFlowTypeStatus(flowType);

        return enabled ? (
            <div
                className="status-tag"
                data-componentid={ `${ componentId }-${ flowType }-configured-status-tag` }
            >
                <CircleCheckFilledIcon className="icon-configured"/>
                <Typography className="text-configured" variant="h6">
                    Enabled
                </Typography>
            </div>
        ) : (
            <div
                className="status-tag"
                data-componentid={ `${ componentId }-${ flowType }-not-configured-status-tag` }
            >
                <Typography className="text-not-configured" variant="h6">
                    Disabled
                </Typography>
            </div>
        );
    };

    /**
     * Checks whether the flow card should be disabled based on the feature flag status.
     *
     * @param flow - The flow item to check.
     * @returns Whether the flow card should be disabled.
     */
    const isFlowCardDisabled = (flow: FlowListItemInterface): boolean => {
        return flow.disabled ||
            !isFeatureEnabled(flowsFeatureConfig, `${flow.featureStatusKey}.disabled`);
    };

    return (
        <div className="flow-list-grid-wrapper" data-componentid={ `${ componentId }-grid` }>
            <div className="flow-list-grid">
                { flowData && flowData.flows.length > 0 && (
                    flowData.flows.map((flow: FlowListItemInterface) =>
                        isFeatureEnabled(flowsFeatureConfig, flow.featureStatusKey) && (
                            <Card
                                key={ flow.id }
                                className={ classNames("flow-type", { "disabled": isFlowCardDisabled(flow) }) }
                                data-componentid={ `${ flow.id }-flow-type-card` }
                                onClick={ () => !isFlowCardDisabled(flow) &&
                                    history.push(AppConstants.getPaths().get(flow.path)) }
                            >
                                <CardContent className="flow-type-header">
                                    <div>
                                        <GenericIcon
                                            size="micro"
                                            icon={ (
                                                <Avatar
                                                    variant="square"
                                                    randomBackgroundColor
                                                    backgroundColorRandomizer={ flow.id }
                                                    className="flow-type-icon-container"
                                                >
                                                    { resolveFlowTypeIcon(flow.type) }
                                                </Avatar>
                                            ) }
                                            inline
                                            transparent
                                            shape="square"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="h6">
                                            { flow.heading }
                                        </Typography>
                                        { resolveFlowTypeStatusLabel(flow.type) }
                                    </div>
                                    <FeatureFlagLabel
                                        featureFlags={ flowsFeatureConfig?.featureFlags }
                                        featureKey={ flow.featureStatusKey }
                                        type="ribbon"
                                    />
                                </CardContent>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        { flow.description }
                                    </Typography>
                                </CardContent>
                            </Card>
                        )))
                }
            </div>
        </div>
    );
};

export default FlowList;
