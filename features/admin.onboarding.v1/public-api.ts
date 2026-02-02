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

// Pages
export { default as OnboardingPage } from "./pages/onboarding-page";

// Shared Components
export { default as ColorPicker } from "./components/shared/color-picker";
export { default as LoginBoxPreview } from "./components/shared/login-box-preview";
export { default as LogoSelector } from "./components/shared/logo-selector";
export { default as SelectableCard } from "./components/shared/selectable-card";
export { default as SignInOptionToggle } from "./components/shared/sign-in-option-toggle";

// Step Components
export { default as ConfigureRedirectUrlStep } from "./components/steps/configure-redirect-url-step";
export { default as DesignLoginStep } from "./components/steps/design-login-step";
export { default as SignInOptionsStep } from "./components/steps/sign-in-options-step";
export { default as SuccessStep } from "./components/steps/success-step";

// API
export * from "./api";

// Constants
export * from "./constants";

// Hooks
export { useOnboardingStatus } from "./hooks/use-onboarding-status";
export * from "./hooks/use-onboarding-validation";

// Models
export * from "./models";
