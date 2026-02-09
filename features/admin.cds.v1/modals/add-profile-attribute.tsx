import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Grid, Modal, Form, DropdownProps, Checkbox, Label } from "semantic-ui-react";
import { PrimaryButton, IconButton, Hint } from "@wso2is/react-components";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { DynamicField, KeyValue } from "@wso2is/forms";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { LinkButton } from "@wso2is/react-components/src/components/button/link-button";
import { CDM_BASE_URL } from "../models/constants";

import type {
    MergeStrategy,
    Mutability,
    ProfileSchemaAttribute,
    ProfileSchemaSubAttributeRef,
    ValueType
} from "../models/profile-attributes";

interface AddTraitModalProps {
    open: boolean;
    onClose: () => void;
    onAddSuccess: () => void;
}

type TraitValueTypeSelector = ValueType | "options";

/**
 * UI dropdown options.
 * - "options" is a UI-only selector (stored as string with canonical_values).
 * - "complex" supports sub_attributes.
 */
const VALUE_TYPE_OPTIONS: Array<{ key: TraitValueTypeSelector; text: string; value: TraitValueTypeSelector }> = [
    { key: "string", text: "Text", value: "string" },
    { key: "integer", text: "Integer", value: "integer" },
    { key: "decimal", text: "Decimal", value: "decimal" },
    { key: "boolean", text: "Boolean", value: "boolean" },
    { key: "date", text: "Date", value: "date" },
    { key: "date_time", text: "Date & Time", value: "date_time" },
    { key: "epoch", text: "Epoch", value: "epoch" },
    { key: "options", text: "Options", value: "options" },
    { key: "complex", text: "Object (Complex)", value: "complex" }
];

const MERGE_STRATEGY_OPTIONS: Array<{ key: MergeStrategy; text: string; value: MergeStrategy }> = [
    { key: "combine", text: "Combine", value: "combine" },
    { key: "append", text: "Append", value: "append" },
    { key: "latest", text: "Latest", value: "latest" },
    { key: "earliest", text: "Earliest", value: "earliest" },
    { key: "overwrite", text: "Overwrite", value: "overwrite" }
];

const MUTABILITY_OPTIONS: Array<{ key: Mutability; text: string; value: Mutability }> = [
    { key: "readOnly", text: "Read Only", value: "readOnly" },
    { key: "readWrite", text: "Read & Write", value: "readWrite" },
    { key: "immutable", text: "Immutable", value: "immutable" },
    { key: "writeOnce", text: "Write Once", value: "writeOnce" }
];

type DropdownOption = { key: string; text: string; value: string };

export const AddTraitModal: FunctionComponent<AddTraitModalProps> = ({ open, onClose, onAddSuccess }) => {
    const dispatch = useDispatch();

    // Keep UI name without `traits.` prefix.
    const [traitName, setTraitName] = useState<string>("");

    const fullTraitName: string = useMemo(() => {
        const trimmed = traitName.trim();
        return trimmed ? `traits.${trimmed}` : "";
    }, [traitName]);

    // Base attribute model (matches new models/profile-schema.ts)
    const [attribute, setAttribute] = useState<Partial<ProfileSchemaAttribute>>({
        // attribute_name is derived at submit time as traits.<name>
        value_type: "string",
        merge_strategy: "latest",
        mutability: "readWrite",
        multi_valued: false
    });

    const [valueTypeSelector, setValueTypeSelector] = useState<TraitValueTypeSelector>("string");

    // complex types
    const [subAttributes, setSubAttributes] = useState<ProfileSchemaSubAttributeRef[]>([]);
    const [subAttributeOptions, setSubAttributeOptions] = useState<DropdownOption[]>([]);

    // options (canonical values)
    const [canonicalValues, setCanonicalValues] = useState<KeyValue[]>([]);

    // name validation
    const [isValidName, setIsValidName] = useState<boolean | null>(null);
    const [isCheckingName, setIsCheckingName] = useState<boolean>(false);

    // Fetch sub-attributes suggestions when complex + name exists.
    useEffect(() => {
        if (valueTypeSelector !== "complex" || !traitName.trim()) {
            setSubAttributeOptions([]);
            setSubAttributes([]);
            return;
        }

        // backend expects: attribute_name co traits.<prefix>.
        const prefix = `${traitName.trim()}.`; // note: user input without traits.
        axios
            .get(`${CDM_BASE_URL}/profile-schema/traits?filter=attribute_name+co+traits.${prefix}`)
            .then((res) => {
                const data: ProfileSchemaAttribute[] = res.data ?? [];
                const options: DropdownOption[] = data.map((attr) => ({
                    key: attr.attribute_id,
                    text: (attr.attribute_name ?? "").replace(/^traits\./, ""),
                    value: attr.attribute_name
                }));

                setSubAttributeOptions(options);
            })
            .catch(() => setSubAttributeOptions([]));
    }, [traitName, valueTypeSelector]);

    // Debounced name availability check (checks full name: traits.<name>)
    useEffect(() => {
        if (!traitName.trim()) {
            setIsValidName(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsCheckingName(true);

            axios
                .get(`${CDM_BASE_URL}/profile-schema/traits?filter=attribute_name+eq+${encodeURIComponent(fullTraitName)}`)
                .then((res) => {
                    const list = res.data ?? [];
                    setIsValidName(Array.isArray(list) ? list.length === 0 : true);
                })
                .catch(() => setIsValidName(null))
                .finally(() => setIsCheckingName(false));
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [traitName, fullTraitName]);

    const handleValueTypeChange = (_: unknown, data: DropdownProps): void => {
        const selected = data.value as TraitValueTypeSelector;
        setValueTypeSelector(selected);

        if (selected === "complex") {
            setAttribute((prev) => ({ ...prev, value_type: "complex" }));
            // keep subAttributes (they will be populated by selection)
            return;
        }

        // for "options", we store value_type as string (backend-wise)
        const resolvedValueType: ValueType = selected === "options" ? "string" : (selected as ValueType);

        setAttribute((prev) => ({ ...prev, value_type: resolvedValueType }));
        setSubAttributes([]);
    };

    const handleSubmit = (): void => {
        const trimmedName = traitName.trim();

        if (!trimmedName) {
            return;
        }

        // UI-only: canonical_values payload when "options" is chosen.
        const canonical_values =
            valueTypeSelector === "options"
                ? canonicalValues.map(({ key, value }) => ({ label: key, value }))
                : undefined;

        const payload: Array<any> = [
            {
                ...attribute,
                attribute_name: `traits.${trimmedName}`,
                value_type: valueTypeSelector === "options" ? "string" : attribute.value_type,
                sub_attributes: valueTypeSelector === "complex" ? subAttributes : undefined,
                canonical_values
            }
        ];

        axios
            .post(`${CDM_BASE_URL}/profile-schema/traits`, payload)
            .then(() => {
                dispatch(
                    addAlert({
                        description: "Trait added successfully.",
                        level: AlertLevels.SUCCESS,
                        message: "Success"
                    })
                );
                onAddSuccess();
                onClose();
            })
            .catch((error) => {
                dispatch(
                    addAlert({
                        description: error?.message || "Failed to add trait.",
                        level: AlertLevels.ERROR,
                        message: "Error"
                    })
                );
            });
    };

    const availableSubAttributeOptions = useMemo(() => {
        const selectedNames = new Set(subAttributes.map((s) => s.attribute_name));
        return subAttributeOptions.filter((opt) => !selectedNames.has(opt.value));
    }, [subAttributeOptions, subAttributes]);

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            size="small"
            dimmer="blurring"
            className="wizard application-create-wizard"
            closeOnDimmerClick={ false }
        >
            <Modal.Header>Add New Trait</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        label="Name"
                        value={ traitName }
                        onChange={ (e) => setTraitName(e.target.value) }
                        error={ isValidName === false }
                        required
                        placeholder="e.g. preferred_category"
                    />

                    { isCheckingName && <Label basic>Checking name...</Label> }
                    { isValidName === false && <Label basic color="red" pointing>Name already exists.</Label> }
                    { isValidName === true && <Label basic color="green" pointing>Name is available.</Label> }

                    <Form.Dropdown
                        label="Value Type"
                        selection
                        options={ VALUE_TYPE_OPTIONS }
                        value={ valueTypeSelector }
                        onChange={ handleValueTypeChange }
                    />
                    <Hint>
                        Choose the data type of this trait. Use "Options" to define fixed label-value pairs or
                        "Object (Complex)" to group other traits.
                    </Hint>

                    { valueTypeSelector === "complex" && (
                        <>
                            <Hint>
                                Select existing traits to group under this complex trait. These traits should start with
                                the current trait's prefix.
                            </Hint>

                            <Form.Dropdown
                                label="Sub Attributes"
                                search
                                selection
                                options={ availableSubAttributeOptions }
                                value={ undefined }
                                placeholder="Select a trait to add"
                                onChange={ (_, data: DropdownProps) => {
                                    const selectedValue = data.value as string;

                                    const selected = subAttributeOptions.find((opt) => opt.value === selectedValue);
                                    if (!selected) {
                                        return;
                                    }

                                    if (subAttributes.some((a) => a.attribute_name === selected.value)) {
                                        return;
                                    }

                                    setSubAttributes((prev) => [
                                        ...prev,
                                        {
                                            attribute_id: String(selected.key),
                                            attribute_name: selected.value
                                        }
                                    ]);
                                } }
                            />

                            <div className="sub-attribute-list" style={ { marginTop: "1rem" } }>
                                { subAttributes.map((attr) => (
                                    <div
                                        key={ attr.attribute_id + ":" + attr.attribute_name }
                                        style={ { display: "flex", marginBottom: "0.5rem" } }
                                    >
                                        <span>{ attr.attribute_name.replace(/^traits\./, "") }</span>
                                        <IconButton
                                            onClick={ () =>
                                                setSubAttributes((prev) =>
                                                    prev.filter((item) => item.attribute_name !== attr.attribute_name)
                                                )
                                            }
                                            style={ { marginLeft: "auto" } }
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }

                    { valueTypeSelector === "options" && (
                        <>
                            <Hint>Define label-value pairs as canonical options for this trait.</Hint>
                            <DynamicField
                                data={ canonicalValues }
                                keyType="text"
                                keyName="Label"
                                valueName="Value"
                                requiredField
                                listen={ (data: KeyValue[]) => setCanonicalValues(data) }
                                keyRequiredMessage="Label is required"
                                valueRequiredErrorMessage="Value is required"
                            />
                        </>
                    ) }

                    <Form.Dropdown
                        label="Merge Strategy"
                        selection
                        options={ MERGE_STRATEGY_OPTIONS }
                        value={ attribute.merge_strategy }
                        onChange={ (_, data: DropdownProps) =>
                            setAttribute((prev) => ({ ...prev, merge_strategy: data.value as MergeStrategy }))
                        }
                    />

                    <Form.Dropdown
                        label="Mutability"
                        selection
                        options={ MUTABILITY_OPTIONS }
                        value={ attribute.mutability }
                        onChange={ (_, data: DropdownProps) =>
                            setAttribute((prev) => ({ ...prev, mutability: data.value as Mutability }))
                        }
                    />

                    <Form.Field>
                        <Checkbox
                            label="Multi Valued"
                            checked={ Boolean(attribute.multi_valued) }
                            onChange={ () => setAttribute((prev) => ({ ...prev, multi_valued: !prev.multi_valued })) }
                        />
                    </Form.Field>
                    <Hint>
                        Enable this option if the trait can hold multiple values (e.g., multiple interests or device IDs).
                    </Hint>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ onClose }>
                                Cancel
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                onClick={ handleSubmit }
                                disabled={ !traitName.trim() || isValidName === false }
                            >
                                Add
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
