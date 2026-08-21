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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FunctionComponent, ReactElement } from "react";

/**
 * Extension point for the wizard shown once a tenant's trial has ended.
 *
 * No-op in the base product. Extensions that run a trial pipeline can override this file with their own wizard,
 * driving it off the state exposed by `useTrialExpiryWizard` in `@wso2is/admin.subscription.v1`.
 *
 * @returns Nothing.
 */
const TrialExpiryWizard: FunctionComponent<IdentifiableComponentInterface> = (): ReactElement => null;

export default TrialExpiryWizard;
