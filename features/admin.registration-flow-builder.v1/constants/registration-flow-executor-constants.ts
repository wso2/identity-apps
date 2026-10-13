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

/**
 * Constants related to the Executors in the Registration flow.
 *
 * @remarks
 * This class is not meant to be instantiated. It only provides static constants.
 *
 * @example
 * ```typescript
 * const executor = RegistrationFlowExecutorConstants.PASSWORD_PROVISIONING_EXECUTOR;
 * ```
 */
class RegistrationFlowExecutorConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly PASSWORD_PROVISIONING_EXECUTOR: string = "PasswordProvisioningExecutor";

    public static readonly EMAIL_OTP_EXECUTOR: string = "EmailOTPExecutor";

    public static readonly SMS_OTP_EXECUTOR: string = "SMSOTPExecutor";

    public static readonly GOOGLE_EXECUTOR: string = "GoogleExecutor";

    public static readonly MAGIC_LINK_EXECUTOR: string = "MagicLinkExecutor";

    public static readonly USER_PROVISIONING_EXECUTOR: string = "UserProvisioningExecutor";

    /**
     * Swapped onto the END step in place of `USER_PROVISIONING_EXECUTOR` when the flow collects an
     * organization name. Provisions the user first, then the organization.
     */
    public static readonly PROVISIONING_DISPATCH_EXECUTOR: string = "ProvisioningDispatchExecutor";

    /**
     * Executor config key read by `ProvisioningDispatchExecutor` to decide where the user is
     * provisioned.
     */
    public static readonly PROVISION_TARGET_KEY: string = "provisionTarget";

    public static readonly ROLE_IDS_KEY: string = "roleIds";

    /**
     * Value of {@link PROVISION_TARGET_KEY} that provisions the user inside the organization the flow
     * creates. Absent means the user is provisioned in the organization the flow is executing in.
     */
    public static readonly NEW_ORGANIZATION_PROVISION_TARGET: string = "NEW_ORGANIZATION";
}

export default RegistrationFlowExecutorConstants;
