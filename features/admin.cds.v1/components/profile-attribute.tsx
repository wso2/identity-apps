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

import { TrashIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint,
    IconButton,
    ResourceTab,
    ResourceTabPaneInterface,
    TabPageLayout,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Grid, Image, TabProps } from "semantic-ui-react";
import { deleteSchemaAttributeById, updateSchemaAttributeById } from "../api/profile-attributes";
import { useSchemaAttributeById } from "../hooks/use-profile-attributes";
import { useSearchSubAttributes } from "../hooks/use-search-sub-attributes";
import { SCOPE_CONFIG, SchemaListingScope } from "../models/profile-attribute-listing";
import {
    MergeStrategy,
    ProfileSchemaAttribute,
    ProfileSchemaSubAttributeRef,
    ValueType
} from "../models/profile-attributes";
import { stripScopePrefix } from "../utils/profile-attribute-utils";

const FORM_ID: string = "profile-attribute-edit-form";

interface RouteParams {
    scope: SchemaListingScope;
    id: string;
}

interface SubAttributeOption {
    key: string;
    text: string;
    value: string;
    attributeId: string;
}

interface AttributeFormValues {
    value_type: ValueType;
    merge_strategy: MergeStrategy;
    multi_valued: boolean;
}

const ProfileAttributeEditPage: FunctionComponent<RouteComponentProps<RouteParams>> = (
    props: RouteComponentProps<RouteParams>
): ReactElement => {

    const { match } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const componentId: string = "profile-attribute-edit";
    const scope: SchemaListingScope = match.params.scope;
    const id: string = match.params.id;
    const cfg = SCOPE_CONFIG[scope];

    const {
        data: fetchedAttribute,
        isLoading,
        error,
        mutate
    } = useSchemaAttributeById(scope, id);

    const [ attribute, setAttribute ] = useState<ProfileSchemaAttribute>(null);
    const [ subAttributes, setSubAttributes ] = useState<ProfileSchemaSubAttributeRef[]>([]);

    const [ currentValueType, setCurrentValueType ] = useState<ValueType>(null);

    useEffect((): void => {
        if (!fetchedAttribute) return;
        setAttribute(fetchedAttribute);
        setSubAttributes(fetchedAttribute?.sub_attributes ?? []);
        setCurrentValueType(fetchedAttribute?.value_type ?? null);
    }, [ fetchedAttribute ]);

    useEffect((): void => {
        if (!error) return;
        dispatch(addAlert({
            description: t("customerDataService:profileAttributes.edit.notifications" +
                ".fetchAttribute.error.description"),
            level: AlertLevels.ERROR,
            message: t("customerDataService:profileAttributes.edit.notifications" +
                ".fetchAttribute.error.message")
        }));
    }, [ error ]);

    const shouldFetchSubAttrs: boolean =
        Boolean(cfg?.supportsSubAttributes) &&
        currentValueType === "complex" &&
        Boolean(attribute?.attribute_name);

    const {
        data: rawSubAttrData,
        isLoading: isLoadingSubAttrs
    } = useSearchSubAttributes(
        scope,
        attribute?.attribute_name ?? "",
        shouldFetchSubAttrs
    );

    const subAttributeOptions: SubAttributeOption[] = useMemo(
        (): SubAttributeOption[] => {
            if (!shouldFetchSubAttrs || isLoadingSubAttrs) return [];
            if (!Array.isArray(rawSubAttrData)) return [];

            return rawSubAttrData.map((a: ProfileSchemaAttribute): SubAttributeOption => ({
                attributeId: a.attribute_id,
                key: a.attribute_id ?? a.attribute_name,
                text: stripScopePrefix(scope, a.attribute_name),
                value: a.attribute_name
            }));
        },
        [ rawSubAttrData, shouldFetchSubAttrs, isLoadingSubAttrs, scope ]
    );

    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ _modalAlert, setModalAlert, modalAlertComponent ] = useConfirmationModalAlert();
    const showDangerZone: boolean = scope === "traits" || scope === "application_data";

    const handleTabChange = (_: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        setModalAlert(null);
    };

    const generateClaimLetter = (attributeName: string): string => {
        const display: string = stripScopePrefix(scope, attributeName);
        const last: string = display?.split(".").pop();

        return last ? last.charAt(0).toUpperCase() : "?";
    };

    const handleUpdate = (values: AttributeFormValues): void => {
        const payload: Partial<ProfileSchemaAttribute> = {
            attribute_name: attribute.attribute_name,
            merge_strategy: values.merge_strategy,
            multi_valued: values.multi_valued,
            mutability: attribute.mutability,
            sub_attributes: currentValueType === "complex" ? subAttributes : [],
            value_type: values.value_type
        };

        setIsUpdating(true);

        updateSchemaAttributeById(scope, id, payload)
            .then((): void => {
                dispatch(addAlert({
                    description: t("customerDataService:profileAttributes.edit.notifications" +
                        ".updateAttribute.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("customerDataService:profileAttributes.edit.notifications" +
                        ".updateAttribute.success.message")
                }));
                mutate();
            })
            .catch((err: any): void => {
                dispatch(addAlert({
                    description: err?.message || t("customerDataService:profileAttributes.edit.notifications" +
                        ".updateAttribute.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("customerDataService:profileAttributes.edit.notifications" +
                        ".updateAttribute.error.message")
                }));
            })
            .finally((): void => setIsUpdating(false));
    };

    const handleDelete = async (): Promise<void> => {
        setIsDeleting(true);

        try {
            await deleteSchemaAttributeById(scope, id);

            dispatch(addAlert({
                description: t("customerDataService:profileAttributes.edit.notifications" +
                    ".deleteAttribute.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:profileAttributes.edit.notifications" +
                    ".deleteAttribute.success.message")
            }));

            history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES"));
        } catch (err: any) {
            setModalAlert({
                description: err?.message || t("customerDataService:profileAttributes.edit.notifications" +
                    ".deleteAttribute.error.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:profileAttributes.edit.notifications" +
                    ".deleteAttribute.error.message")
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleSubAttributeAdd = (selectedAttrName: string): void => {
        const option: SubAttributeOption | undefined = subAttributeOptions.find(
            (opt: SubAttributeOption): boolean => opt.value === selectedAttrName
        );

        if (option && !subAttributes.some(
            (sa: ProfileSchemaSubAttributeRef): boolean => sa.attribute_name === selectedAttrName
        )) {
            setSubAttributes([
                ...subAttributes,
                { attribute_id: option.attributeId, attribute_name: selectedAttrName }
            ]);
        }
    };

    const handleSubAttributeRemove = (attributeId: string): void => {
        setSubAttributes(
            subAttributes.filter(
                (x: ProfileSchemaSubAttributeRef): boolean => x.attribute_id !== attributeId
            )
        );
    };

    // -------------------------------------------------------------------------
    // Render helpers
    // -------------------------------------------------------------------------

    const renderGeneralTab = (): ReactElement | null => {
        if (!attribute) return null;

        return (
            <>
                <EmphasizedSegment padded="very">
                    <Form
                        id={ FORM_ID }
                        uncontrolledForm={ true }
                        onSubmit={ (values: AttributeFormValues) => handleUpdate(values) }
                        initialValues={ {
                            merge_strategy: attribute.merge_strategy,
                            multi_valued: attribute.multi_valued,
                            value_type: attribute.value_type
                        } }
                    >
                        <Grid>

                            { /* ── Identity attributes notice ─────────────────── */ }
                            { scope === "identity_attributes" && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <div style={ {
                                            backgroundColor: "#e8f4fd",
                                            border: "1px solid #bbdefb",
                                            borderRadius: "4px",
                                            padding: "1rem"
                                        } }>
                                            { t("customerDataService:profileAttributes.edit" +
                                                ".identityAttributesNotice") }
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* ── Attribute name (read-only) ──────────────────── */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Attribute name"
                                        inputType="default"
                                        name="attribute_name_display"
                                        label={ t("customerDataService:profileAttributes.edit" +
                                            ".fields.attribute.label") }
                                        value={ stripScopePrefix(scope, attribute.attribute_name) }
                                        readOnly
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        data-componentid={ `${componentId}-attribute-name-input` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit" +
                                            ".fields.attribute.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* ── Application identifier (application_data only) ─ */ }
                            { scope === "application_data" && attribute.application_identifier && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.Input
                                            ariaLabel="Application identifier"
                                            inputType="default"
                                            name="application_identifier_display"
                                            label={ t("customerDataService:profileAttributes.edit" +
                                                ".fields.applicationIdentifier.label") }
                                            value={ attribute.application_identifier }
                                            readOnly
                                            maxLength={ 200 }
                                            minLength={ 3 }
                                            data-componentid={
                                                `${componentId}-application-identifier-input`
                                            }
                                            width={ 16 }
                                        />
                                        <Hint>
                                            { t("customerDataService:profileAttributes.edit" +
                                                ".fields.applicationIdentifier.hint") }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* ── Value type ──────────────────────────────────── */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Dropdown
                                        ariaLabel="Value type"
                                        name="value_type"
                                        label={ t("customerDataService:profileAttributes.edit" +
                                            ".fields.valueType.label") }
                                        value={ attribute.value_type }
                                        required={ false }
                                        disabled={ !cfg.allowValueTypeEdit }
                                        options={ [
                                            {
                                                key: "string",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.valueType.options.text"),
                                                value: "string"
                                            },
                                            {
                                                key: "integer",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.valueType.options.integer"),
                                                value: "integer"
                                            },
                                            {
                                                key: "decimal",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.valueType.options.decimal"),
                                                value: "decimal"
                                            },
                                            {
                                                key: "boolean",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.valueType.options.boolean"),
                                                value: "boolean"
                                            },
                                            {
                                                key: "complex",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.valueType.options.complex"),
                                                value: "complex"
                                            }
                                        ] }
                                        listen={ (value: ValueType): void => {
                                            if (currentValueType === "complex" && value !== "complex") {
                                                setSubAttributes([]);
                                            }
                                            setCurrentValueType(value);
                                        } }
                                        data-componentid={ `${componentId}-value-type-dropdown` }
                                        width={ 16 }
                                    />
                                </Grid.Column>
                            </Grid.Row>

                            { /* ── Merge strategy ──────────────────────────────── */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Dropdown
                                        ariaLabel="Merge strategy"
                                        name="merge_strategy"
                                        label={ t("customerDataService:profileAttributes.edit" +
                                            ".fields.mergeStrategy.label") }
                                        value={ attribute.merge_strategy }
                                        required={ false }
                                        disabled={ !cfg.allowMergeStrategyEdit }
                                        options={ [
                                            {
                                                key: "combine",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.mergeStrategy.options.combine"),
                                                value: "combine"
                                            },
                                            {
                                                key: "overwrite",
                                                text: t("customerDataService:profileAttributes.edit" +
                                                    ".fields.mergeStrategy.options.overwrite"),
                                                value: "overwrite"
                                            }
                                        ] }
                                        data-componentid={ `${componentId}-merge-strategy-dropdown` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit" +
                                            ".fields.mergeStrategy.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* ── Multi valued ────────────────────────────────── */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Checkbox
                                        ariaLabel="Multi valued"
                                        name="multi_valued"
                                        label={ t("customerDataService:profileAttributes.edit" +
                                            ".fields.multiValued.label") }
                                        value={ attribute.multi_valued }
                                        disabled={ !cfg.allowMultiValuedEdit }
                                        data-componentid={ `${componentId}-multi-valued-checkbox` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit" +
                                            ".fields.multiValued.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* ── Sub attributes (complex type only) ─────────── */ }
                            { cfg.supportsSubAttributes && currentValueType === "complex" && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.Dropdown
                                            ariaLabel="Add sub attribute"
                                            name="sub_attribute_picker"
                                            label={ t("customerDataService:profileAttributes.edit" +
                                                ".fields.subAttributes.label") }
                                            placeholder={ t("customerDataService:profileAttributes.edit" +
                                                ".fields.subAttributes.placeholder") }
                                            required={ false }
                                            loading={ isLoadingSubAttrs }
                                            options={ subAttributeOptions }
                                            listen={ (value: string): void => {
                                                if (value) handleSubAttributeAdd(value);
                                            } }
                                            data-componentid={ `${componentId}-sub-attribute-dropdown` }
                                            width={ 16 }
                                        />
                                        <div style={ { marginTop: "1rem" } }>
                                            { subAttributes.map(
                                                (subAttr: ProfileSchemaSubAttributeRef) => (
                                                    <div
                                                        key={ subAttr.attribute_id }
                                                        style={ {
                                                            alignItems: "center",
                                                            display: "flex",
                                                            marginBottom: "0.5rem"
                                                        } }
                                                    >
                                                        <span>
                                                            { stripScopePrefix(
                                                                scope, subAttr.attribute_name
                                                            ) }
                                                        </span>
                                                        <IconButton
                                                            onClick={ () =>
                                                                handleSubAttributeRemove(
                                                                    subAttr.attribute_id
                                                                )
                                                            }
                                                            style={ { marginLeft: "auto" } }
                                                        >
                                                            <TrashIcon />
                                                        </IconButton>
                                                    </div>
                                                )
                                            ) }
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* ── Submit button ───────────────────────────────── */ }
                            { scope !== "identity_attributes" && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.Button
                                            form={ FORM_ID }
                                            size="small"
                                            buttonType="primary_btn"
                                            ariaLabel="Update button"
                                            name="update-button"
                                            label={ t("common:update") }
                                            loading={ isUpdating }
                                            disabled={ isUpdating }
                                            data-componentid={ `${componentId}-update-button` }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                        </Grid>
                    </Form>
                </EmphasizedSegment>

                { showDangerZone && (
                    <DangerZoneGroup
                        sectionHeader={ t("customerDataService:common.dangerZone.header") }
                    >
                        <DangerZone
                            actionTitle={ t("customerDataService:profileAttributes.edit" +
                                ".dangerZone.delete.actionTitle") }
                            header={ t("customerDataService:profileAttributes.edit" +
                                ".dangerZone.delete.header") }
                            subheader={ t("customerDataService:profileAttributes.edit" +
                                ".dangerZone.delete.subheader") }
                            onActionClick={ () => {
                                setModalAlert(null);
                                setShowDeleteModal(true);
                            } }
                            isButtonDisabled={ isDeleting }
                        />
                    </DangerZoneGroup>
                ) }
            </>
        );
    };

    const panes: ResourceTabPaneInterface[] = useMemo(
        () => [
            {
                componentId: "general",
                menuItem: t("customerDataService:profileAttributes.edit.tabs.general"),
                render: renderGeneralTab
            }
        ],
        [
            attribute, subAttributes, subAttributeOptions,
            isUpdating, isDeleting, isLoadingSubAttrs, currentValueType
        ]
    );

    const title: string = attribute?.attribute_name
        ? stripScopePrefix(scope, attribute.attribute_name)
        : t("customerDataService:profileAttributes.edit.page.pageTitle");

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    return (
        <>
            <TabPageLayout
                isLoading={ isLoading }
                image={ (
                    <Image floated="left" verticalAlign="middle" rounded centered size="tiny">
                        <AnimatedAvatar />
                        <span className="claims-letter">
                            { attribute ? generateClaimLetter(attribute.attribute_name) : "?" }
                        </span>
                    </Image>
                ) }
                title={ title }
                pageTitle={ t("customerDataService:profileAttributes.edit.page.pageTitle") }
                description={ `Edit ${cfg?.label} Attribute` }
                backButton={ {
                    onClick: (): void => history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")),
                    text: t("customerDataService:profileAttributes.edit.page.backButton")
                } }
                data-componentid={ componentId }
                titleTextAlign="left"
            >
                { modalAlertComponent }
                <ResourceTab
                    panes={ panes }
                    activeIndex={ activeTabIndex }
                    onTabChange={ handleTabChange }
                />
            </TabPageLayout>

            { showDangerZone && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ () => {
                        setShowDeleteModal(false);
                        setModalAlert(null);
                    } }
                    type="negative"
                    open={ showDeleteModal }
                    assertionHint={ t("customerDataService:profileAttributes.edit" +
                        ".confirmations.deleteAttribute.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("customerDataService:common.buttons.confirm") }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ () => {
                        setShowDeleteModal(false);
                        setModalAlert(null);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                    >
                        { t("customerDataService:profileAttributes.edit.confirmations.deleteAttribute.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        attached
                        negative
                    >
                        { t("customerDataService:profileAttributes.edit.confirmations.deleteAttribute.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t(
                            "customerDataService:profileAttributes.edit.confirmations.deleteAttribute.content",
                            { attributeName: stripScopePrefix(scope, attribute?.attribute_name) }
                        ) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ProfileAttributeEditPage;
