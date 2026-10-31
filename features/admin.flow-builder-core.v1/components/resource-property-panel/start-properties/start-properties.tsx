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

import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Fab from "@oxygen-ui/react/Fab";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Paper from "@oxygen-ui/react/Paper";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon, MinusIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node, useNodesData, useReactFlow } from "@xyflow/react";
import React, { ChangeEvent, FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from "../../../hooks/use-authentication-flow-builder-core-context";
import {
    FlowVariablesInterface,
    RuntimeValueInterface,
    RuntimeValueType,
    VariableDataTypes,
    VariableLimitsInterface
} from "../../../models/variables";
import { Resource } from "../../../models/resources";
import {
    AB_TESTING_KEY_MAX,
    AB_TESTING_KEY_MIN,
    HEADER_DATA_TYPES,
    VariableNameError,
    VariableValueError,
    getVariableNameError,
    getVariableValueError,
    withAbTestingKeyFirst
} from "../../../utils/variables";
import "./start-properties.scss";

/**
 * The kinds of variables, by the list that holds them.
 */
type VariableKind = keyof FlowVariablesInterface;

/**
 * Props interface of {@link StartProperties}
 */
interface StartPropertiesPropsInterface extends IdentifiableComponentInterface {
    /**
     * The start step.
     */
    resource: Resource;
}

/**
 * Props interface of {@link VariableList}
 */
interface VariableListPropsInterface extends IdentifiableComponentInterface {
    kind: VariableKind;
    variables: RuntimeValueInterface[];
    dataTypes: VariableDataTypes[];
    max?: number;
    valueLimits?: Pick<VariableLimitsInterface, "maxValueLength" | "maxArraySize">;
    onChange: (variables: RuntimeValueInterface[]) => void;
}

/**
 * A collapsible section of the start properties, holding one kind of variable.
 */
interface VariableSectionInterface {
    kind: VariableKind;
    dataTypes: VariableDataTypes[];
    max?: number;
}

/**
 * Props interface of {@link InitialValueField}
 */
interface InitialValueFieldPropsInterface extends IdentifiableComponentInterface {
    dataType: VariableDataTypes;
    value: RuntimeValueType;
    error?: string;
    onChange: (value: RuntimeValueType) => void;
}

/**
 * Props interface of {@link AbTestingKeyItem}
 */
interface AbTestingKeyItemPropsInterface extends IdentifiableComponentInterface {
    runtimeValue: RuntimeValueInterface;
    isOutOfRange: boolean;
    onChange: (value: RuntimeValueType) => void;
}

const RUNTIME_VALUE_DATA_TYPES: VariableDataTypes[] = Object.values(VariableDataTypes);

/**
 * The initial value of a runtime value, edited as its type needs.
 *
 * @param props - Props injected to the component.
 * @returns The InitialValueField component.
 */
const InitialValueField: FunctionComponent<InitialValueFieldPropsInterface> = ({
    dataType,
    value,
    error,
    onChange,
    ["data-componentid"]: componentId = "initial-value-field"
}: InitialValueFieldPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const label: string = t("flows:core.steps.start.variables.fields.initialValue");

    if (dataType === VariableDataTypes.BOOLEAN) {
        return (
            <Select
                size="small"
                displayEmpty
                value={ value === undefined || value === null ? "" : String(value) }
                onChange={ (event: SelectChangeEvent<string>) =>
                    onChange(event.target.value === "" ? undefined : event.target.value === "true") }
                data-componentid={ componentId }
            >
                <MenuItem value="">{ t("flows:core.steps.start.variables.fields.noValue") }</MenuItem>
                <MenuItem value="true">true</MenuItem>
                <MenuItem value="false">false</MenuItem>
            </Select>
        );
    }

    if (dataType === VariableDataTypes.STRING_ARRAY || dataType === VariableDataTypes.NUMBER_ARRAY) {
        const isNumeric: boolean = dataType === VariableDataTypes.NUMBER_ARRAY;
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
                        error={ !!error }
                        helperText={ error ?? t("flows:core.steps.start.variables.fields.initialValueHint") }
                    />
                ) }
                data-componentid={ componentId }
            />
        );
    }

    const isNumber: boolean = dataType === VariableDataTypes.INTEGER || dataType === VariableDataTypes.DECIMAL;

    return (
        <TextField
            size="small"
            fullWidth
            label={ label }
            error={ !!error }
            helperText={ error }
            type={ isNumber ? "number" : "text" }
            inputProps={ dataType === VariableDataTypes.INTEGER ? { step: 1 } : undefined }
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
 * The A/B testing key every flow has. Only its initial value, from 0 to 99, can change.
 *
 * @param props - Props injected to the component.
 * @returns The AbTestingKeyItem component.
 */
const AbTestingKeyItem: FunctionComponent<AbTestingKeyItemPropsInterface> = ({
    runtimeValue,
    isOutOfRange,
    onChange,
    ["data-componentid"]: componentId = "ab-testing-key-item"
}: AbTestingKeyItemPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const value: RuntimeValueType = runtimeValue.value;

    return (
        <Paper variant="outlined" sx={ { p: 1.5 } } data-componentid={ componentId }>
            <Stack gap={ 1.5 }>
                <Alert severity="info" data-componentid={ `${componentId}-info` }>
                    { t("flows:core.steps.start.variables.abTestingKey") }
                </Alert>
                <TextField
                    size="small"
                    fullWidth
                    disabled
                    label={ t("flows:core.steps.start.variables.fields.name") }
                    value={ runtimeValue.name }
                    helperText={ t(`flows:core.steps.start.variables.dataTypes.${VariableDataTypes.INTEGER}`) }
                    data-componentid={ `${componentId}-name` }
                />
                <TextField
                    size="small"
                    fullWidth
                    type="number"
                    label={ t("flows:core.steps.start.variables.fields.initialValue") }
                    inputProps={ { max: AB_TESTING_KEY_MAX, min: AB_TESTING_KEY_MIN, step: 1 } }
                    value={ value === undefined || value === null ? "" : String(value) }
                    error={ isOutOfRange }
                    helperText={ t("flows:core.steps.start.variables.fields.abTestingKeyValueHint", {
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
 * The headers or runtime values of a flow, one row each.
 *
 * @param props - Props injected to the component.
 * @returns The VariableList component.
 */
const VariableList: FunctionComponent<VariableListPropsInterface> = ({
    kind,
    variables,
    dataTypes,
    max,
    valueLimits,
    onChange,
    ["data-componentid"]: componentId = "variable-list"
}: VariableListPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const isRuntimeValue: boolean = kind === "runtimeValues";

    /**
     * Whether a row is the A/B testing key every flow has. Runtime values are listed with it first, so a row named
     * like it later is a row of its own, which cannot keep that name.
     *
     * @param index - Position of the variable.
     * @returns True for the A/B testing key.
     */
    const isSystemRuntimeValue: (index: number) => boolean = (index: number): boolean =>
        isRuntimeValue && index === 0;

    // The A/B testing key does not count towards the limit.
    const definedCount: number = variables.filter(
        (_: RuntimeValueInterface, index: number) => !isSystemRuntimeValue(index)).length;
    const isLimitReached: boolean = max !== undefined && definedCount >= max;

    /**
     * The message for the problem with a variable's name, if any.
     *
     * @param index - Position of the variable.
     * @returns The error message, or undefined when the name is fine.
     */
    const getNameError: (index: number) => string | undefined = (index: number): string | undefined => {
        const error: VariableNameError = getVariableNameError(kind, variables, index);

        return error ? t(`flows:core.steps.start.variables.errors.${error}`) : undefined;
    };

    /**
     * The message for the problem with a runtime value's initial value, if any.
     *
     * @param index - Position of the runtime value.
     * @returns The error message, or undefined when the value is fine.
     */
    const getValueError: (index: number) => string | undefined = (index: number): string | undefined => {
        const error: VariableValueError = getVariableValueError(
            variables[ index ], valueLimits, isSystemRuntimeValue(index));

        return error
            ? t(`flows:core.steps.start.variables.errors.${error}`, {
                max: error === "tooManyValues" ? valueLimits?.maxArraySize : valueLimits?.maxValueLength
            })
            : undefined;
    };

    const update: (index: number, changes: Partial<RuntimeValueInterface>) => void = (
        index: number,
        changes: Partial<RuntimeValueInterface>
    ): void => {
        onChange(variables.map((variable: RuntimeValueInterface, current: number) =>
            current === index ? { ...variable, ...changes } : variable));
    };

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            { definedCount === 0 && (
                <Typography variant="body2" color="text.secondary">
                    { t(`flows:core.steps.start.variables.empty.${kind}`) }
                </Typography>
            ) }
            { variables.map((variable: RuntimeValueInterface, index: number) => {
                const nameError: string = getNameError(index);

                if (isSystemRuntimeValue(index)) {
                    return (
                        <AbTestingKeyItem
                            key={ index }
                            runtimeValue={ variable }
                            isOutOfRange={ !!getVariableValueError(variable, valueLimits, true) }
                            onChange={ (value: RuntimeValueType) => update(index, { value }) }
                            data-componentid={ `${componentId}-item-${index}` }
                        />
                    );
                }

                return (
                    <Paper
                        key={ index }
                        variant="outlined"
                        className="variable-item"
                        data-componentid={ `${componentId}-item-${index}` }
                    >
                        <Tooltip title={ t("flows:core.steps.start.variables.remove") }>
                            <Fab
                                aria-label={ t("flows:core.steps.start.variables.remove") }
                                size="small"
                                className="variable-item-remove"
                                onClick={ () => onChange(variables.filter(
                                    (_: RuntimeValueInterface, current: number) => current !== index)) }
                                data-componentid={ `${componentId}-item-${index}-remove` }
                            >
                                <MinusIcon className="variable-item-remove-icon" />
                            </Fab>
                        </Tooltip>
                        <Stack gap={ 1.5 }>
                            <TextField
                                size="small"
                                fullWidth
                                label={ t("flows:core.steps.start.variables.fields.name") }
                                value={ variable.name ?? "" }
                                error={ !!nameError }
                                helperText={ nameError }
                                onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                    update(index, { name: event.target.value }) }
                                data-componentid={ `${componentId}-item-${index}-name` }
                            />
                            <Select
                                size="small"
                                fullWidth
                                value={ variable.dataType ?? dataTypes[ 0 ] }
                                onChange={ (event: SelectChangeEvent<VariableDataTypes>) => update(index, {
                                    dataType: event.target.value as VariableDataTypes,
                                    ...(isRuntimeValue && { value: undefined })
                                }) }
                                data-componentid={ `${componentId}-item-${index}-data-type` }
                            >
                                { dataTypes.map((dataType: VariableDataTypes) => (
                                    <MenuItem key={ dataType } value={ dataType }>
                                        { t(`flows:core.steps.start.variables.dataTypes.${dataType}`) }
                                    </MenuItem>
                                )) }
                            </Select>
                            { isRuntimeValue && (
                                <>
                                    <InitialValueField
                                        dataType={ variable.dataType ?? dataTypes[ 0 ] }
                                        value={ variable.value }
                                        error={ getValueError(index) }
                                        onChange={ (value: RuntimeValueType) => update(index, { value }) }
                                        data-componentid={ `${componentId}-item-${index}-value` }
                                    />
                                    <Box>
                                        <FormControlLabel
                                            control={ (
                                                <Checkbox
                                                    checked={ !!variable.clientWritable }
                                                    onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                                        update(index, { clientWritable: event.target.checked }) }
                                                    data-componentid={
                                                        `${componentId}-item-${index}-client-writable` }
                                                />
                                            ) }
                                            label={ t("flows:core.steps.start.variables.fields.clientWritable") }
                                        />
                                        { variable.clientWritable && (
                                            <FormHelperText>
                                                { t("flows:core.steps.start.variables.fields.clientWritableHint") }
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
                    variant="text"
                    size="small"
                    className="variable-add"
                    startIcon={ <PlusIcon size={ 12 } /> }
                    disabled={ isLimitReached }
                    onClick={ () => onChange([ ...variables, { dataType: dataTypes[ 0 ], name: "" } ]) }
                    data-componentid={ `${componentId}-add` }
                >
                    { t(`flows:core.steps.start.variables.add.${kind}`) }
                </Button>
                { isLimitReached && (
                    <FormHelperText>
                        { t("flows:core.steps.start.variables.limitReached", { max }) }
                    </FormHelperText>
                ) }
            </Box>
        </Stack>
    );
};

/**
 * Properties of the start step: the variables of the flow, which are the headers it reads from each request and the
 * runtime values it keeps. They are kept on the start node and saved with the flow.
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
    const { isVariablesEnabled, variableLimits } = useAuthenticationFlowBuilderCore();
    const [ expandedKind, setExpandedKind ] = useState<VariableKind | false>(false);

    const variables: FlowVariablesInterface = (node?.data?.variables ?? {}) as FlowVariablesInterface;

    const updateVariables: (kind: VariableKind, list: RuntimeValueInterface[]) => void = (
        kind: VariableKind,
        list: RuntimeValueInterface[]
    ): void => {
        updateNodeData(stepId, (current: Node) => ({
            variables: {
                ...((current?.data?.variables ?? {}) as FlowVariablesInterface),
                [ kind ]: list
            }
        }));
    };

    const sections: VariableSectionInterface[] = [
        { dataTypes: HEADER_DATA_TYPES, kind: "headers", max: variableLimits?.maxHeaders },
        { dataTypes: RUNTIME_VALUE_DATA_TYPES, kind: "runtimeValues", max: variableLimits?.maxRuntimeValues }
    ];

    if (!isVariablesEnabled) {
        return (
            <Alert severity="info" data-componentid={ `${componentId}-disabled` }>
                { t("flows:core.steps.start.variables.disabled") }
            </Alert>
        );
    }

    return (
        <Stack gap={ 2 } className="start-properties" data-componentid={ componentId }>
            { sections.map(({ kind, dataTypes, max }: VariableSectionInterface) => {
                const list: RuntimeValueInterface[] = kind === "runtimeValues"
                    ? withAbTestingKeyFirst(variables.runtimeValues)
                    : variables.headers ?? [];
                const sectionId: string = `${componentId}-${kind === "runtimeValues" ? "runtime-values" : kind}`;

                return (
                    <Stack key={ kind } gap={ 1 }>
                        <Box>
                            <Typography variant="subtitle1" data-componentid={ `${sectionId}-heading` }>
                                { t(`flows:core.steps.start.variables.headings.${kind}`) }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                { t(`flows:core.steps.start.variables.descriptions.${kind}`) }
                            </Typography>
                        </Box>
                        <Accordion
                            disableGutters
                            variant="outlined"
                            expanded={ expandedKind === kind }
                            onChange={ (_: SyntheticEvent, isExpanded: boolean) =>
                                setExpandedKind(isExpanded ? kind : false) }
                            className="variable-section"
                            data-componentid={ sectionId }
                        >
                            <AccordionSummary
                                expandIcon={ <ChevronDownIcon size={ 14 } /> }
                                data-componentid={ `${sectionId}-summary` }
                            >
                                <Typography variant="body2" className="variable-section-title">
                                    { t(`flows:core.steps.start.variables.tabs.${kind}`) }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    { list.length }
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VariableList
                                    kind={ kind }
                                    variables={ list }
                                    dataTypes={ dataTypes }
                                    max={ max }
                                    valueLimits={ variableLimits }
                                    onChange={ (next: RuntimeValueInterface[]) => updateVariables(kind, next) }
                                    data-componentid={ sectionId }
                                />
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                );
            }) }
        </Stack>
    );
};

export default StartProperties;
