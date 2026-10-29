/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { CimdConstants } from "./constants";

/**
 * Why a Client Identifier URL is not accepted before it is previewed.
 */
export enum CimdClientIdUrlError {
    INVALID = "invalid",
    TOO_LONG = "tooLong"
}

/**
 * Length of a Client Identifier URL in UTF-8 bytes, as IS counts it.
 *
 * @param url - Client Identifier URL.
 * @returns Length in bytes.
 */
const getCimdClientIdByteLength = (url: string): number => new TextEncoder().encode(url).length;

/**
 * Checks a Client Identifier URL before it is previewed: an `https` URL of at most 255 bytes, the longest client ID
 * IS can store. IS checks the rest of its shape when it previews it.
 *
 * @param url - Client Identifier URL.
 * @returns The reason it is not accepted, or `null`.
 */
export const validateCimdClientIdUrl = (url: string): CimdClientIdUrlError | null => {
    if (getCimdClientIdByteLength(url) > CimdConstants.MAX_CLIENT_ID_BYTES) {
        return CimdClientIdUrlError.TOO_LONG;
    }

    try {
        return new URL(url).protocol === "https:" ? null : CimdClientIdUrlError.INVALID;
    } catch {
        return CimdClientIdUrlError.INVALID;
    }
};
