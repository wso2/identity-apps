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

import "./webhook-channel-config-form.scss";
import { Box, FormGroup, Grid, Typography } from "@mui/material";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField } from "@wso2is/form/src";
import CheckboxAdapter from "@wso2is/form/src/components/adapters/checkbox-field-adapter";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { WebhookChannelConfigInterface } from "../models/event-profile";

interface WebhookChannelConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Specifies the channel configurations for the form.
     */
    channelConfigs: WebhookChannelConfigInterface[];
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
}

const WebhookChannelConfigForm: FunctionComponent<WebhookChannelConfigFormInterface> = ({
    channelConfigs,
    isReadOnly,
    ["data-componentid"]: _componentId = "webhook-channel-config-form"
}: WebhookChannelConfigFormInterface): ReactElement => {
    const defaultChannels: WebhookChannelConfigInterface[] = channelConfigs;

    const { t } = useTranslation();

    const renderChannelCheckbox = (channel: WebhookChannelConfigInterface): ReactElement => {
        return (
            <Box key={ channel.key } className="channel-checkbox-container">
                <Box className="checkbox-control">
                    <FinalFormField
                        ariaLabel={ channel.name }
                        data-componentid={ `${_componentId}-${channel.key}-checkbox` }
                        name={ `channels.${channel.key}` }
                        component={ CheckboxAdapter }
                        disabled={ isReadOnly }
                        label={
                            (<Box className="checkbox-label">
                                <Typography variant="body1" component="div" className="channel-name">
                                    { channel.name }
                                </Typography>
                                <Typography variant="caption" component="div" className="hint-text channel-description">
                                    { channel.description }
                                </Typography>
                            </Box>)
                        }
                    />
                </Box>
            </Box>
        );
    };

    const renderChannelSelection = (): ReactElement => {
        const leftColumnChannels: WebhookChannelConfigInterface[] = defaultChannels.slice(0,
            Math.ceil(defaultChannels.length / 2));
        const rightColumnChannels: WebhookChannelConfigInterface[] = defaultChannels.slice(
            Math.ceil(defaultChannels.length / 2)
        );

        return (
            <Grid container spacing={ 3 } className="channel-grid">
                <Grid item xs={ 12 } md={ 6 }>
                    <FormGroup>
                        { leftColumnChannels.map((channel: WebhookChannelConfigInterface) =>
                            renderChannelCheckbox(channel)) }
                    </FormGroup>
                </Grid>
                <Grid item xs={ 12 } md={ 6 }>
                    <FormGroup>
                        { rightColumnChannels.map(
                            (channel: WebhookChannelConfigInterface) =>
                                renderChannelCheckbox(channel)
                        ) }
                    </FormGroup>
                </Grid>
            </Grid>
        );
    };

    return (
        <div className="webhook-channel-config-form">
            <Typography variant="h6" className="heading-container">
                { t("webhooks:configForm.channels.heading") }
            </Typography>
            <Typography variant="body2" color="text.secondary" className="section-description">
                { t("webhooks:configForm.channels.subHeading") }
            </Typography>
            { renderChannelSelection() }
        </div>
    );
};

export default WebhookChannelConfigForm;
