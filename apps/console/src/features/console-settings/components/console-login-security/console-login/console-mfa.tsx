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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Switch from "@oxygen-ui/react/Switch";
import Typography from "@oxygen-ui/react/Typography";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetConnections } from "../../../../connections/api/connections";
import { ConnectionInterface } from "../../../../connections/models/connection";
import "./console-mfa.scss";
import { useGetAuthenticators } from "../../../../connections/api/authenticators";
import { AuthenticatorInterface } from "../../../../connections/models/authenticators";
import { AuthenticatorMeta } from "../../../../connections/meta/authenticator-meta";
import useConsoleSettings from "../../../hooks/use-console-settings";
import { AuthenticationSequenceInterface } from "../../../../applications/models/application";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

/**
 * Props interface of {@link ConsoleMFA}
 */
type ConsoleMFAInterface = IdentifiableComponentInterface;

const PadlockIcon = ({ ...rest }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
        <path
            d="M16 1.91992C11.7525 1.91992 8.31997 5.35242 8.31997 9.59992V12.7999H5.75997C4.70747 12.7999 3.83997 13.6674 3.83997 14.7199V30.0799C3.83997 31.1324 4.70747 31.9999 5.75997 31.9999H26.24C27.2925 31.9999 28.16 31.1324 28.16 30.0799V14.7199C28.16 13.6674 27.2925 12.7999 26.24 12.7999H23.68V9.59992C23.68 5.35242 20.2475 1.91992 16 1.91992ZM16 3.19992C19.5625 3.19992 22.4 6.03742 22.4 9.59992V12.7999H9.59997V9.59992C9.59997 6.03742 12.4375 3.19992 16 3.19992ZM26.24 14.0799C26.595 14.0799 26.88 14.3649 26.88 14.7199V30.0799C26.88 30.4349 26.595 30.7199 26.24 30.7199H5.75997C5.40497 30.7199 5.11997 30.4349 5.11997 30.0799V14.7199C5.11997 14.3649 5.40497 14.0799 5.75997 14.0799H26.24ZM16 19.1999C14.9125 19.1999 14.08 20.0324 14.08 21.1199C14.08 21.6949 14.335 22.1999 14.72 22.5199V24.3199C14.72 25.0249 15.295 25.5999 16 25.5999C16.705 25.5999 17.28 25.0249 17.28 24.3199V22.5199C17.665 22.1999 17.92 21.6949 17.92 21.1199C17.92 20.0324 17.0875 19.1999 16 19.1999Z"
            fill="#7186D1"
        />
        <path
            d="M16 1.91992C11.7525 1.91992 8.31997 5.35242 8.31997 9.59992V12.7999H5.75997C4.70747 12.7999 3.83997 13.6674 3.83997 14.7199V30.0799C3.83997 31.1324 4.70747 31.9999 5.75997 31.9999H26.24C27.2925 31.9999 28.16 31.1324 28.16 30.0799V14.7199C28.16 13.6674 27.2925 12.7999 26.24 12.7999H23.68V9.59992C23.68 5.35242 20.2475 1.91992 16 1.91992ZM16 3.19992C19.5625 3.19992 22.4 6.03742 22.4 9.59992V12.7999H9.59997V9.59992C9.59997 6.03742 12.4375 3.19992 16 3.19992ZM26.24 14.0799C26.595 14.0799 26.88 14.3649 26.88 14.7199V30.0799C26.88 30.4349 26.595 30.7199 26.24 30.7199H5.75997C5.40497 30.7199 5.11997 30.4349 5.11997 30.0799V14.7199C5.11997 14.3649 5.40497 14.0799 5.75997 14.0799H26.24ZM16 19.1999C14.9125 19.1999 14.08 20.0324 14.08 21.1199C14.08 21.6949 14.335 22.1999 14.72 22.5199V24.3199C14.72 25.0249 15.295 25.5999 16 25.5999C16.705 25.5999 17.28 25.0249 17.28 24.3199V22.5199C17.665 22.1999 17.92 21.6949 17.92 21.1199C17.92 20.0324 17.0875 19.1999 16 19.1999Z"
            stroke="#7186D1"
        />
    </svg>
);

/**
 * Component to render the console login settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login component.
 */
const ConsoleMFA: FunctionComponent<ConsoleMFAInterface> = (props: ConsoleMFAInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleAuthenticationSequence, mutateConsoleConfigurations, updateConsoleLoginFlow } = useConsoleSettings();

    const {
        data: authenticators,
        isLoading: isAuthenticatorsFetchRequestLoading,
        error: authenticatorsFetchRequestError,
        mutate: mutateAuthenticatorsFetchRequest
    } = useGetAuthenticators("tag eq MFA");

    const modifyMFAFactors = (authenticator: AuthenticatorInterface, shouldAdd: boolean) => {
        const updatedAuthenticationSequence: AuthenticationSequenceInterface = cloneDeep(consoleAuthenticationSequence);

        // If there's already a second step, append the new authenticator to the end of the sequence.
        if (updatedAuthenticationSequence.steps.length > 1) {
            if (shouldAdd) {
                updatedAuthenticationSequence.steps[1] = {
                    ...updatedAuthenticationSequence.steps[1],
                    options: [
                        ...updatedAuthenticationSequence.steps[1].options,
                        {
                            authenticator: authenticator.name,
                            idp: "LOCAL"
                        }
                    ]
                };
            } else {
                if (updatedAuthenticationSequence.steps[1].options.length === 1) {
                    updatedAuthenticationSequence.steps.splice(1, 1);
                } else {
                    updatedAuthenticationSequence.steps[1] = {
                        ...updatedAuthenticationSequence.steps[1],
                        options: updatedAuthenticationSequence.steps[1].options.filter(
                            option => option.authenticator !== authenticator.name
                        )
                    };
                }
            }
        } else {
            updatedAuthenticationSequence.steps.push({
                id: 2,
                options: [
                    {
                        authenticator: authenticator.name,
                        idp: "LOCAL"
                    }
                ]
            });
        }

        updateConsoleLoginFlow(updatedAuthenticationSequence)
            .then(() => {
                mutateConsoleConfigurations();

                const alert: AlertInterface = {
                    description: `${authenticator.displayName} has been added as a second factor option.`,
                    message: `${authenticator.displayName} added successfully.`
                };

                if (!shouldAdd) {
                    alert.description = `${authenticator.displayName} has been removed from the second factor option list.`;
                    alert.message = `${authenticator.displayName} removed successfully.`;
                }

                dispatch(
                    addAlert<AlertInterface>({
                        ...alert,
                        level: AlertLevels.SUCCESS
                    })
                );
            })
            .catch(() => {
                const alert: AlertInterface = {
                    description: `Couldn't add ${authenticator.displayName} as a second factor option.`,
                    message: `Failed to add ${authenticator.displayName}`
                };

                if (!shouldAdd) {
                    alert.description = `Couldn't remove ${authenticator.displayName} from the second factor option list.`;
                    alert.message = `Failed to remove ${authenticator.displayName}`;
                }

                dispatch(
                    addAlert<AlertInterface>({
                        ...alert,
                        level: AlertLevels.ERROR
                    })
                );
            });
    };

    return (
        <div className="console-login-security">
            <Card className="console-login-security-card">
                <div className="console-login-security-card-header">
                    <Avatar variant="square" className="mfa-login-avatar">
                        <PadlockIcon height="18" width="18" />
                    </Avatar>
                    <div className="enterprise-login-header-text">
                        <Typography variant="h5">Second Factor Login</Typography>
                        <Typography variant="body2">
                            Enable multi factor authentication to better protect your workspace
                        </Typography>
                    </div>
                </div>
                <div className="mfa-cards">
                    { authenticators?.map((authenticator: AuthenticatorInterface) => (
                        <Card key={ authenticator.id }>
                            <CardContent>
                                <div className="enterprise-login-header-text">
                                    <Typography className="factor-name">
                                        <Switch
                                            size="small"
                                            onChange={ (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                                modifyMFAFactors(authenticator, checked);
                                            } }
                                            checked={ consoleAuthenticationSequence?.steps[1]?.options?.some(
                                                option => option.authenticator === authenticator.name
                                            ) }
                                            inputProps={ { "aria-label": "controlled" } }
                                        />
                                        <GenericIcon
                                            size="micro"
                                            icon={ AuthenticatorMeta.getAuthenticatorIcon(authenticator.id) }
                                        />
                                        { authenticator.displayName }
                                    </Typography>
                                    <Typography variant="body2">
                                        { AuthenticatorMeta.getAuthenticatorDescription(authenticator.id) }
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    )) }
                </div>
            </Card>
        </div>
    );
};

/**
 * Default props for the component.
 */
ConsoleMFA.defaultProps = {
    "data-componentid": "console-login"
};

export default ConsoleMFA;
