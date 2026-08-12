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
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, Popup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import ClientSecretRow from "./client-secret-row";
import "./client-secrets-section.scss";
import DeleteClientSecretModal from "./delete-client-secret-modal";
import GenerateClientSecretModal from "./generate-client-secret-modal";
import GeneratedClientSecretModal from "./generated-client-secret-modal";
import PreviousClientSecrets from "./previous-client-secrets";
import { deleteClientSecretById } from "../../api/application";
import useGetOAuthClientSecrets from "../../api/use-get-oauth-client-secrets";
import { ClientSecretInterface, ClientSecretStatus } from "../../models/application-inbound";

/**
 * Props for the client secrets section.
 */
interface ClientSecretsSectionPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application.
     */
    appId: string;
    /**
     * Value of the current (latest) client secret, from the OIDC configuration.
     */
    clientSecret: string;
    /**
     * Expiry of the current client secret as Unix epoch seconds (0 when it does not expire).
     */
    clientSecretExpiresAt?: number;
    /**
     * Whether the application has more than one client secret configured. The previous secrets
     * dropdown is only shown when this is true.
     */
    multipleClientSecretsConfigured?: boolean;
    /**
     * Whether secret values are unavailable (client secret hashing enabled).
     */
    hideSecretValue?: boolean;
    /**
     * Callback to refresh the inbound OIDC configuration (e.g. after the current secret changes).
     */
    onUpdate: (id: string) => void;
    /**
     * Whether the application is in a read-only (non-editable) state.
     */
    readOnly?: boolean;
}

/**
 * Client secrets section shown on the OIDC protocol tab — the current secret with a generate action,
 * and a lazily-loaded, expandable list of previous secrets.
 *
 * @param props - Props injected to the component.
 * @returns Client secrets section.
 */
const ClientSecretsSection: FunctionComponent<ClientSecretsSectionPropsInterface> = (
    props: ClientSecretsSectionPropsInterface
): ReactElement => {

    const {
        appId,
        clientSecret,
        clientSecretExpiresAt,
        multipleClientSecretsConfigured,
        hideSecretValue,
        onUpdate,
        readOnly,
        [ "data-componentid" ]: componentId = "client-secrets-section"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const maxCount: number = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications?.properties?.multipleClientSecretsMaxCount as number);
    const isClientSecretHashEnabled: boolean = useSelector(
        (state: AppState) => state.config.ui.isClientSecretHashEnabled);
    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications);

    const [ showPreviousSecrets, setShowPreviousSecrets ] = useState<boolean>(false);
    const [ showGenerateModal, setShowGenerateModal ] = useState<boolean>(false);
    const [ generatedSecret, setGeneratedSecret ] = useState<ClientSecretInterface | null>(null);
    const [ secretToDelete, setSecretToDelete ] = useState<ClientSecretInterface | null>(null);

    /*
     * Generating and deleting secrets are both disabled while the app is read-only (view mode). When
     * editable, each is gated on its own dedicated client secret scope, which the /secrets endpoints
     * always enforce (the skip-enforce flag applies only to the legacy single-secret path).
     */
    const hasGeneratePermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.create ?? []);
    const hasDeletePermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.delete ?? []);
    const canGenerate: boolean = !readOnly && hasGeneratePermission;
    const canDelete: boolean = !readOnly && hasDeletePermission;

    /*
     * The list is fetched up front only for users who can generate, since they are the ones who need
     * the total count to know whether the limit is reached (which disables the button). Other viewers
     * fetch lazily when they expand the previous secrets dropdown. Either way the dropdown is a pure
     * show/hide toggle over this same data.
     */
    const {
        data: clientSecretList,
        isLoading: isClientSecretListLoading,
        error: clientSecretListError,
        mutate: mutateClientSecretList
    } = useGetOAuthClientSecrets(appId, canGenerate || showPreviousSecrets);

    useEffect(() => {
        if (!clientSecretListError) {
            return;
        }

        dispatch(addAlert({
            description: t("applications:clientSecrets.notifications.getSecrets.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:clientSecrets.notifications.getSecrets.genericError.message")
        }));
    }, [ clientSecretListError ]);

    const currentSecret: ClientSecretInterface = {
        expiresAt: clientSecretExpiresAt,
        latest: true,
        secretValue: clientSecret,
        status: ClientSecretStatus.ACTIVE
    };

    const previousSecrets: ClientSecretInterface[] = (clientSecretList?.list ?? [])
        .filter((secret: ClientSecretInterface) => !secret?.latest);

    /*
     * The previous secrets dropdown is shown when the app has previous secrets. Before the list is
     * fetched we rely on the OIDC config flag; once fetched, the list is the source of truth, so
     * deleting the last previous secret removes the dropdown.
     */
    const hasPreviousSecrets: boolean = clientSecretList
        ? previousSecrets.length > 0
        : Boolean(multipleClientSecretsConfigured);

    /*
     * Proactively block generation once the app is at the secret limit. This is knowable only after
     * the list resolves; while it is unknown (still loading, or the fetch failed) the button stays
     * enabled and the create endpoint's 409 is the authoritative backstop, surfaced as a notification.
     */
    const isMaxCountReached: boolean = Boolean(clientSecretList)
        && maxCount !== undefined
        && (clientSecretList?.list?.length ?? 0) >= maxCount;

    const resolveErrorDescription = (
        error: AxiosError<HttpErrorResponseDataInterface>,
        fallback: string
    ): string => error?.response?.data?.description ?? fallback;

    const handleGenerated = (secret: ClientSecretInterface): void => {
        dispatch(addAlert({
            description: t("applications:clientSecrets.notifications.generateSecret.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("applications:clientSecrets.notifications.generateSecret.success.message")
        }));
        setShowGenerateModal(false);
        /* Surface the plaintext value only when hashing hides it from the secret cards. */
        if (isClientSecretHashEnabled) {
            setGeneratedSecret(secret);
        }
        mutateClientSecretList();
        onUpdate(appId);
    };

    const handleDelete = (secret: ClientSecretInterface): void => {
        if (!secret?.secretId) {
            return;
        }

        deleteClientSecretById(appId, secret.secretId)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:clientSecrets.notifications.deleteSecret.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:clientSecrets.notifications.deleteSecret.success.message")
                }));
                setSecretToDelete(null);
                mutateClientSecretList();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: resolveErrorDescription(
                        error,
                        t("applications:clientSecrets.notifications.deleteSecret.genericError.description")
                    ),
                    level: AlertLevels.ERROR,
                    message: t("applications:clientSecrets.notifications.deleteSecret.genericError.message")
                }));
                setSecretToDelete(null);
            });
    };

    /*
     * Pluralize the toggle by how many previous secrets the app can hold (the max total minus the
     * current secret), which is known from configuration up front — unlike the actual count, which is
     * unavailable until the list is fetched (e.g. before a viewer without generate access expands it).
     */
    const resolvePreviousSecretsToggleLabel = (): string => {
        const maxPreviousSecrets: number = maxCount - 1;

        if (showPreviousSecrets) {
            return maxPreviousSecrets === 1
                ? t("applications:clientSecrets.hidePreviousSecret")
                : t("applications:clientSecrets.hidePreviousSecrets");
        }

        return maxPreviousSecrets === 1
            ? t("applications:clientSecrets.viewPreviousSecret")
            : t("applications:clientSecrets.viewPreviousSecrets");
    };

    return (
        <div className="client-secrets-section" data-componentid={ componentId }>
            <ClientSecretRow
                secret={ currentSecret }
                hideSecretValue={ hideSecretValue }
                action={ canGenerate && (
                    <Popup
                        wide
                        position="top center"
                        disabled={ !isMaxCountReached }
                        content={ t("applications:clientSecrets.maxCountReachedHint", { count: maxCount }) }
                        trigger={ (
                            <span className="client-secrets-section-generate-trigger">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    disabled={ isMaxCountReached }
                                    onClick={ (): void => setShowGenerateModal(true) }
                                    data-componentid={ `${ componentId }-generate-button` }
                                >
                                    { t("applications:clientSecrets.generateButton") }
                                </Button>
                            </span>
                        ) }
                        data-componentid={ `${ componentId }-max-count-tooltip` }
                    />
                ) }
                data-componentid={ `${ componentId }-current` }
            />
            { /* The previous secrets dropdown appears only while the app has previous secrets. */ }
            { hasPreviousSecrets && (
                <>
                    <LinkButton
                        type="button"
                        className="client-secrets-section-toggle"
                        onClick={ (): void => setShowPreviousSecrets((previous: boolean) => !previous) }
                        data-componentid={ `${ componentId }-toggle` }
                    >
                        <Icon name={ showPreviousSecrets ? "chevron up" : "chevron down" } />
                        { resolvePreviousSecretsToggleLabel() }
                    </LinkButton>
                    { showPreviousSecrets && (
                        <PreviousClientSecrets
                            secrets={ previousSecrets }
                            isLoading={ isClientSecretListLoading }
                            readOnly={ !canDelete }
                            hideSecretValue={ hideSecretValue }
                            onDelete={ (secret: ClientSecretInterface): void => setSecretToDelete(secret) }
                            data-componentid={ `${ componentId }-previous` }
                        />
                    ) }
                </>
            ) }
            { showGenerateModal && (
                <GenerateClientSecretModal
                    open={ showGenerateModal }
                    appId={ appId }
                    maxCount={ maxCount }
                    onGenerated={ handleGenerated }
                    onCancel={ (): void => setShowGenerateModal(false) }
                    data-componentid={ `${ componentId }-generate-modal` }
                />
            ) }
            { secretToDelete && (
                <DeleteClientSecretModal
                    open={ Boolean(secretToDelete) }
                    secret={ secretToDelete }
                    onConfirm={ handleDelete }
                    onCancel={ (): void => setSecretToDelete(null) }
                    data-componentid={ `${ componentId }-delete-modal` }
                />
            ) }
            { generatedSecret && (
                <GeneratedClientSecretModal
                    open={ Boolean(generatedSecret) }
                    secret={ generatedSecret }
                    onClose={ (): void => setGeneratedSecret(null) }
                    data-componentid={ `${ componentId }-generated-modal` }
                />
            ) }
        </div>
    );
};

export default ClientSecretsSection;
