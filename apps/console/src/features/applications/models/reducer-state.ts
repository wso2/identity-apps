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

import {
    ApplicationTemplateListItemInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "./application";
import { AuthProtocolMetaListItemInterface, OIDCMetadataInterface } from "./application-inbound";

/**
 * Interface for the Application reducer state.
 */
export interface ApplicationReducerStateInterface {
    meta: ApplicationMetaInterface;
    templates: ApplicationTemplateListItemInterface[];
    groupedTemplates: ApplicationTemplateListItemInterface[];
    oidcConfigurations: OIDCApplicationConfigurationInterface;
    samlConfigurations: SAMLApplicationConfigurationInterface;
}

/**
 * Interface for the application meta for the redux store.
 */
interface ApplicationMetaInterface {
    inboundProtocols: AuthProtocolMetaListItemInterface[];
    customInboundProtocols: AuthProtocolMetaListItemInterface[];
    customInboundProtocolChecked: boolean;
    protocolMeta: AuthProtocolMetaInterface;
}

/**
 * Interface for the auth protocol metadata.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface AuthProtocolMetaInterface {
    [ key: string ]: OIDCMetadataInterface | any;
}
