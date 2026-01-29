import React, { FunctionComponent, useState, useEffect } from "react";
import { Grid, Icon, Modal, Form, DropdownProps, Checkbox, Label } from "semantic-ui-react";
import {
    PrimaryButton,
    IconButton,
    Hint
} from "@wso2is/react-components";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { DynamicField, KeyValue } from "@wso2is/forms";
import { Trait } from "../../api/traits";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { LinkButton } from "@wso2is/react-components/src/components/button/link-button";
import { CDM_BASE_URL } from "../../models/constants";
import { url } from "inspector";

interface AddTraitModalProps {
    open: boolean;
    onClose: () => void;
    onAddSuccess: () => void;
}

const VALUE_TYPE_OPTIONS = [
    { key: "string", text: "Text", value: "string" },
    { key: "integer", text: "Integer", value: "integer" },
    { key: "decimal", text: "Decimal", value: "decimal" },
    { key: "boolean", text: "Boolean", value: "boolean" },
    { key: "complex", text: "Complex", value: "complex" },
    { key: "options", text: "Options", value: "options" }
];

export const AddTraitModal: FunctionComponent<AddTraitModalProps> = ({
    open,
    onClose,
    onAddSuccess
}) => {
    const dispatch = useDispatch();

    const [trait, setTrait] = useState<Partial<Trait>>({
        attribute_name: "",
        value_type: "string",
        merge_strategy: "latest",
        mutability: "readWrite",
        multi_valued: false
    });

    const [dataType, setDataType] = useState<string>("string");
    const [subAttributes, setSubAttributes] = useState<{ attribute_name: string, attribute_id: string }[]>([]);
    const [subAttributeOptions, setSubAttributeOptions] = useState([]);
    const [isValidName, setIsValidName] = useState<boolean | null>(null);
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [canonicalValues, setCanonicalValues] = useState<KeyValue[]>([]);

    useEffect(() => {
        if (trait.attribute_name && trait.value_type === "complex") {
            const prefix = trait.attribute_name + ".";
            axios
                .get(`${CDM_BASE_URL}/profile-schema/traits?filter=attribute_name+co+traits.${prefix}`)
                .then((res) => {
                    const data = res.data ?? [];
                    setSubAttributeOptions(
                        data.map((attr: Trait) => ({
                            key: attr.attribute_id,
                            text: attr.attribute_name.replace(/^traits\./, ""),
                            value: attr.attribute_name
                        }))
                    );
                })
                .catch(() => setSubAttributeOptions([]));
        } else {
            setSubAttributeOptions([]);
        }
    }, [trait.attribute_name, trait.value_type]);

    useEffect(() => {
        if (!trait.attribute_name?.trim()) {
            setIsValidName(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsCheckingName(true);
            axios.get(`${CDM_BASE_URL}/profile-schema/traits?filter=attribute_name+eq+traits.${trait.attribute_name}`)
                .then(res => {
                    setIsValidName(res.data.length === 0);
                })
                .catch(() => setIsValidName(null))
                .finally(() => setIsCheckingName(false));
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [trait.attribute_name]);

    const handleSubmit = () => {
        const canonical_values = dataType === "options"
            ? canonicalValues.map(({ key, value }) => ({ label: key, value }))
            : undefined;

        const url = `${CDM_BASE_URL}/profile-schema/traits`;
        axios.post(url, [{
            ...trait,
            attribute_name: `traits.${trait.attribute_name?.trim()}`,
            value_type: dataType === "options" ? "string" : trait.value_type,
            sub_attributes: subAttributes,
            canonical_values
        }])
        .then(() => {
            dispatch(addAlert({
                description: "Trait added successfully.",
                level: AlertLevels.SUCCESS,
                message: "Success"
            }));
            onAddSuccess();
            onClose();
        })
        .catch((error) => {
            dispatch(addAlert({
                description: error?.message || "Failed to add trait.",
                level: AlertLevels.ERROR,
                message: "Error"
            }));
        });
    };

    return (
        <Modal 
        open={open} 
        onClose={onClose} 
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
                        value={trait.attribute_name}
                        onChange={(e) => setTrait({ ...trait, attribute_name: e.target.value.trim() })}
                        error={isValidName === false}
                        required
                        placeholder="e.g. preferred_category"
                    />
                    {isCheckingName && <Label basic>Checking name...</Label>}
                    {isValidName === false && (
                        <Label basic color="red" pointing>Name already exists.</Label>
                    )}
                    {isValidName === true && (
                        <Label basic color="green" pointing>Name is available.</Label>
                    )}

                    <Form.Dropdown
                        label="Value Type"
                        selection
                        options={VALUE_TYPE_OPTIONS}
                        value={dataType}
                        onChange={(_, data: DropdownProps) => {
                            const selected = data.value as string;
                            setDataType(selected);
                            if (selected === "complex") {
                                setTrait({ ...trait, value_type: "complex" });
                            } else {
                                setTrait({ ...trait, value_type: selected === "options" ? "string" : selected });
                            }
                            if (selected !== "complex") setSubAttributes([]);
                        }}
                    />
                    <Hint>
                        Choose the data type of this trait. Use "Options" to define fixed label-value pairs or "Complex" to group other traits.
                    </Hint>


                    {dataType === "complex" && (
                        <>
                        <Hint>
                                Select existing traits to group under this complex trait. These traits should start with the current trait's prefix.
                            </Hint>
                            <Form.Dropdown
                                label="Sub Attributes"
                                search
                                selection
                                options={subAttributeOptions.filter(option => !subAttributes.includes(option.value))}
                                onChange={(_, data: { value: string }) => {
                                    const selected = subAttributeOptions.find(opt => opt.value === data.value);
                                    if (selected && !subAttributes.some(attr => attr.attribute_name === selected.value)) {
                                        setSubAttributes([
                                            ...subAttributes,
                                            {
                                                attribute_name: selected.value,
                                                attribute_id: selected.key
                                            }
                                        ]);
                                    }
                                }}
                                
                            />

                            <div className="sub-attribute-list" style={{ marginTop: "1rem" }}>
                            {subAttributes.map((attr, i) => (
                                <div key={i} style={{ display: "flex", marginBottom: "0.5rem" }}>
                                    <span>{attr.attribute_name.replace(/^traits\./, "")}</span>
                                    <IconButton
                                        onClick={() =>
                                            setSubAttributes(subAttributes.filter(item => item.attribute_name !== attr.attribute_name))}
                                        style={{ marginLeft: "auto" }}
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                </div>
                            ))}
                            </div>
                        </>
                    )}

                    {dataType === "options" && (
                        <>
                            <Hint>Define label-value pairs as canonical options for this trait</Hint>
                            <DynamicField
                                data={canonicalValues}
                                keyType="text"
                                keyName="Label"
                                valueName="Value"
                                requiredField
                                listen={(data: KeyValue[]) => setCanonicalValues(data)}
                                keyRequiredMessage="Label is required"
                                valueRequiredErrorMessage="Value is required"
                            />
                        </>
                    )}

                    <Form.Dropdown
                        label="Merge Strategy"
                        selection
                        options={[
                            { key: "combine", text: "Combine", value: "combine" },
                            { key: "latest", text: "Latest", value: "latest" },
                            { key: "earliest", text: "Earliest", value: "earliest" }
                        ]}
                        value={trait.merge_strategy}
                        onChange={(_, data: DropdownProps) =>
                            setTrait({ ...trait, merge_strategy: data.value as string })}
                    />

                    <Form.Dropdown
                        label="Mutability"
                        selection
                        options={[
                            { key: "readOnly", text: "Read Only", value: "readOnly" },
                            { key: "readWrite", text: "Read & Write", value: "readWrite" },
                            { key: "immutable", text: "Immutable", value: "immutable" }
                        ]}
                        value={trait.mutability}
                        onChange={(_, data: DropdownProps) =>
                            setTrait({ ...trait, mutability: data.value as string })}
                    />

                    <Form.Field>
                        <Checkbox
                            label="Multi Valued"
                            checked={trait.multi_valued}
                            onChange={() => setTrait({ ...trait, multi_valued: !trait.multi_valued })}
                        />
                    </Form.Field>
                    <Hint>
                    Enable this option if the trait can hold multiple values (e.g., multiple interests or device IDs).
                    </Hint>

                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <PrimaryButton
                        onClick={handleSubmit}
                        disabled={!trait.attribute_name?.trim() || isValidName === false}
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

