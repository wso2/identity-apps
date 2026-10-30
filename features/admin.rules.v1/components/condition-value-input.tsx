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

import { Theme } from "@mui/material/styles";
import Autocomplete, {
    AutocompleteInputChangeReason,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Popover from "@oxygen-ui/react/Popover";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { FieldReferenceIcon } from "./value-type-icons";
import {
    ConditionValueType,
    FieldOptionInterface,
    FieldReferenceInterface,
    LiteralOptionInterface,
    QualifierOptionInterface
} from "../models/rules";

/**
 * Props interface of {@link ConditionValueInput}.
 */
interface ConditionValueInputPropsInterface extends IdentifiableComponentInterface {
    /**
     * The value of the condition.
     */
    value: ConditionValueType;
    /**
     * Called with the new value whenever it changes.
     */
    onChange: (value: ConditionValueType) => void;
    /**
     * The condition's own field, which is never offered as its value.
     */
    leftField: FieldReferenceInterface;
    /**
     * Data type of the condition's own field. Looked up in `availableFields` when not given.
     */
    leftDataType?: string;
    /**
     * The fields the value may be read from. With none, only a literal can be entered.
     */
    availableFields: FieldOptionInterface[];
    /**
     * Known values of the condition's field, offered while a literal is entered.
     */
    literalOptions?: LiteralOptionInterface[];
    /**
     * Renders an input that takes the literal in place of the text box, such as the list input of `in` and `notIn`,
     * with the given field toggle placed inside its box. The toggle is positioned at a fixed spot at the end of the
     * box, so the input keeps `FIELD_TOGGLE_SPACE` free there. Returns nothing when the text box suits the field.
     */
    renderLiteralInput?: (fieldToggle: ReactNode) => ReactElement | undefined;
    /**
     * Whether the input is shown for reading only.
     */
    disabled?: boolean;
    /**
     * Placeholder of the text box. Defaults to the translated "Enter a value".
     */
    placeholder?: string;
}

/**
 * Room kept at the end of a value box for the field toggle, which sits at a fixed spot inside the box so it
 * stays where it is whatever the box holds.
 */
export const FIELD_TOGGLE_SPACE: number = 5;

/**
 * Keeps room at the end of a plain or free text box for the field toggle.
 */
export const TEXT_BOX_WITH_FIELD_TOGGLE_SX: Record<string, unknown> = {
    "&& .MuiInputBase-root": { pr: FIELD_TOGGLE_SPACE }
};

const PAPER_PROPS: Record<string, unknown> = {
    paper: {
        elevation: 0,
        sx: { border: 1, borderColor: "divider", borderRadius: 1, mt: 0.5 }
    }
};

/**
 * Props interface of {@link BoxTooltip}.
 */
interface BoxTooltipPropsInterface {
    /**
     * Text shown in the tooltip.
     */
    title: string;
    /**
     * Whether the list of the control it describes is open.
     */
    isListOpen: boolean;
    /**
     * The control the tooltip describes.
     */
    children: ReactElement;
}

/**
 * Tooltip of a control with a list, shown above it and hidden while the list is open so it never covers
 * the options.
 *
 * @param props - Props injected to the component.
 * @returns The tooltip.
 */
const BoxTooltip: FunctionComponent<BoxTooltipPropsInterface> = ({
    title,
    isListOpen,
    children
}: BoxTooltipPropsInterface): ReactElement => {
    const [ isHovered, setIsHovered ] = useState<boolean>(false);

    return (
        <Tooltip
            title={ title }
            placement="top"
            describeChild
            open={ isHovered && !isListOpen && !!title }
            onOpen={ () => setIsHovered(true) }
            onClose={ () => setIsHovered(false) }
        >
            { children }
        </Tooltip>
    );
};

/**
 * How a value read from a field is shown in the value box.
 *
 * @param reference - The field reference.
 * @returns The reference as `{{name.qualifier}}`, or an empty string when no field is chosen yet.
 */
const toFieldReferenceText = (reference: FieldReferenceInterface): string => {
    if (!reference?.name) {
        return "";
    }

    return `{{${reference.name}${reference.qualifier ? `.${reference.qualifier}` : ""}}}`;
};

/**
 * Value input of a rule condition: one box that takes a literal, with a `{ }` button that switches the value to
 * one read from another field.
 *
 * @param props - Props injected to the component.
 * @returns The value input.
 */
const ConditionValueInput: FunctionComponent<ConditionValueInputPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-value-input",
    value,
    onChange,
    leftField,
    leftDataType,
    availableFields,
    literalOptions,
    renderLiteralInput,
    disabled,
    placeholder
}: ConditionValueInputPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const inputRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const anchorRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const qualifierInputRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const readsField: boolean = value?.type === "field";

    /**
     * What the box shows for a literal: a known literal's label, any other literal as it is.
     */
    const toDisplayText: (current: ConditionValueType) => string = (current: ConditionValueType): string => {
        if (current?.type !== "literal") {
            return "";
        }

        return literalOptions?.find((option: LiteralOptionInterface) => option.value === current.literal)?.label
            ?? current.literal ?? "";
    };

    const [ text, setText ] = useState<string>(toDisplayText(value));
    const [ isPopoverOpen, setIsPopoverOpen ] = useState<boolean>(false);
    const [ openList, setOpenList ] = useState<"field" | "qualifier" | null>(null);
    const [ qualifierText, setQualifierText ] = useState<string>(
        value?.type === "field" ? value.field?.qualifier ?? "" : "");

    const literalKey: string = value?.type === "literal" ? value.literal : undefined;
    const reference: FieldReferenceInterface = value?.type === "field" ? value.field : undefined;

    useEffect(() => {
        // While the box has focus the typed text is the newer of the two; the stored value is only
        // catching up with it. Anything changing the value from outside happens with the focus elsewhere.
        if (document.activeElement !== inputRef.current) {
            setText(toDisplayText(value));
        }
    }, [ readsField, literalKey, literalOptions ]);

    useEffect(() => {
        // A qualifier typed in is kept while it is being typed, and follows the saved one otherwise.
        if (document.activeElement !== qualifierInputRef.current) {
            setQualifierText(reference?.qualifier ?? "");
        }
    }, [ reference?.name, reference?.qualifier ]);

    // The type a value read from a field must have, when the condition's own field states one.
    const comparedType: string = useMemo((): string => (leftDataType
        ?? availableFields?.find((option: FieldOptionInterface) => option.name === leftField?.name)
            ?.qualifiers?.find((qualifier: QualifierOptionInterface) => qualifier.value === leftField?.qualifier)
            ?.dataType)?.toLowerCase(), [ availableFields, leftField, leftDataType ]);

    // A field that takes no qualifier is the condition's own field as a whole, so it is not offered.
    const fieldOptions: FieldOptionInterface[] = useMemo((): FieldOptionInterface[] => (availableFields ?? [])
        .filter((option: FieldOptionInterface) => option.qualifiers || option.name !== leftField?.name),
    [ availableFields, leftField ]);

    // A field saved before its list has loaded, or no longer listed, is still shown by name.
    const selectedField: FieldOptionInterface = reference?.name
        ? availableFields?.find((option: FieldOptionInterface) => option.name === reference.name)
            ?? { label: reference.name, name: reference.name, ...(reference.qualifier && { qualifiers: [] }) }
        : null;

    const qualifierOptions: QualifierOptionInterface[] = useMemo((): QualifierOptionInterface[] =>
        (selectedField?.qualifiers ?? [])
            .filter((qualifier: QualifierOptionInterface) =>
                !(selectedField.name === leftField?.name && qualifier.value === leftField?.qualifier))
            .filter((qualifier: QualifierOptionInterface) =>
                !comparedType || !qualifier.dataType || qualifier.dataType.toLowerCase() === comparedType),
    [ selectedField, leftField, comparedType ]);

    const selectedQualifier: QualifierOptionInterface = reference?.qualifier
        ? selectedField?.qualifiers?.find((qualifier: QualifierOptionInterface) =>
            qualifier.value === reference.qualifier)
            ?? { label: reference.qualifier, value: reference.qualifier }
        : null;

    // The saved value stays among the options even when it is no longer offered, so it is shown as chosen.
    const fieldChoices: FieldOptionInterface[] = selectedField
        && !fieldOptions.some((option: FieldOptionInterface) => option.name === selectedField.name)
        ? [ ...fieldOptions, selectedField ]
        : fieldOptions;
    const qualifierChoices: QualifierOptionInterface[] = selectedQualifier
        && !qualifierOptions.some((option: QualifierOptionInterface) => option.value === selectedQualifier.value)
        ? [ ...qualifierOptions, selectedQualifier ]
        : qualifierOptions;

    const leftKey: string = `${leftField?.name ?? ""}|${leftField?.qualifier ?? ""}`;
    const initialLeftKey: MutableRefObject<string> = useRef<string>(leftKey);

    useEffect(() => {
        // Once the condition's own field changes, a qualifier picked against the old one that the new one cannot
        // be compared with -- another type, or the very same claim -- is cleared. A saved rule is left as it is
        // when opened, and a qualifier not listed yet is never judged.
        if (leftKey === initialLeftKey.current || !reference?.qualifier) {
            return;
        }
        const isListed: boolean = !!selectedField?.qualifiers?.some((qualifier: QualifierOptionInterface) =>
            qualifier.value === reference.qualifier);
        const isOffered: boolean = qualifierOptions.some((qualifier: QualifierOptionInterface) =>
            qualifier.value === reference.qualifier);

        if (isListed && !isOffered) {
            onChange({ field: { name: reference.name }, type: "field" });
        }
    }, [ leftKey, comparedType, qualifierOptions ]);

    const offersFields: boolean = availableFields?.length > 0 || readsField;

    const toggleField: () => void = (): void => {
        if (readsField) {
            setIsPopoverOpen(false);
            setText("");
            onChange({ literal: "", type: "literal" });

            return;
        }

        setText("");
        onChange({ field: { name: "" }, type: "field" });
        setIsPopoverOpen(true);
    };

    const commitLiteral: (literal: string) => void = (literal: string): void => {
        if (value?.type !== "literal" || value.literal !== literal) {
            onChange({ literal, type: "literal" });
        }
    };

    const commitTypedQualifier: () => void = (): void => {
        const qualifier: string = qualifierText.trim();

        if (selectedField && qualifier !== (reference?.qualifier ?? "")) {
            onChange({
                field: { name: selectedField.name, ...(qualifier && { qualifier }) },
                type: "field"
            });
        }
    };

    const toggleLabel: string = readsField
        ? t("rules:fields.valueInput.fieldToggle.disable")
        : t("rules:fields.valueInput.fieldToggle.enable");

    // Placed in the box rather than laid out with its content, so it does not move as the box changes.
    const renderFieldToggleSlot: () => ReactElement = (): ReactElement => (
        <Box
            component="span"
            sx={ { display: "flex", position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" } }
        >
            { renderFieldToggle() }
        </Box>
    );

    const renderFieldToggle: () => ReactElement = (): ReactElement => (
        <Tooltip title={ toggleLabel } describeChild>
            <span>
                <IconButton
                    size="small"
                    disabled={ disabled }
                    aria-label={ toggleLabel }
                    aria-pressed={ readsField }
                    data-componentid={ `${componentId}-field-toggle` }
                    onClick={ toggleField }
                    sx={ { color: readsField ? "warning.main" : "text.secondary", p: 0.25 } }
                >
                    <FieldReferenceIcon />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderLiteralBox: () => ReactElement = (): ReactElement => (
        <Autocomplete
            freeSolo
            fullWidth
            disableClearable
            clearOnBlur={ false }
            disabled={ disabled }
            data-componentid={ `${componentId}-literal` }
            options={ literalOptions ?? [] }
            value={ literalOptions?.find((option: LiteralOptionInterface) => option.value === literalKey) ?? null }
            inputValue={ text }
            getOptionLabel={ (option: LiteralOptionInterface | string) =>
                typeof option === "string" ? option : option?.label ?? "" }
            isOptionEqualToValue={ (option: LiteralOptionInterface, other: LiteralOptionInterface) =>
                option.value === other?.value }
            onChange={ (_: SyntheticEvent, option: LiteralOptionInterface | string) => {
                if (option && typeof option !== "string") {
                    setText(option.label);
                    commitLiteral(option.value);
                }
            } }
            onInputChange={ (_: SyntheticEvent, next: string, reason: AutocompleteInputChangeReason) => {
                // The text is kept here, so the resets the autocomplete makes on a selection are ignored.
                if (reason !== "input") {
                    return;
                }

                setText(next);
                commitLiteral(next);
            } }
            componentsProps={ PAPER_PROPS }
            renderInput={ (params: AutocompleteRenderInputParams) => (
                <TextField
                    { ...params }
                    inputRef={ inputRef }
                    inputProps={ { ...params.inputProps, "aria-label": t("rules:fields.valueInput.valueLabel") } }
                    placeholder={ placeholder ?? t("rules:fields.valueInput.placeholder") }
                    sx={ offersFields ? TEXT_BOX_WITH_FIELD_TOGGLE_SX : undefined }
                    InputProps={ {
                        ...params.InputProps,
                        endAdornment: offersFields ? renderFieldToggleSlot() : params.InputProps.endAdornment
                    } }
                />
            ) }
        />
    );

    const renderReferenceBox: () => ReactElement = (): ReactElement => (
        <TextField
            fullWidth
            disabled={ disabled }
            value={ toFieldReferenceText(reference) }
            placeholder={ t("rules:fields.valueInput.fieldPlaceholder") }
            data-componentid={ `${componentId}-reference` }
            onClick={ () => !disabled && setIsPopoverOpen(true) }
            inputProps={ {
                "aria-haspopup": "dialog",
                "aria-label": t("rules:fields.valueInput.valueLabel"),
                onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>): void => {
                    if (!disabled && [ "Enter", " ", "ArrowDown" ].includes(event.key)) {
                        event.preventDefault();
                        setIsPopoverOpen(true);
                    }
                },
                readOnly: true
            } }
            sx={ TEXT_BOX_WITH_FIELD_TOGGLE_SX }
            InputProps={ { endAdornment: renderFieldToggleSlot() } }
        />
    );

    const renderFieldBox: () => ReactElement = (): ReactElement => (
        <BoxTooltip title={ selectedField?.name ?? "" } isListOpen={ openList === "field" }>
            <Autocomplete
                fullWidth
                openOnFocus
                onOpen={ () => setOpenList("field") }
                onClose={ () => setOpenList(null) }
                autoHighlight
                disableClearable
                disabled={ disabled }
                data-componentid={ `${componentId}-field` }
                options={ fieldChoices }
                value={ selectedField }
                getOptionLabel={ (option: FieldOptionInterface) => option?.label ?? "" }
                isOptionEqualToValue={ (option: FieldOptionInterface, other: FieldOptionInterface) =>
                    option.name === other?.name }
                noOptionsText={ t("rules:fields.valueInput.noMatchingFields") }
                onChange={ (_: SyntheticEvent, option: FieldOptionInterface) => {
                    if (option && option.name !== reference?.name) {
                        onChange({ field: { name: option.name }, type: "field" });
                    }
                } }
                componentsProps={ PAPER_PROPS }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        size="small"
                        inputProps={ { ...params.inputProps, "aria-label": t("rules:fields.valueInput.fieldLabel") } }
                        placeholder={ t("rules:fields.valueInput.fieldPlaceholder") }
                    />
                ) }
            />
        </BoxTooltip>
    );

    const renderQualifierBox: () => ReactElement = (): ReactElement => (
        <BoxTooltip title={ selectedQualifier?.value ?? "" } isListOpen={ openList === "qualifier" }>
            <Autocomplete
                fullWidth
                openOnFocus
                onOpen={ () => setOpenList("qualifier") }
                onClose={ () => setOpenList(null) }
                autoHighlight
                disableClearable
                disabled={ disabled }
                data-componentid={ `${componentId}-qualifier` }
                options={ qualifierChoices }
                value={ selectedQualifier }
                getOptionLabel={ (option: QualifierOptionInterface) => option?.label ?? "" }
                isOptionEqualToValue={ (option: QualifierOptionInterface, other: QualifierOptionInterface) =>
                    option.value === other?.value }
                noOptionsText={ t("rules:fields.valueInput.noMatchingQualifiers") }
                onChange={ (_: SyntheticEvent, option: QualifierOptionInterface) => {
                    if (option) {
                        onChange({ field: { name: selectedField.name, qualifier: option.value }, type: "field" });
                    }
                } }
                componentsProps={ PAPER_PROPS }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        size="small"
                        inputProps={ {
                            ...params.inputProps,
                            "aria-label": t("rules:fields.valueInput.qualifierLabel")
                        } }
                        placeholder={ t("rules:fields.valueInput.qualifierPlaceholder") }
                    />
                ) }
            />
        </BoxTooltip>
    );

    const renderTypedQualifierBox: () => ReactElement = (): ReactElement => (
        <TextField
            fullWidth
            size="small"
            disabled={ disabled }
            value={ qualifierText }
            inputRef={ qualifierInputRef }
            data-componentid={ `${componentId}-qualifier` }
            inputProps={ { "aria-label": t("rules:fields.valueInput.qualifierLabel") } }
            placeholder={ t("rules:fields.valueInput.qualifierTypedPlaceholder") }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => setQualifierText(event.target.value) }
            onBlur={ commitTypedQualifier }
            onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                    commitTypedQualifier();
                }
            } }
        />
    );

    const renderFieldPopover: () => ReactElement = (): ReactElement => (
        <Popover
            open={ isPopoverOpen && readsField }
            anchorEl={ anchorRef.current }
            onClose={ () => setIsPopoverOpen(false) }
            anchorOrigin={ { horizontal: "left", vertical: "bottom" } }
            transformOrigin={ { horizontal: "left", vertical: "top" } }
            data-componentid={ `${componentId}-field-popover` }
            PaperProps={ {
                "aria-label": t("rules:fields.valueInput.fieldPopover.title"),
                role: "dialog",
                sx: {
                    mt: 0.5,
                    p: 2,
                    width: anchorRef.current?.offsetWidth,
                    minWidth: (theme: Theme) => theme.spacing(35)
                }
            } }
        >
            <Stack spacing={ 1.5 }>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">{ t("rules:fields.valueInput.fieldPopover.title") }</Typography>
                    <IconButton
                        size="small"
                        aria-label={ t("rules:fields.valueInput.fieldPopover.close") }
                        data-componentid={ `${componentId}-field-popover-close` }
                        onClick={ () => setIsPopoverOpen(false) }
                    >
                        <XMarkIcon size={ 14 } />
                    </IconButton>
                </Box>
                { renderFieldBox() }
                { selectedField?.qualifiers && (
                    selectedField.isQualifierTyped ? renderTypedQualifierBox() : renderQualifierBox()
                ) }
            </Stack>
        </Popover>
    );

    // A literal entered with another input keeps it, with the toggle at the end of that input's box.
    const renderLiteral: () => ReactElement = (): ReactElement =>
        renderLiteralInput?.(offersFields ? renderFieldToggleSlot() : null) ?? renderLiteralBox();

    return (
        <Box ref={ anchorRef } width="100%" data-componentid={ componentId }>
            { readsField ? renderReferenceBox() : renderLiteral() }
            { offersFields && renderFieldPopover() }
        </Box>
    );
};

export default ConditionValueInput;
