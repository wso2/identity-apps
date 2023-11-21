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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { PrimaryButton } from "@wso2is/react-components";
import { IdentityProviderManagementConstants } from "apps/console/src/features/identity-providers/constants";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetConnections } from "../../../../connections/api/connections";
import { ConnectionInterface } from "../../../../connections/models/connection";
import "./console-login.scss";
import useConsoleSettings from "../../../hooks/use-console-settings";
import { AuthenticationSequenceInterface } from "../../../../applications/models";
import { AutocompleteChangeReason } from "@mui/material";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { addAlert } from "@wso2is/core/store";

/**
 * Props interface of {@link ConsoleLogin}
 */
type ConsoleLoginInterface = IdentifiableComponentInterface;

const BuildingIcon = ({ ...rest }) => (
    <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg" { ...rest }>
        <path
            d="M14.0873 28H0.793651C0.583162 28 0.381293 27.9157 0.232455 27.7657C0.0836165 27.6157 0 27.4122 0 27.2L0 0.8C0 0.587827 0.0836165 0.384344 0.232455 0.234315C0.381293 0.0842855 0.583162 0 0.793651 0L13.2936 0C13.5041 0 13.706 0.0842855 13.8548 0.234315C14.0037 0.384344 14.0873 0.587827 14.0873 0.8V6.4H24.2063C24.4168 6.4 24.6187 6.48429 24.7675 6.63431C24.9164 6.78434 25 6.98783 25 7.2V28H14.0873ZM14.0873 26.8H23.4127C23.5179 26.8 23.6189 26.7579 23.6933 26.6828C23.7677 26.6078 23.8095 26.5061 23.8095 26.4V22.64H14.0873V26.8ZM12.8968 26.8V1.6C12.8968 1.49391 12.855 1.39217 12.7806 1.31716C12.7062 1.24214 12.6052 1.2 12.5 1.2H1.5873C1.48206 1.2 1.38112 1.24214 1.3067 1.31716C1.23228 1.39217 1.19048 1.49391 1.19048 1.6V26.4C1.19048 26.5061 1.23228 26.6078 1.3067 26.6828C1.38112 26.7579 1.48206 26.8 1.5873 26.8H4.34722V22.24C4.34722 22.0278 4.43084 21.8243 4.57968 21.6743C4.72852 21.5243 4.93038 21.44 5.14087 21.44H9.00992C9.22041 21.44 9.42228 21.5243 9.57112 21.6743C9.71995 21.8243 9.80357 22.0278 9.80357 22.24V26.8H12.8968ZM8.61111 26.8V22.64H5.53571V26.8H8.61111ZM23.8095 21.44V8C23.8095 7.89391 23.7677 7.79217 23.6933 7.71716C23.6189 7.64214 23.5179 7.6 23.4127 7.6H14.0873V21.44H23.8095ZM20.7758 18.2V17H21.9663V18.2H20.7758ZM18.3948 18.2V17H19.5853V18.2H18.3948ZM16.0139 18.2V17H17.2044V18.2H16.0139ZM10.0833 18.2V17H11.2738V18.2H10.0833ZM7.70238 18.2V17H8.89286V18.2H7.70238ZM5.32143 18.2V17H6.5119V18.2H5.32143ZM2.94048 18.2V17H4.13095V18.2H2.94048ZM20.7778 15.8V14.6H21.9683V15.8H20.7778ZM18.3968 15.8V14.6H19.5873V15.8H18.3968ZM16.0159 15.8V14.6H17.2063V15.8H16.0159ZM10.0853 15.8V14.6H11.2758V15.8H10.0853ZM7.70436 15.8V14.6H8.89484V15.8H7.70436ZM5.32341 15.8V14.6H6.51389V15.8H5.32341ZM2.94246 15.8V14.6H4.13294V15.8H2.94246ZM20.7798 13.4V12.2H21.9702V13.4H20.7798ZM18.3988 13.4V12.2H19.5893V13.4H18.3988ZM16.0179 13.4V12.2H17.2083V13.4H16.0179ZM10.0873 13.4V12.2H11.2778V13.4H10.0873ZM7.70635 13.4V12.2H8.89683V13.4H7.70635ZM5.3254 13.4V12.2H6.51587V13.4H5.3254ZM2.94444 13.4V12.2H4.13492V13.4H2.94444ZM20.7817 11V9.8H21.9722V11H20.7817ZM18.4008 11V9.8H19.5913V11H18.4008ZM16.0198 11V9.8H17.2103V11H16.0198ZM10.0893 11V9.8H11.2798V11H10.0893ZM7.70833 11V9.8H8.89881V11H7.70833ZM5.32738 11V9.8H6.51786V11H5.32738ZM2.94643 11V9.8H4.1369V11H2.94643ZM10.0893 8.6V7.4H11.2798V8.6H10.0893ZM7.70833 8.6V7.4H8.89881V8.6H7.70833ZM5.32738 8.6V7.4H6.51786V8.6H5.32738ZM2.94643 8.6V7.4H4.1369V8.6H2.94643ZM10.0893 6.2V5H11.2798V6.2H10.0893ZM7.70833 6.2V5H8.89881V6.2H7.70833ZM5.32738 6.2V5H6.51786V6.2H5.32738ZM2.94643 6.2V5H4.1369V6.2H2.94643ZM10.0893 3.8V2.6H11.2798V3.8H10.0893ZM7.70833 3.8V2.6H8.89881V3.8H7.70833ZM5.32738 3.8V2.6H6.51786V3.8H5.32738ZM2.94643 3.8V2.6H4.1369V3.8H2.94643Z"
            fill="#CF3B89"
        />
    </svg>
);

/**
 * Component to render the console login settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login component.
 */
const ConsoleLogin: FunctionComponent<ConsoleLoginInterface> = (props: ConsoleLoginInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { consoleAuthenticationSequence, mutateConsoleConfigurations, updateConsoleLoginFlow } = useConsoleSettings();

    const {
        data: connections,
        isLoading: isConnectionsFetchRequestLoading,
        error: connectionsFetchRequestError,
        mutate: mutateConnectionsFetchRequest
    } = useGetConnections(null, null, null, "federatedAuthenticators");

    const enterpriseIdPs = useMemo(() => {
        if (!connections) {
            return [];
        }

        return connections.identityProviders?.filter(
            (connection: ConnectionInterface) =>
                connection.federatedAuthenticators?.defaultAuthenticatorId !==
                IdentityProviderManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID
        );
    }, [ connections ]);

    const [ selectedEnterpriseIdP, setSelectedEnterpriseIdP ] = useState<ConnectionInterface>(null);

    useEffect(() => {
        if (!consoleAuthenticationSequence || isEmpty(enterpriseIdPs)) {
            return;
        }

        const updatedSequence: AuthenticationSequenceInterface = cloneDeep(consoleAuthenticationSequence);

        const _selectedEnterpriseIdP: ConnectionInterface = enterpriseIdPs.find((idp) => {
            return updatedSequence.steps[0].options.some((option) => {
                return option.idp === idp.name;
            });
        });

        setSelectedEnterpriseIdP(_selectedEnterpriseIdP);
    }, [ consoleAuthenticationSequence, enterpriseIdPs ]);

    const handleEnterpriseIdPChange = (_: SyntheticEvent<Element, Event>, value: {
        label: string;
        idp: ConnectionInterface;
    }, reason: AutocompleteChangeReason): void => {
        const updatedAuthenticationSequence: AuthenticationSequenceInterface = cloneDeep(consoleAuthenticationSequence);

        // If there's a value, that means the user has selected an IdP.
        if (reason === "selectOption") {
            const defaultAuthenticator = value.idp.federatedAuthenticators.authenticators.find((authenticator) => {
                return authenticator.authenticatorId === value.idp.federatedAuthenticators.defaultAuthenticatorId;
            });

            updatedAuthenticationSequence.steps[0].options = [
                ...updatedAuthenticationSequence.steps[0].options,
                {
                    authenticator: defaultAuthenticator.name,
                    idp: value.idp.name
                }
            ];

            setSelectedEnterpriseIdP(value?.idp);
        } else if (reason === "clear") {
            updatedAuthenticationSequence.steps[0].options = updatedAuthenticationSequence.steps[0].options.filter((option) => {
                const defaultAuthenticator = selectedEnterpriseIdP.federatedAuthenticators.authenticators.find((authenticator) => {
                    return authenticator.authenticatorId === selectedEnterpriseIdP.federatedAuthenticators.defaultAuthenticatorId;
                });

                return !(option.idp === selectedEnterpriseIdP.name && option.authenticator === defaultAuthenticator.name);
            });

            setSelectedEnterpriseIdP(null);
        }

        updateConsoleLoginFlow(updatedAuthenticationSequence)
            .then(() => {
                mutateConsoleConfigurations();

                const alert: AlertInterface = {
                    description: `${ value.idp.name } has been added as an enterprise login option.`,
                    message: `${ value.idp.name } added successfully.`
                };

                if (reason === "clear") {
                    alert.description = `${ selectedEnterpriseIdP.name } has been removed as an enterprise login option.`;
                    alert.message = `${ selectedEnterpriseIdP.name } removed successfully.`;
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
                    description: `Couldn't add ${ selectedEnterpriseIdP.name } as an enterprise login option.`,
                    message: `Failed to add ${ selectedEnterpriseIdP.name }`
                };

                if (reason === "clear") {
                    alert.description = `Couldn't remove ${ selectedEnterpriseIdP.name } from the login option list.`;
                    alert.message = `Failed to remove ${ selectedEnterpriseIdP.name }`;
                }

                dispatch(
                    addAlert<AlertInterface>({
                        ...alert,
                        level: AlertLevels.ERROR
                    })
                );
            });

        setSelectedEnterpriseIdP(value?.idp);
    };

    return (
        <div className="console-login-security">
            <Card className="console-login-security-card flex">
                <div className="console-login-security-card-header">
                    <Avatar variant="square" className="enterprise-login-avatar">
                        <BuildingIcon height="18" width="18" />
                    </Avatar>
                    <div className="enterprise-login-header-text">
                        <Typography variant="h5">Enterprise Login</Typography>
                        <Typography variant="body2">
                            Enable login to the Console via your own enterprise Identity Provider.
                        </Typography>
                    </div>
                </div>
                <div className="enterprise-idp-selection">
                    <Autocomplete
                        disablePortal
                        size="small"
                        id="tags-filled"
                        className="enterprise-idp-select-field"
                        options={ enterpriseIdPs.map((idp: ConnectionInterface) => {
                            return {
                                idp,
                                label: idp.name
                            };
                        }) }
                        renderInput={ (params: AutocompleteRenderInputParams) => (
                            <TextField
                                id="enterprise-idp-selection-text-field"
                                { ...params }
                                placeholder={ "Select an IdP" }
                            />
                        ) }
                        onChange={ handleEnterpriseIdPChange }
                        value={
                            selectedEnterpriseIdP
                                ? {
                                    label: selectedEnterpriseIdP?.name,
                                    idp: selectedEnterpriseIdP
                                }
                                : null
                        }
                    />
                </div>
            </Card>
        </div>
    );
};

/**
 * Default props for the component.
 */
ConsoleLogin.defaultProps = {
    "data-componentid": "console-login"
};

export default ConsoleLogin;
