import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, Field } from "@wso2is/form";
import {
    TabPageLayout,
    PrimaryButton,
    ContentLoader,
    ConfirmationModal,
    Hint,
    AnimatedAvatar
} from "@wso2is/react-components";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import axios from "axios";
import { AlertLevels } from "@wso2is/core/models";
import { CDM_BASE_URL } from "../models/constants";

const UnificationRuleEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const dispatch = useDispatch();

    const [ rule, setRule ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ isToggling, setIsToggling ] = useState(false);
    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ showToggleConfirm, setShowToggleConfirm ] = useState(false);
    const [ showDeleteConfirm, setShowDeleteConfirm ] = useState(false);

    useEffect(() => {
        axios.get(`${CDM_BASE_URL}/unification-rules/${id}`)
            .then(res => {
                setRule(res.data);
            })
            .catch(() => {
                dispatch(addAlert({
                    level: AlertLevels.ERROR,
                    message: "Failed to load rule"
                }));
            })
            .finally(() => setIsLoading(false));
    }, [ id ]);

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await axios.patch(`${CDM_BASE_URL}/unification-rules/${id}`, {
                priority: values.priority
            });
            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: "Rule updated successfully"
            }));
        } catch {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Update failed"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleStatus = async () => {
        setIsToggling(true);
        try {
            await axios.patch(`${CDM_BASE_URL}/unification-rules/${id}`, {
                is_active: !rule.is_active
            });
            setRule(prev => ({ ...prev, is_active: !prev.is_active }));
            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: rule.is_active ? "Rule disabled" : "Rule enabled"
            }));
        } catch {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Status update failed"
            }));
        } finally {
            setIsToggling(false);
            setShowToggleConfirm(false);
        }
    };

    const deleteRule = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${CDM_BASE_URL}/unification-rules/${id}`);
            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: "Rule deleted"
            }));
            history.push("/unification");
        } catch {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Delete failed"
            }));
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (isLoading) return <ContentLoader />;

    return (
        <TabPageLayout
            isLoading={ isLoading }
            title={ rule?.rule_name || "Edit Rule" }
            pageTitle="Edit Unification Rule"
            description="Modify and manage your unification rule."
            backButton={{
                onClick: () => history.push("/unification"),
                text: "Go back to list"
            }}
            image={ <AnimatedAvatar name={ rule?.rule_name } size="tiny" /> }
            titleTextAlign="left"
        >
            <Form
                uncontrolledForm={ true }
                onSubmit={ handleSubmit }
                initialValues={ rule }
                id ="unification-rule-edit-form"
            >
                <Field
                    name="rule_name"
                    label="Rule Name"
                    readOnly
                    ariaLabel="Rule Name"
                />
                <Field
                    name="property_name"
                    label="Attribute"
                    readOnly
                    ariaLabel="Attribute"
                />
                <Field
                    name="priority"
                    label="Priority"
                    type="number"
                    required
                    ariaLabel="Priority"
                />
                <Hint>
                    Only priority can be updated. Rule name and attribute are fixed once created.
                </Hint>
                <PrimaryButton type="submit" loading={ isSubmitting }>Update</PrimaryButton>
                <PrimaryButton
                    basic
                    color={ rule.is_active ? "orange" : "green" }
                    loading={ isToggling }
                    onClick={ () => setShowToggleConfirm(true) }
                >{ rule.is_active ? "Disable Rule" : "Enable Rule" }</PrimaryButton>
                <PrimaryButton
                    basic
                    color="red"
                    loading={ isDeleting }
                    onClick={ () => setShowDeleteConfirm(true) }
                >Delete Rule</PrimaryButton>
            </Form>

            <ConfirmationModal
                open={ showToggleConfirm }
                onClose={ () => setShowToggleConfirm(false) }
                type="warning"
                assertionType="checkbox"
                primaryAction="Confirm"
                secondaryAction="Cancel"
                onPrimaryActionClick={ toggleStatus }
                onSecondaryActionClick={ () => setShowToggleConfirm(false) }
            >
                <ConfirmationModal.Header>
                    { rule.is_active ? "Disable Rule" : "Enable Rule" }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message>
                    { rule.is_active
                        ? "Disabling this rule will stop it from applying to future profile unifications."
                        : "Enabling this rule will apply it to future profile unifications." }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    Are you sure you want to { rule.is_active ? "disable" : "enable" } rule <b>{ rule.rule_name }</b>?
                </ConfirmationModal.Content>
            </ConfirmationModal>

            <ConfirmationModal
                open={ showDeleteConfirm }
                onClose={ () => setShowDeleteConfirm(false) }
                type="negative"
                assertionType="checkbox"
                primaryAction="Delete"
                secondaryAction="Cancel"
                onPrimaryActionClick={ deleteRule }
                onSecondaryActionClick={ () => setShowDeleteConfirm(false) }
            >
                <ConfirmationModal.Header>Delete Rule</ConfirmationModal.Header>
                <ConfirmationModal.Message>
                    This action is irreversible.
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    Are you sure you want to delete rule <b>{ rule.rule_name }</b>?
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </TabPageLayout>
    );
};

export default UnificationRuleEditPage;
