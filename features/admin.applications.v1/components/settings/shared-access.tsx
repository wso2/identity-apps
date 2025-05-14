/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { ApplicationManagementConstants, OperationStatus } from "../../constants/application-management";
import { useAsyncOperationStatus } from "../../hooks/use-async-operation-status";
import { ApplicationInterface, OperationStatusSummary } from "../../models/application";
import { ApplicationShareForm } from "../forms/share-application-form";
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
    const applicationSharingStatusPollingInterval: number = useSelector((state: AppState) =>
        state?.config?.ui?.applicationSharingStatusPollingInterval);

    const statusToi18nKeyMap: Map<OperationStatus, string> = new Map<OperationStatus, string>([
        [ OperationStatus.SUCCESS, "success" ],
        [ OperationStatus.FAILED, "failure" ],
        [ OperationStatus.PARTIALLY_COMPLETED, "partialSuccess" ]
    ]);

    const { status, startPolling } = useAsyncOperationStatus({
        enabled: isApplicationShareOperationStatusEnabled,
        onCompleted: (finalStatus: OperationStatus) => {
            setSharingState(finalStatus);
            dispatch(addAlert({
                description: t("applications:edit.sections.shareApplication.completedSharingNotification."
                    + statusToi18nKeyMap.get(status) + ".description"),
                level: AlertLevels.ERROR,
                message: t("applications:edit.sections.shareApplication.completedSharingNotification."
                    + statusToi18nKeyMap.get(status) + ".message")
            }));
        },
        onStatusChange: (newOperationId: string, newStatus: OperationStatus,
            operationSummary: OperationStatusSummary) => {
            setSharingState(newStatus);
            setSharingOperationId(newOperationId);
            setSharingOperationSummary(operationSummary);
        },
        operationType: ApplicationManagementConstants.B2B_APPLICATION_SHARE,
        pollingInterval: applicationSharingStatusPollingInterval,
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
                <ApplicationShareForm
                    application={ application }
                    onApplicationSharingCompleted={ () => onUpdate(application?.id) }
                    readOnly={ readOnly }
                    onOperationStarted={ handleChildStartedOperation }
                    operationStatus={ status }
                    isSharingInProgress={ sharingState === OperationStatus.IN_PROGRESS }
                />
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
