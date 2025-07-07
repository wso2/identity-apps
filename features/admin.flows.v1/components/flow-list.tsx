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
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardActions from "@oxygen-ui/react/CardActions";
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
import useNewRegistrationPortalFeatureStatus from
    "@wso2is/admin.registration-flow-builder.v1/api/use-new-registration-portal-feature-status";
import {
    ServerConfigurationsConstants,
    updateGovernanceConnector,
    useGetGovernanceConnectorById
} from "@wso2is/admin.server-configurations.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
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

    const dispatch: Dispatch = useDispatch();

    const {
        data: isNewRegistrationPortalEnabled
    } = useNewRegistrationPortalFeatureStatus();

    const { mutate: connectorDetailsMutate } = useGetGovernanceConnectorById(
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
    );

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
            case FlowTypes.INVITE_USER_PASSWORD_SETUP:
                return <UserAsteriskIcon size="small" className="icon" />;
            default:
                return <UserKeyIcon size="small" className="icon" />;
        }
    };

    const resolveFlowTypeName = (flowType: string): string => {
        switch (flowType) {
            case FlowTypes.REGISTRATION:
                return "Registration";
            case FlowTypes.PASSWORD_RECOVERY:
                return "Password Recovery";
            case FlowTypes.INVITE_USER_PASSWORD_SETUP:
                return "Invite User Password Setup";
            default:
                return "Unknown Flow Type";
        }
    };

    const handleUpdateSuccess = (flowType: string, isEnabled: boolean) => {
        dispatch(
            addAlert({
                description: `The cutomized ${ flowType.toLowerCase() } flow has been successfully`
                    + (isEnabled ? " enabled." : " disabled."),
                level: AlertLevels.SUCCESS,
                message: "Dynamic " + resolveFlowTypeName(flowType) + " Flow" + (isEnabled ? " Enabled" : " Disabled")
            })
        );
    };

    const handleFlowStatusUpdateError = (flowType: string, error: any) => {
        dispatch(
            addAlert({
                description: `An error occurred while toggling the ${ flowType.toLowerCase() } flow status: `
                    + `${ error?.description || error?.message }`,
                level: AlertLevels.ERROR,
                message: "Flow Status Update Error"
            })
        );
    };


    const resolveFlowTypeStatus = (flowType: string): boolean => {
        switch (flowType) {
            case FlowTypes.REGISTRATION:
                return isNewRegistrationPortalEnabled;

        }
    };

    const resolveFlowTypeStatusLabel = (flowType: string): ReactElement => {
        switch (flowType) {
            case FlowTypes.REGISTRATION:
                return resolveFlowTypeStatus(flowType)
                    ? (
                        <div
                            className="status-tag"
                            data-componentid={ `${ componentId }-${ flowType }-configured-status-tag` }
                        >
                            <CircleCheckFilledIcon className="icon-configured"/>
                            <Typography  className="text-configured" variant="h6">
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

        }
    };

    const handleFlowStatusToggle = async (e: MouseEvent<HTMLButtonElement>, flowType: string): Promise<void> => {
        e.stopPropagation();
        switch (flowType) {
            case FlowTypes.REGISTRATION:
                updateGovernanceConnector(
                    {
                        operation: "UPDATE",
                        properties:[ {
                            name: ServerConfigurationsConstants.SELF_REGISTRATION_FLOW_BUILDER_ENABLED,
                            value: !isNewRegistrationPortalEnabled
                        } ]
                    },
                    ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                    ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
                ).then(() => {
                    handleUpdateSuccess(flowType, !isNewRegistrationPortalEnabled);
                    connectorDetailsMutate();
                }).catch((error: IdentityAppsApiException) => {
                    handleFlowStatusUpdateError(flowType, error);
                });

                break;
        }
    };

    return (
        <div className="flow-list-grid-wrapper" data-componentid={ `${ componentId }-grid` }>
            <div className="flow-list-grid">
                { flowData && flowData.flows.length > 0 && (
                    flowData.flows.map((flow: FlowListItemInterface) =>
                        isFeatureEnabled(flowsFeatureConfig, flow.featureStatusKey) && (
                            <Card
                                key={ flow.id }
                                className={ classNames("flow-type", { "disabled": flow.disabled }) }
                                data-componentid={ `${ flow.id }-flow-type-card` }
                                onClick={ () => history.push(AppConstants.getPaths().get(flow.path)) }
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
                                        {  flow.description }
                                    </Typography>
                                </CardContent>
                                {
                                    !flow.disabled && (
                                        <CardActions>
                                            <Button
                                                className="action-button"
                                                onClick={
                                                    (e: MouseEvent<HTMLButtonElement>) =>
                                                        handleFlowStatusToggle(e, flow.type)
                                                }
                                            >
                                                { resolveFlowTypeStatus(flow.type)
                                                    ? "Disable"
                                                    : "Enable"
                                                }
                                            </Button>
                                        </CardActions>
                                    )
                                }
                            </Card>
                        )))
                }
            </div>
        </div>
    );
};

export default FlowList;
