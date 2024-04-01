/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Context, createContext } from "react";
import {
    AdaptiveAuthTemplateCategoryListItemInterface,
    ApplicationInterface,
    AuthenticationSequenceInterface
} from "../../admin-applications-v1/models/application";
import { GenericAuthenticatorInterface } from "../../admin-identity-providers-v1/models/identity-provider";
import { AuthenticationFlowBuilderModes } from "../models/flow-builder";
import { VisualEditorFlowNodeMetaInterface } from "../models/visual-editor";

/**
 * Props interface for BrandingPreferenceContext.
 */
export type AuthenticationFlowContextProps = {
    /**
     * Application details from the GET details API call.
     */
    applicationMetaData: ApplicationInterface;
    /**
     * Adaptive authentication templates.
     */
    adaptiveAuthTemplates: AdaptiveAuthTemplateCategoryListItemInterface;
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Set of local, social, etc. authenticators.
     */
    authenticators: {
        local: GenericAuthenticatorInterface[];
        social: GenericAuthenticatorInterface[];
        enterprise: GenericAuthenticatorInterface[];
        secondFactor: GenericAuthenticatorInterface[];
        recovery: GenericAuthenticatorInterface[];
    };
    /**
     * List of hidden authenticators.
     */
    hiddenAuthenticators: string[];
    /**
     * Callback to be fired when a new authentication step needs to be added.
     */
    addSignInStep: () => void;
    /**
     * Callback to be fired when a new authentication option needs to be added.
     * @param stepIndex - Index of the step.
     * @param authenticatorId - ID of the authenticator.
     */
    addSignInOption: (stepIndex: number, authenticatorId: string) => void;
    /**
     * Default authentication sequence.
     */
    defaultAuthenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is adaptive authentication available or not.
     */
    isAdaptiveAuthAvailable: boolean;
    /**
     * Is authentication sequence default or not.
     */
    isAuthenticationSequenceDefault: boolean;
    /**
     * Is authentication flow valid or not.
     */
    isValidAuthenticationFlow: boolean;
    /**
     * Is conditional authentication enabled or not.
     */
    isConditionalAuthenticationEnabled: boolean;
    /**
     * Is the visual editor enabled or not.
     */
    isVisualEditorEnabled: boolean;
    /**
     * Is the legacy editor enabled or not.
     */
    isLegacyEditorEnabled: boolean;
    /**
     * Flag to determine if the updated application a system application.
     */
    isSystemApplication?: boolean;
    /**
     * Callback to be fired when the active flow mode is changed.
     * @param mode - Active flow mode.
     */
    onActiveFlowModeChange: (mode: AuthenticationFlowBuilderModes) => void;
    /**
     * Callback to be fired when the conditional authentication toggle is switched.
     * @param enabled - Is conditional authentication enabled or not.
     */
    onConditionalAuthenticationToggle: (enabled: boolean) => void;
    /**
     * Callback to be fired when the application details needs to be re-fetched.
     */
    refetchApplication: () => void;
    /**
     * Callback to be fired when the authenticators needs to be re-fetched.
     * @returns Promise.
     */
    refetchAuthenticators: () => Promise<void>;
    /**
     * Callback to be fired when a sign-in option needs to be removed.
     * @param stepIndex - Index of the step.
     * @param authenticatorId - ID of the authenticator.
     */
    removeSignInOption: (stepIndex: number, authenticatorId: string) => void;
    /**
     * Callback to be fired when a sign-in step needs to be removed.
     * @param stepIndex - Index of the step.
     */
    removeSignInStep: (stepIndex: number) => void;
    /**
     * Callback to be fired when the authentication sequence needs to be reverted to the default.
     */
    revertAuthenticationSequenceToDefault: () => void;
    /**
     * Callback to be fired when the authentication sequence needs to be updated.
     * @param sequence - Partial new sequence.
     */
    updateAuthenticationSequence: (sequence: AuthenticationSequenceInterface) => void;
    /**
     * Callback to be fired when visual editor flow node meta needs to be updated.
     * @param stepIndex - Index of the step.
     * @param meta - New meta.
     */
    updateVisualEditorFlowNodeMeta: (stepIndex: number | string, meta: VisualEditorFlowNodeMetaInterface) => void;
    /**
     * Visual editor flow node meta.
     */
    visualEditorFlowNodeMeta: VisualEditorFlowNodeMetaInterface;
};

/**
 * Context object for managing branding preferences.
 */
const AuthenticationFlowContext: Context<AuthenticationFlowContextProps> =
  createContext<null | AuthenticationFlowContextProps>(null);

/**
 * Display name for the AuthenticationFlowContext.
 */
AuthenticationFlowContext.displayName = "AuthenticationFlowContext";

export default AuthenticationFlowContext;
