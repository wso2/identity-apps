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

import Button from "@oxygen-ui/react/Button";
import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import {
    AuthenticationType,
    EndpointConfigFormPropertyInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/forms";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import { FormApi } from "final-form";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import updateFlowExtension from "../../api/update-flow-extension";
import { FlowExtensionConstants } from "../../constants/flow-extension-constants";
import {
    FlowExtensionEndpointInterface,
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "../../models/flow-extension";

/**
 * Props for the Flow Extension endpoint settings tab.
 */
interface FlowExtensionEndpointSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The Flow Extension being edited.
     */
    flowExtension: FlowExtensionResponseInterface;
    /**
     * Whether the parent resource is still loading.
     */
    isLoading?: boolean;
    /**
     * Whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Callback to refresh the Flow Extension after an update.
     */
    mutateFlowExtension: () => void;
}

/**
 * Build the endpoint form's initial values from the Flow Extension response. The API returns the
 * raw endpoint shape (`uri`, `authentication.type`, `authentication.properties`); this maps it into
 * the form shape (`endpointUri`, `authenticationType`, per-property fields) the config form expects.
 *
 * @param endpoint - Endpoint section of the Flow Extension response.
 * @returns Initial values for the endpoint configuration form.
 */
const buildEndpointInitialValues = (
    endpoint: FlowExtensionEndpointInterface
): EndpointConfigFormPropertyInterface => {
    const authProperties: Record<string, string> = endpoint?.authentication?.properties ?? {};
    const authenticationType: AuthenticationType =
        (endpoint?.authentication?.type as AuthenticationType) ?? AuthenticationType.NONE;

    const values: EndpointConfigFormPropertyInterface = {
        allowedHeaders: endpoint?.allowedHeaders ?? [],
        authenticationType,
        endpointUri: endpoint?.uri ?? ""
    };

    // Pre-populate the non-secret auth fields so they round-trip on edit. Secrets (password, access
    // token, client secret, API key value) are never returned by the backend and must be re-entered
    // when changing authentication.
    switch (authenticationType) {
        case AuthenticationType.BASIC:
            values.usernameAuthProperty = authProperties?.username;

            break;
        case AuthenticationType.API_KEY:
            values.headerAuthProperty = authProperties?.header;

            break;
        case AuthenticationType.CLIENT_CREDENTIAL:
            values.clientIdAuthProperty = authProperties?.clientId;
            values.tokenEndpointAuthProperty = authProperties?.tokenEndpoint;
            values.scopesAuthProperty = authProperties?.scopes;

            break;
        default:
            break;
    }

    return values;
};

/**
 * Endpoint configuration tab of the Flow Extension edit page.
 *
 * @param props - Props injected to the component.
 * @returns Flow Extension endpoint settings component.
 */
const FlowExtensionEndpointSettings: FunctionComponent<FlowExtensionEndpointSettingsPropsInterface> = ({
    flowExtension,
    isLoading,
    isReadOnly,
    mutateFlowExtension,
    ["data-componentid"]: componentId = "flow-extension-endpoint-settings"
}: FlowExtensionEndpointSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ endpointAuthType, setEndpointAuthType ] = useState<AuthenticationType>(
        (flowExtension?.endpoint?.authentication?.type as AuthenticationType) ?? AuthenticationType.NONE
    );
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);

    // Memoized so the reference is stable across renders. ActionEndpointConfigForm resets its
    // authentication state in a useEffect keyed on initialValues — a fresh object each render would
    // continually revert the auth-type selection.
    const initialValues: EndpointConfigFormPropertyInterface = useMemo(
        (): EndpointConfigFormPropertyInterface => buildEndpointInitialValues(flowExtension?.endpoint),
        [ flowExtension ]
    );

    const resolveAuthProperties = (values: EndpointConfigFormPropertyInterface): Record<string, string> => {
        switch (endpointAuthType) {
            case AuthenticationType.BASIC:
                return {
                    password: values.passwordAuthProperty ?? "",
                    username: values.usernameAuthProperty ?? ""
                };
            case AuthenticationType.BEARER:
                return { accessToken: values.accessTokenAuthProperty ?? "" };
            case AuthenticationType.API_KEY:
                return {
                    header: values.headerAuthProperty ?? "",
                    value: values.valueAuthProperty ?? ""
                };
            case AuthenticationType.CLIENT_CREDENTIAL:
                return {
                    clientId: values.clientIdAuthProperty ?? "",
                    clientSecret: values.clientSecretAuthProperty ?? "",
                    tokenEndpoint: values.tokenEndpointAuthProperty ?? "",
                    ...(values.scopesAuthProperty ? { scopes: values.scopesAuthProperty } : {})
                };
            default:
                return {};
        }
    };

    const validateForm = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> =>
        validateActionEndpointFields(values, {
            authenticationType: endpointAuthType,
            isAuthenticationUpdateFormState
        });

    const handleSubmit = (
        values: EndpointConfigFormPropertyInterface,
        changedFields: Record<string, boolean>
    ): void => {
        setIsSubmitting(true);
        const isEndpointChanged: boolean = isAuthenticationUpdateFormState
            || Boolean(changedFields?.endpointUri)
            || Boolean(changedFields?.allowedHeaders);

        if (!isEndpointChanged) {
            return;
        }

        const endpoint: Partial<FlowExtensionEndpointInterface> = {
            ...(changedFields?.allowedHeaders && { allowedHeaders: values.allowedHeaders }),
            ...(isAuthenticationUpdateFormState && {
                authentication: {
                    properties: resolveAuthProperties(values),
                    type: endpointAuthType
                }
            }),
            ...(changedFields?.endpointUri && { uri: values.endpointUri })
        };

        const body: FlowExtensionUpdateRequestInterface = { endpoint };

        updateFlowExtension(flowExtension.id, body)
            .then((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.updateSuccess.message")
                }));
                setIsAuthenticationUpdateFormState(false);
                mutateFlowExtension();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:notifications.updateError.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    };

    if (isLoading) {
        return <ContentLoader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <FinalForm
                initialValues={ initialValues }
                validate={ validateForm }
                onSubmit={ (
                    values: EndpointConfigFormPropertyInterface,
                    form: FormApi
                ): void => handleSubmit(values, form.getState().dirtyFields) }
                render={ ({ handleSubmit }: FormRenderProps): ReactElement => (
                    <form onSubmit={ handleSubmit } className="form-container with-max-width">
                        <ActionEndpointConfigForm
                            initialValues={ initialValues }
                            isCreateFormState={ false }
                            isReadOnly={ isReadOnly }
                            showHeadersAndParams={ false }
                            authenticationTypes={ FlowExtensionConstants.FLOW_EXTENSION_AUTH_TYPES }
                            onAuthenticationTypeChange={ (updatedValue: AuthenticationType, change: boolean): void => {
                                setEndpointAuthType(updatedValue);
                                setIsAuthenticationUpdateFormState(change);
                            } }
                            data-componentid={ `${componentId}-endpoint-config-form` }
                        />
                        <Button
                            size="medium"
                            variant="contained"
                            type="submit"
                            sx={ { marginTop: 3.75 } }
                            data-componentid={ `${componentId}-update-button` }
                            loading={ isSubmitting }
                            disabled={ isReadOnly || isSubmitting }
                        >
                            { t("common:update") }
                        </Button>
                    </form>
                ) }
            />
        </EmphasizedSegment>
    );
};

export default FlowExtensionEndpointSettings;
