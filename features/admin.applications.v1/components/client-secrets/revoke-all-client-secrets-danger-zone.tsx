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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import {
    ApplicationFeatureDictionaryKeys,
    ApplicationManagementConstants
} from "../../constants/application-management";

/**
 * Props for the revoke all client secrets danger zone component.
 */
interface RevokeAllClientSecretsDangerZonePropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback fired when the revocation is confirmed.
     */
    onRevokeAll: () => void;
    /**
     * Whether the danger zone is rendered in read-only mode.
     */
    readOnly?: boolean;
}

/**
 * Danger zone that revokes all client secrets and regenerates a fresh one.
 *
 * @param props - Props injected to the component.
 * @returns Revoke all client secrets danger zone.
 */
const RevokeAllClientSecretsDangerZone: FunctionComponent<RevokeAllClientSecretsDangerZonePropsInterface> = (
    props: RevokeAllClientSecretsDangerZonePropsInterface
): ReactElement => {

    const {
        onRevokeAll,
        readOnly,
        [ "data-componentid" ]: componentId = "revoke-all-client-secrets-danger-zone"
    } = props;

    const { t } = useTranslation();

    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications);

    const isEnforceClientSecretPermissionEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get(
            ApplicationFeatureDictionaryKeys.ApplicationEditEnforceClientSecretPermission)
    );
    const hasClientSecretCreatePermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.create);

    const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);

    /*
     * Read-only covers the application update baseline. Regenerating a secret additionally needs the
     * client secret create scope when client secret permission enforcement is on.
     */
    if (readOnly || (isEnforceClientSecretPermissionEnabled && !hasClientSecretCreatePermission)) {
        return null;
    }

    return (
        <>
            <Divider hidden />
            <DangerZoneGroup
                sectionHeader={ t("applications:dangerZoneGroup.header") }
            >
                <DangerZone
                    actionTitle={ t("applications:clientSecrets.dangerZone.revokeAll.actionTitle") }
                    header={ t("applications:clientSecrets.dangerZone.revokeAll.header") }
                    subheader={ t("applications:clientSecrets.dangerZone.revokeAll.subheader") }
                    onActionClick={ (): void => setShowConfirmationModal(true) }
                    data-componentid={ `${ componentId }-danger-zone` }
                />
            </DangerZoneGroup>
            <ConfirmationModal
                type="negative"
                open={ showConfirmationModal }
                assertionHint={ t("applications:clientSecrets.dangerZone.revokeAll.confirmation.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onClose={ (): void => setShowConfirmationModal(false) }
                onSecondaryActionClick={ (): void => setShowConfirmationModal(false) }
                onPrimaryActionClick={ (): void => {
                    onRevokeAll();
                    setShowConfirmationModal(false);
                } }
                closeOnDimmerClick={ false }
                data-componentid={ `${ componentId }-confirmation-modal` }
            >
                <ConfirmationModal.Header data-componentid={ `${ componentId }-confirmation-modal-header` }>
                    { t("applications:clientSecrets.dangerZone.revokeAll.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${ componentId }-confirmation-modal-message` }
                >
                    { t("applications:clientSecrets.dangerZone.revokeAll.confirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-componentid={ `${ componentId }-confirmation-modal-content` }>
                    { t("applications:clientSecrets.dangerZone.revokeAll.confirmation.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

export default RevokeAllClientSecretsDangerZone;
