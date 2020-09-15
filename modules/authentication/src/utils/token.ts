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

import { DecodedIdTokenPayloadInterface } from "../models";

/**
 * Extracts the tenant domain from the ID token payload.
 *
 * @param {DecodedIdTokenPayloadInterface} payload - Decoded ID token payload.
 * @param {string} uidSeparator - Separator to split the uid.
 * @return {string} Extracted tenant domain.
 */
export const getTenantDomainFromIdTokenPayload = (payload: DecodedIdTokenPayloadInterface,
                                                  uidSeparator: string = "@"): string => {

    // If the `tenant_domain` claim is available in the ID token payload, give precedence.
    if (payload.tenant_domain) {
        return payload.tenant_domain;
    }

    // Try to extract the tenant domain from the `sub` claim.
    const uid = payload.sub;
    const tokens = uid.split(uidSeparator);

    return tokens[ tokens.length - 1 ];
};
