/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    EmptyPlaceholder,
    GenericIconProps,
    PrimaryButton,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import _ from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Icon } from "semantic-ui-react";
import {
    AppState,
    AuthenticatorAccordion,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    store
} from "../../../core";
import {
    deleteProtocol,
    getAuthProtocolMetadata,
    regenerateClientSecret,
    revokeClientSecret,
    updateAuthProtocolConfig
} from "../../api";
import { getInboundProtocolLogos } from "../../configs";
import { OIDCDataInterface, SupportedAuthProtocolMetaTypes, SupportedAuthProtocolTypes } from "../../models";
import { setAuthProtocolMeta } from "../../store";
import { InboundFormFactory } from "../forms";
import { ApplicationCreateWizard } from "../wizard";

/**
 * Proptypes for the applications settings component.
 */
interface AccessConfigurationPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Currently editing application name.
     */
    appName: string;
    /**
     * Protocol configurations.
     */
    inboundProtocolConfig: any;
    /**
     *  Currently configured inbound protocols.
     */
    inboundProtocols: string[];
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     *  Is inbound protocol config request is still loading.
     */
    isInboundProtocolConfigRequestLoading: boolean;
    /**
    * CORS allowed origin list for the tenant.
    */
    allowedOriginList?: string[];
    /**
     * Callback to update the allowed origins.
     */
    onAllowedOriginsUpdate?: () => void;
    /**
     * Callback to be fired when an OIDC application secret is regenerated.
     */
    onApplicationSecretRegenerate?: (response: OIDCDataInterface) => void;
    /**
     * Specifies if the inbound protocol list is loading.
     */
    inboundProtocolsLoading?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 *  Inbound protocols and advance settings component.
 *
 * @param {AccessConfigurationPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AccessConfiguration: FunctionComponent<AccessConfigurationPropsInterface> = (
    props: AccessConfigurationPropsInterface
): ReactElement => {

    const {
        appId,
        appName,
        featureConfig,
        inboundProtocolConfig,
        inboundProtocols,
        isLoading,
        onUpdate,
        allowedOriginList,
        onAllowedOriginsUpdate,
        onApplicationSecretRegenerate,
        inboundProtocolsLoading,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const tenantName = store.getState().config.deployment.tenant;

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ protocolToDelete, setProtocolToDelete ] = useState<string>(undefined);

    /**
     * Handles the inbound config delete action.
     *
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be deleted.
     */
    const handleInboundConfigDelete = (protocol: string): void => {
        deleteProtocol(appId, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".success.description", { protocol: protocol }),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.deleteProtocolConfig.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".genericError.message")
                }));
            });
    };

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be updated.
     */
    const handleInboundConfigFormSubmit = (values: any, protocol: string): void => {
        updateAuthProtocolConfig(appId, values, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".success.message")
                }));

                onUpdate(appId);
                onAllowedOriginsUpdate();
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".genericError.message")
                }));
            });
    };

    /**
     *  Regenerate application.
     */
    const handleApplicationRegenerate = (): void => {
        regenerateClientSecret(appId)
            .then((response: AxiosResponse<OIDCDataInterface>) => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.regenerateSecret.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.regenerateSecret.success.message")
                }));

                onApplicationSecretRegenerate(response.data);
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.regenerateSecret.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.regenerateSecret" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.regenerateSecret.genericError.message")
                }));
            });
    };

    /**
     * Revokes application.
     */
    const handleApplicationRevoke = (): void => {
        revokeClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.revokeApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.revokeApplication.success.message")
                }));
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.revokeApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.revokeApplication.success" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.revokeApplication.success.message")
                }));
            });
    };

    /**
     * Handles Authenticator delete button on click action.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
     * @param {string} name - Protocol name.
     */
    const handleProtocolDeleteOnClick = (e: MouseEvent<HTMLDivElement>, name: string): void => {
        if (!name) {
            return;
        }

        const deletingProtocol = inboundProtocols
            .find((protocol) => protocol === name);

        if (!deletingProtocol) {
            return;
        }

        setProtocolToDelete(deletingProtocol);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Resolves the corresponding protocol config form when a
     * protocol is selected.
     * @return {React.ReactElement}
     */
    const resolveInboundProtocolSettingsForm = (): ReactElement => {
        return (inboundProtocolConfig
                ?
                <AuthenticatorAccordion
                    globalActions={
                        !readOnly && [
                            {
                                icon: "trash alternate",
                                onClick: handleProtocolDeleteOnClick,
                                type: "icon"
                            }
                        ]
                    }
                    authenticators={
                        Object.keys(inboundProtocolConfig).map((protocol) => {
                            if (Object.values(SupportedAuthProtocolTypes)
                                .includes(protocol as SupportedAuthProtocolTypes)) {
                                return {
                                    actions: [],
                                    content: (
                                        <InboundFormFactory
                                            tenantDomain={ tenantName }
                                            allowedOrigins={ allowedOriginList }
                                            metadata={ authProtocolMeta[protocol] }
                                            initialValues={
                                                _.isEmpty(inboundProtocolConfig[protocol])
                                                    ? undefined : inboundProtocolConfig[protocol]
                                            }
                                            onSubmit={
                                                (values: any) => handleInboundConfigFormSubmit(values,
                                                    protocol)
                                            }
                                            type={ protocol as SupportedAuthProtocolTypes }
                                            onApplicationRegenerate={ handleApplicationRegenerate }
                                            onApplicationRevoke={ handleApplicationRevoke }
                                            readOnly={
                                                readOnly
                                                || !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update,
                                                    allowedScopes
                                                )
                                            }
                                            data-testid={ `${ testId }-inbound-${ protocol }-form` }
                                        />
                                    ),
                                    icon: {
                                        icon: getInboundProtocolLogos()[protocol], size: "micro"
                                    } as GenericIconProps,
                                    id: protocol,
                                    title: _.upperCase(protocol)
                                };
                            } else {
                                return {
                                    actions: [],
                                    content: (
                                        <InboundFormFactory
                                            metadata={ authProtocolMeta[protocol] }
                                            initialValues={
                                                _.isEmpty(inboundProtocolConfig[protocol])
                                                    ? undefined : inboundProtocolConfig[protocol]
                                            }
                                            onSubmit={
                                                (values: any) => handleInboundConfigFormSubmit(values,
                                                    protocol)
                                            }
                                            type={ SupportedAuthProtocolTypes.CUSTOM }
                                            readOnly={
                                                !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update,
                                                    allowedScopes
                                                )
                                            }
                                            data-testid={ `${ testId }-inbound-custom-form` }
                                        />
                                    ),
                                    icon: {
                                        icon: (
                                            <UserAvatar
                                                data-testid={ `${ testId }-${ protocol }-icon` }
                                                name={ protocol }
                                                size="mini"
                                            />
                                        ),
                                        size: "nano"
                                    } as GenericIconProps,
                                    id: protocol,
                                    title: _.upperCase(protocol)
                                };
                            }
                        })
                    }
                    data-testid={ `${ testId }-protocol-accordion` }
                /> : <ContentLoader/>
        );
    };

    /**
     * Use effect hook to be run when an inbound protocol is selected.
     */
    useEffect(() => {
        if (_.isEmpty(inboundProtocols)) {
            return;
        }

        inboundProtocols.map((selected) => {

            if (selected === SupportedAuthProtocolTypes.WS_FEDERATION) {
                return;
            }

            const selectedProtocol = selected as SupportedAuthProtocolMetaTypes;

            // Check if the metadata for the selected auth protocol is available in redux store.
            // If not, fetch the metadata related to the selected auth protocol.
            if (!Object.prototype.hasOwnProperty.call(authProtocolMeta, selectedProtocol)) {
                getAuthProtocolMetadata(selectedProtocol)
                    .then((response) => {
                        dispatch(setAuthProtocolMeta(selectedProtocol, response));
                    })
                    .catch((error) => {
                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                                    ".error.message")
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                                ".genericError.message")
                        }));
                    });
            }
        });
    }, [ inboundProtocols ]);

    return (
        !isLoading
            ? (
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            {
                                (inboundProtocols.length > 0)
                                    ? !readOnly
                                    && hasRequiredScopes(featureConfig?.applications,
                                        featureConfig?.applications?.scopes?.update,
                                        allowedScopes)
                                    && (
                                        <Button
                                            floated="right"
                                            primary
                                            onClick={ () => setShowWizard(true) }
                                            data-testid={ `${ testId }-new-protocol-button` }
                                        >
                                            <Icon name="add"/>New Protocol
                                        </Button>
                                    )
                                    : (
                                        !inboundProtocolsLoading
                                        && <EmptyPlaceholder
                                            action={
                                                hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update,
                                                    allowedScopes) && (
                                                    <PrimaryButton onClick={ () => setShowWizard(true) }>
                                                        <Icon name="add"/>
                                                        { t("console:develop.features.applications.placeholders" +
                                                            ".emptyProtocolList.action") }
                                                    </PrimaryButton>
                                                )
                                            }
                                            image={ getEmptyPlaceholderIllustrations().newList }
                                            imageSize="tiny"
                                            title={
                                                t("console:develop.features.applications.placeholders" +
                                                    ".emptyProtocolList.title")
                                            }
                                            subtitle={ [
                                                t("console:develop.features.applications.placeholders" +
                                                    ".emptyProtocolList.subtitles.0"),
                                                t("console:develop.features.applications.placeholders" +
                                                    ".emptyProtocolList.subtitles.1"),
                                                t("console:develop.features.applications.placeholders" +
                                                    ".emptyProtocolList.subtitles.2")
                                            ] }
                                            data-testid={ `${ testId }-protocol-empty-placeholder` }
                                        />
                                    )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            { inboundProtocols?.length > 0 && resolveInboundProtocolSettingsForm() }
                        </Grid.Column>
                    </Grid.Row>
                    {
                        showWizard && (
                            <ApplicationCreateWizard
                                title={
                                    t("console:develop.features.applications.edit.sections.access.addProtocolWizard" +
                                        ".heading")
                                }
                                subTitle={
                                    t("console:develop.features.applications.edit.sections.access.addProtocolWizard" +
                                        ".subHeading",
                                        { appName: appName })
                                }
                                closeWizard={ (): void => setShowWizard(false) }
                                addProtocol={ true }
                                selectedProtocols={ inboundProtocols }
                                onUpdate={ onUpdate }
                                appId={ appId }
                                data-testid={ `${ testId }-protocol-add-wizard` }
                            />
                        )
                    }
                    {
                        showDeleteConfirmationModal && (
                            <ConfirmationModal
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="warning"
                                open={ showDeleteConfirmationModal }
                                assertion={ protocolToDelete }
                                assertionHint={ (
                                    <p>
                                        <Trans
                                            i18nKey={
                                                "console:develop.features.applications.confirmations.deleteProtocol" +
                                                ".assertionHint"
                                            }
                                            tOptions={ { name: protocolToDelete } }
                                        >
                                            Please type <strong>{ protocolToDelete }</strong> to confirm.
                                        </Trans>
                                    </p>
                                ) }
                                assertionType="input"
                                primaryAction={ t("common:confirm") }
                                secondaryAction={ t("common:cancel") }
                                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                onPrimaryActionClick={
                                    (): void => {
                                        handleInboundConfigDelete(protocolToDelete);
                                        setShowDeleteConfirmationModal(false);
                                    }
                                }
                                data-testid={ `${ testId }-protocol-delete-confirmation-modal` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header
                                    data-testid={ `${ testId }-protocol-delete-confirmation-modal-header` }
                                >
                                    { t("console:develop.features.applications.confirmations.deleteProtocol.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    warning
                                    data-testid={ `${ testId }-protocol-delete-confirmation-modal-message` }
                                >
                                    { t("console:develop.features.applications.confirmations.deleteProtocol.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content
                                    data-testid={ `${ testId }-protocol-delete-confirmation-modal-content` }
                                >
                                   { t("console:develop.features.applications.confirmations.deleteProtocol.content") }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </Grid>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the application access configuration component.
 */
AccessConfiguration.defaultProps = {
    "data-testid": "application-access-configuration"
};
