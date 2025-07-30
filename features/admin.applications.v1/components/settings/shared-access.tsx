/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { useAsyncOperationStatus } from "@wso2is/admin.core.v1/hooks/use-async-operation-status";
import { OperationStatus, OperationStatusSummary } from "@wso2is/admin.core.v1/models/common";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, FeatureAccessConfigInterface,
    IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationManagementConstants } from "../../constants/application-management";
import { ApplicationInterface } from "../../models/application";
import { ApplicationShareForm } from "../forms/share-application-form";
import { ApplicationShareFormUpdated } from "../forms/share-application-form-updated";
import { OperationStatusBanner } from "../shared-access-status-banner";

/**
 * Proptypes for the shared access component.
 */
interface SharedAccessPropsInterface extends SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 *  Shared access component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Share access component.
 */
export const SharedAccess: FunctionComponent<SharedAccessPropsInterface> = (
    props: SharedAccessPropsInterface
): ReactElement => {

    const { application, onUpdate, readOnly } = props;
    const [ sharingState, setSharingState ] = useState<OperationStatus>(OperationStatus.IDLE);
    const [ sharingOperationId, setSharingOperationId ] = useState<string>();
    const [ sharingOperationSummary, setSharingOperationSummary ] = useState<OperationStatusSummary>();
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications);
    const isApplicationShareOperationStatusEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_SHARED_ACCESS_STATUS"));
    const isRoleSharingEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_ROLE_SHARING"));
    const asyncOperationStatusPollingInterval: number = useSelector((state: AppState) =>
        state?.config?.ui?.asyncOperationStatusPollingInterval);

    const statusToi18nKeyMap: Map<OperationStatus, { alertLevel: AlertLevels, i18nKey: string }> =
        new Map<OperationStatus, { alertLevel: AlertLevels, i18nKey: string }>([
            [ OperationStatus.SUCCESS, { alertLevel: AlertLevels.SUCCESS, i18nKey: "success" } ],
            [ OperationStatus.FAILED, { alertLevel: AlertLevels.ERROR, i18nKey: "failure" } ],
            [ OperationStatus.PARTIALLY_COMPLETED, { alertLevel: AlertLevels.ERROR, i18nKey: "partialSuccess" } ]
        ]);

    const { status, startPolling } = useAsyncOperationStatus({
        enabled: isApplicationShareOperationStatusEnabled,
        onStatusChange: (newOperationId: string, newStatus: OperationStatus,summary: OperationStatusSummary) => {
            if (sharingState !== OperationStatus.IDLE && newStatus !== OperationStatus.IN_PROGRESS) {
                const alertDetails: { alertLevel: AlertLevels, i18nKey: string } = statusToi18nKeyMap.get(newStatus);

                if (alertDetails) {
                    dispatch(addAlert({
                        description: t("applications:edit.sections.shareApplication.completedSharingNotification."
                            + alertDetails.i18nKey + ".description"),
                        level: alertDetails.alertLevel,
                        message: t("applications:edit.sections.shareApplication.completedSharingNotification."
                            + alertDetails.i18nKey + ".message")
                    }));
                }
            }
            setSharingState(newStatus);
            setSharingOperationId(newOperationId);
            setSharingOperationSummary(summary);
        },
        operationType: ApplicationManagementConstants.B2B_APPLICATION_SHARE,
        pollingInterval: asyncOperationStatusPollingInterval,
        subjectId: application.id
    });

    const handleChildStartedOperation = () => {
        setSharingState(OperationStatus.IN_PROGRESS);
        startPolling();
    };

    return (
        <>
            <OperationStatusBanner
                status={ sharingState }
                sharingOperationId={ sharingOperationId }
                sharingOperationSummary={ sharingOperationSummary }/>

            <EmphasizedSegment className="advanced-configuration-section" padded="very">
                {
                    isRoleSharingEnabled
                        ? (
                            <ApplicationShareFormUpdated
                                application={ application }
                                onApplicationSharingCompleted={ () => onUpdate(application?.id) }
                                readOnly={ readOnly }
                                onOperationStarted={ handleChildStartedOperation }
                                operationStatus={ status }
                                isSharingInProgress={ sharingState === OperationStatus.IN_PROGRESS }
                            />
                        ) : (
                            <ApplicationShareForm
                                application={ application }
                                onApplicationSharingCompleted={ () => onUpdate(application?.id) }
                                readOnly={ readOnly }
                                onOperationStarted={ handleChildStartedOperation }
                                operationStatus={ status }
                                isSharingInProgress={ sharingState === OperationStatus.IN_PROGRESS }
                            />
                        )
                }
            </EmphasizedSegment>
        </>
    );
};

/**
 * Default props for the application advanced settings component.
 */
SharedAccess.defaultProps = {
    "data-componentid": "application-shared-access"
};
