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

import DesktopApplicationTemplateGroup from "./groups/desktop-application-template-group.json";
import MobileApplicationTemplateGroup from "./groups/mobile-application-template-group.json";
import WebApplicationTemplateGroup from "./groups/web-application-template-group.json";
import AndroidMobileApplicationTemplate from "./templates/android-mobile-application/android-mobile-application.json";
import CustomApplicationTemplate from "./templates/custom-application/custom-application.json";
import OIDCWebApplicationTemplate from "./templates/oidc-web-application/oidc-web-application.json";
import SAMLWebApplicationTemplate from "./templates/saml-web-application/saml-web-application.json";
import SinglePageApplicationTemplate from "./templates/single-page-application/single-page-application.json";
import WindowsDesktopApplicationTemplate
    from "./templates/windows-desktop-application/windows-desktop-application.json";
import { ApplicationTemplateGroupInterface, ApplicationTemplateListItemInterface } from "../../models";

export interface ApplicationTemplatesConfigInterface {
    groups: ApplicationTemplateGroupConfigInterface[];
    templates: ApplicationTemplateConfigInterface[];
}

export interface ApplicationTemplateConfigInterface {
    meta: CommonTemplateConfigMetaInterface;
    templateObj: ApplicationTemplateListItemInterface;
}

export interface ApplicationTemplateGroupConfigInterface {
    meta: CommonTemplateConfigMetaInterface;
    templateGroupObj: ApplicationTemplateGroupInterface;
}

interface CommonTemplateConfigMetaInterface {
    enabled: boolean;
}

export const getApplicationTemplatesConfig = (): ApplicationTemplatesConfigInterface => {

    return {
        groups: [
            {
                meta: {
                    enabled: true
                },
                templateGroupObj: WebApplicationTemplateGroup
            },
            {
                meta: {
                    enabled: true
                },
                templateGroupObj: DesktopApplicationTemplateGroup
            },
            {
                meta: {
                    enabled: true
                },
                templateGroupObj: MobileApplicationTemplateGroup
            }
        ],
        templates: [
            {
                meta: {
                    enabled: true
                },
                templateObj: AndroidMobileApplicationTemplate
            },
            {
                meta: {
                    enabled: true
                },
                templateObj: OIDCWebApplicationTemplate
            },
            {
                meta: {
                    enabled: true
                },
                templateObj: SAMLWebApplicationTemplate
            },
            {
                meta: {
                    enabled: true
                },
                templateObj: SinglePageApplicationTemplate
            },
            {
                meta: {
                    enabled: true
                },
                templateObj: WindowsDesktopApplicationTemplate
            },
            {
                meta: {
                    enabled: true
                },
                templateObj: CustomApplicationTemplate
            }
        ]
    };
};
