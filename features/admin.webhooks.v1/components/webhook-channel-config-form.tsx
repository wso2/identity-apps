/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import "./webhook-channel-config-form.scss";
import Box from "@oxygen-ui/react/Box";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Typography from "@oxygen-ui/react/Typography";
import { EMPTY_ARRAY } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import WebhookChannelAccordionItem from "./webhook-channel-accordion-item";
import { WebhookChannelConfigInterface } from "../models/event-profile";
import { ChannelStatus, WebhookChannelSubscriptionInterface } from "../models/webhooks";

interface WebhookChannelConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Specifies the channel configurations for the form.
     */
    channelConfigs: WebhookChannelConfigInterface[];
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Current channel subscriptions with status.
     */
    channelSubscriptions?: WebhookChannelSubscriptionInterface[];
    /**
     * ID of the webhook being edited. Absent while creating.
     */
    webhookId?: string;
    /**
     * Whether the organization has child organizations.
     */
    isChildOrganizationsAvailable?: boolean;
    /**
     * Whether child organization subscription is switched on for this deployment.
     */
    isChildOrgSubscriptionEnabled?: boolean;
    /**
     * Organization selection validation messages, keyed by channel key.
     */
    channelOrganizationErrors?: Record<string, string>;
}

const WebhookChannelConfigForm: FunctionComponent<WebhookChannelConfigFormInterface> = ({
    channelConfigs,
    isReadOnly,
    channelSubscriptions = EMPTY_ARRAY,
    webhookId,
    isChildOrganizationsAvailable = false,
    isChildOrgSubscriptionEnabled = false,
    channelOrganizationErrors,
    ["data-componentid"]: _componentId = "webhook-channel-config-form"
}: WebhookChannelConfigFormInterface): ReactElement => {

    const { t } = useTranslation();

    // Expansion is held here rather than per row so that opening one channel closes the
    // previously open one.
    const [ expandedChannelKey, setExpandedChannelKey ] = useState<string>(null);

    /**
     * Get channel status for a given channel URI.
     */
    const getChannelStatus = (channelUri: string): ChannelStatus | null => {
        const subscription: WebhookChannelSubscriptionInterface | undefined = channelSubscriptions.find(
            (sub: WebhookChannelSubscriptionInterface) => sub.channelUri === channelUri
        );

        return subscription?.status || null;
    };

    /**
     * Get status configuration including icon, color, and text.
     */
    const getStatusConfig = (status: ChannelStatus | null) => {
        switch (status) {
            case ChannelStatus.SUBSCRIPTION_ACCEPTED:
                return {
                    color: "success",
                    icon: "check",
                    iconColor: "green" as const,
                    text: t("webhooks:configForm.channels.status.subscriptionAccepted")
                };
            case ChannelStatus.SUBSCRIPTION_ERROR:
                return {
                    color: "warning",
                    icon: "exclamation triangle",
                    iconColor: "orange" as const,
                    text: t("webhooks:configForm.channels.status.subscriptionError")
                };
            case ChannelStatus.UNSUBSCRIPTION_ACCEPTED:
                return {
                    color: "success",
                    icon: "check",
                    iconColor: "green" as const,
                    text: t("webhooks:configForm.channels.status.unsubscriptionAccepted")
                };
            case ChannelStatus.UNSUBSCRIPTION_ERROR:
                return {
                    color: "warning",
                    icon: "exclamation triangle",
                    iconColor: "orange" as const,
                    text: t("webhooks:configForm.channels.status.unsubscriptionError")
                };
            default:
                return null;
        }
    };

    /**
     * Render status indicator with icon and label.
     */
    const renderStatusIndicator = (channel: WebhookChannelConfigInterface): ReactElement | null => {
        const channelStatus: ChannelStatus | null = getChannelStatus(channel.channelUri);
        const statusConfig: ReturnType<typeof getStatusConfig> = getStatusConfig(channelStatus);

        if (!statusConfig) {
            return null;
        }

        return (
            <span className={ `channel-status-inline ${statusConfig.color}` }>
                <Icon
                    className="status-icon"
                    name={ statusConfig.icon as any }
                    color={ statusConfig.iconColor }
                    size="small"
                />
                { statusConfig.text }
            </span>
        );
    };

    return (
        <div className="webhook-channel-config-form">
            <FormLabel component="legend" required className="heading-container">
                { t("webhooks:configForm.channels.heading") }
            </FormLabel>
            <Typography variant="body2" color="text.secondary" className="section-description">
                { t("webhooks:configForm.channels.subHeading") }
            </Typography>
            <Box className="channel-accordion-list" data-componentid={ `${_componentId}-accordion-list` }>
                { channelConfigs.map((channel: WebhookChannelConfigInterface) => (
                    <WebhookChannelAccordionItem
                        key={ channel.key }
                        channel={ channel }
                        isReadOnly={ isReadOnly }
                        isExpanded={ expandedChannelKey === channel.key }
                        onExpandedChange={ (expanded: boolean) =>
                            setExpandedChannelKey(expanded ? channel.key : null) }
                        webhookId={ webhookId }
                        isChildOrganizationsAvailable={ isChildOrganizationsAvailable }
                        isChildOrgSubscriptionEnabled={ isChildOrgSubscriptionEnabled }
                        storedSubscriptionPolicy={
                            channelSubscriptions.find(
                                (sub: WebhookChannelSubscriptionInterface) =>
                                    sub.channelUri === channel.channelUri
                            )?.childOrgSubscription?.subscriptionPolicy
                        }
                        statusIndicator={ renderStatusIndicator(channel) }
                        organizationsError={ channelOrganizationErrors?.[channel.key] }
                        data-componentid={ _componentId }
                    />
                )) }
            </Box>
        </div>
    );
};

export default WebhookChannelConfigForm;
