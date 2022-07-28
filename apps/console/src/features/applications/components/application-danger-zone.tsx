/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppConstants, AppState, FeatureConfigInterface, UIConfigInterface, history, EventPublisher } from "../../core";
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
 * @param { ApplicationDangerZonePropsInterface } props - Props injected to the component.
 * 
 * @return {React.ReactElement}
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
        [ "data-componentid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);
 
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeletionInProgress, setIsDeletionInProgress ] = useState<boolean>(false);
 
    /**
     * Deletes an application.
     */
    const handleApplicationDelete = (): void => {
        setIsDeletionInProgress(true);
        deleteApplication(appId)
            .then(() => {
                setIsDeletionInProgress(false);
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteApplication.success" +
                         ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.deleteApplication.success.message")
                }));
 
                setShowDeleteConfirmationModal(false);
                onDelete();

                eventPublisher.publish("application-delete", {
                    "client-id": clientId
                });
            })
            .catch((error) => {
                setIsDeletionInProgress(false);
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.deleteApplication.error" +
                             ".message")
                    }));
 
                    return;
                }
 
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteApplication" +
                         ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.deleteApplication.genericError" +
                         ".message")
                }));
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
     * @return {React.ReactElement} DangerZoneGroup element.
     */
    const resolveDangerActions = (): ReactElement => {
        if (!hasRequiredScopes(
            featureConfig?.applications, featureConfig?.applications?.scopes?.update, allowedScopes)) {
            return null;
        }
 
        if (UIConfig.systemAppsIdentifiers.includes(name)) {
            return null;
        }
 
        if (hasRequiredScopes(
            featureConfig?.applications, featureConfig?.applications?.scopes?.delete, allowedScopes)) {
            return (
                <DangerZoneGroup sectionHeader={ t("console:develop.features.applications.dangerZoneGroup.header") }>
                    {
                        hasRequiredScopes(
                            featureConfig?.applications, featureConfig?.applications?.scopes?.delete, allowedScopes) &&
                         (
                             <DangerZone
                                 actionTitle={
                                     t("console:develop.features.applications.dangerZoneGroup.deleteApplication" +
                                         ".actionTitle")
                                 }
                                 header={
                                     t("console:develop.features.applications.dangerZoneGroup.deleteApplication.header")
                                 }
                                 subheader={
                                     !content ?
                                         t("console:develop.features.applications.dangerZoneGroup.deleteApplication" +
                                         ".subheader")
                                         : content
                                 }
                                 onActionClick={ (): void => setShowDeleteConfirmationModal(true) }
                                 data-testid={ `${ testId }-danger-zone` }
                             />
                         )
                    }
                </DangerZoneGroup>
            );
        }
 
        return null;
    };
     
    return (
        <>
            { resolveDangerActions() }
            <ConfirmationModal
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="warning"
                open={ showDeleteConfirmationModal }
                assertionHint={ t("console:develop.features.applications.confirmations.deleteApplication." +
                             "assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                onPrimaryActionClick={ (): void => handleApplicationDelete() }
                data-testid={ `${ testId }-application-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isDeletionInProgress }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-application-delete-confirmation-modal-header` }
                >
                    { t("console:develop.features.applications.confirmations.deleteApplication.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning
                    data-testid={ `${ testId }-application-delete-confirmation-modal-message` }
                >
                    { t("console:develop.features.applications.confirmations.deleteApplication.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-testid={ `${ testId }-application-delete-confirmation-modal-content` }
                >   
                    { t("console:develop.features.applications.confirmations.deleteApplication.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};
