/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionComponent, RefObject, SVGProps } from "react";
import { Notification } from "react-notification-system";

/**
 * Alert interface.
 */
export interface AlertInterface extends Notification {
    /**
     * Description for the alert.
     */
    description: string;
}

/**
 * Enum for Alert levels.
 *
 * @readonly
 */
export enum AlertLevels {
    /**
     * Success alert level.
     */
    SUCCESS = "success",
    /**
     * Error alert level.
     */
    ERROR = "error",
    /**
     * Info alert level.
     */
    INFO = "info",
    /**
     * Warning alert level.
     */
    WARNING = "warning"
}

/**
 * Interface for the runtime config.
 *
 * TODO: Remove this and use the ones passed from portals.
 * @deprecated Maintain this on the app side.
 */
export interface RuntimeConfigInterface {
    /**
     * Name of the application. ex: "Console, My Account etc.".
     */
    applicationName?: string;
    /**
     * Client host. ex: "https://localhost:9000".
     */
    clientHost?: string;
    /**
     * Client ID. ex: "USER_PORTAL" or "OBkfXrmKCvulIt0fIs6UOYVZd34a".
     */
    clientID?: string;
    /**
     * Copyright text to be displayed on footer.
     */
    copyrightText?: string;
    /**
     * Login callback URL. ex: "https://localhost:9000/<PORTAL>/login".
     */
    loginCallbackUrl?: string;
    /**
     * Server host. ex: "https://localhost:9443".
     */
    serverHost?: string;
    /**
     * Product title. ex: "WSO2 Identity Server".
     */
    titleText?: string;
}

/**
 * Common interface to extend testable components.
 *
 * @deprecated Use IdentifiableComponentInterface instead.
 */
export interface TestableComponentInterface {
    /**
     * Unit test id.
     */
    "data-testid"?: string;
}

/**
 * Common interface to extend identifiable components.
 */
export interface IdentifiableComponentInterface {
    /**
     * Unique component id.
     */
   "data-componentid"?: string;
}

/**
 * Interface for loading state options.
 */
export interface LoadingStateOptionsInterface {
    /**
     * Number of loading rows.
     */
    count?: number;
    /**
     * Loading state image type.
     */
    imageType?: "circular" | "square";
}

/**
 * Common interface to be extended to for components having loading capability.
 */
export interface LoadableComponentInterface {
    /**
     * Flag for loading state.
     */
    isLoading?: boolean;
}

/**
 * Common interface to be extended to have the `ref` attribute.
 */
export interface ReferableComponentInterface<T = Record<string, any>> {
    /**
     *
     */
    ref: RefObject<T>;
}

/**
 * Enum for Product release types.
 *
 * @readonly
 */
export enum ProductReleaseTypes {
    /**
     * Milestone release.
     */
    MILESTONE = "milestone",
    /**
     * Alpha release.
     */
    ALPHA = "alpha",
    /**
     * Beta Release.
     */
    BETA = "beta",
    /**
     * Release candidate.
     */
    RC = "rc"
}

/**
 * Product version configurations interface.
 */
export interface ProductVersionConfigInterface {
    /**
     * Show snapshot label.
     */
    allowSnapshot?: boolean;
    /**
     * Color for the release label.
     */
    labelColor?: "auto" | "primary" | "secondary" | string;
    /**
     * Override the parent POM version.
     */
    productVersion?: string;
    /**
     * Text case.
     */
    textCase?: "lowercase" | "uppercase";
    /**
     * Label position.
     */
    labelPosition?: "absolute" | "relative";
}

/**
 * Interface for lazily loaded imported SVGs loaded using svgr webpack loader.
 */
export interface SVGRLoadedInterface {
    /**
     * Image as React Component.
     */
    ReactComponent:  FunctionComponent<SVGProps<SVGSVGElement>>;
    /**
     * Image as Data URL.
     */
    default: string;
}

export interface LegacyModeInterface {
    apiResources: boolean;
    applicationListSystemApps: boolean;
    applicationOIDCSubjectIdentifier: boolean;
    applicationRequestPathAuthentication: boolean;
    applicationSystemAppsSettings: boolean;
    approvals: boolean;
    certificates: boolean;
    loginAndRegistrationEmailDomainDiscovery: boolean;
    organizations: boolean;
    rolesV1: boolean;
    roleMapping: boolean;
    secretsManagement: boolean;
    saasApplications: boolean;
}
