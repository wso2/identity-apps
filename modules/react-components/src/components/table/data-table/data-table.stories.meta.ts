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
 *
 */

import { StoryCategories } from "../../../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "DataTable" ],
    description: "Component to render a data driven table.",
    stories: [
        {
            description: "Basic usage of a Data Table.",
            title: "Basic Usage"
        },
        {
            description: "Usage of a Data Table with an operations bar enabled.",
            title: "With operations bar Enabled"
        },
        {
            description: "Usage of a sortable Data Table.",
            title: "Sortable"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Data Table`
};

export interface DataTableDemoDataInterface {
    name: string;
    clientId: string;
    description: string;
    imageUrl?: string;
    accessUrl?: string;
}

export const DEMO_DATA_LIST: DataTableDemoDataInterface[] = [
    {
        accessUrl: "https://facebook.com",
        clientId: "jvwEqjYtRSeMtb4nGWXUKdMBN2UXpl3t",
        description: "Facebook federated login example app.",
        imageUrl: "http://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19750.png",
        name: "Facebook"
    },
    {
        accessUrl: "https://localhost:9000/go-demo",
        clientId: "jvasdjYtdfdfRSeMtbasdUKdMBN2UXpl34",
        description: "Demo of the GO lang SDK implementing the auth code flow.",
        imageUrl: "https://miro.medium.com/max/1300/1*pk4gPFD0OLeKbwKlN1v9YA.png",
        name: "GO SDK Demo"
    },
    {
        accessUrl: "https://localhost:9000/react",
        clientId: "HkajsdTYsadyiqu908jwjasdkal234kjkalsd",
        description: "React SPA application which uses Identity server for authentication.",
        imageUrl: "https://cdn.worldvectorlogo.com/logos/react.svg",
        name: "React OIDC"
    },
    {
        accessUrl: "https://localhost:9000/travelocity",
        clientId: "qj98237hkjashf18TYWE937kjasdhajs3YY",
        description: "Sample to demonstrate how to configure SSO using SAML 2.0",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRacD47HCM72sjMsU8z1COwdSfiopqgddXi24k_" +
            "bCIPTGRvCeij",
        name: "travelocity.com"
    },
    {
        accessUrl: "https://localhost:9000/android",
        clientId: "RRj98237hkjashf18TYWE937kjasdhajs3X",
        description: "A demo application to showcase multi-factor authentication on android devices.",
        imageUrl: "https://cdn.worldvectorlogo.com/logos/android.svg",
        name: "Android Integration Demo"
    },
    {
        accessUrl: "https://localhost:9443/pickup-dispatch",
        clientId: "EEj98237hkjashf18TYWE937kjasdhajs3F",
        description: "This application helps manage the overall operations in a car rental service.",
        imageUrl: "https://img.icons8.com/plasticine/2x/car.png",
        name: "Pickup Dispatch"
    },
    {
        accessUrl: "https://localhost:4444/angular-oidc",
        clientId: "Psj98237hkjashf18TYWE937kjasdhajs3X",
        description: "SPA application which uses Identity server for authentication.",
        imageUrl: "https://angular.io/assets/images/logos/angularjs/AngularJS-Shield.svg",
        name: "Angular OIDC"
    },
    {
        accessUrl: "https://mail.google.com",
        clientId: "RDj98237hkjashf18TYWE937kjasdhajs3Q",
        description: "Gmail is email that's intuitive, efficient, and useful. 15 GB of storage, less spam, and " +
            "mobile access",
        imageUrl: "https://www.freepnglogos.com/uploads/logo-gmail-png/logo-gmail-png-gmail-icon-download-png-" +
            "and-vector-1.png",
        name: "Gmail"
    },
    {
        accessUrl: "https://www.google.com/drive/",
        clientId: "EDj98237hkjashf18TYWE937kjasdhajs3Q",
        description: "With Drive Enterprise, businesses only pay for the storage employees use.",
        imageUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/a3/62/4f/a3624fbc-6f28-da42-fc2e-a01a4c" +
            "93943d/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-6.png/246x0w.jpg",
        name: "Google Drive"
    }
];
