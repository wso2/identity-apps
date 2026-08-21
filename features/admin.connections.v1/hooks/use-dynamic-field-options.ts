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

import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getConnectionDetails, useGetConnections } from "../api/connections";
import {
    ConnectionInterface,
    ConnectionListResponseInterface,
    StrictConnectionInterface
} from "../models/connection";

/**
 * Supported option sources of a dynamic `select` field.
 */
enum DynamicFieldOptionsSourceTypes {
    IDENTITY_PROVIDERS = "identity-providers"
}

/**
 * Declaration of where the options of a dynamic `select` field come from.
 */
interface DynamicFieldOptionsSourceInterface {
    type: DynamicFieldOptionsSourceTypes | string;
    authenticatorId?: string;
    templateId?: string;
    valueField?: string;
    labelField?: string;
}

/**
 * Attributes of a dynamic form field this hook reads or rewrites.
 */
interface DynamicFieldInterface {
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    optionsSource?: DynamicFieldOptionsSourceInterface;
    [ key: string ]: unknown;
}

/**
 * Context of the form the fields are rendered in.
 */
interface DynamicFieldOptionsContextInterface {
    currentConnectionId?: string;
    currentValues?: Record<string, unknown>;
}

/**
 * Return type of {@link useDynamicFieldOptions}.
 */
interface DynamicFieldOptionsResultInterface {
    fields: DynamicFieldInterface[];
    isLoading: boolean;
}

/**
 * Resolves the options of dynamic form fields that declare an `optionsSource`.
 */
const useDynamicFieldOptions = (
    fields: DynamicFieldInterface[],
    context?: DynamicFieldOptionsContextInterface
): DynamicFieldOptionsResultInterface => {

    const { t } = useTranslation();

    const [ templateIdsByConnection, setTemplateIdsByConnection ] = useState<Record<string, string>>({});
    const [ isResolvingTemplateIds, setIsResolvingTemplateIds ] = useState<boolean>(false);

    /**
     * Sources declared by the given fields.
     */
    const sources: DynamicFieldOptionsSourceInterface[] = useMemo(() => {
        if (!Array.isArray(fields)) {
            return [];
        }

        return fields
            .map((field: DynamicFieldInterface) => field?.optionsSource)
            .filter((source: DynamicFieldOptionsSourceInterface) =>
                source?.type === DynamicFieldOptionsSourceTypes.IDENTITY_PROVIDERS);
    }, [ fields ]);

    const shouldFetchConnections: boolean = sources.length > 0;

    const {
        data: connectionsResponse,
        error: connectionsFetchRequestError
    } = useGetConnections<ConnectionListResponseInterface>(
        null,
        null,
        undefined,
        "federatedAuthenticators",
        shouldFetchConnections,
        true
    );

    const isConnectionListLoading: boolean = shouldFetchConnections
        && !connectionsFetchRequestError
        && !connectionsResponse;

    const connections: StrictConnectionInterface[] = useMemo(
        () => connectionsResponse?.identityProviders ?? [],
        [ connectionsResponse ]
    );

    /**
     * Connections that satisfy every filter of a source.
     */
    const getCandidates = (source: DynamicFieldOptionsSourceInterface): StrictConnectionInterface[] => {
        return connections.filter((connection: StrictConnectionInterface) => {
            if (connection?.id === context?.currentConnectionId) {
                return false;
            }

            if (connection?.isEnabled === false) {
                return false;
            }

            if (!source?.authenticatorId) {
                return true;
            }

            return connection?.federatedAuthenticators?.authenticators
                ?.some((authenticator: { authenticatorId?: string }) =>
                    authenticator?.authenticatorId === source.authenticatorId) ?? false;
        });
    };

    /**
     * Ids of the candidates whose template id has to be looked up.
     */
    const idsRequiringTemplateId: string[] = useMemo(() => {
        const ids: Set<string> = new Set<string>();

        sources
            .filter((source: DynamicFieldOptionsSourceInterface) => !isEmpty(source?.templateId))
            .forEach((source: DynamicFieldOptionsSourceInterface) => {
                getCandidates(source).forEach((connection: StrictConnectionInterface) => ids.add(connection.id));
            });

        return Array.from(ids).sort();
    }, [ sources, connections, context?.currentConnectionId ]);

    const idsRequiringTemplateIdKey: string = idsRequiringTemplateId.join(",");

    /**
     * Resolves the template id of every candidate.
     */
    useEffect(() => {
        if (isEmpty(idsRequiringTemplateId)) {
            setTemplateIdsByConnection({});
            setIsResolvingTemplateIds(false);

            return;
        }

        let isActive: boolean = true;

        setIsResolvingTemplateIds(true);

        Promise.all(
            idsRequiringTemplateId.map((id: string) =>
                getConnectionDetails(id).catch(() => null)
            )
        ).then((responses: ConnectionInterface[]) => {
            if (!isActive) {
                return;
            }

            const resolved: Record<string, string> = {};

            responses.forEach((connection: ConnectionInterface, index: number) => {
                if (connection?.templateId) {
                    resolved[ idsRequiringTemplateId[ index ] ] = connection.templateId;
                }
            });

            setTemplateIdsByConnection(resolved);
        }).finally(() => {
            if (isActive) {
                setIsResolvingTemplateIds(false);
            }
        });

        return () => {
            isActive = false;
        };
    }, [ idsRequiringTemplateIdKey ]);

    const isLoading: boolean = isConnectionListLoading || isResolvingTemplateIds;

    const resolvedFields: DynamicFieldInterface[] = useMemo(() => {
        if (!Array.isArray(fields)) {
            return fields;
        }

        return fields.map((field: DynamicFieldInterface) => {
            const source: DynamicFieldOptionsSourceInterface = field?.optionsSource;

            if (source?.type !== DynamicFieldOptionsSourceTypes.IDENTITY_PROVIDERS) {
                return field;
            }

            const valueField: string = source?.valueField ?? "id";
            const labelField: string = source?.labelField ?? "name";

            const options: { text: string; value: string }[] = getCandidates(source)
                .filter((connection: StrictConnectionInterface) => {
                    if (isEmpty(source?.templateId)) {
                        return true;
                    }

                    const resolvedTemplateId: string = templateIdsByConnection[ connection.id ];

                    // Drop the connection when its template id could not be resolved.
                    return resolvedTemplateId === source.templateId;
                })
                .map((connection: StrictConnectionInterface) => ({
                    text: get(connection, labelField) ?? get(connection, "id"),
                    value: get(connection, valueField)
                }))
                .filter((option: { text: string; value: string }) => !isEmpty(option.value));

            /*
             * Keep an already persisted value selectable even when it is not part of the resolved options.
             */
            const currentValue: unknown = field?.name
                ? context?.currentValues?.[ field.name ]
                : undefined;
            const persistedValue: string = typeof currentValue === "string" ? currentValue : "";

            if (!isEmpty(persistedValue)
                && !options.some((option: { value: string }) => option.value === persistedValue)) {
                const persistedConnection: StrictConnectionInterface = connections.find(
                    (connection: StrictConnectionInterface) => get(connection, valueField) === persistedValue);

                options.push({
                    text: isLoading
                        ? persistedValue
                        : (persistedConnection?.isEnabled === false
                            ? t("authenticationProvider:forms.authenticatorSettings.dynamicOptions.disabled", {
                                value: get(persistedConnection, labelField) ?? persistedValue
                            })
                            : t("authenticationProvider:forms.authenticatorSettings.dynamicOptions.unavailable", {
                                value: persistedValue
                            })),
                    value: persistedValue
                });
            }

            const isUnusable: boolean = isLoading || isEmpty(options);

            return {
                ...field,
                options,
                placeholder: isLoading
                    ? t("authenticationProvider:forms.authenticatorSettings.dynamicOptions.loading")
                    : (isEmpty(options)
                        ? t("authenticationProvider:forms.authenticatorSettings.dynamicOptions.empty")
                        : field?.placeholder),
                readOnly: field?.readOnly || isUnusable
            };
        });
    }, [ fields, connections, templateIdsByConnection, isLoading, context?.currentValues ]);

    return {
        fields: resolvedFields,
        isLoading
    };
};

export default useDynamicFieldOptions;
