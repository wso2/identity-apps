/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConfigInterface,
    history
} from "../../admin.core.v1";
import { deleteApplication } from "../api";

/**
 * Prop types of the  ApplicationDangerZone component.
 */
interface ApplicationDangerZonePropsInterface extends
    SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
        /**
         * Currently editing application id.
         */
        appId?: string;
        /**
         * Client Id of the application.
         */
        clientId?: string;
        /**
         * Name of the application.
         */
        name: string;
        /**
         * Customized content.
         */
        content?: string;
    }

/**
 * Application Danger Zone component
 *
 * @param props - Props injected to the component.
 *
 * @returns ApplicationDangerZoneComponent.
 */
export const ApplicationDangerZoneComponent: FunctionComponent<ApplicationDangerZonePropsInterface> = (
    props: ApplicationDangerZonePropsInterface
): ReactElement => {
    const {
        featureConfig,
        appId,
        clientId,
        name,
        content,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeletionInProgress, setIsDeletionInProgress ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    /**
     * Deletes an application.
     */
    const handleApplicationDelete = (): void => {
        setIsDeletionInProgress(true);
        deleteApplication(appId)
            .then(() => {
                setIsDeletionInProgress(false);
                dispatch(addAlert({
                    description: t("applications:notifications.deleteApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.deleteApplication.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();

                eventPublisher.publish(
                    "application-delete",
                    { "client-id": clientId }
                );
            })
            .catch((error: IdentityAppsApiException) => {
                setIsDeletionInProgress(false);
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.deleteApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.deleteApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.deleteApplication.genericError" +
                        ".message")
                }));
                eventPublisher.publish(
                    "application-delete-error",
                    { "client-id": clientId }
                );
            });
    };

    /**
     * Called when an application is deleted.
     */
    const onDelete = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS"));
    };

    /**
     * Resolves the danger actions.
     *
     * @returns DangerZoneGroup element.
     */
    const resolveDangerActions = (): ReactElement => {
        if (!hasRequiredScopes(
            featureConfig?.applications, featureConfig?.applications?.scopes?.update, allowedScopes)) {
            return null;
        }

        if (UIConfig.systemAppsIdentifiers.includes(name)) {
            return null;
        }

        return (
            <Show
                when={ featureConfig?.applications?.scopes?.delete }
            >
                <DangerZoneGroup
                    sectionHeader={ t("applications:dangerZoneGroup.header") }
                >
                    <DangerZone
                        actionTitle={
                            t("applications:dangerZoneGroup.deleteApplication" +
                                ".actionTitle")
                        }
                        header={
                            t("applications:dangerZoneGroup.deleteApplication.header")
                        }
                        subheader={
                            !content ?
                                t("applications:dangerZoneGroup.deleteApplication" +
                                ".subheader")
                                : content
                        }
                        onActionClick={ (): void => setShowDeleteConfirmationModal(true) }
                        data-componentid={ `${ componentId }-danger-zone` }
                    />
                </DangerZoneGroup>
            </Show>
        );
    };

    return (
        <>
            { resolveDangerActions() }
            <ConfirmationModal
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="negative"
                open={ showDeleteConfirmationModal }
                assertionHint={ t("applications:confirmations.deleteApplication." +
                             "assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                onPrimaryActionClick={ (): void => handleApplicationDelete() }
                data-componentid={ `${ componentId }-application-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isDeletionInProgress }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${ componentId }-application-delete-confirmation-modal-header` }
                >
                    { t("applications:confirmations.deleteApplication.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${ componentId }-application-delete-confirmation-modal-message` }
                >
                    { t("applications:confirmations.deleteApplication.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-application-delete-confirmation-modal-content` }
                >
                    { t("applications:confirmations.deleteApplication.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};
