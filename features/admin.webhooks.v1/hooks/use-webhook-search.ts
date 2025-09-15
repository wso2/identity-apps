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
import { useMemo, useState } from "react";
import { WebhookListItemInterface } from "../models/webhooks";

export interface UseWebhookSearchInterface {
    searchQuery: string;
    searchOperator: string;
    searchAttribute: string;
    triggerClearQuery: boolean;
    filteredWebhooks: WebhookListItemInterface[];
    handleWebhookFilter: (query: string) => void;
    handleSearchQueryClear: () => void;
}

const useWebhookSearch = (webhooks: WebhookListItemInterface[]): UseWebhookSearchInterface => {
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ searchOperator, setSearchOperator ] = useState<string>("co");
    const [ searchAttribute, setSearchAttribute ] = useState<string>("name");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const parseSearchQuery = (query: string) => {
        const trimmedQuery: string = query.trim();
        const parts: string[] = trimmedQuery.split(" ");

        if (parts.length >= 3) {
            const potentialOperator: string = parts[1];
            const supportedOperators: string[] = [ "co", "eq", "sw", "ew" ];

            if (supportedOperators.includes(potentialOperator)) {
                return {
                    attribute: parts[0],
                    operator: potentialOperator,
                    value: parts.slice(2).join(" ")
                };
            }
        }

        return {
            attribute: "name",
            operator: "co",
            value: trimmedQuery
        };
    };

    const applySearchFilter = (
        webhook: WebhookListItemInterface,
        query: string,
        operator: string,
        attribute: string
    ): boolean => {
        const normalizedQuery: string = query.toLowerCase();
        let fieldsToSearch: string[] = [];

        switch (attribute) {
            case "name":
                fieldsToSearch = [ webhook.name.toLowerCase() ];

                break;
            case "endpoint":
                fieldsToSearch = [ webhook.endpoint.toLowerCase() ];

                break;
            default:
                fieldsToSearch = [ webhook.name.toLowerCase(), webhook.endpoint.toLowerCase() ];
        }

        return fieldsToSearch.some((field: string) => {
            switch (operator) {
                case "eq":
                    return field === normalizedQuery;
                case "sw":
                    return field.startsWith(normalizedQuery);
                case "ew":
                    return field.endsWith(normalizedQuery);
                case "co":
                default:
                    return field.includes(normalizedQuery);
            }
        });
    };

    const filteredWebhooks: WebhookListItemInterface[] = useMemo(() => {
        if (!searchQuery?.trim()) {
            return webhooks;
        }

        return webhooks.filter((webhook: WebhookListItemInterface) =>
            applySearchFilter(webhook, searchQuery, searchOperator, searchAttribute)
        );
    }, [ webhooks, searchQuery, searchOperator, searchAttribute ]);

    const handleWebhookFilter = (query: string): void => {
        if (!query || typeof query !== "string") {
            setSearchQuery("");

            return;
        }

        const { attribute, operator, value } = parseSearchQuery(query);

        setSearchQuery(value);
        setSearchOperator(operator);
        setSearchAttribute(attribute);
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setSearchOperator("co");
        setSearchAttribute("name");
        setTriggerClearQuery(!triggerClearQuery);
    };

    return {
        filteredWebhooks,
        handleSearchQueryClear,
        handleWebhookFilter,
        searchAttribute,
        searchOperator,
        searchQuery,
        triggerClearQuery
    };
};

export default useWebhookSearch;
