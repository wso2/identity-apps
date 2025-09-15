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

import CommonStaticStepFactory, {
    CommonStaticStepFactoryPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resources/steps/common-static-step-factory";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import EmailConfirmationNode from "./email-confirmation";
import UserAccountUnlockNode from "./user-acount-unlock";
import { RegistrationStaticStepTypes } from "../../../models/flow";

/**
 * Props interface of {@link StaticStepFactory}
 */
export type StaticStepFactoryPropsInterface = CommonStaticStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Factory for creating static steps in the visual editor.
 * Extends the {@link CommonStaticStepFactory} component.
 *
 * @param props - Props injected to the component.
 * @returns The StaticStepFactory component.
 */
export const StaticStepFactory: FunctionComponent<StaticStepFactoryPropsInterface> = ({
    type,
    "data-componentid": componentId = "static-node-factory",
    ...rest
}: StaticStepFactoryPropsInterface & Node): ReactElement => {

    if ((type as string) === RegistrationStaticStepTypes.EMAIL_CONFIRMATION) {
        return <EmailConfirmationNode />;
    }

    if ((type as string) === RegistrationStaticStepTypes.USER_ACCOUNT_UNLOCK) {
        return <UserAccountUnlockNode />;
    }

    return <CommonStaticStepFactory type={ type } data-componentid={ componentId } { ...rest } />;
};

export default StaticStepFactory;
