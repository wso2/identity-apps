/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { Node } from "@xyflow/react";
import { Base } from "./base";
import { Resource } from "./resources";

export interface StepPosition {
    x: number;
    y: number;
}

export interface StepSize {
    width: number;
    height: number;
}

export interface StrictStep extends Base {
    size: StepSize;
    position: StepPosition;
}

export interface StepWithCodeGenerationMetadata extends StrictStep {
    __generationMeta__: any;
}

export interface StepData {
    components: Resource[];
    [key: string]: any;
}

export type Step = StepWithCodeGenerationMetadata & Node<StepData>;

export enum StepCategories {
    Decision = "DECISION",
    Interface = "INTERFACE",
    Workflow = "WORKFLOW"
}

export enum StepTypes {
    View = "VIEW",
    RuleEvaluation = "RULE_EVALUATION",
    Execution = "EXECUTION",
    End = "END",
}

export enum StaticStepTypes {
    UserOnboard = "USER_ONBOARD",
    Start = "START",
}

export enum ExecutionTypes {
    GoogleFederation = "GoogleExecutor",
    AppleFederation = "AppleExecutor",
    FacebookFederation = "FacebookExecutor",
    MicrosoftFederation = "Office365Executor",
    GithubFederation = "GithubExecutor",
    PasskeyEnrollment = "FIDO2Executor",
    ConfirmationCode = "ConfirmationCodeValidationExecutor",
    MagicLinkExecutor = "MagicLinkExecutor",
    FlowExtension = "FlowExtensionExecutor",
    DigitalWalletFederation = "PresentationExecutor",
    DeviceRegistration = "DeviceRegistrationExecutor",
    // Contributed by the Authsignal connector; available only when the connector is deployed.
    Authsignal = "AuthsignalExecutor"
}

/**
 * Phases of the device registration executor, set in `action.executor.meta.phase`.
 */
export enum DeviceRegistrationPhases {
    NativeDeviceRegistration = "NATIVE_DEVICE_REGISTRATION",
    InitRegistration = "INIT_REGISTRATION",
    ProcessDevice = "PROCESS_DEVICE",
    FinishRegistration = "FINISH_REGISTRATION"
}

/**
 * Components an execution step's page allows on top of the static content, by phase.
 */
export interface ExecutionAllowedResourceTypesInterface {
    /**
     * Additions for a step without a phase, or with a phase not listed in `phases`.
     */
    default: string[];
    /**
     * Additions per phase, the value of `action.executor.meta.phase`.
     */
    phases?: Record<string, string[]>;
}

export enum ExecutionStepViewTypes {
    Default = "Execution",
    MagicLinkView = "Magic Link View",
    PasskeyView = "Passkey View",
    WalletView = "Digital Wallet"
}

export enum ViewStepVariants {
    PolicyConsent = "POLICY_CONSENT",
    PreferenceManagement = "PREFERENCE_MANAGEMENT"
}
