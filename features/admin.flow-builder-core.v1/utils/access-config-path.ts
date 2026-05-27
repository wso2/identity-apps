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

import { AccessConfigInterface, ContextPathInterface } from "@wso2is/admin.actions.v1/models/actions";

// Containers whose child keys are URIs (contain "/") and so must be encoded as
// `[<attr>=<value>]` segments instead of a slash-joined sub-path. Extend this
// map if new URI-keyed containers are added on the backend.
const URI_CONTAINERS: { prefix: string; attr: string }[] = [
    { attr: "uri", prefix: "/user/claims/" }
];

const TYPE_HINT_RE: RegExp = /\{[^}]+\}$/;

/**
 * Convert an internal slash-joined path to the API's bracketed form.
 * `/user/claims/<uri>{Type}?` → `/user/claims[uri=<uri>]{Type}?`
 */
const toApiPath = (path: string): string => {
    if (!path) return path;

    const typeHintMatch: RegExpMatchArray | null = path.match(TYPE_HINT_RE);
    const typeHint: string = typeHintMatch ? typeHintMatch[0] : "";
    const base: string = typeHint ? path.slice(0, -typeHint.length) : path;

    for (const { prefix, attr } of URI_CONTAINERS) {
        if (base.startsWith(prefix) && base.length > prefix.length) {
            const value: string = base.slice(prefix.length);

            return `${prefix.slice(0, -1)}[${attr}=${value}]${typeHint}`;
        }
    }

    return path;
};

/**
 * Convert an API bracketed path back to the internal slash-joined form.
 * `/user/claims[uri=<uri>]{Type}?` → `/user/claims/<uri>{Type}?`
 */
const fromApiPath = (path: string): string => {
    if (!path) return path;

    const typeHintMatch: RegExpMatchArray | null = path.match(TYPE_HINT_RE);
    const typeHint: string = typeHintMatch ? typeHintMatch[0] : "";
    const base: string = typeHint ? path.slice(0, -typeHint.length) : path;

    for (const { prefix, attr } of URI_CONTAINERS) {
        const container: string = prefix.slice(0, -1);
        const bracket: string = `${container}[${attr}=`;

        if (base.startsWith(bracket) && base.endsWith("]")) {
            const value: string = base.slice(bracket.length, -1);

            return `${prefix}${value}${typeHint}`;
        }
    }

    return path;
};

const mapPaths = (
    config: AccessConfigInterface | undefined,
    transform: (path: string) => string
): AccessConfigInterface | undefined => {
    if (!config) return config;

    return {
        expose: (config.expose ?? []).map((entry: ContextPathInterface) => ({
            ...entry,
            path: transform(entry.path)
        })),
        modify: (config.modify ?? []).map((entry: ContextPathInterface) => ({
            ...entry,
            path: transform(entry.path)
        }))
    };
};

/**
 * Serialise an in-memory access config for sending to the API.
 * Rewrites URI-keyed paths into the bracketed `[attr=value]` form expected by the backend.
 */
export const serializeAccessConfig = (
    config: AccessConfigInterface | undefined
): AccessConfigInterface | undefined => mapPaths(config, toApiPath);

/**
 * Parse an access config from an API response into the in-memory slash-joined form.
 */
export const deserializeAccessConfig = (
    config: AccessConfigInterface | undefined
): AccessConfigInterface | undefined => mapPaths(config, fromApiPath);
