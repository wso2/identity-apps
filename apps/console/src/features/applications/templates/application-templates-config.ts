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

import AndroidMobileApplicationTemplate from "./android-mobile-application/android-mobile-application.json";
import CustomApplicationTemplate from "./custom-application/custom-application.json";
import OIDCWebApplicationTemplate from "./oidc-web-application/oidc-web-application.json";
import SAMLWebApplicationTemplate from "./saml-web-application/saml-web-application.json";
import SinglePageApplicationTemplate from "./single-page-application/single-page-application.json";
import WindowsDesktopApplicationTemplate from "./windows-desktop-application/windows-desktop-application.json";
import {
    ApplicationTemplateCategories,
    ApplicationTemplateListItemInterface,
    DefaultTemplateGroupIds
} from "../models";

export interface ApplicationTemplatesConfigInterface {
    enabled: boolean;
    id: string;
    template?: ApplicationTemplateListItemInterface;
}

export const getApplicationTemplatesConfig = (): ApplicationTemplatesConfigInterface[] => {

    return [
        {
            enabled: false,
            id: "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec",
            template: AndroidMobileApplicationTemplate
        },
        {
            enabled: true,
            id: "b9c5e11e-fc78-484b-9bec-015d247561b8",
            template: OIDCWebApplicationTemplate
        },
        {
            enabled: true,
            id: "776a73da-fd8e-490b-84ff-93009f8ede85",
            template: SAMLWebApplicationTemplate
        },
        {
            enabled: true,
            id: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
            template: SinglePageApplicationTemplate
        },
        {
            enabled: true,
            id: "df929521-6768-44f5-8586-624126ec3f8b",
            template: WindowsDesktopApplicationTemplate
        },
        {
            enabled: true,
            id: "custom-application",
            template: CustomApplicationTemplate
        }
    ];
};

export const getApplicationTemplateGroups = (): ApplicationTemplateListItemInterface[] => {

    return [
        {
            category: ApplicationTemplateCategories.DEFAULT_GROUP,
            description: "Regular web applications which use re-directions inside browsers.",
            id: DefaultTemplateGroupIds.WEB_APPLICATION,
            image: "oidcWebApp",
            name: "Web Application",
            subTemplatesSectionTitle: "Protocols"
        },
        {
            category: ApplicationTemplateCategories.DEFAULT_GROUP,
            description: "Applications developed to target native desktops.",
            id: DefaultTemplateGroupIds.DESKTOP_APPLICATION,
            image: "windowsNative",
            name: "Desktop Application",
            subTemplatesSectionTitle: "Technology"
        },
        {
            category: ApplicationTemplateCategories.DEFAULT_GROUP,
            description: "Applications developed to target mobiles devices.",
            id: DefaultTemplateGroupIds.MOBILE_APPLICATION,
            image: "oidcMobile",
            name: "Mobile Application",
            subTemplatesSectionTitle: "Technology"
        }
    ];
};
