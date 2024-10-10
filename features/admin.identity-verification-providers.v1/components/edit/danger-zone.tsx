/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Divider from "@oxygen-ui/react/Divider";
import { Show, useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CheckboxProps } from "semantic-ui-react";

interface DangerZonePropsInterface extends IdentifiableComponentInterface {
    isIdVPEnabled: boolean;
    handleDelete: () => void;
    handleUpdate: (isEnabled: boolean) => void;
    isReadOnly?: boolean;
    isLoading?: boolean;
}

const IdVPEditDangerZone: FunctionComponent<DangerZonePropsInterface> = (
    {
        isIdVPEnabled,
        handleDelete,
        handleUpdate,
        isReadOnly = false,
        isLoading = false,
        ["data-componentid"]: componentId = "idvp-edit-danger-zone"
    }: DangerZonePropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasIdVPDeletePermission: boolean = useRequiredScopes(
        featureConfig?.identityVerificationProviders?.scopes?.delete
    );

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isEnabled, setIsEnabled ] = useState<boolean>(isIdVPEnabled);

    return (
        <>
            <Divider hidden />
            { (hasIdVPDeletePermission || !isReadOnly) && (
                <DangerZoneGroup
                    sectionHeader={ t("common:dangerZone") }>
                    <Show when={ featureConfig?.identityVerificationProviders?.scopes?.update }>
                        <DangerZone
                            actionTitle={
                                t("idvp:edit.dangerZone.disable.header",
                                    { state: isEnabled ? t("common:disable") : t("common:enable") } )
                            }
                            header={
                                t("idvp:edit.dangerZone.disable.header",
                                    { state: isEnabled ? t("common:disable") : t("common:enable") } )
                            }
                            subheader={
                                isEnabled ?
                                    t("idvp:edit.dangerZone.disable.enabledDescription") :
                                    t("idvp:edit.dangerZone.disable.disabledDescription")
                            }
                            onActionClick={ undefined }
                            toggle={ {
                                checked: isEnabled,
                                onChange: (_: any, data: CheckboxProps) => {
                                    setIsEnabled(data.checked);
                                    handleUpdate(data.checked);
                                }
                            } }
                            data-componentid={ `${ componentId }-disable` }
                        />
                    </Show>
                    <Show when={ featureConfig?.identityVerificationProviders?.scopes?.delete }>
                        <DangerZone
                            actionTitle={ t("common:delete") }
                            header={ t("idvp:edit.dangerZone.delete.header") }
                            subheader={ t("idvp:edit.dangerZone.delete.description") }
                            onActionClick={ () => setShowDeleteConfirmationModal(true) }
                            data-componentid={ `${ componentId }-delete` }
                        />
                    </Show>
                </DangerZoneGroup>
            ) }
            {
                showDeleteConfirmationModal && (
                    <ConfirmationModal
                        primaryActionLoading={ isLoading }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("idvp:delete.confirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleDelete() }
                        data-componentid={ `${ componentId }-delete-confirmation` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${ componentId }-delete-confirmation-header` }>
                            { t("idvp:delete.confirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${ componentId }-delete-confirmation-message` }>
                            { t("idvp:delete.confirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${ componentId }-delete-confirmation-content` }>
                            { t("idvp:delete.confirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

export default IdVPEditDangerZone;
