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
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, Message, Popup } from "@wso2is/react-components";
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
import useClientSecretManagement from "../../hooks/use-client-secret-management";
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
     * Client ID of the application.
     */
    clientId?: string;
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
        clientId,
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

    const isClientSecretHashEnabled: boolean = useSelector(
        (state: AppState) => state.config.ui.isClientSecretHashEnabled);

    const [ showPreviousSecrets, setShowPreviousSecrets ] = useState<boolean>(false);
    const [ showGenerateModal, setShowGenerateModal ] = useState<boolean>(false);
    const [ generatedSecret, setGeneratedSecret ] = useState<ClientSecretInterface | null>(null);
    const [ secretToDelete, setSecretToDelete ] = useState<ClientSecretInterface | null>(null);

    /*
     * The /secrets endpoints always enforce their dedicated scopes (skip-enforce covers only the
     * application OIDC protocol GET); generating/deleting also require the app to be editable.
     */
    const {
        hasClientSecretReadPermission,
        hasClientSecretCreatePermission,
        hasClientSecretDeletePermission,
        maxSecretCount: maxCount
    } = useClientSecretManagement();
    const canGenerate: boolean = !readOnly && hasClientSecretCreatePermission;
    const canDelete: boolean = !readOnly && hasClientSecretDeletePermission;

    /*
     * Fetched eagerly only for generate-capable users, who need the count for the limit check;
     * others fetch lazily when expanding the previous secrets dropdown.
     */
    const {
        data: clientSecretList,
        isLoading: isClientSecretListLoading,
        error: clientSecretListError,
        mutate: mutateClientSecretList
    } = useGetOAuthClientSecrets(appId, hasClientSecretReadPermission && (canGenerate || showPreviousSecrets));

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
     * Before the list is fetched, the OIDC config flag decides whether previous secrets exist;
     * once fetched, the list is the source of truth.
     */
    const hasPreviousSecrets: boolean = clientSecretList
        ? previousSecrets.length > 0
        : Boolean(multipleClientSecretsConfigured);

    /*
     * Knowable only after the list resolves; until then the button stays enabled and the create
     * endpoint's 409 is the authoritative backstop.
     */
    const isMaxCountReached: boolean = Boolean(clientSecretList)
        && maxCount !== undefined
        && (clientSecretList?.list?.length ?? 0) >= maxCount;

    const handleGenerated = (secret: ClientSecretInterface): void => {
        dispatch(addAlert({
            description: t("applications:clientSecrets.notifications.generateSecret.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("applications:clientSecrets.notifications.generateSecret.success.message")
        }));
        setShowGenerateModal(false);
        mutateClientSecretList();

        /*
         * With hashing enabled, the parent refresh is deferred until the reveal modal is dismissed —
         * refreshing would unmount the modal before the user sees the one-time value.
         */
        if (isClientSecretHashEnabled) {
            setGeneratedSecret(secret);

            return;
        }

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
                    description: error?.response?.data?.description
                        ?? t("applications:clientSecrets.notifications.deleteSecret.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:clientSecrets.notifications.deleteSecret.genericError.message")
                }));
                setSecretToDelete(null);
            });
    };

    const hasSinglePreviousSecret: boolean = maxCount - 1 === 1;
    const previousSecretsToggleLabel: string = showPreviousSecrets
        ? t(hasSinglePreviousSecret
            ? "applications:clientSecrets.hidePreviousSecret"
            : "applications:clientSecrets.hidePreviousSecrets")
        : t(hasSinglePreviousSecret
            ? "applications:clientSecrets.viewPreviousSecret"
            : "applications:clientSecrets.viewPreviousSecrets");

    return (
        <div className="client-secrets-section" data-componentid={ componentId }>
            { hideSecretValue && (
                <Message
                    type="info"
                    content={ t("applications:clientSecrets.hashedDisclaimer") }
                    data-componentid={ `${ componentId }-hashed-disclaimer` }
                />
            ) }
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
            { hasClientSecretReadPermission && hasPreviousSecrets && (
                <>
                    <LinkButton
                        type="button"
                        className="client-secrets-section-toggle"
                        onClick={ (): void => setShowPreviousSecrets((previous: boolean) => !previous) }
                        data-componentid={ `${ componentId }-toggle` }
                    >
                        <Icon name={ showPreviousSecrets ? "chevron up" : "chevron down" } />
                        { previousSecretsToggleLabel }
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
                    onClose={ (): void => setShowGenerateModal(false) }
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
                    clientId={ clientId }
                    onClose={ (): void => {
                        setGeneratedSecret(null);
                        onUpdate(appId);
                    } }
                    data-componentid={ `${ componentId }-generated-modal` }
                />
            ) }
        </div>
    );
};

export default ClientSecretsSection;
