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

import { ApplicationTemplateListItemInterface } from "../models";

export const getDefaultTemplateGroups = (): ApplicationTemplateListItemInterface[] => [
    {
        category: "DEFAULT_GROUP",
        description: "Regular web applications which uses re-directions inside browsers.",
        id: "web-application",
        image: "oidcWebApp",
        name: "Web Application",
        subTemplatesSectionTitle: "Protocols"
    },
    {
        category: "DEFAULT_GROUP",
        description: "Applications developed to target native desktops.",
        id: "desktop",
        image: "windowsNative",
        name: "Desktop Application",
        subTemplatesSectionTitle: "Technology"
    },
    {
        category: "DEFAULT_GROUP",
        description: "Applications developed to target mobiles devices.",
        id: "mobile",
        image: "oidcMobile",
        name: "Mobile Application",
        subTemplatesSectionTitle: "Technology"
    }
];
