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

import { SxProps, Theme } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Collapse from "@oxygen-ui/react/Collapse";
import Divider from "@oxygen-ui/react/Divider";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node, useNodesData } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetFlowExtension from "../../../api/use-get-flow-extension";
import useAuthenticationFlowBuilderCore from "../../../hooks/use-authentication-flow-builder-core-context";
import {
    FlowExtensionAccessConfigInterface,
    FlowExtensionContextPathInterface
} from "../../../models/flow-extension-access";
import { FlowVariableInterface, FlowVariablesInterface } from "../../../models/variables";
import { START_STEP_ID } from "../../../utils/variables";

const RUNTIME_VALUE_PATH_PREFIX: string = "/runtimeValues[name=";
const REQUEST_HEADER_PATH_PREFIX: string = "/request/additionalHeaders[name=";

/**
 * A runtime value or request header of the flow, as a row of the access config.
 */
interface AccessRowInterface {
    name: string;
    dataType: string;
    path: string;
    canWrite: boolean;
}

/**
 * Props interface of {@link FlowExtensionAccessConfig}
 */
interface FlowExtensionAccessConfigPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the flow extension the step runs.
     */
    extensionId: string;
}

/**
 * Props interface of {@link AccessRows}
 */
interface AccessRowsPropsInterface extends IdentifiableComponentInterface {
    title: string;
    emptyText: string;
    rows: AccessRowInterface[];
    isRead: (path: string) => boolean;
    isWritten: (path: string) => boolean;
    onToggleRead: (path: string) => void;
    onToggleWrite: (path: string) => void;
}

/**
 * The rows of the named runtime values or headers, once per name.
 */
const toRows: (
    variables: FlowVariableInterface[],
    pathPrefix: string,
    isWritable: (name: string) => boolean,
    normaliseName?: (name: string) => string
) => AccessRowInterface[] = (
    variables: FlowVariableInterface[],
    pathPrefix: string,
    isWritable: (name: string) => boolean,
    normaliseName: (name: string) => string = (name: string): string => name
): AccessRowInterface[] => {
    const rows: Map<string, AccessRowInterface> = new Map();

    (variables ?? []).forEach((variable: FlowVariableInterface) => {
        const name: string = normaliseName(variable?.name?.trim() ?? "");

        if (name && !rows.has(name)) {
            rows.set(name, {
                canWrite: isWritable(name),
                dataType: variable.dataType,
                name,
                path: `${ pathPrefix }${ name }]`
            });
        }
    });

    return [ ...rows.values() ];
};

const INDENT: number = 18;

/**
 * Style of a READ or WRITE chip, matching the access config tree of the flow extension.
 */
const getAccessChipSx: (active: boolean, color: string, background: string) => SxProps<Theme> = (
    active: boolean,
    color: string,
    background: string
): SxProps<Theme> => ({
    "& .MuiChip-label": { px: "6px" },
    ...(!active && {
        "&:hover": { backgroundColor: background, borderColor: color, color }
    }),
    backgroundColor: active ? background : "transparent",
    border: "1px solid",
    borderColor: active ? color : "#EBEBEB",
    borderRadius: "20px",
    color: active ? color : "#787878",
    cursor: "pointer",
    flexShrink: 0,
    fontSize: "9.5px",
    fontWeight: active ? 700 : 600,
    height: 19,
    letterSpacing: "0.05em",
    transition: "all 0.12s ease"
});

/**
 * The runtime values or request headers of the flow under a collapsible section, each with READ and WRITE
 * toggles, laid out like the access config tree of the flow extension.
 *
 * @param props - Props injected to the component.
 * @returns AccessRows component.
 */
const AccessRows: FunctionComponent<AccessRowsPropsInterface> = ({
    title,
    emptyText,
    rows,
    isRead,
    isWritten,
    onToggleRead,
    onToggleWrite,
    ["data-componentid"]: componentId = "flow-extension-access-rows"
}: AccessRowsPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const [ open, setOpen ] = useState<boolean>(true);

    return (
        <Box data-componentid={ componentId }>
            <Box
                onClick={ () => setOpen((isOpen: boolean) => !isOpen) }
                sx={ {
                    alignItems: "center",
                    backgroundColor: "#F4F4F4",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    gap: "4px",
                    minHeight: "36px",
                    px: "8px"
                } }
            >
                <Box
                    sx={ {
                        alignItems: "center",
                        color: "#D0D0D0",
                        display: "flex",
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.18s ease"
                    } }
                >
                    <ChevronRightIcon size={ 14 } />
                </Box>
                <Typography component="span" sx={ { fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" } }>
                    { title }
                </Typography>
            </Box>
            <Collapse in={ open } timeout={ 180 }>
                { rows.length === 0 && (
                    <Typography
                        sx={ {
                            color: "grey.400",
                            fontSize: 11,
                            fontStyle: "italic",
                            pl: `${ INDENT + 8 }px`,
                            py: "6px"
                        } }
                    >
                        { emptyText }
                    </Typography>
                ) }
                { rows.map((row: AccessRowInterface) => (
                    <Box
                        key={ row.path }
                        sx={ {
                            "&:hover": { backgroundColor: "#F4F4F4" },
                            alignItems: "center",
                            borderRadius: "6px",
                            display: "flex",
                            gap: "6px",
                            minHeight: "36px",
                            pl: `${ INDENT + 8 }px`,
                            pr: "8px"
                        } }
                        data-componentid={ `${ componentId }-${ row.name }` }
                    >
                        <Typography
                            component="span"
                            sx={ {
                                color: "text.secondary",
                                fontFamily: "monospace",
                                fontSize: 13,
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            } }
                        >
                            { row.name }
                        </Typography>
                        <Typography
                            component="span"
                            sx={ { color: "text.disabled", flexShrink: 0, fontFamily: "monospace", fontSize: "9px" } }
                        >
                            { row.dataType }
                        </Typography>
                        { !row.canWrite && (
                            <Typography
                                component="span"
                                sx={ { color: "text.disabled", flexShrink: 0, fontSize: "9px", fontWeight: 500 } }
                            >
                                { t("flowExtension:contextTree.node.readOnlyBadge") }
                            </Typography>
                        ) }
                        <Box sx={ { display: "inline-flex", flexShrink: 0, gap: "4px", ml: "auto" } }>
                            <Chip
                                size="small"
                                label={ t("flowExtension:contextTree.node.readChip") }
                                onClick={ () => onToggleRead(row.path) }
                                sx={ getAccessChipSx(isRead(row.path), "#2E7D32", "#E8F5E9") }
                                data-componentid={ `${ componentId }-${ row.name }-read` }
                            />
                            { row.canWrite && (
                                <Chip
                                    size="small"
                                    label={ t("flowExtension:contextTree.node.writeChip") }
                                    onClick={ () => onToggleWrite(row.path) }
                                    sx={ getAccessChipSx(isWritten(row.path), "#1565C0", "#E3F2FD") }
                                    data-componentid={ `${ componentId }-${ row.name }-write` }
                                />
                            ) }
                        </Box>
                    </Box>
                )) }
            </Collapse>
        </Box>
    );
};

/**
 * Access the flow extension of a step has to the runtime values and request headers of this flow. The flow
 * extension is fetched by its ID; when it cannot be fetched, nothing is shown. Changes are kept in the flow
 * builder and saved to the flow extension after the flow is saved.
 *
 * @param props - Props injected to the component.
 * @returns FlowExtensionAccessConfig component.
 */
const FlowExtensionAccessConfig: FunctionComponent<FlowExtensionAccessConfigPropsInterface> = ({
    extensionId,
    ["data-componentid"]: componentId = "flow-extension-access-config"
}: FlowExtensionAccessConfigPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const {
        flowType,
        isVariablesEnabled,
        flowExtensionAccessConfigs,
        flowExtensionsSavedVersion,
        setFlowExtensionAccessConfig
    } = useAuthenticationFlowBuilderCore();

    const startNode: Pick<Node, "data" | "type" | "id"> = useNodesData(START_STEP_ID);
    const variables: FlowVariablesInterface = startNode?.data?.variables as FlowVariablesInterface;

    const { data: extension, error, mutate } = useGetFlowExtension(
        extensionId,
        !!isVariablesEnabled && !!flowType
    );

    // Reload the flow extension once its changes are saved with the flow.
    useEffect(() => {
        if (flowExtensionsSavedVersion > 0) {
            mutate();
        }
    }, [ flowExtensionsSavedVersion ]);

    const runtimeValueRows: AccessRowInterface[] = useMemo(
        () => toRows(variables?.runtimeValues, RUNTIME_VALUE_PATH_PREFIX, (): boolean => true),
        [ variables?.runtimeValues ]
    );

    // Header names are kept in lower case, as the server keeps them.
    const headerRows: AccessRowInterface[] = useMemo(
        () => toRows(variables?.headers, REQUEST_HEADER_PATH_PREFIX, (): boolean => false,
            (name: string): string => name.toLowerCase()),
        [ variables?.headers ]
    );

    if (!isVariablesEnabled || !flowType || error || !extension) {
        return null;
    }

    const accessConfig: FlowExtensionAccessConfigInterface =
        flowExtensionAccessConfigs?.[ extensionId ] ?? extension.accessConfig ?? {};

    const isMarked: (entries: FlowExtensionContextPathInterface[], path: string) => boolean = (
        entries: FlowExtensionContextPathInterface[],
        path: string
    ): boolean =>
        (entries ?? []).some((entry: FlowExtensionContextPathInterface) =>
            entry.path === path && entry.flowType === flowType);

    // Entries of other flows and the ones shared by all flows are kept as they are.
    const toggle: (key: keyof FlowExtensionAccessConfigInterface, path: string) => void = (
        key: keyof FlowExtensionAccessConfigInterface,
        path: string
    ): void => {
        const entries: FlowExtensionContextPathInterface[] = accessConfig[ key ] ?? [];
        const updated: FlowExtensionContextPathInterface[] = isMarked(entries, path)
            ? entries.filter((entry: FlowExtensionContextPathInterface) =>
                !(entry.path === path && entry.flowType === flowType))
            : [ ...entries, { encrypted: false, flowType, path } ];

        const updatedConfig: FlowExtensionAccessConfigInterface = {
            expose: accessConfig.expose ?? [],
            modify: accessConfig.modify ?? []
        };

        updatedConfig[ key ] = updated;
        setFlowExtensionAccessConfig(extensionId, updatedConfig);
    };

    return (
        <>
            <Divider />
            <Stack gap={ 2 } data-componentid={ componentId }>
                <Stack gap={ 0.5 }>
                    <Typography variant="body1" sx={ { fontWeight: 500 } }>
                        { t("flowExtension:properties.accessConfig.title") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { t("flowExtension:properties.accessConfig.description") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { t("flowExtension:properties.accessConfig.advancedHint") }
                    </Typography>
                </Stack>
                <AccessRows
                    title={ t("flowExtension:properties.accessConfig.runtimeValues") }
                    emptyText={ t("flowExtension:properties.accessConfig.noRuntimeValues") }
                    rows={ runtimeValueRows }
                    isRead={ (path: string) => isMarked(accessConfig.expose, path) }
                    isWritten={ (path: string) => isMarked(accessConfig.modify, path) }
                    onToggleRead={ (path: string) => toggle("expose", path) }
                    onToggleWrite={ (path: string) => toggle("modify", path) }
                    data-componentid={ `${ componentId }-runtime-values` }
                />
                <AccessRows
                    title={ t("flowExtension:properties.accessConfig.headers") }
                    emptyText={ t("flowExtension:properties.accessConfig.noHeaders") }
                    rows={ headerRows }
                    isRead={ (path: string) => isMarked(accessConfig.expose, path) }
                    isWritten={ (): boolean => false }
                    onToggleRead={ (path: string) => toggle("expose", path) }
                    onToggleWrite={ (): void => undefined }
                    data-componentid={ `${ componentId }-headers` }
                />
            </Stack>
        </>
    );
};

export default FlowExtensionAccessConfig;
