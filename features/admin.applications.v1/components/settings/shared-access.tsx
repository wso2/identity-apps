/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { FeatureConfigInterface } from "../../../admin.core.v1";
import { ApplicationInterface } from "../../models";
import { ApplicationShareForm } from "../forms";

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

    return (
        <EmphasizedSegment className="advanced-configuration-section" padded="very">
            <ApplicationShareForm 
                application={ application } 
                onApplicationSharingCompleted={ () => onUpdate(application?.id) }
                readOnly={ readOnly }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default props for the application advanced settings component.
 */
SharedAccess.defaultProps = {
    "data-componentid": "application-shared-access"
};
