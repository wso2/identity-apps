import React, { FunctionComponent, useEffect, useState } from "react";
import { Modal, Form, DropdownProps, Checkbox, Grid } from "semantic-ui-react";
import axios from "axios";
import {
    PrimaryButton,
    Hint
} from "@wso2is/react-components";
import { LinkButton } from "@wso2is/react-components/src/components/button/link-button";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import {CDM_BASE_URL} from "../../models/constants";

interface UnificationRuleAddModalProps {
    open: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

const SCOPE_OPTIONS = [
    { key: "identity", text: "Identity Attributes", value: "identity_attributes" },
    { key: "application", text: "Application Data", value: "application_data" },
    { key: "traits", text: "Traits", value: "traits" }
];

export const UnificationRuleAddModal: FunctionComponent<UnificationRuleAddModalProps> = ({
    open,
    onClose,
    onSubmitSuccess
}) => {
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        rule_name: "",
        scope: "identity_attributes",
        attribute: "",
        priority: 1,
        is_active: true
    });

    const [attributeOptions, setAttributeOptions] = useState<{ key: string, text: string, value: string }[]>([]);
    const [existingRules, setExistingRules] = useState<any[]>([]);
    const [ruleNameConflict, setRuleNameConflict] = useState(false);
    const [attributeConflict, setAttributeConflict] = useState(false);
    const [priorityConflict, setPriorityConflict] = useState(false);


    useEffect(() => {
        if (!open) return;
        const url = `${CDM_BASE_URL}/unification-rules`;
        fetchAttributes(form.scope);
        axios.get(url)
            .then((res) => setExistingRules(res.data || []))
            .catch(() => setExistingRules([]));
    }, [open]);

    useEffect(() => {
        if (form.scope) {
            setForm((prev) => ({ ...prev, attribute: "" }));
            fetchAttributes(form.scope);
        }
    }, [form.scope]);

    useEffect(() => {
        if (!form.rule_name || !form.attribute || !form.priority) {
            setRuleNameConflict(false);
            setAttributeConflict(false);
            setPriorityConflict(false);
            return;
        }

        const fullAttribute = `${form.scope}.${form.attribute}`;

        setRuleNameConflict(existingRules.some(rule => rule.rule_name === form.rule_name));
        setAttributeConflict(existingRules.some(rule => rule.property_name === fullAttribute));
        setPriorityConflict(existingRules.some(rule => rule.priority === form.priority));
    }, [form, existingRules]);


    const fetchAttributes = async (scope: string) => {
        try {
            const response = await axios.get(`${CDM_BASE_URL}/profile-schema/${scope}`);
            const options = (response.data || [])
                .filter((item: any) => {
                    // Exclude complex types and entries with empty names
                    const name = item.attribute_name || "";
                    return name && item.value_type !== "complex";
                })
                .map((item: any) => {
                    const name = item.attribute_name;
                    const suffix = name.split(".").slice(1).join(".") || name;
                    return {
                        key: name,
                        text: suffix,
                        value: suffix
                    };
                });

            setAttributeOptions(options);
        } catch (error) {
            console.error("Failed to fetch attributes", error);
            setAttributeOptions([]);
        }
    };


    const handleSubmit = async () => {
        if (!form.rule_name || !form.attribute || form.priority <= 0) return;

        try {
            const url = `${CDM_BASE_URL}/unification-rules`;
            await axios.post(url, {
                rule_name: form.rule_name,
                property_name: `${form.scope}.${form.attribute}`,
                priority: form.priority,
                is_active: form.is_active
            });

            dispatch(addAlert({
                description: "Unification rule added successfully.",
                level: AlertLevels.SUCCESS,
                message: "Success"
            }));

            onSubmitSuccess();
            onClose();
        } catch (error) {
            dispatch(addAlert({
                description: error?.message || "Failed to add rule.",
                level: AlertLevels.ERROR,
                message: "Error"
            }));
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="small"
            dimmer="blurring"
            className="wizard application-create-wizard"
            closeOnDimmerClick={false}
        >
            <Modal.Header>Add Profile Unification Rule</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input
                        label="Rule Name"
                        placeholder="e.g. resolve_by_email"
                        value={form.rule_name}
                        onChange={(e) => setForm({ ...form, rule_name: e.target.value })}
                        required
                    />
                    {ruleNameConflict && (
                        <div style={{ color: "red", marginTop: "0.25rem" }}>
                            A rule with this name already exists.
                        </div>
                    )}

                    <Form.Group widths="equal">
                        <Form.Dropdown
                            label="Scope"
                            selection
                            options={SCOPE_OPTIONS}
                            value={form.scope}
                            onChange={(_, data: DropdownProps) =>
                                setForm({ ...form, scope: data.value as string })}
                        />
                        <Form.Dropdown
                            label="Attribute"
                            selection
                            search
                            options={attributeOptions}
                            value={form.attribute}
                            onChange={(_, data: DropdownProps) =>
                                setForm({ ...form, attribute: data.value as string })}
                        />
                    </Form.Group>
                    {attributeConflict && (
                        <div style={{ color: "red", marginTop: "0.25rem" }}>
                            A rule for this attribute already exists.
                        </div>
                    )}
                    <Hint>
                        Choose the attribute scope and specific attribute to apply this rule to.
                    </Hint>

                    <Form.Input
                        label="Priority"
                        type="number"
                        min={1}
                        value={form.priority}
                        onChange={(e) =>
                            setForm({ ...form, priority: Math.max(1, parseInt(e.target.value) || 1) })}
                    />
                    {priorityConflict && (
                        <div style={{ color: "red", marginTop: "0.25rem" }}>
                            This priority is already assigned for an attribute.
                        </div>
                    )}
                    <Hint>Lower number means higher priority.</Hint>

                    <Form.Field>
                        <Checkbox
                            label="Enable Rule"
                            checked={form.is_active}
                            onChange={() =>
                                setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <LinkButton floated="left" onClick={onClose}>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column textAlign="right">
                            <PrimaryButton
                                disabled={!form.rule_name || !form.attribute || form.priority <= 0 || ruleNameConflict ||
                                    attributeConflict ||
                                    priorityConflict}
                                onClick={handleSubmit}
                            >
                                Submit
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

export default UnificationRuleAddModal;
