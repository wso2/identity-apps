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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, useMediaContext } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, MouseEvent, PropsWithChildren, ReactNode } from "react";
// import { Card, Grid, Header, Icon, List, Menu, Message, SemanticICONS } from "semantic-ui-react";

/**
 * Prop-types for the settings section component. See also
 * {@link SettingsSection.defaultProps}
 */
interface SettingsSectionProps extends IdentifiableComponentInterface {
    className?: string;
    contentPadding?: boolean;
    description?: string;
    connectorEnabled?: boolean;
    header: string;
    icon?: FunctionComponent | ReactNode;
    onPrimaryActionClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent) => void;
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent) => void;
    placeholder?: ReactNode;
    primaryAction?: FunctionComponent | ReactNode;
    primaryActionDisabled?: boolean;
    secondaryAction?: FunctionComponent | ReactNode;
    secondaryActionDisabled?: boolean;
    showActionBar?: boolean;
    topActionBar?: ReactNode;
}

/**
 * Settings section component.
 *
 * @param props - Props injected to the component.
 * @returns Settings section component.
 */
export const SettingsSection: FunctionComponent<PropsWithChildren<SettingsSectionProps>> = (
    props: PropsWithChildren<SettingsSectionProps>
): JSX.Element => {

    const {
        description,
        connectorEnabled,
        header,
        icon,
        placeholder,
        onPrimaryActionClick
    } = props;

    return (

        <Card
            position="relative"
            className={ connectorEnabled ? "notification-channel" : "notification-channel-disabled" }
            onClick={ onPrimaryActionClick }
        >
            <CardContent className="notification-channel-header">
                <div className="">
                    <GenericIcon
                        size="micro"
                        icon={ icon }
                        inline
                        transparent
                        shape={ "square" }
                        style={ {
                            "display": "inline",
                            "verticalAlign": "text-bottom"
                        } }
                    />
                </div>
                <div>
                    <Typography variant="h6">
                        { header }
                    </Typography>
                </div>
            </CardContent>
            <CardContent className="notification-channel-description">
                <Typography variant="body2" color="text.secondary">
                    { description }
                </Typography>
            </CardContent>

            { placeholder && (
                <Paper
                    className="notification-channel-note"
                >
                    <Typography variant="body1">
                        { placeholder }
                    </Typography>
                </Paper>
            ) }
        </Card>


    );
};

/**
 * Default proptypes for the settings section component.
 */
SettingsSection.defaultProps = {
    className: "",
    contentPadding: false,
    "data-componentid": "settings-section",
    description: "",
    header: "",
    primaryAction: "",
    primaryActionDisabled: false,
    showActionBar: true,
    topActionBar: null
};
