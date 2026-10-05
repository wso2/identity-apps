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

import { ReactNode, isValidElement } from "react";
import { DropdownItemProps } from "semantic-ui-react";

/**
 * Reads the props of the list item a subject attribute option renders.
 *
 * @param option - Subject attribute dropdown option.
 * @returns The list item props, or an empty object when the option renders plain text.
 */
const getSubjectAttributeOptionItemProps = (option: DropdownItemProps): Record<string, unknown> => {
    const text: ReactNode = option?.text;

    return isValidElement(text) ? (text.props as Record<string, unknown>) : {};
};

/**
 * Resolves the label a subject attribute option is displayed with. The options render a list item that carries
 * the attribute's display name, so the label is read from it; an option without a list item falls back to its value.
 *
 * @param option - Subject attribute dropdown option.
 * @returns The display name of the attribute.
 */
const getSubjectAttributeOptionDisplayName = (option: DropdownItemProps): string => {
    const displayName: unknown = getSubjectAttributeOptionItemProps(option).displayName;

    if (typeof displayName === "string" && displayName.length > 0) {
        return displayName;
    }

    return option?.value !== undefined && option?.value !== null ? String(option.value) : "";
};

/**
 * Resolves the attribute URI of a subject attribute option.
 *
 * @param option - Subject attribute dropdown option.
 * @returns The attribute URI, or the option value when the option has no list item.
 */
const getSubjectAttributeOptionClaimURI = (option: DropdownItemProps): string => {
    const claimURI: unknown = getSubjectAttributeOptionItemProps(option).claimURI;

    if (typeof claimURI === "string" && claimURI.length > 0) {
        return claimURI;
    }

    return option?.value !== undefined && option?.value !== null ? String(option.value) : "";
};

/**
 * Sorts subject attribute options by their display name, ignoring case.
 *
 * @param options - Subject attribute dropdown options.
 * @returns A sorted copy of the options.
 */
export const sortSubjectAttributeOptions = <T extends DropdownItemProps>(options: T[]): T[] => {
    return [ ...options ].sort((first: T, second: T) =>
        getSubjectAttributeOptionDisplayName(first).localeCompare(
            getSubjectAttributeOptionDisplayName(second), undefined, { sensitivity: "base" }
        )
    );
};

/**
 * Filters subject attribute options by a search query, matching the attribute's display name and URI. The options
 * render a list item rather than plain text, so the default text search of the dropdown cannot be used.
 *
 * @param options - Subject attribute dropdown options.
 * @param query - Search query typed into the dropdown.
 * @returns The options matching the query, or every option when the query is blank.
 */
export const filterSubjectAttributeOptions = (options: DropdownItemProps[], query: string): DropdownItemProps[] => {
    const normalizedQuery: string = (query ?? "").trim().toLowerCase();

    if (!normalizedQuery) {
        return options;
    }

    return options.filter((option: DropdownItemProps) =>
        getSubjectAttributeOptionDisplayName(option).toLowerCase().includes(normalizedQuery)
            || getSubjectAttributeOptionClaimURI(option).toLowerCase().includes(normalizedQuery)
    );
};
