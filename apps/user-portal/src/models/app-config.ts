/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
  * Model of the Overview page
  */
interface Overview {
    enabled: boolean;
    accountStatus: boolean;
    accountActivity: boolean;
    accountSecurity: boolean;
    consentsControl: boolean;
}

/**
 * Model of the Personal Info page
 */
interface PersonalInfo {
    enabled: true;
    profile: true;
    linkedAccounts: true;
    exportProfile: true;
}

/**
 * Model of the Security Page configuration
 */
interface Security {
    enabled: boolean;
    changePassword: boolean;
    accountRecovery: AccountRecovery;
    multiFactorAuthentication: MultiFactorAuthentication;
    activeSessions: boolean;
    manageConsents: boolean;
}

/**
 * Model of the Account Recovery configuration
 */
interface AccountRecovery {
    enabled: boolean;
    securityQuestions: boolean;
    emailRecovery: boolean;
}

/**
 * Model of the MFA configuration
 */
interface MultiFactorAuthentication {
    enabled: boolean;
    sms: boolean;
    fido: boolean;
}

/**
 * Model of the app configuration
 */
export interface AppConfigInterface {
    overview: Overview;
    personalInfo: PersonalInfo;
    applications: boolean;
    security: Security;
    operations: boolean;
}
