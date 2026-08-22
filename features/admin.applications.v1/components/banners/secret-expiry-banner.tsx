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
import Button from "@oxygen-ui/react/Button";
import { ApplicationTabIDs } from "@wso2is/admin.extensions.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { TAB_URL_HASH_FRAGMENT } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback } from "react";
import { useTranslation } from "react-i18next";
import useGetOAuthClientSecrets from "../../api/use-get-oauth-client-secrets";
import useClientSecretManagement from "../../hooks/use-client-secret-management";
import { ClientSecretListInterface } from "../../models/application-inbound";
import { hasSecretsAboutToExpire } from "../client-secrets/client-secret-utils";

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
    /**
     * Expiry of the latest client secret as Unix epoch seconds (0 when it does not expire).
     */
    latestClientSecretExpiresAt?: number;
    /**
     * Whether the application has more than one client secret configured.
     */
    multipleClientSecretsConfigured?: boolean;
}

/**
 * Banner that warns when a client secret is about to expire.
 *
 * @param props - Props injected to the component.
 * @returns Secret expiry banner or null when no secret needs attention.
 */
const SecretExpiryBanner: FunctionComponent<SecretExpiryBannerPropsInterface> = (
    props: SecretExpiryBannerPropsInterface
): ReactElement | null => {

    const {
        appId,
        isOIDCApplication,
        isPublicClient,
        latestClientSecretExpiresAt,
        multipleClientSecretsConfigured,
        [ "data-componentid" ]: componentId = "secret-expiry-banner"
    } = props;

    const { t } = useTranslation();

    const {
        hasClientSecretReadPermission,
        isEnforceClientSecretPermissionEnabled,
        maxSecretCount
    } = useClientSecretManagement();

    /*
     * The latest secret's expiry is known from the loaded OIDC configuration regardless of the secret
     * capacity, so the banner applies to single-secret deployments as well. Its visibility mirrors the
     * protocol tab's latest secret display gate.
     */
    const isBannerApplicable: boolean = Boolean(
        isOIDCApplication &&
        !isPublicClient &&
        appId &&
        (!isEnforceClientSecretPermissionEnabled || hasClientSecretReadPermission)
    );

    const isLatestSecretAboutToExpire: boolean = isBannerApplicable && hasSecretsAboutToExpire([
        { expiresAt: latestClientSecretExpiresAt }
    ]);

    const shouldFetch: boolean = isBannerApplicable
        && (maxSecretCount > 1 && hasClientSecretReadPermission)
        && Boolean(multipleClientSecretsConfigured)
        && !isLatestSecretAboutToExpire;

    const { data: clientSecretList } = useGetOAuthClientSecrets<ClientSecretListInterface>(appId, shouldFetch);

    const handleViewSecrets: () => void = useCallback((): void => {
        window.location.hash = TAB_URL_HASH_FRAGMENT + ApplicationTabIDs.PROTOCOL;
    }, []);

    if (!isBannerApplicable) {
        return null;
    }

    const isPreviousSecretAboutToExpire: boolean =
        !isLatestSecretAboutToExpire && hasSecretsAboutToExpire(clientSecretList?.list ?? []);

    if (!isLatestSecretAboutToExpire && !isPreviousSecretAboutToExpire) {
        return null;
    }

    return (
        <Alert
            severity="warning"
            sx={ { marginBottom: 2 } }
            action={ (
                <Button
                    className="banner-view-hide-details"
                    onClick={ handleViewSecrets }
                    data-componentid={ `${ componentId }-view-secrets-button` }
                >
                    { t("applications:clientSecrets.expiryBanner.viewSecrets") }
                </Button>
            ) }
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
