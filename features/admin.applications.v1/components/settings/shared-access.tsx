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
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useOperationStatusPoller } from "../../hooks/use-operation-status-poller";
import { ApplicationInterface } from "../../models/application";
import { ApplicationShareForm } from "../forms/share-application-form";
import { OperationStatusBanner } from "../shared-access-status-banner";
import { ApplicationShareStatus } from "../../constants/application-management";

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
    const [ sharingState, setSharingState ] = useState<ApplicationShareStatus>(ApplicationShareStatus.IDLE);
    const [ sharingOperationId, setSharingOperationId ] = useState<string>();

    const { status, startPolling } = useOperationStatusPoller({  // use-application-sharing-operation-status
        applicationId: application.id,
        pollingInterval: 5000,
        onCompleted: (finalStatus) => {
            setSharingState(finalStatus);
        },
        onStatusChange: (newOperationId, newStatus) => {
            setSharingState(newStatus);
            setSharingOperationId(newOperationId);
        },
        onError: (error) => {
            console.error("Polling error:", error);
        },
        enabled: true //config.operationStatusPoller?.enabled ??
    });

    const handleChildStartedOperation = () => {
        setSharingState(ApplicationShareStatus.IN_PROGRESS);
        startPolling();
    };

    return (
        <>
            <OperationStatusBanner
                status={ sharingState}
                sharingOperationId={ sharingOperationId }/>
            <EmphasizedSegment className="advanced-configuration-section" padded="very">
                <ApplicationShareForm
                    application={ application }
                    onApplicationSharingCompleted={ () => onUpdate(application?.id) }
                    readOnly={ readOnly }
                    onOperationStarted={ handleChildStartedOperation }
                    operationStatus={ status }
                    isSharingInProgress={ sharingState === ApplicationShareStatus.IN_PROGRESS }
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
