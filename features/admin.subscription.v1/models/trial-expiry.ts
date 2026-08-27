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

/**
 * Steps of the trial expiry wizard.
 */
export enum TrialExpiryStep {
    CHANGES = 0,
    UPGRADE = 1
}

/**
 * Response of the post trial expiry notice endpoint.
 */
export interface TrialExpiryNoticeResponseInterface {
    orgHandle: string;
    /**
     * True only when the most recent trial of the organization has expired, the notice has not
     * been dismissed for the organization, and the organization is on a free tier.
     */
    showNotice: boolean;
    /**
     * End date of the most recent trial in epoch milliseconds. 0 when the organization never
     * held a trial.
     */
    trialEndDate: number;
    /**
     * Id of the trial the notice is about, passed back when dismissing the notice.
     */
    trialId: number;
}

/**
 * Request body of the post trial expiry notice dismissal endpoint.
 */
export interface TrialExpiryNoticeDismissalRequestInterface {
    trialId: number;
}
