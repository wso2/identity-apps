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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useGetOAuthClientSecrets from "../../api/use-get-oauth-client-secrets";
import { ApplicationFeatureDictionaryKeys, ApplicationManagementConstants } from "../../constants/application-management";
import { ClientSecretListInterface } from "../../models/application-inbound";
import { hasCriticallyExpiringSecret } from "../client-secrets/client-secret-utils";

/**
 * Props for the secret expiry banner component.
 */
interface SecretExpiryBannerPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application.
     */
    appId: string;
    /**
     * Whether the application has an OIDC inbound protocol configured.
     */
    isOIDCApplication: boolean;
    /**
     * Whether the application is a public client (SPA/mobile), which has no client secret.
     */
    isPublicClient?: boolean;
}

/**
 * Banner that warns when a client secret is about to expire or has already expired.
 *
 * @param props - Props injected to the component.
 * @returns Secret expiry banner or null when no secret needs attention.
 */
const SecretExpiryBanner: FunctionComponent<SecretExpiryBannerPropsInterface> = (
    props: SecretExpiryBannerPropsInterface
): ReactElement => {

    const {
        appId,
        isOIDCApplication,
        isPublicClient,
        [ "data-componentid" ]: componentId = "secret-expiry-banner"
    } = props;

    const { t } = useTranslation();

    const isMultipleClientSecretsEnabled: boolean = useSelector((state: AppState) =>
        Boolean(state?.config?.ui?.features?.applications?.properties?.isMultipleClientSecretsEnabled));
    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications);

    const isEnforceClientSecretPermissionEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get(
            ApplicationFeatureDictionaryKeys.ApplicationEditEnforceClientSecretPermission)
    );
    const hasClientSecretReadPermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.read);

    const [ dismissed, setDismissed ] = useState<boolean>(false);

    /* Suppress the banner (and the underlying secrets fetch) when the user lacks the view permission. */
    const hasViewPermission: boolean = !isEnforceClientSecretPermissionEnabled || hasClientSecretReadPermission;
    const shouldFetch: boolean = isMultipleClientSecretsEnabled && isOIDCApplication && !isPublicClient
        && hasViewPermission && !!appId;

    const { data: clientSecretList } = useGetOAuthClientSecrets<ClientSecretListInterface>(appId, shouldFetch);

    if (dismissed || !shouldFetch) {
        return null;
    }

    /* Show a single generic banner when at least one secret is within the critical expiry window. */
    if (!hasCriticallyExpiringSecret(clientSecretList?.list ?? [])) {
        return null;
    }

    return (
        <Alert
            severity="warning"
            onClose={ (): void => setDismissed(true) }
            sx={ { marginBottom: 2 } }
            data-componentid={ componentId }
        >
            <AlertTitle>
                { t("applications:clientSecrets.expiryBanner.title") }
            </AlertTitle>
            { t("applications:clientSecrets.expiryBanner.description") }
        </Alert>
    );
};

export default SecretExpiryBanner;
