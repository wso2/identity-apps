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

import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { Node, ReactFlowState, useNodesData, useStore } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import useGetFlowExtension from "../api/use-get-flow-extension";
import FlowExtensionAccessConstants from "../constants/flow-extension-access-constants";
import { Element } from "../models/elements";
import {
    FlowExtensionAccessConfigInterface,
    FlowExtensionAccessRowInterface,
    FlowExtensionContextPathInterface
} from "../models/flow-extension-access";
import { FlowVariableInterface, FlowVariablesInterface } from "../models/variables";
import { START_STEP_ID } from "../utils/variables";

/**
 * What {@link useFlowExtensionAccessRows} gives the flow extension step to render.
 */
export interface UseFlowExtensionAccessRowsReturnInterface {
    /**
     * Whether anything is shown: the flow extension was fetched, and the flow has runtime values and headers or
     * onboards an organization.
     */
    isShown: boolean;
    isVariablesShown: boolean;
    isSubjectOrganizationShown: boolean;
    /**
     * Whether the toggles are locked, as while the flow is being saved.
     */
    isLocked: boolean;
    runtimeValueRows: FlowExtensionAccessRowInterface[];
    headerRows: FlowExtensionAccessRowInterface[];
    subjectOrganizationRows: FlowExtensionAccessRowInterface[];
    organizationAttributeRows: FlowExtensionAccessRowInterface[];
    isRead: (row: FlowExtensionAccessRowInterface) => boolean;
    isWritten: (row: FlowExtensionAccessRowInterface) => boolean;
    toggleRead: (row: FlowExtensionAccessRowInterface) => void;
    toggleWrite: (row: FlowExtensionAccessRowInterface) => void;
}

/**
 * Fields of the organization a registration flow onboards, other than its attributes.
 */
const SUBJECT_ORGANIZATION_ROWS: FlowExtensionAccessRowInterface[] = [
    { name: "id", path: FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_ID_PATH },
    { name: "name", path: FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_NAME_PATH },
    { name: "handle", path: FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_HANDLE_PATH },
    { name: "description", path: FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_DESCRIPTION_PATH }
].map(({ name, path }: { name: string; path: string }): FlowExtensionAccessRowInterface => ({
    canWrite: false,
    dataType: FlowExtensionAccessConstants.STRING_DATA_TYPE,
    name,
    path
}));

/**
 * The path of a named runtime value, header or organization attribute.
 */
const toSelectorPath = (prefix: string, name: string): string =>
    `${ prefix }${ name }${ FlowExtensionAccessConstants.NAME_SELECTOR_SUFFIX }`;

/**
 * The rows of the named runtime values or headers, once per name.
 */
const toVariableRows = (
    variables: FlowVariableInterface[],
    pathPrefix: string,
    canWrite: boolean,
    normaliseName: (name: string) => string = (name: string): string => name
): FlowExtensionAccessRowInterface[] => {
    const rows: Map<string, FlowExtensionAccessRowInterface> = new Map();

    (variables ?? []).forEach((variable: FlowVariableInterface) => {
        const name: string = normaliseName(variable?.name?.trim() ?? "");

        if (name && !rows.has(name)) {
            rows.set(name, {
                canWrite,
                dataType: variable.dataType,
                name,
                path: toSelectorPath(pathPrefix, name)
            });
        }
    });

    return [ ...rows.values() ];
};

/**
 * The attributes the flow collects for the organization it onboards, other than the standard organization inputs.
 */
const collectOrganizationAttributeNames = (nodes: Node[]): string[] => {
    const names: Set<string> = new Set<string>();

    const visit = (components: Element[]): void => {
        components?.forEach((component: Element) => {
            const identifier: string = component?.config?.identifier;

            if (component?.config?.identifierType === FlowExtensionAccessConstants.ORGANIZATION_IDENTIFIER_TYPE
                && identifier
                && !FlowExtensionAccessConstants.STANDARD_ORGANIZATION_INPUTS.includes(identifier)) {
                names.add(identifier);
            }
            visit(component?.components);
        });
    };

    nodes?.forEach((node: Node) => visit(node?.data?.components as Element[]));

    return [ ...names ];
};

const selectOrganizationAttributeNames = (state: ReactFlowState): string[] =>
    collectOrganizationAttributeNames(state.nodes);

const areSameNames = (previous: string[], next: string[]): boolean =>
    previous.length === next.length && previous.every((name: string, index: number) => name === next[index]);

/**
 * An entry of the organization a registration flow onboards, saved before such entries had a flow type, with the
 * registration flow type they apply to. Other entries are returned as they are.
 */
const withSubjectOrganizationFlowType = (
    entry: FlowExtensionContextPathInterface
): FlowExtensionContextPathInterface =>
    !entry?.flowType && entry?.path?.startsWith(FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_PATH_PREFIX)
        ? { ...entry, flowType: FlowTypes.REGISTRATION }
        : entry;

/**
 * Hook for the access the flow extension of a step has to the runtime values and request headers of this flow, and
 * in a registration flow to the organization it onboards. The flow extension is fetched by its ID, and reloaded once
 * the flow is saved. Changes are kept in the flow builder, to save to the flow extension after the flow.
 *
 * @param extensionId - ID of the flow extension the step runs.
 * @returns The rows to show, and how to read and change their access.
 */
const useFlowExtensionAccessRows = (extensionId: string): UseFlowExtensionAccessRowsReturnInterface => {
    const {
        flowType,
        isVariablesEnabled,
        flowExtensionAccessConfigs,
        flowExtensionsSavedVersion,
        isFlowExtensionAccessLocked,
        setFlowExtensionAccessConfig
    } = useAuthenticationFlowBuilderCore();

    const startNode: Pick<Node, "data" | "type" | "id"> = useNodesData(START_STEP_ID);
    const variables: FlowVariablesInterface = startNode?.data?.variables as FlowVariablesInterface;
    // Only the organization identifiers are selected, so moving a node does not update the rows.
    const organizationAttributeNames: string[] = useStore(selectOrganizationAttributeNames, areSameNames);

    const isSubjectOrganizationShown: boolean = flowType === FlowTypes.REGISTRATION;

    const { data: extension, error, mutate } = useGetFlowExtension(
        extensionId,
        !!flowType && (!!isVariablesEnabled || isSubjectOrganizationShown)
    );

    // Reload the flow extension once its changes are saved with the flow.
    useEffect(() => {
        if (flowExtensionsSavedVersion > 0) {
            mutate();
        }
    }, [ flowExtensionsSavedVersion ]);

    const runtimeValueRows: FlowExtensionAccessRowInterface[] = useMemo(
        () => toVariableRows(variables?.runtimeValues, FlowExtensionAccessConstants.RUNTIME_VALUE_PATH_PREFIX, true),
        [ variables?.runtimeValues ]
    );

    // Header names are kept in lower case, as the server keeps them.
    const headerRows: FlowExtensionAccessRowInterface[] = useMemo(
        () => toVariableRows(variables?.headers, FlowExtensionAccessConstants.REQUEST_HEADER_PATH_PREFIX, false,
            (name: string): string => name.toLowerCase()),
        [ variables?.headers ]
    );

    const organizationAttributeRows: FlowExtensionAccessRowInterface[] = useMemo(
        () => isSubjectOrganizationShown
            ? organizationAttributeNames.map((name: string): FlowExtensionAccessRowInterface => ({
                canWrite: false,
                dataType: FlowExtensionAccessConstants.STRING_DATA_TYPE,
                name,
                path: toSelectorPath(FlowExtensionAccessConstants.SUBJECT_ORGANIZATION_ATTRIBUTE_PATH_PREFIX, name)
            }))
            : [],
        [ isSubjectOrganizationShown, organizationAttributeNames ]
    );

    const accessConfig: FlowExtensionAccessConfigInterface = useMemo(() => {
        const savedAccessConfig: FlowExtensionAccessConfigInterface =
            flowExtensionAccessConfigs?.[ extensionId ] ?? extension?.accessConfig ?? {};

        return {
            expose: savedAccessConfig.expose?.map(withSubjectOrganizationFlowType),
            modify: savedAccessConfig.modify?.map(withSubjectOrganizationFlowType)
        };
    }, [ flowExtensionAccessConfigs, extensionId, extension ]);

    // Every entry listed here is saved for this flow type.
    const isEntryOf = (entry: FlowExtensionContextPathInterface, row: FlowExtensionAccessRowInterface): boolean =>
        entry.path === row.path && entry.flowType === flowType;

    const isMarked = (
        entries: FlowExtensionContextPathInterface[],
        row: FlowExtensionAccessRowInterface
    ): boolean => (entries ?? []).some((entry: FlowExtensionContextPathInterface) => isEntryOf(entry, row));

    // Entries of other flows and the other fields are kept as they are.
    const toggle = (key: keyof FlowExtensionAccessConfigInterface, row: FlowExtensionAccessRowInterface): void => {
        const entries: FlowExtensionContextPathInterface[] = accessConfig[ key ] ?? [];
        const updatedConfig: FlowExtensionAccessConfigInterface = {
            expose: accessConfig.expose ?? [],
            modify: accessConfig.modify ?? []
        };

        updatedConfig[ key ] = isMarked(entries, row)
            ? entries.filter((entry: FlowExtensionContextPathInterface) => !isEntryOf(entry, row))
            : [ ...entries, { encrypted: false, flowType, path: row.path } ];
        setFlowExtensionAccessConfig(extensionId, updatedConfig);
    };

    return {
        headerRows,
        isLocked: !!isFlowExtensionAccessLocked,
        isRead: (row: FlowExtensionAccessRowInterface): boolean => isMarked(accessConfig.expose, row),
        isShown: !!flowType && (!!isVariablesEnabled || isSubjectOrganizationShown) && !error && !!extension,
        isSubjectOrganizationShown,
        isVariablesShown: !!isVariablesEnabled,
        isWritten: (row: FlowExtensionAccessRowInterface): boolean => isMarked(accessConfig.modify, row),
        organizationAttributeRows,
        runtimeValueRows,
        subjectOrganizationRows: SUBJECT_ORGANIZATION_ROWS,
        toggleRead: (row: FlowExtensionAccessRowInterface): void => toggle("expose", row),
        toggleWrite: (row: FlowExtensionAccessRowInterface): void => toggle("modify", row)
    };
};

export default useFlowExtensionAccessRows;
