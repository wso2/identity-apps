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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { DynamicField, KeyValue } from "@wso2is/forms";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint,
    ResourceTab,
    ResourceTabPaneInterface,
    TabPageLayout,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Grid, Icon, Image, Label, Message, TabProps } from "semantic-ui-react";
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

type Mutability = "readWrite" | "readOnly" | "immutable" | "writeOnce";

interface CanonicalValues {
    label: string;
    value: string;
}

interface AttributeFormValues {
    display_name: string;
    value_type: ValueType;
    merge_strategy: MergeStrategy;
    multi_valued: boolean;
    mutability: Mutability;
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
    const cfg: typeof SCOPE_CONFIG[keyof typeof SCOPE_CONFIG] = SCOPE_CONFIG[scope];

    const {
        data: fetchedAttribute,
        isLoading,
        error,
        mutate
    } = useSchemaAttributeById(scope, id);

    const [ attribute, setAttribute ] = useState<ProfileSchemaAttribute>(null);
    const [ subAttributes, setSubAttributes ] = useState<ProfileSchemaSubAttributeRef[]>([]);
    const [ currentValueType, setCurrentValueType ] = useState<ValueType>(null);

    // Canonical values editor
    const [ canonicalValues, setCanonicalValues ] = useState<CanonicalValues[]>([]);

    useEffect((): void => {
        if (!fetchedAttribute) return;

        setAttribute(fetchedAttribute);
        setSubAttributes(fetchedAttribute?.sub_attributes ?? []);
        setCurrentValueType(fetchedAttribute?.value_type ?? null);
        setCanonicalValues((fetchedAttribute?.canonical_values as CanonicalValues[]) ?? []);
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

            const selectedIds: Set<string> =
            new Set(subAttributes.map((sa: ProfileSchemaSubAttributeRef) => sa.attribute_id));

            return rawSubAttrData
                .filter((a: ProfileSchemaAttribute) => !selectedIds.has(a.attribute_id))
                .map((a: ProfileSchemaAttribute): SubAttributeOption => ({
                    attributeId: a.attribute_id,
                    key: a.attribute_id ?? a.attribute_name,
                    text: stripScopePrefix(scope, a.attribute_name),
                    value: a.attribute_name
                }));
        },
        [ rawSubAttrData, shouldFetchSubAttrs, isLoadingSubAttrs, scope, subAttributes ]
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
        const isComplex: boolean = currentValueType === "complex";
        const isIdentityScope: boolean = scope === "identity_attributes";

        if (isComplex && subAttributes.length === 0) {
            dispatch(addAlert({
                description: t("customerDataService:profileAttributes.edit.fields.subAttributes.validationError")
                    || "[CDS-13001] A complex attribute must have at least one sub-attribute.",
                level: AlertLevels.ERROR,
                message: t("customerDataService:profileAttributes.edit.fields.subAttributes.validationErrorMessage")
                    || "Sub-attribute required"
            }));

            return;
        }

        const payload: Partial<ProfileSchemaAttribute> = {
            attribute_name: attribute.attribute_name,
            canonical_values: canonicalValues as CanonicalValues[],
            ...(values.display_name ? { display_name: values.display_name } : {}),
            merge_strategy: values.merge_strategy,
            multi_valued: Boolean(values.multi_valued),
            mutability: isIdentityScope ? attribute.mutability : values.mutability,
            sub_attributes: isComplex ? subAttributes : [],
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

                // Revalidate so SWR fetches fresh server data. The server is the source of
                // truth for canonical_values — its response is what the useEffect re-seeds from.
                mutate();
            })
            .catch((err: AxiosError): void => {
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
        } catch (err: unknown) {
            const axiosErr: AxiosError = err as AxiosError;

            setModalAlert({
                description: axiosErr?.message || t("customerDataService:profileAttributes.edit.notifications" +
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

    const mutabilityOptions: Array<{ value: Mutability; label: string;}> = useMemo(
        () => [
            {
                label: t("customerDataService:profileAttributes.create."+
                    "forms.typeConfig.fields.mutability.options.readWrite.label"),
                value: "readWrite" as Mutability
            },
            {
                label: t("customerDataService:profileAttributes.create."+
                    "forms.typeConfig.fields.mutability.options.readOnly.label"),
                value: "readOnly" as Mutability
            },
            {
                label: t("customerDataService:profileAttributes.create."+
                    "forms.typeConfig.fields.mutability.options.immutable.label"),
                value: "immutable" as Mutability
            },
            {
                label: t("customerDataService:profileAttributes.create."+
                    "forms.typeConfig.fields.mutability.options.writeOnce.label"),
                value: "writeOnce" as Mutability
            }
        ],
        [ t ]
    );
    const renderGeneralTab = (): ReactElement | null => {
        if (!attribute) return null;

        const isIdentityScope: boolean = scope === "identity_attributes";

        const showCanonicalEditor: boolean =
            canonicalValues.length > 0 ||
            (!isIdentityScope && currentValueType === "string");

        // identity_attributes may see existing canonical values, but cannot edit them
        const isCanonicalReadOnly: boolean = isIdentityScope;

        return (
            <>
                <EmphasizedSegment padded="very">
                    <Form
                        id={ FORM_ID }
                        key={
                            `${attribute?.attribute_id}-${attribute?.value_type}`
                            + `-${attribute?.merge_strategy}-${attribute?.multi_valued}`
                            + `-${attribute?.mutability}`
                        }
                        uncontrolledForm={ true }
                        onSubmit={ (values: AttributeFormValues) => handleUpdate(values) }
                        initialValues={ {
                            display_name: attribute.display_name ?? "",
                            merge_strategy: attribute.merge_strategy,
                            multi_valued: Boolean(attribute.multi_valued),
                            mutability: (attribute.mutability as Mutability) ?? "readWrite",
                            value_type: attribute.value_type
                        } }
                    >
                        <Grid>

                            { isIdentityScope && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Message className="display-flex" size="small" info>
                                            <Icon name="info circle" />
                                            <Message.Content className="tiny">
                                                { t("customerDataService:profileAttributes.edit."+
                                                "identityAttributesNotice") }
                                            </Message.Content>
                                        </Message>
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* Attribute name */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Attribute name"
                                        inputType="default"
                                        name="attribute_name_display"
                                        label={ t("customerDataService:profileAttributes.edit.fields.attribute.label") }
                                        value={ stripScopePrefix(scope, attribute.attribute_name) }
                                        readOnly
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        data-componentid={ `${componentId}-attribute-name-input` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit.fields.attribute.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* Display name */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Display name"
                                        inputType="default"
                                        name="display_name"
                                        label={ t("customerDataService:profileAttributes.edit.fields.displayName.label") }
                                        placeholder={ t("customerDataService:profileAttributes.edit." +
                                            "fields.displayName.placeholder") }
                                        readOnly={ isIdentityScope }
                                        maxLength={ 200 }
                                        minLength={ 0 }
                                        data-componentid={ `${componentId}-display-name-input` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit.fields.displayName.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* Mutability */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    { isIdentityScope ? (
                                        <>
                                            <Field.Input
                                                ariaLabel="Mutability"
                                                inputType="default"
                                                name="mutability_display"
                                                label={
                                                    t("customerDataService:profileAttributes.edit."+
                                                        "fields.mutability.label")
                                                }
                                                value={
                                                    mutabilityOptions.find(
                                                        (opt: { value: Mutability; label: string }): boolean =>
                                                            opt.value === (attribute.mutability as Mutability)
                                                    )?.label
                                                    ?? (attribute.mutability as Mutability)
                                                    ?? "readWrite"
                                                }
                                                readOnly
                                                data-componentid={ `${componentId}-mutability-input` }
                                                width={ 16 }
                                                minLength={ 3 }
                                                maxLength={ 200 }
                                            />
                                            <Hint>
                                                { t("customerDataService:profileAttributes.edit."+
                                                "fields.mutability.hint") }
                                            </Hint>
                                        </>
                                    ) : (
                                        <>
                                            <Field.Dropdown
                                                ariaLabel="Mutability"
                                                name="mutability"
                                                label={
                                                    t("customerDataService:profileAttributes.edit."+
                                                        "fields.mutability.label")
                                                }
                                                value={ (attribute.mutability as Mutability) ?? "readWrite" }
                                                required={ false }
                                                options={ mutabilityOptions.map(
                                                    ({ value, label }: { value: Mutability; label: string }) => ({
                                                        key: value,
                                                        text: label,
                                                        value
                                                    })) }
                                                data-componentid={ `${componentId}-mutability-dropdown` }
                                                width={ 16 }
                                            />
                                            <Hint>
                                                { t("customerDataService:profileAttributes.edit."+
                                                    "fields.mutability.hint") }
                                            </Hint>
                                        </>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>

                            { /* Application identifier (application_data only) */ }
                            { scope === "application_data" && attribute.application_identifier && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.Input
                                            ariaLabel="Application identifier"
                                            inputType="default"
                                            name="application_identifier_display"
                                            label={ t("customerDataService:profileAttributes.edit."+
                                                "fields.applicationIdentifier.label") }
                                            value={ attribute.application_identifier }
                                            readOnly
                                            maxLength={ 200 }
                                            minLength={ 3 }
                                            data-componentid={ `${componentId}-application-identifier-input` }
                                            width={ 16 }
                                        />
                                        <Hint>
                                            { t("customerDataService:profileAttributes.edit."+
                                            "fields.applicationIdentifier.hint") }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* Value type */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Dropdown
                                        ariaLabel="Value type"
                                        name="value_type"
                                        label={ t("customerDataService:profileAttributes.edit.fields.valueType.label") }
                                        value={ attribute.value_type }
                                        required={ false }
                                        disabled={ !cfg.allowValueTypeEdit }
                                        options={ [
                                            { key: "string", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.text"), value: "string" },
                                            { key: "integer", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.integer"), value: "integer" },
                                            { key: "decimal", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.decimal"), value: "decimal" },
                                            { key: "boolean", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.boolean"), value: "boolean" },
                                            { key: "epoch", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.epoch"), value: "epoch" },
                                            { key: "date time", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.dateTime"), value: "date_time" },
                                            { key: "date", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.date"), value: "date" },
                                            { key: "object", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.valueType.options.complex"), value: "complex" }
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

                            { /* Canonical values editor  - identity_attributes: read-only view of existing values only
                              */ }
                            { showCanonicalEditor && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Hint>
                                            { t("customerDataService:profileAttributes.create."+
                                            "forms.advancedSettings.fields.canonicalValues.hint") }
                                        </Hint>

                                        <DynamicField
                                            data={ canonicalValues.map(
                                                (cv: CanonicalValues): KeyValue => ({
                                                    key: cv.label,
                                                    value: cv.value
                                                })
                                            ) }
                                            keyType="text"
                                            keyName={ t("customerDataService:profileAttributes.create."+
                                                "forms.advancedSettings.fields.canonicalValues.labelField") }
                                            valueName={ t("customerDataService:profileAttributes.create."+
                                                "forms.advancedSettings.fields.canonicalValues.valueField") }
                                            keyRequiredMessage={ t("customerDataService:profileAttributes.create."+
                                                "forms.advancedSettings.fields.canonicalValues.validations.empty") }
                                            valueRequiredErrorMessage={ t("customerDataService:profileAttributes."+
                                                "create.forms.advancedSettings.fields.canonicalValues."+
                                                "validations.empty") }
                                            requiredField={ true }
                                            listen={ (data: KeyValue[]): void => {
                                                setCanonicalValues(
                                                    data.map((item: KeyValue): CanonicalValues => ({
                                                        label: item.key,
                                                        value: item.value
                                                    }))
                                                );
                                            } }
                                            readOnly={ isCanonicalReadOnly }
                                            data-componentid={ `${componentId}-canonical-values-dynamic-field` }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* Sub attributes (complex type only) */ }
                            { cfg.supportsSubAttributes && currentValueType === "complex" && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.Dropdown
                                            ariaLabel="Add sub attribute"
                                            name="sub_attribute_picker"
                                            label={ t("customerDataService:profileAttributes.edit."+
                                                "fields.subAttributes.label") }
                                            placeholder={ t("customerDataService:profileAttributes.edit."+
                                                "fields.subAttributes.placeholder") }
                                            required={ subAttributes.length === 0 }
                                            loading={ isLoadingSubAttrs }
                                            disabled={ !isLoadingSubAttrs && subAttributeOptions.length === 0 }
                                            options={ subAttributeOptions }
                                            search
                                            onChange={ (
                                                event: React.SyntheticEvent<HTMLElement, Event>,
                                                data: { value: string }
                                            ): void => {
                                                // Guard against keyboard navigation triggering an add
                                                if (event.type === "click") {
                                                    handleSubAttributeAdd(data.value);
                                                }
                                            } }
                                            data-componentid={ `${componentId}-sub-attribute-dropdown` }
                                            width={ 16 }
                                        />

                                        { !isLoadingSubAttrs && subAttributeOptions.length === 0 &&
                                        subAttributes.length === 0
                                            ? (
                                                <Message info size="small" className="display-flex">
                                                    <Icon name="info circle" />
                                                    <Message.Content className="tiny">
                                                        { t("customerDataService:profileAttributes.edit."+
                                                        "fields.subAttributes.empty") }
                                                    </Message.Content>
                                                </Message>
                                            ) : !isLoadingSubAttrs && subAttributeOptions.length === 0 &&
                                            subAttributes.length > 0
                                                ? (
                                                    <Message info size="small" className="display-flex">
                                                        <Icon name="info circle" />
                                                        <Message.Content className="tiny">
                                                            { t("customerDataService:profileAttributes.edit."+
                                                            "fields.subAttributes.allAdded") }
                                                        </Message.Content>
                                                    </Message>
                                                ) : (
                                                    <Hint>
                                                        { t("customerDataService:profileAttributes.edit."+
                                                        "fields.subAttributes.hint") }
                                                    </Hint>
                                                )
                                        }

                                        { subAttributes.length > 0 && (
                                            <Box sx={ { marginTop: "1rem" } }>
                                                { subAttributes.map((subAttr: ProfileSchemaSubAttributeRef) => (
                                                    <Box
                                                        key={ subAttr.attribute_id }
                                                        sx={ {
                                                            alignItems: "center",
                                                            display: "flex",
                                                            padding: "0.25rem 0"
                                                        } }
                                                    >
                                                        <Box component="span" sx={ { fontSize: "0.875rem" } }>
                                                            { stripScopePrefix(scope, subAttr.attribute_name) }
                                                        </Box>
                                                        <IconButton
                                                            sx={ { marginLeft: "auto" } }
                                                            size="small"
                                                            onClick={ (): void =>
                                                                handleSubAttributeRemove(subAttr.attribute_id)
                                                            }
                                                            data-componentid={
                                                                // eslint-disable-next-line max-len
                                                                `${componentId}-delete-sub-attribute-${subAttr.attribute_id}`
                                                            }
                                                        >
                                                            <TrashIcon />
                                                        </IconButton>
                                                    </Box>
                                                )) }
                                            </Box>
                                        ) }
                                    </Grid.Column>
                                </Grid.Row>
                            ) }

                            { /* Merge strategy */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Dropdown
                                        ariaLabel="Merge strategy"
                                        name="merge_strategy"
                                        label={ t("customerDataService:profileAttributes.edit."+
                                            "fields.mergeStrategy.label") }
                                        value={ attribute.merge_strategy }
                                        required={ false }
                                        disabled={ !cfg.allowMergeStrategyEdit }
                                        options={ [
                                            { key: "combine", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.mergeStrategy.options.combine"), value: "combine" },
                                            { key: "overwrite", text: t("customerDataService:profileAttributes.edit."+
                                                "fields.mergeStrategy.options.overwrite"), value: "overwrite" }
                                        ] }
                                        data-componentid={ `${componentId}-merge-strategy-dropdown` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit.fields.mergeStrategy.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* Multi valued */ }
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Checkbox
                                        ariaLabel="Multi valued"
                                        name="multi_valued"
                                        label={ t("customerDataService:profileAttributes.edit."+
                                            "fields.multiValued.label") }
                                        disabled={ !cfg.allowMultiValuedEdit }
                                        data-componentid={ `${componentId}-multi-valued-checkbox` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:profileAttributes.edit.fields.multiValued.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { /* Submit */ }
                            { !isIdentityScope && (
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
                    <DangerZoneGroup sectionHeader={ t("customerDataService:common.dangerZone.header") }>
                        <DangerZone
                            actionTitle={ t("customerDataService:profileAttributes.edit."+
                                "dangerZone.delete.actionTitle") }
                            header={ t("customerDataService:profileAttributes.edit.dangerZone.delete.header") }
                            subheader={ t("customerDataService:profileAttributes.edit.dangerZone.delete.subheader") }
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
            attribute,
            subAttributes,
            subAttributeOptions,
            canonicalValues,
            isUpdating,
            isDeleting,
            isLoadingSubAttrs,
            currentValueType
        ]
    );

    const title: string = attribute?.attribute_name
        ? stripScopePrefix(scope, attribute.attribute_name)
        : t("customerDataService:profileAttributes.edit.page.pageTitle");

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
                description={
                    cfg?.label
                        ? (
                            <div className="with-label ellipsis">
                                <Label size="small">{ cfg.label }</Label>
                            </div>
                        )
                        : null
                }
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
                    assertionHint={ t("customerDataService:profileAttributes.edit."+
                        "confirmations.deleteAttribute.assertionHint") }
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
                    <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
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
                        <Trans
                            i18nKey="customerDataService:profileAttributes.edit.confirmations.deleteAttribute.content"
                            values={ { attributeName: stripScopePrefix(scope, attribute?.attribute_name) } }
                            components={ [ null, <strong key="0" /> ] }
                        />
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ProfileAttributeEditPage;
