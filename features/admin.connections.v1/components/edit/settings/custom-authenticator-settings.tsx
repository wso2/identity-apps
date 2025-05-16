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

import Button from "@oxygen-ui/react/Button";
import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import { AuthenticationType, EndpointConfigFormPropertyInterface } from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import {
    FederatedAuthenticatorInterface,
    FederatedAuthenticatorListItemInterface
} from "@wso2is/admin.identity-providers.v1/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    getFederatedAuthenticatorDetails,
    updateCustomAuthenticator,
    updateFederatedAuthenticator
} from "../../../api/connections";
import {
    AuthenticationPropertiesInterface,
    ConnectionInterface,
    CustomAuthConnectionInterface,
    EndpointAuthenticationType,
    EndpointAuthenticationUpdateInterface
} from "../../../models/connection";
import {
    handleConnectionUpdateError,
    handleCustomAuthenticatorUpdateError,
    handleGetCustomAuthenticatorError
} from "../../../utils/connection-utils";
import "./custom-authenticator-settings.scss";

/**
 * Proptypes for the Custom Local Authenticator edit page component.
 */
export interface CustomAuthenticatorSettingsPagePropsInterface extends IdentifiableComponentInterface {
    /**
     * Is the authenticator a custom local authenticator.
     */
    isCustomLocalAuthenticator: boolean;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Connection details.
     */
    connector: CustomAuthConnectionInterface | ConnectionInterface;
    /**
     * Callback to update the connector details.
     */
    onUpdate: (id: string, tabName?: string) => void;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Custom authenticator settings page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const CustomAuthenticatorSettings: FunctionComponent<CustomAuthenticatorSettingsPagePropsInterface> = ({
    isCustomLocalAuthenticator,
    isLoading,
    isReadOnly,
    connector,
    onUpdate,
    loader: Loader,
    ["data-componentid"]: componentId = "custom-authenticator-settings-page"
}: CustomAuthenticatorSettingsPagePropsInterface): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ initialValues, setInitialValues ] = useState<EndpointConfigFormPropertyInterface>(null);
    const [ endpointAuthenticationType, setEndpointAuthenticationType ] = useState<AuthenticationType>(null);
    const [ isEndpointAuthenticationUpdated, setIsEndpointAuthenticationUpdated ] = useState<boolean>(false);
    const [ isEndpointDetailsLoading, setIsEndpointDetailsLoading ] = useState<boolean>(false);

    useEffect(() => {
        if (isCustomLocalAuthenticator) {
            setInitialValues({
                authenticationType: (connector as CustomAuthConnectionInterface)?.endpoint?.authentication?.type,
                endpointUri: (connector as CustomAuthConnectionInterface)?.endpoint?.uri
            });
        } else {
            const customAuthenticatorId: string = connector?.federatedAuthenticators?.
                authenticators[0]?.authenticatorId;

            getCustomFederatedAuthenticatorInitialValues(customAuthenticatorId);
        }
    }, []);

    /**
     * This function is utilized only for custom federated authenticators since endpoint details are not
     * returned from the get IDP API. Therefore, the specific federated authenticator GET API is triggered.
     *
     * This is not required for other connections since all the required details
     * are passed from the parent component.
     *
     * @param customFederatedAuthenticatorId - Custom federated authenticator id.
     */
    const getCustomFederatedAuthenticatorInitialValues = (customFederatedAuthenticatorId: string) => {
        setIsEndpointDetailsLoading(true);
        getFederatedAuthenticatorDetails(connector?.id, customFederatedAuthenticatorId)
            .then((data: FederatedAuthenticatorListItemInterface) => {
                const endpointAuth: EndpointConfigFormPropertyInterface = {
                    authenticationType: data?.endpoint?.authentication?.type,
                    endpointUri: data?.endpoint?.uri
                };

                setInitialValues(endpointAuth);
            })
            .catch((error: AxiosError) => {
                handleGetCustomAuthenticatorError(error);
            }).finally(() => {
                setIsEndpointDetailsLoading(false);
            });
    };

    const resolveDisplayName = (): string => {
        if (isCustomLocalAuthenticator) {
            return (connector as CustomAuthConnectionInterface)?.displayName;
        } else {
            return (connector as ConnectionInterface)?.name;
        }
    };

    const validateForm = (values: EndpointConfigFormPropertyInterface):
        Partial<EndpointConfigFormPropertyInterface> => {

        return validateActionEndpointFields(values, {
            authenticationType: endpointAuthenticationType,
            isAuthenticationUpdateFormState: isEndpointAuthenticationUpdated
        });
    };

    /**
     * Update custom local authenticator.
     *
     * @param values - Form values.
     * @param authProperties - Endpoint authentication properties.
     */
    const handleUpdateCustomLocalAuthenticator = (
        values: EndpointConfigFormPropertyInterface,
        authProperties: Partial<AuthenticationPropertiesInterface>
    ) => {
        const updatingValues: EndpointAuthenticationUpdateInterface = {
            description: connector.description,
            displayName: resolveDisplayName(),
            endpoint: {
                authentication: {
                    properties: authProperties,
                    type: values.authenticationType as EndpointAuthenticationType
                },
                uri: values?.endpointUri
            },
            image: connector.image,
            isEnabled: connector.isEnabled,
            isPrimary: connector.isPrimary
        };

        updateCustomAuthenticator(connector.id, updatingValues as CustomAuthConnectionInterface)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("authenticationProvider:notifications.updateIDP.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("authenticationProvider:notifications.updateIDP.success.message")
                    })
                );
                onUpdate(connector.id);
            })
            .catch((error: AxiosError) => {
                handleConnectionUpdateError(error);
            });
    };

    /**
     * Update custom federated authenticator.
     *
     * @param values - Form values.
     * @param changedFields - Changed fields.
     * @param authProperties - Endpoint authentication properties.
     */
    const handleUpdateCustomFederatedAuthenticator = (
        values: EndpointConfigFormPropertyInterface,
        authProperties: Partial<AuthenticationPropertiesInterface>
    ) => {
        const federatedAuthenticatorId: string =
            connector?.federatedAuthenticators?.authenticators[0]?.authenticatorId;
        const updatingValues: FederatedAuthenticatorInterface = {
            authenticatorId: federatedAuthenticatorId,
            endpoint: {
                authentication: {
                    properties: authProperties,
                    type: values.authenticationType as EndpointAuthenticationType
                },
                uri: values.endpointUri
            },
            isDefault: true,
            isEnabled: connector.isEnabled
        };

        updateFederatedAuthenticator(connector.id, updatingValues)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "customAuthenticator:notifications.updateCustomAuthenticator.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t("customAuthenticator:notifications.updateCustomAuthenticator.success.message")
                    })
                );
                onUpdate(connector.id);
            })
            .catch((error: AxiosError) => {
                handleCustomAuthenticatorUpdateError(error);
            });
    };

    const handleSubmit = (
        values: EndpointConfigFormPropertyInterface
    ) => {
        const authProperties: Partial<AuthenticationPropertiesInterface> = {};

        switch (values.authenticationType) {
            case AuthenticationType.BASIC:
                authProperties.username = values.usernameAuthProperty;
                authProperties.password = values.passwordAuthProperty;

                break;
            case AuthenticationType.BEARER:
                authProperties.accessToken = values.accessTokenAuthProperty;

                break;
            case AuthenticationType.API_KEY:
                authProperties.header = values.headerAuthProperty;
                authProperties.value = values.valueAuthProperty;

                break;
            case AuthenticationType.NONE:
                break;
            default:
                break;
        }

        if (isCustomLocalAuthenticator) {
            handleUpdateCustomLocalAuthenticator(values, authProperties);

            return;
        } else {
            handleUpdateCustomFederatedAuthenticator(values, authProperties);
        }
    };

    if (isLoading || isEndpointDetailsLoading) {
        return <Loader />;
    }

    return (
        <div className="custom-authenticator-settings-tab">
            <FinalForm
                onSubmit={ handleSubmit }
                initialValues={ initialValues }
                validate={ validateForm }
                render={ ({ handleSubmit }: FormRenderProps) => (
                    <EmphasizedSegment
                        className="endpoint-settings-container"
                        padded={ "very" }
                        data-componentid={ `${componentId}-section` }
                    >
                        <div className="form-container with-max-width">
                            <ActionEndpointConfigForm
                                initialValues={ initialValues }
                                isCreateFormState={ false }
                                isReadOnly={ isReadOnly }
                                onAuthenticationTypeChange={ (
                                    authenticationType: AuthenticationType,
                                    isAuthenticationUpdated: boolean
                                ) => {
                                    setEndpointAuthenticationType(authenticationType);
                                    setIsEndpointAuthenticationUpdated(isAuthenticationUpdated);
                                } }
                            />
                            { !isLoading && !isReadOnly && (
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={ handleSubmit }
                                    className={ "button-container" }
                                    data-componentid={ `${componentId}-update-button` }
                                >
                                    { t("actions:buttons.update") }
                                </Button>
                            ) }
                        </div>
                    </EmphasizedSegment>
                ) }
            ></FinalForm>
        </div>
    );
};

export default CustomAuthenticatorSettings;
