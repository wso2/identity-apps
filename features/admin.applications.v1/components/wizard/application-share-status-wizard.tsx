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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { ShareApplicationStatusResponseSummary } from "../../models/application";
import { ShareApplicationStatusResponseList } from "../share-application-status-response-list";

/**
 * Proptypes for the application share status wizard component.
 */
interface ApplicationShareStatusWizardProps extends IdentifiableComponentInterface {
    /**
     * The component Id.
     */
    componentId: string;
    /**
     * The operation ID of the share operation.
     */
    operationId: string;
    hasError: boolean;
}

/**
 * Application share status wizard component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application share status wizard component.
 */
const ApplicationShareStatusWizard: FunctionComponent<ApplicationShareStatusWizardProps> = (
    props: ApplicationShareStatusWizardProps
): ReactElement => {

    const { operationId, hasError, componentId } = props;
    const [ hasLoaded ] = useState<boolean>(false);
    const [ applicationShareStatusResponseSummary ] =
    useState<ShareApplicationStatusResponseSummary>(initialApplicationShareStatusResponseSummary);

    return (
        <>
            <ShareApplicationStatusResponseList
                isLoading={ !hasLoaded }
                operationId={ operationId }
                data-componentid={ `${componentId}-list` }
                hasError={ hasError }
                shareApplicationSummary={ applicationShareStatusResponseSummary }
            />
        </>
    );
};

const initialApplicationShareStatusResponseSummary: ShareApplicationStatusResponseSummary = {
    failedAppShare: 0,
    successAppShare: 0
};

export default ApplicationShareStatusWizard;
