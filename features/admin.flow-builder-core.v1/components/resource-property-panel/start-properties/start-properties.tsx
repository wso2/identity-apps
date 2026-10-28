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

import Tabs from "@mui/material/Tabs";
import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Paper from "@oxygen-ui/react/Paper";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node, useNodesData, useReactFlow } from "@xyflow/react";
import React, { ChangeEvent, FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from "../../../hooks/use-authentication-flow-builder-core-context";
import {
    DeclarationConfigsInterface,
    DeclarationInterface,
    DeclaredDataTypes,
    DeclaredValue,
    FlowDeclarationsInterface,
    VariableDeclarationInterface
} from "../../../models/declarations";
import { Resource } from "../../../models/resources";
import {
    AB_TESTING_KEY,
    AB_TESTING_KEY_MAX,
    AB_TESTING_KEY_MIN,
    DeclarationNamePatterns,
    REQUEST_VALUE_DATA_TYPES
} from "../../../utils/declarations";

/**
 * The kinds of declarations, by the list that holds them.
 */
type DeclarationKind = keyof FlowDeclarationsInterface;

/**
 * Props interface of {@link StartProperties}
 */
export interface StartPropertiesPropsInterface extends IdentifiableComponentInterface {
    /**
     * The start step.
     */
    resource: Resource;
}

/**
 * Props interface of {@link DeclarationList}
 */
interface DeclarationListPropsInterface extends IdentifiableComponentInterface {
    kind: DeclarationKind;
    declarations: VariableDeclarationInterface[];
    dataTypes: DeclaredDataTypes[];
    max?: number;
    onChange: (declarations: VariableDeclarationInterface[]) => void;
}

/**
 * Props interface of {@link InitialValueField}
 */
interface InitialValueFieldPropsInterface extends IdentifiableComponentInterface {
    dataType: DeclaredDataTypes;
    value: DeclaredValue;
    onChange: (value: DeclaredValue) => void;
}

/**
 * Props interface of {@link AbTestingKeyItem}
 */
interface AbTestingKeyItemPropsInterface extends IdentifiableComponentInterface {
    declaration: VariableDeclarationInterface;
    onChange: (value: DeclaredValue) => void;
}

const VARIABLE_DATA_TYPES: DeclaredDataTypes[] = Object.values(DeclaredDataTypes);

/**
 * The initial value of a variable, edited as its type needs.
 *
 * @param props - Props injected to the component.
 * @returns The InitialValueField component.
 */
const InitialValueField: FunctionComponent<InitialValueFieldPropsInterface> = ({
    dataType,
    value,
    onChange,
    ["data-componentid"]: componentId = "initial-value-field"
}: InitialValueFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const label: string = t("flows:core.steps.start.declarations.fields.initialValue");

    if (dataType === DeclaredDataTypes.BOOLEAN) {
        return (
            <Select
                size="small"
                displayEmpty
                value={ value === undefined || value === null ? "" : String(value) }
                onChange={ (event: SelectChangeEvent<string>) =>
                    onChange(event.target.value === "" ? undefined : event.target.value === "true") }
                data-componentid={ componentId }
            >
                <MenuItem value="">{ t("flows:core.steps.start.declarations.fields.noValue") }</MenuItem>
                <MenuItem value="true">true</MenuItem>
                <MenuItem value="false">false</MenuItem>
            </Select>
        );
    }

    if (dataType === DeclaredDataTypes.STRING_ARRAY || dataType === DeclaredDataTypes.NUMBER_ARRAY) {
        const isNumeric: boolean = dataType === DeclaredDataTypes.NUMBER_ARRAY;
        const entries: string[] = Array.isArray(value) ? value.map((entry: string | number) => String(entry)) : [];

        return (
            <Autocomplete
                multiple
                freeSolo
                size="small"
                options={ [] }
                value={ entries }
                onChange={ (_: SyntheticEvent, next: string[]) => {
                    const values: (string | number)[] = isNumeric
                        ? next.filter((entry: string) => entry.trim() !== "" && !isNaN(Number(entry)))
                            .map((entry: string) => Number(entry))
                        : next;

                    onChange(values.length ? values : undefined);
                } }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        label={ label }
                        helperText={ t("flows:core.steps.start.declarations.fields.initialValueHint") }
                    />
                ) }
                data-componentid={ componentId }
            />
        );
    }

    const isNumber: boolean = dataType === DeclaredDataTypes.INTEGER || dataType === DeclaredDataTypes.DECIMAL;

    return (
        <TextField
            size="small"
            fullWidth
            label={ label }
            type={ isNumber ? "number" : "text" }
            inputProps={ dataType === DeclaredDataTypes.INTEGER ? { step: 1 } : undefined }
            value={ value === undefined || value === null ? "" : String(value) }
            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                const text: string = event.target.value;

                if (text === "") {
                    onChange(undefined);
                } else if (!isNumber) {
                    onChange(text);
                } else if (!isNaN(Number(text))) {
                    onChange(Number(text));
                }
            } }
            data-componentid={ componentId }
        />
    );
};

/**
 * The A/B testing key every flow declares. Only its initial value, from 0 to 99, can change.
 *
 * @param props - Props injected to the component.
 * @returns The AbTestingKeyItem component.
 */
const AbTestingKeyItem: FunctionComponent<AbTestingKeyItemPropsInterface> = ({
    declaration,
    onChange,
    ["data-componentid"]: componentId = "ab-testing-key-item"
}: AbTestingKeyItemPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const value: DeclaredValue = declaration.value;
    const isOutOfRange: boolean = value !== undefined && value !== null && (!Number.isInteger(value)
        || (value as number) < AB_TESTING_KEY_MIN || (value as number) > AB_TESTING_KEY_MAX);

    return (
        <Paper variant="outlined" sx={ { p: 1.5 } } data-componentid={ componentId }>
            <Stack gap={ 1.5 }>
                <TextField
                    size="small"
                    fullWidth
                    disabled
                    label={ t("flows:core.steps.start.declarations.fields.name") }
                    value={ declaration.name }
                    helperText={ t(`flows:core.steps.start.declarations.dataTypes.${DeclaredDataTypes.INTEGER}`) }
                    data-componentid={ `${componentId}-name` }
                />
                <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label={ t("flows:core.steps.start.declarations.fields.initialValue") }
                    inputProps={ { max: AB_TESTING_KEY_MAX, min: AB_TESTING_KEY_MIN, step: 1 } }
                    value={ value === undefined || value === null ? "" : String(value) }
                    error={ isOutOfRange }
                    helperText={ t("flows:core.steps.start.declarations.fields.abTestingKeyValueHint", {
                        max: AB_TESTING_KEY_MAX,
                        min: AB_TESTING_KEY_MIN
                    }) }
                    onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                        const text: string = event.target.value;

                        if (text === "") {
                            onChange(undefined);
                        } else if (!isNaN(Number(text))) {
                            onChange(Number(text));
                        }
                    } }
                    data-componentid={ `${componentId}-value` }
                />
            </Stack>
        </Paper>
    );
};

/**
 * The headers, query parameters or variables a flow declares, one row each.
 *
 * @param props - Props injected to the component.
 * @returns The DeclarationList component.
 */
const DeclarationList: FunctionComponent<DeclarationListPropsInterface> = ({
    kind,
    declarations,
    dataTypes,
    max,
    onChange,
    ["data-componentid"]: componentId = "declaration-list"
}: DeclarationListPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const isVariable: boolean = kind === "variables";

    /**
     * Whether a row is the A/B testing key every flow declares. The first variable of that name is the one.
     *
     * @param index - Position of the declaration.
     * @returns True for the A/B testing key.
     */
    const isSystemVariable: (index: number) => boolean = (index: number): boolean =>
        isVariable && declarations[ index ]?.name === AB_TESTING_KEY
            && declarations.findIndex((declaration: DeclarationInterface) =>
                declaration?.name === AB_TESTING_KEY) === index;

    // The A/B testing key does not count towards the limit.
    const declaredCount: number = declarations.filter(
        (_: VariableDeclarationInterface, index: number) => !isSystemVariable(index)).length;
    const isLimitReached: boolean = max !== undefined && declaredCount >= max;

    /**
     * The problem with a declaration's name, if any. Header names are compared ignoring case, as HTTP does.
     *
     * @param index - Position of the declaration.
     * @returns The error message, or undefined when the name is fine.
     */
    const getNameError: (index: number) => string | undefined = (index: number): string | undefined => {
        const name: string = declarations[ index ]?.name?.trim() ?? "";

        if (!name) {
            return undefined;
        }
        if (!DeclarationNamePatterns[ kind ].test(name)) {
            return t(isVariable
                ? "flows:core.steps.start.declarations.errors.invalidVariableName"
                : "flows:core.steps.start.declarations.errors.invalidName");
        }
        if (isVariable && name === AB_TESTING_KEY && !isSystemVariable(index)) {
            return t("flows:core.steps.start.declarations.errors.reserved");
        }

        const key: string = kind === "headers" ? name.toLowerCase() : name;
        const isDuplicate: boolean = declarations.some((declaration: DeclarationInterface, other: number) => {
            const otherName: string = declaration?.name?.trim() ?? "";

            return other < index && (kind === "headers" ? otherName.toLowerCase() : otherName) === key;
        });

        return isDuplicate ? t("flows:core.steps.start.declarations.errors.duplicate") : undefined;
    };

    const update: (index: number, changes: Partial<VariableDeclarationInterface>) => void = (
        index: number,
        changes: Partial<VariableDeclarationInterface>
    ): void => {
        onChange(declarations.map((declaration: VariableDeclarationInterface, current: number) =>
            current === index ? { ...declaration, ...changes } : declaration));
    };

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            { declaredCount === 0 && (
                <Typography variant="body2" color="text.secondary">
                    { t(`flows:core.steps.start.declarations.empty.${kind}`) }
                </Typography>
            ) }
            { declarations.map((declaration: VariableDeclarationInterface, index: number) => {
                const nameError: string = getNameError(index);

                if (isSystemVariable(index)) {
                    return (
                        <AbTestingKeyItem
                            key={ index }
                            declaration={ declaration }
                            onChange={ (value: DeclaredValue) => update(index, { value }) }
                            data-componentid={ `${componentId}-item-${index}` }
                        />
                    );
                }

                return (
                    <Paper
                        key={ index }
                        variant="outlined"
                        sx={ { p: 1.5 } }
                        data-componentid={ `${componentId}-item-${index}` }
                    >
                        <Stack gap={ 1.5 }>
                            <Stack direction="row" gap={ 1 } alignItems="flex-start">
                                <TextField
                                    size="small"
                                    fullWidth
                                    label={ t("flows:core.steps.start.declarations.fields.name") }
                                    value={ declaration.name ?? "" }
                                    error={ !!nameError }
                                    helperText={ nameError }
                                    onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                        update(index, { name: event.target.value }) }
                                    data-componentid={ `${componentId}-item-${index}-name` }
                                />
                                <Tooltip title={ t("flows:core.steps.start.declarations.remove") }>
                                    <IconButton
                                        onClick={ () => onChange(declarations.filter(
                                            (_: VariableDeclarationInterface, current: number) => current !== index)) }
                                        data-componentid={ `${componentId}-item-${index}-remove` }
                                    >
                                        <TrashIcon size={ 14 } />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <Select
                                size="small"
                                fullWidth
                                value={ declaration.dataType ?? dataTypes[ 0 ] }
                                onChange={ (event: SelectChangeEvent<DeclaredDataTypes>) => update(index, {
                                    dataType: event.target.value as DeclaredDataTypes,
                                    ...(isVariable && { value: undefined })
                                }) }
                                data-componentid={ `${componentId}-item-${index}-data-type` }
                            >
                                { dataTypes.map((dataType: DeclaredDataTypes) => (
                                    <MenuItem key={ dataType } value={ dataType }>
                                        { t(`flows:core.steps.start.declarations.dataTypes.${dataType}`) }
                                    </MenuItem>
                                )) }
                            </Select>
                            { isVariable && (
                                <>
                                    <InitialValueField
                                        dataType={ declaration.dataType ?? dataTypes[ 0 ] }
                                        value={ declaration.value }
                                        onChange={ (value: DeclaredValue) => update(index, { value }) }
                                        data-componentid={ `${componentId}-item-${index}-value` }
                                    />
                                    <Box>
                                        <FormControlLabel
                                            control={ (
                                                <Checkbox
                                                    checked={ !!declaration.clientWritable }
                                                    onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                                        update(index, { clientWritable: event.target.checked }) }
                                                    data-componentid={
                                                        `${componentId}-item-${index}-client-writable` }
                                                />
                                            ) }
                                            label={ t("flows:core.steps.start.declarations.fields.clientWritable") }
                                        />
                                        { declaration.clientWritable && (
                                            <FormHelperText>
                                                { t("flows:core.steps.start.declarations.fields.clientWritableHint") }
                                            </FormHelperText>
                                        ) }
                                    </Box>
                                </>
                            ) }
                        </Stack>
                    </Paper>
                );
            }) }
            <Box>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={ <PlusIcon size={ 14 } /> }
                    disabled={ isLimitReached }
                    onClick={ () => onChange([ ...declarations, { dataType: dataTypes[ 0 ], name: "" } ]) }
                    data-componentid={ `${componentId}-add` }
                >
                    { t(`flows:core.steps.start.declarations.add.${kind}`) }
                </Button>
                { isLimitReached && (
                    <FormHelperText>
                        { t("flows:core.steps.start.declarations.limitReached", { max }) }
                    </FormHelperText>
                ) }
            </Box>
        </Stack>
    );
};

/**
 * Properties of the start step: the headers and query parameters the flow reads from each request, and the
 * variables it keeps. They are kept on the start node and saved with the flow.
 *
 * @param props - Props injected to the component.
 * @returns The StartProperties component.
 */
const StartProperties: FunctionComponent<StartPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "start-properties"
}: StartPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const stepId: string = resource?.id;
    const node: Pick<Node, "data" | "type" | "id"> = useNodesData(stepId);
    const { updateNodeData } = useReactFlow();
    const { metadata } = useAuthenticationFlowBuilderCore();
    const [ activeTab, setActiveTab ] = useState<number>(0);

    const configs: DeclarationConfigsInterface = metadata?.inputConfigs;
    const declarations: FlowDeclarationsInterface = (node?.data?.declarations ?? {}) as FlowDeclarationsInterface;

    const updateDeclarations: (kind: DeclarationKind, list: VariableDeclarationInterface[]) => void = (
        kind: DeclarationKind,
        list: VariableDeclarationInterface[]
    ): void => {
        updateNodeData(stepId, (current: Node) => ({
            declarations: {
                ...((current?.data?.declarations ?? {}) as FlowDeclarationsInterface),
                [ kind ]: list
            }
        }));
    };

    if (configs && !configs.enabled) {
        return (
            <Alert severity="info" data-componentid={ `${componentId}-disabled` }>
                { t("flows:core.steps.start.declarations.disabled") }
            </Alert>
        );
    }

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2" color="text.secondary">
                { t("flows:core.steps.start.declarations.description") }
            </Typography>
            <Tabs
                value={ activeTab }
                onChange={ (_: SyntheticEvent, tab: number) => setActiveTab(tab) }
                variant="fullWidth"
            >
                <Tab
                    label={ t("flows:core.steps.start.declarations.tabs.headers") }
                    data-componentid={ `${componentId}-headers-tab` }
                />
                <Tab
                    label={ t("flows:core.steps.start.declarations.tabs.queryParams") }
                    data-componentid={ `${componentId}-query-params-tab` }
                />
                <Tab
                    label={ t("flows:core.steps.start.declarations.tabs.variables") }
                    data-componentid={ `${componentId}-variables-tab` }
                />
            </Tabs>
            <TabPanel value={ activeTab } index={ 0 }>
                <DeclarationList
                    kind="headers"
                    declarations={ declarations.headers ?? [] }
                    dataTypes={ REQUEST_VALUE_DATA_TYPES }
                    max={ configs?.maxHeaders }
                    onChange={ (list: VariableDeclarationInterface[]) => updateDeclarations("headers", list) }
                    data-componentid={ `${componentId}-headers` }
                />
            </TabPanel>
            <TabPanel value={ activeTab } index={ 1 }>
                <DeclarationList
                    kind="queryParams"
                    declarations={ declarations.queryParams ?? [] }
                    dataTypes={ REQUEST_VALUE_DATA_TYPES }
                    max={ configs?.maxQueryParams }
                    onChange={ (list: VariableDeclarationInterface[]) => updateDeclarations("queryParams", list) }
                    data-componentid={ `${componentId}-query-params` }
                />
            </TabPanel>
            <TabPanel value={ activeTab } index={ 2 }>
                <Stack gap={ 2 }>
                    <Alert severity="info">
                        { t("flows:core.steps.start.declarations.abTestingKey") }
                    </Alert>
                    <DeclarationList
                        kind="variables"
                        declarations={ declarations.variables ?? [] }
                        dataTypes={ VARIABLE_DATA_TYPES }
                        max={ configs?.maxVariables }
                        onChange={ (list: VariableDeclarationInterface[]) => updateDeclarations("variables", list) }
                        data-componentid={ `${componentId}-variables` }
                    />
                </Stack>
            </TabPanel>
        </Stack>
    );
};

export default StartProperties;
