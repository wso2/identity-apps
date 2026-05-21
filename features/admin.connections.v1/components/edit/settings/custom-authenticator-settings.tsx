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
import { ActionsConstants } from "@wso2is/admin.actions.v1/constants/actions-constants";
import { AuthenticationType, EndpointConfigFormPropertyInterface } from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import {
    FederatedAuthenticatorInterface,
    FederatedAuthenticatorListItemInterface
} from "@wso2is/admin.identity-providers.v1/models";
import { AlertLevels, IdentifiableComponentInterface,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/forms";
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
    EndpointAuthenticationUpdateInterface,
    ExternalEndpoint
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
interface CustomAuthenticatorSettingsPagePropsInterface extends IdentifiableComponentInterface {
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
const CustomAuthenticatorSettings: FunctionComponent<CustomAuthenticatorSettingsPagePropsInterface> = ({
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

    /**
     * Builds initial form values from an endpoint configuration, populating
     * the non-secret auth-type-specific fields so the Authentication section
     * shows the previously saved values. Secrets (password, clientSecret,
     * accessToken, value) are intentionally omitted because the API does not
     * return them.
     */
    const buildEndpointInitialValues = (
        endpoint: ExternalEndpoint
    ): EndpointConfigFormPropertyInterface => {
        const authProperties: Partial<AuthenticationPropertiesInterface> =
            endpoint?.authentication?.properties ?? {};
        const authType: EndpointAuthenticationType = endpoint?.authentication?.type;
        const values: EndpointConfigFormPropertyInterface = {
            allowedHeaders: endpoint?.allowedHeaders,
            allowedParameters: endpoint?.allowedParameters,
            authenticationType: authType,
            endpointUri: endpoint?.uri
        };

        switch (authType) {
            case EndpointAuthenticationType.BASIC:
                values.usernameAuthProperty = authProperties?.username;

                break;
            case EndpointAuthenticationType.API_KEY:
                values.headerAuthProperty = authProperties?.header;

                break;
            case EndpointAuthenticationType.CLIENT_CREDENTIAL:
                values.clientIdAuthProperty = authProperties?.clientId;
                values.tokenEndpointAuthProperty = authProperties?.tokenEndpoint;
                values.scopesAuthProperty = authProperties?.scopes;

                break;
            case EndpointAuthenticationType.PASSWORD_CREDENTIAL:
                values.clientId_passwordCredentialAuthProperty = authProperties?.clientId;
                values.tokenEndpoint_passwordCredentialAuthProperty = authProperties?.tokenEndpoint;
                values.username_passwordCredentialAuthProperty = authProperties?.username;
                values.scopes_passwordCredentialAuthProperty = authProperties?.scopes;

                break;
            default:
                break;
        }

        return values;
    };

    useEffect(() => {
        if (isCustomLocalAuthenticator) {
            setInitialValues(
                buildEndpointInitialValues((connector as CustomAuthConnectionInterface)?.endpoint)
            );
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
                setInitialValues(buildEndpointInitialValues(data?.endpoint as ExternalEndpoint));
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
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
                allowedHeaders: values?.allowedHeaders,
                allowedParameters: values?.allowedParameters,
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
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
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
                allowedHeaders: values?.allowedHeaders,
                allowedParameters: values?.allowedParameters,
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
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                handleCustomAuthenticatorUpdateError(error);
            });
    };

    const handleSubmit = (
        values: EndpointConfigFormPropertyInterface
    ) => {
        const authProperties: Partial<AuthenticationPropertiesInterface> = {};

        if (!isEndpointAuthenticationUpdated) {
            if (isCustomLocalAuthenticator) {
                handleUpdateCustomLocalAuthenticator(values, authProperties);

                return;
            }
            handleUpdateCustomFederatedAuthenticator(values, authProperties);

            return;
        }

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
            case AuthenticationType.CLIENT_CREDENTIAL:
                authProperties.clientId = values.clientIdAuthProperty;
                authProperties.clientSecret = values.clientSecretAuthProperty;
                authProperties.tokenEndpoint = values.tokenEndpointAuthProperty;
                authProperties.scopes = values.scopesAuthProperty;

                break;
            case AuthenticationType.PASSWORD_CREDENTIAL:
                authProperties.clientId = values.clientId_passwordCredentialAuthProperty;
                authProperties.clientSecret = values.clientSecret_passwordCredentialAuthProperty;
                authProperties.tokenEndpoint = values.tokenEndpoint_passwordCredentialAuthProperty;
                authProperties.username = values.username_passwordCredentialAuthProperty;
                authProperties.password = values.password_passwordCredentialAuthProperty;
                authProperties.scopes = values.scopes_passwordCredentialAuthProperty;

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
                                authenticationTypes={ ActionsConstants.ACTION_AUTH_TYPES }
                                onAuthenticationTypeChange={ (
                                    authenticationType: AuthenticationType,
                                    isAuthenticationUpdated: boolean
                                ) => {
                                    setEndpointAuthenticationType(authenticationType);
                                    setIsEndpointAuthenticationUpdated(isAuthenticationUpdated);
                                } }
                                showHeadersAndParams={ true }
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
