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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Step from "@oxygen-ui/react/Step";
import StepContent from "@oxygen-ui/react/StepContent";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DynamicField, KeyValue } from "@wso2is/forms";
import { EmphasizedSegment, Hint, PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Message } from "semantic-ui-react";
import { createSchemaAttributes, fetchProfileSchemaByScope } from "../api/profile-attributes";
import { APPLICATION_DATA, TRAITS } from "../models/constants";
import type { SchemaListingScope } from "../models/profile-attribute-listing";
import type {
    MergeStrategy,
    Mutability,
    ProfileSchemaAttribute,
    ProfileSchemaScope,
    ProfileSchemaSubAttributeRef,
    ValueType
} from "../models/profile-attributes";
import { stripScopePrefix } from "../utils/profile-attribute-utils";

// Minimal local interface covering only the fields consumed in this file.
interface AppListItemInterface {
    name: string;
    clientId?: string;
    issuer?: string;
}

const StepActionsContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2)
}));

type ScopeValue = ProfileSchemaScope;

interface CanonicalValueInterface {
    label: string;
    value: string;
}

// attributeId added to match edit page's SubAttributeOption pattern
interface DropdownOptionInterface {
    key: string;
    text: string;
    value: string;
    attributeId: string;
}

interface StepFormRefInterface {
    triggerSubmit: () => void;
}

interface ApplicationIdentifierOptionInterface {
    label: string;
    value: string;
}

interface AttributeGeneralFormValuesInterface {
    scope: ScopeValue;
    applicationIdentifier: string;
    name: string;
    displayName: string;
}

interface TypeAndAdvancedFormValuesInterface {
    valueType: ValueType;
    mutability: Mutability;
    multiValued: boolean;
    mergeStrategy: MergeStrategy;
    subAttributes?: ProfileSchemaSubAttributeRef[];
    canonicalValues?: CanonicalValueInterface[];
}

interface AttributeCreateFormDataInterface {
    attributeGeneral?: AttributeGeneralFormValuesInterface;
    typeAndAdvanced?: TypeAndAdvancedFormValuesInterface;
}

interface AttributeGeneralFormPropsInterface {
    initialValues: Partial<AttributeGeneralFormValuesInterface>;
    onSubmit: (values: AttributeGeneralFormValuesInterface) => void;
    "data-componentid"?: string;
}

const AttributeGeneralForm: React.ForwardRefExoticComponent<
    AttributeGeneralFormPropsInterface & React.RefAttributes<StepFormRefInterface>
> = forwardRef<StepFormRefInterface, AttributeGeneralFormPropsInterface>(
    (props: AttributeGeneralFormPropsInterface, ref: React.ForwardedRef<StepFormRefInterface>): ReactElement => {
        const {
            initialValues,
            onSubmit,
            "data-componentid": componentId = "attribute-general-form"
        } = props;

        const { t } = useTranslation();

        const [ scope, setScope ] = useState<ScopeValue>(
            initialValues?.scope ?? (TRAITS as ProfileSchemaScope)
        );
        const [ applicationIdentifier, setApplicationIdentifier ] = useState<string>(
            initialValues?.applicationIdentifier ?? ""
        );
        const [ name, setName ] = useState<string>(initialValues?.name ?? "");
        const [ displayName, setDisplayName ] = useState<string>(initialValues?.displayName ?? "");
        const [ nameError, setNameError ] = useState<string>("");
        const [ appIdError, setAppIdError ] = useState<string>("");
        const [ isCheckingName, setIsCheckingName ] = useState<boolean>(false);
        const [ isNameAvailable, setIsNameAvailable ] = useState<boolean | null>(
            initialValues?.name ? true : null
        );
        const [ appIdentifierOptions, setAppIdentifierOptions ] =
            useState<ApplicationIdentifierOptionInterface[]>([]);

        const debounceTimer: React.MutableRefObject<ReturnType<typeof setTimeout> | null> =
            useRef<ReturnType<typeof setTimeout> | null>(null);

        const shouldFetchApplications: boolean = scope === APPLICATION_DATA;

        const {
            data: applicationListData,
            isLoading: isLoadingAppIds
        } = useApplicationList(
            "advancedConfigurations,templateId,clientId,issuer",
            null,
            null,
            null,
            shouldFetchApplications,
            true
        );

        const scopeOptions: { value: ScopeValue; label: string }[] = useMemo(() => [
            {
                label: t("customerDataService:profileAttributes.create." +
                    "forms.attributeGeneral.fields.scope.options.traits"),
                value: TRAITS as ScopeValue
            },
            {
                label: t("customerDataService:profileAttributes.create." +
                    "forms.attributeGeneral.fields.scope.options.applicationData"),
                value: APPLICATION_DATA as ScopeValue
            }
        ], [ t ]);

        const fullAttributeName: string = useMemo((): string => {
            if (!name.trim()) return "";
            if (scope === APPLICATION_DATA) {
                if (!applicationIdentifier.trim()) return "";

                return `${APPLICATION_DATA}.${applicationIdentifier.trim()}.${name.trim()}`;
            }

            return `${scope}.${name.trim()}`;
        }, [ scope, applicationIdentifier, name ]);

        useEffect((): void => {
            if (scope !== APPLICATION_DATA) {
                setAppIdentifierOptions([]);

                return;
            }

            if (!(applicationListData as { applications?: AppListItemInterface[] })?.applications) {
                return;
            }

            const appList: { applications?: AppListItemInterface[] } =
                applicationListData as { applications?: AppListItemInterface[] };
            const options: ApplicationIdentifierOptionInterface[] = (appList.applications ?? [])
                .map((app: AppListItemInterface): ApplicationIdentifierOptionInterface | null => {
                    const id: string = app.clientId || app.issuer || "";

                    if (!id) return null;

                    return { label: id, value: id };
                })
                .filter(
                    (opt: ApplicationIdentifierOptionInterface | null):
                        opt is ApplicationIdentifierOptionInterface => opt !== null
                );

            setAppIdentifierOptions(options);
        }, [ scope, applicationListData ]);

        useEffect((): (() => void) => {
            setIsNameAvailable(null);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            if (!fullAttributeName) {
                return (): void => undefined;
            }

            debounceTimer.current = setTimeout((): void => {
                setIsCheckingName(true);
                fetchProfileSchemaByScope(
                    scope,
                    `attribute_name eq ${fullAttributeName}`
                )
                    .then((list: ProfileSchemaAttribute[]): void => {
                        setIsNameAvailable(list.length === 0);
                    })
                    .catch((): void => setIsNameAvailable(null))
                    .finally((): void => setIsCheckingName(false));
            }, 400);

            return (): void => clearTimeout(debounceTimer.current);
        }, [ fullAttributeName, scope ]);

        const handleScopeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            setScope(e.target.value as ScopeValue);
            setApplicationIdentifier("");
            setName("");
            setNameError("");
            setAppIdError("");
            setIsNameAvailable(null);
        };

        const handleApplicationIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            setApplicationIdentifier(e.target.value);
            setAppIdError("");
            setName("");
            setIsNameAvailable(null);
        };

        const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
            setName(e.target.value);
            setNameError("");
            setIsNameAvailable(null);
        };

        const handleSubmit: () => void = (): void => {
            if (scope === APPLICATION_DATA && !applicationIdentifier.trim()) {
                setAppIdError(
                    t("customerDataService:profileAttributes.create." +
                        "forms.attributeGeneral.fields.applicationIdentifier.validations.empty")
                );

                return;
            }

            if (!name.trim()) {
                setNameError(
                    t("customerDataService:profileAttributes.create." +
                        "forms.attributeGeneral.fields.name.validations.empty")
                );

                return;
            }

            if (isNameAvailable === false) {
                setNameError(
                    t("customerDataService:profileAttributes.create." +
                        "forms.attributeGeneral.fields.name.validations.exists")
                );

                return;
            }

            setNameError("");
            setAppIdError("");
            onSubmit({
                applicationIdentifier: applicationIdentifier.trim(),
                displayName: displayName.trim(),
                name: name.trim(),
                scope
            });
        };

        useImperativeHandle(ref, () => ({ triggerSubmit: handleSubmit }));

        return (
            <Grid container spacing={ 2 } data-componentid={ componentId }>
                <Grid xs={ 12 }>
                    <Typography variant="body2" sx={ { mb: 0.75 } }>
                        { t("customerDataService:profileAttributes.create." +
                            "forms.attributeGeneral.fields.attribute.label") }{ " " }
                        <Box component="span" sx={ { color: "error.main" } }>*</Box>
                    </Typography>

                    <Box sx={ { display: "flex", gap: 1.5, width: "100%" } }>

                        <Box sx={ { flex: "0 0 160px" } }>
                            <TextField
                                select
                                value={ scope }
                                onChange={ handleScopeChange }
                                fullWidth
                                inputProps={ {
                                    "aria-label": t(
                                        "customerDataService:profileAttributes.create." +
                                        "forms.attributeGeneral.fields.scope.ariaLabel"
                                    )
                                } }
                                data-componentid={ `${componentId}-scope` }
                            >
                                { scopeOptions.map((opt: { value: ScopeValue; label: string }) => (
                                    <MenuItem key={ opt.value } value={ opt.value }>
                                        { opt.label }
                                    </MenuItem>
                                )) }
                            </TextField>
                        </Box>

                        { scope === APPLICATION_DATA && (
                            <Box sx={ { flex: "0 0 220px", minWidth: 180 } }>
                                <TextField
                                    select
                                    required
                                    value={ applicationIdentifier }
                                    onChange={ handleApplicationIdentifierChange }
                                    error={ Boolean(appIdError) }
                                    helperText={ appIdError || " " }
                                    disabled={ isLoadingAppIds }
                                    fullWidth
                                    placeholder={ t(
                                        "customerDataService:profileAttributes.create." +
                                        "forms.attributeGeneral.fields.applicationIdentifier.placeholder"
                                    ) }
                                    InputProps={ {
                                        endAdornment: isLoadingAppIds ? (
                                            <InputAdornment position="end">
                                                <CircularProgress size={ 16 } />
                                            </InputAdornment>
                                        ) : null
                                    } }
                                    data-componentid={ `${componentId}-app-identifier` }
                                >
                                    { isLoadingAppIds ? (
                                        <MenuItem value="" disabled>
                                            { t("customerDataService:profileAttributes.create." +
                                                "forms.attributeGeneral.fields.applicationIdentifier.loading") }
                                        </MenuItem>
                                    ) : appIdentifierOptions.length === 0 ? (
                                        <MenuItem value="" disabled>
                                            { t("customerDataService:profileAttributes.create." +
                                                "forms.attributeGeneral.fields.applicationIdentifier.noOptions") }
                                        </MenuItem>
                                    ) : (
                                        appIdentifierOptions.map((opt: ApplicationIdentifierOptionInterface) => (
                                            <MenuItem key={ opt.value } value={ opt.value }>
                                                { opt.label }
                                            </MenuItem>
                                        ))
                                    ) }
                                </TextField>
                            </Box>
                        ) }

                        <Box sx={ { flex: "1 1 auto", minWidth: 0 } }>
                            <TextField
                                required
                                value={ name }
                                onChange={ handleNameChange }
                                error={ Boolean(nameError) || isNameAvailable === false }
                                helperText={
                                    nameError
                                        ? nameError
                                        : isNameAvailable === false
                                            ? t(
                                                "customerDataService:profileAttributes.create." +
                                                "forms.attributeGeneral.fields.name.validations.exists"
                                            )
                                            : " "
                                }
                                placeholder={ t(
                                    "customerDataService:profileAttributes.create." +
                                    "forms.attributeGeneral.fields.name.placeholder"
                                ) }
                                disabled={ scope === APPLICATION_DATA && !applicationIdentifier.trim() }
                                fullWidth
                                InputProps={ {
                                    endAdornment: isCheckingName ? (
                                        <InputAdornment position="end">
                                            <CircularProgress size={ 16 } />
                                        </InputAdornment>
                                    ) : null
                                } }
                                data-componentid={ `${componentId}-name-field` }
                            />
                        </Box>
                    </Box>
                </Grid>

                <Grid xs={ 12 }>
                    <TextField
                        label={ t("customerDataService:profileAttributes.create." +
                            "forms.attributeGeneral.fields.displayName.label") }
                        value={ displayName }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                            setDisplayName(e.target.value)
                        }
                        placeholder={ t("customerDataService:profileAttributes.create." +
                            "forms.attributeGeneral.fields.displayName.placeholder") }
                        fullWidth
                        data-componentid={ `${componentId}-display-name-field` }
                    />
                    <Hint>
                        { t("customerDataService:profileAttributes.create." +
                            "forms.attributeGeneral.fields.displayName.hint") }
                    </Hint>
                </Grid>
            </Grid>
        );
    }
);

AttributeGeneralForm.displayName = "AttributeGeneralForm";

interface TypeAndAdvancedFormPropsInterface {
    initialValues: Partial<TypeAndAdvancedFormValuesInterface>;
    scope: ProfileSchemaScope;
    attributeNamePrefix: string;
    onSubmit: (values: TypeAndAdvancedFormValuesInterface) => void;
    "data-componentid"?: string;
}

const TypeAndAdvancedForm: React.ForwardRefExoticComponent<
    TypeAndAdvancedFormPropsInterface & React.RefAttributes<StepFormRefInterface>
> = forwardRef<StepFormRefInterface, TypeAndAdvancedFormPropsInterface>(
    (props: TypeAndAdvancedFormPropsInterface, ref: React.ForwardedRef<StepFormRefInterface>): ReactElement => {
        const {
            initialValues,
            scope,
            attributeNamePrefix,
            onSubmit,
            "data-componentid": componentId = "attribute-type-advanced-form"
        } = props;

        const { t } = useTranslation();

        const [ valueType, setValueType ] = useState<ValueType>(
            initialValues?.valueType ?? "string"
        );
        const [ mutability, setMutability ] = useState<Mutability>(
            initialValues?.mutability ?? "readWrite"
        );
        const [ multiValued, setMultiValued ] = useState<boolean>(
            initialValues?.multiValued ?? false
        );
        const [ mergeStrategy, setMergeStrategy ] = useState<MergeStrategy>(
            initialValues?.mergeStrategy ?? "overwrite"
        );
        const [ subAttributes, setSubAttributes ] = useState<ProfileSchemaSubAttributeRef[]>(
            initialValues?.subAttributes ?? []
        );
        const [ subAttributeOptions, setSubAttributeOptions ] = useState<DropdownOptionInterface[]>([]);
        const [ isLoadingSubAttrs, setIsLoadingSubAttrs ] = useState<boolean>(false);
        const [ canonicalValues, setCanonicalValues ] = useState<CanonicalValueInterface[]>(
            initialValues?.canonicalValues ?? []
        );

        const valueTypeOptions: Array<{ value: ValueType; label: string }> = useMemo(
            () => [
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.string.label"),
                    value: "string" as ValueType
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.integer.label"),
                    value: "integer" as ValueType
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.boolean.label"),
                    value: "boolean" as ValueType
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.date.label"),
                    value: "date" as ValueType
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.date_time.label"),
                    value: "date_time" as ValueType
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.epoch.label"),
                    value: "epoch" as ValueType
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.typeConfig.fields.valueType.options.complex.label"),
                    value: "complex" as ValueType
                }
            ],
            [ t ]
        );

        const mutabilityOptions: Array<{ value: Mutability; label: string }> = useMemo(
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

        const mergeStrategyOptions: Array<{ value: MergeStrategy; label: string }> = useMemo(
            () => [
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.advancedSettings.fields.mergeStrategy.options.overwrite.label"),
                    value: "overwrite" as MergeStrategy
                },
                {
                    label: t("customerDataService:profileAttributes.create."+
                        "forms.advancedSettings.fields.mergeStrategy.options.combine.label"),
                    value: "combine" as MergeStrategy
                }
            ],
            [ t ]
        );

        useEffect((): void => {
            if (valueType !== "complex" || !attributeNamePrefix.trim()) {
                setSubAttributeOptions([]);

                return;
            }

            setIsLoadingSubAttrs(true);
            fetchProfileSchemaByScope(
                scope,
                `attribute_name co ${scope}.${attributeNamePrefix.trim()}.`
            )
                .then((data: ProfileSchemaAttribute[]): void => {
                    setSubAttributeOptions(
                        data.map(
                            (attr: ProfileSchemaAttribute): DropdownOptionInterface => ({
                                attributeId: attr.attribute_id,
                                key: attr.attribute_id ?? attr.attribute_name,
                                text: stripScopePrefix(scope as SchemaListingScope, attr.attribute_name),
                                value: attr.attribute_name
                            })
                        )
                    );
                })
                .catch((): void => setSubAttributeOptions([]))
                .finally((): void => setIsLoadingSubAttrs(false));
        }, [ attributeNamePrefix, scope, valueType ]);

        const availableSubAttributeOptions: DropdownOptionInterface[] = useMemo(
            (): DropdownOptionInterface[] => {
                const selected: Set<string> = new Set(
                    subAttributes.map((s: ProfileSchemaSubAttributeRef): string => s.attribute_name)
                );

                return subAttributeOptions.filter(
                    (opt: DropdownOptionInterface): boolean => !selected.has(opt.value)
                );
            },
            [ subAttributeOptions, subAttributes ]
        );

        const handleSubAttributeAdd = (selectedAttrName: string): void => {
            const option: DropdownOptionInterface | undefined = subAttributeOptions.find(
                (opt: DropdownOptionInterface): boolean => opt.value === selectedAttrName
            );

            if (!option) return;
            if (subAttributes.some(
                (sa: ProfileSchemaSubAttributeRef): boolean => sa.attribute_name === selectedAttrName
            )) return;

            setSubAttributes(
                (prev: ProfileSchemaSubAttributeRef[]): ProfileSchemaSubAttributeRef[] => [
                    ...prev,
                    { attribute_id: option.attributeId, attribute_name: selectedAttrName }
                ]
            );
        };

        const handleSubAttributeRemove = (attributeId: string): void => {
            setSubAttributes(
                (prev: ProfileSchemaSubAttributeRef[]): ProfileSchemaSubAttributeRef[] =>
                    prev.filter(
                        (sa: ProfileSchemaSubAttributeRef): boolean => sa.attribute_id !== attributeId
                    )
            );
        };

        const handleSubmit: () => void = (): void => {
            if (valueType === "complex" && subAttributes.length === 0) {
                return;
            }

            onSubmit({
                canonicalValues,
                mergeStrategy,
                multiValued,
                mutability,
                subAttributes,
                valueType
            });
        };

        useImperativeHandle(ref, () => ({ triggerSubmit: handleSubmit }));

        return (
            <Grid container spacing={ 2 } data-componentid={ componentId }>

                { /* ── Value Type ── */ }
                <Grid xs={ 12 }>
                    <TextField
                        select
                        fullWidth
                        label={ t("customerDataService:profileAttributes.create."+
                            "forms.typeConfig.fields.valueType.label") }
                        value={ valueType }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => {
                            const next: ValueType = e.target.value as ValueType;

                            if (valueType === "complex" && next !== "complex") {
                                setSubAttributes([]);
                            }
                            setValueType(next);
                        } }
                        data-componentid={ `${componentId}-value-type-field` }
                    >
                        { valueTypeOptions.map((opt: { value: ValueType; label: string }) => (
                            <MenuItem key={ opt.value } value={ opt.value }>
                                { opt.label }
                            </MenuItem>
                        )) }
                    </TextField>
                    <Hint>
                        { t("customerDataService:profileAttributes.create.forms.typeConfig.fields.valueType.hint") }
                    </Hint>
                </Grid>

                { /* ── Canonical Values – DynamicField shown for string type, matching edit page ── */ }
                { valueType === "string" && (
                    <Grid xs={ 12 }>
                        <Hint>
                            { t("customerDataService:profileAttributes.create."+
                            "forms.advancedSettings.fields.canonicalValues.hint") }
                        </Hint>
                        <DynamicField
                            data={ canonicalValues.map(
                                (cv: CanonicalValueInterface): KeyValue => ({
                                    key: cv.label,
                                    value: cv.value
                                })
                            ) }
                            keyType="text"
                            keyName={
                                t("customerDataService:profileAttributes.create."+
                                    "forms.advancedSettings.fields.canonicalValues.labelField") }
                            valueName={
                                t("customerDataService:profileAttributes.create."+
                                    "forms.advancedSettings.fields.canonicalValues.valueField") }
                            keyRequiredMessage={
                                t("customerDataService:profileAttributes.create."+
                                    "forms.advancedSettings.fields.canonicalValues.validations.atLeastOne") }
                            valueRequiredErrorMessage={
                                t("customerDataService:profileAttributes.create."+
                                    "forms.advancedSettings.fields.canonicalValues.validations.atLeastOne") }
                            requiredField={ false }
                            listen={ (data: KeyValue[]): void => {
                                setCanonicalValues(
                                    data.map((item: KeyValue): CanonicalValueInterface => ({
                                        label: item.key,
                                        value: item.value
                                    }))
                                );
                            } }
                            data-componentid={ `${componentId}-canonical-values-dynamic-field` }
                        />
                    </Grid>
                ) }

                { /* ── Sub-attributes – dropdown + inline list with TrashIcon, matching edit page ── */ }
                { valueType === "complex" && (
                    <Grid xs={ 12 }>
                        <TextField
                            select
                            fullWidth
                            label={ t("customerDataService:profileAttributes.create."+
                                "forms.advancedSettings.fields.subAttributes.label") }
                            placeholder={ t("customerDataService:profileAttributes.create."+
                                "forms.advancedSettings.fields.subAttributes.placeholder") }
                            value=""
                            disabled={ isLoadingSubAttrs || subAttributeOptions.length === 0
                                || availableSubAttributeOptions.length === 0 }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => {
                                handleSubAttributeAdd(e.target.value);
                            } }
                            InputProps={ {
                                endAdornment: isLoadingSubAttrs ? (
                                    <InputAdornment position="end">
                                        <CircularProgress size={ 16 } />
                                    </InputAdornment>
                                ) : null
                            } }
                            data-componentid={ `${componentId}-sub-attributes-field` }
                        >
                            { availableSubAttributeOptions.length === 0 ? (
                                <MenuItem value="" disabled>
                                    { t("customerDataService:profileAttributes.create."+
                                    "forms.advancedSettings.fields.subAttributes.noOptions") }
                                </MenuItem>
                            ) : (
                                availableSubAttributeOptions.map((opt: DropdownOptionInterface) => (
                                    <MenuItem key={ opt.key } value={ opt.value }>
                                        { opt.text }
                                    </MenuItem>
                                ))
                            ) }
                        </TextField>

                        { !isLoadingSubAttrs && subAttributeOptions.length === 0 ? (
                            // API returned no attributes — nothing to pick from
                            <Message info size="small" className="display-flex">
                                <Icon name="info circle" />
                                <Message.Content className="tiny">
                                    { t("customerDataService:profileAttributes.edit.fields.subAttributes.empty")
                                        || "No sub-attributes available. Create a non-complex attribute first." }
                                </Message.Content>
                            </Message>
                        ) : !isLoadingSubAttrs && availableSubAttributeOptions.length === 0 &&
                        subAttributes.length > 0 ? (
                                <Message info size="small" className="display-flex">
                                    <Icon name="info circle" />
                                    <Message.Content className="tiny">
                                        { t("customerDataService:profileAttributes.edit.fields.subAttributes.allAdded")
                                            || "All available sub-attributes have been added." }
                                    </Message.Content>
                                </Message>
                            ) : !isLoadingSubAttrs && subAttributes.length === 0 ? (
                                // Options exist but none selected yet — show validation nudge
                                <Message negative size="small" className="display-flex">
                                    <Icon name="exclamation circle" />
                                    <Message.Content className="tiny">
                                        { t("customerDataService:profileAttributes.edit."+
                                        "fields.subAttributes.validationError") }
                                    </Message.Content>
                                </Message>
                            ) : (
                                // Options available and at least one already selected
                                <Hint>
                                    { t("customerDataService:profileAttributes.create."+
                                    "forms.advancedSettings.fields.subAttributes.hint") }
                                </Hint>
                            ) }

                        { subAttributes.length > 0 && (
                            <div style={ { marginTop: "1rem" } }>
                                { subAttributes.map((subAttr: ProfileSchemaSubAttributeRef) => (
                                    <div
                                        key={ subAttr.attribute_id }
                                        style={ {
                                            alignItems: "center",
                                            display: "flex",
                                            padding: "0.25rem 0"
                                        } }
                                    >
                                        <span style={ { fontSize: "0.875rem" } }>
                                            { stripScopePrefix(scope as SchemaListingScope, subAttr.attribute_name) }
                                        </span>
                                        <IconButton
                                            sx={ { marginLeft: "auto" } }
                                            size="small"
                                            onClick={ (): void =>
                                                handleSubAttributeRemove(subAttr.attribute_id)
                                            }
                                            data-componentid={
                                                `${componentId}-remove-sub-attribute-${subAttr.attribute_id}`
                                            }
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </div>
                                )) }
                            </div>
                        ) }
                    </Grid>
                ) }

                { /* ── Mutability ── */ }
                <Grid xs={ 12 }>
                    <TextField
                        select
                        fullWidth
                        label={ t("customerDataService:profileAttributes.create."+
                            "forms.typeConfig.fields.mutability.label") }
                        value={ mutability }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                            setMutability(e.target.value as Mutability)
                        }
                        data-componentid={ `${componentId}-mutability-field` }
                    >
                        { mutabilityOptions.map(
                            (opt: { value: Mutability; label: string }): ReactElement => (
                                <MenuItem key={ opt.value } value={ opt.value }>
                                    { opt.label }
                                </MenuItem>
                            )
                        ) }
                    </TextField>
                    <Hint>
                        { t("customerDataService:profileAttributes.create.forms.typeConfig.fields.mutability.hint") }
                    </Hint>
                </Grid>

                { /* ── Multi-valued ── */ }
                <Grid xs={ 12 }>
                    <FormControlLabel
                        control={
                            (
                                <Checkbox
                                    checked={ multiValued }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                        setMultiValued(e.target.checked)
                                    }
                                    data-componentid={ `${componentId}-multi-valued-checkbox` }
                                />
                            )
                        }
                        label={ t("customerDataService:profileAttributes.create."+
                            "forms.typeConfig.fields.multiValued.label") }
                    />
                    <Hint>
                        { t("customerDataService:profileAttributes.create.forms.typeConfig.fields.multiValued.hint") }
                    </Hint>
                </Grid>

                <Grid xs={ 12 }>
                    <Divider />
                </Grid>

                { /* ── Merge Strategy ── */ }
                <Grid xs={ 12 }>
                    <TextField
                        select
                        fullWidth
                        label={ t("customerDataService:profileAttributes.create."+
                            "forms.advancedSettings.fields.mergeStrategy.label") }
                        value={ mergeStrategy }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                            setMergeStrategy(e.target.value as MergeStrategy)
                        }
                        data-componentid={ `${componentId}-merge-strategy-field` }
                    >
                        { mergeStrategyOptions.map(
                            (opt: { value: MergeStrategy; label: string }): ReactElement => (
                                <MenuItem key={ opt.value } value={ opt.value }>
                                    { opt.label }
                                </MenuItem>
                            )
                        ) }
                    </TextField>
                    <Hint>
                        { t("customerDataService:profileAttributes.create."+
                        "forms.advancedSettings.fields.mergeStrategy.hint") }
                    </Hint>
                </Grid>
            </Grid>
        );
    }
);

TypeAndAdvancedForm.displayName = "TypeAndAdvancedForm";

type ProfileAttributeCreatePagePropsInterface = IdentifiableComponentInterface;

const ProfileAttributeCreatePage: FunctionComponent<ProfileAttributeCreatePagePropsInterface> = (
    props: ProfileAttributeCreatePagePropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "create-profile-attribute"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const attributeGeneralFormRef: MutableRefObject<StepFormRefInterface> =
        useRef<StepFormRefInterface>(null);
    const typeAndAdvancedFormRef: MutableRefObject<StepFormRefInterface> =
        useRef<StepFormRefInterface>(null);

    const [ activeStep, setActiveStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ formData, setFormData ] = useState<AttributeCreateFormDataInterface>({});

    const onAttributeGeneralFormSubmit = (values: AttributeGeneralFormValuesInterface): void => {
        setFormData(
            (prev: AttributeCreateFormDataInterface): AttributeCreateFormDataInterface => ({
                ...prev,
                attributeGeneral: values
            })
        );
        setActiveStep(1);
    };

    const onTypeAndAdvancedFormSubmit = (values: TypeAndAdvancedFormValuesInterface): void => {
        const { scope, applicationIdentifier, name, displayName } = formData.attributeGeneral;

        const attributeName: string = `${scope}.${name}`;

        const payload: Array<Partial<ProfileSchemaAttribute>> = [
            {
                attribute_name: attributeName,
                canonical_values: values.canonicalValues ?? [],
                ...(displayName ? { display_name: displayName } : {}),
                merge_strategy: values.mergeStrategy,
                multi_valued: values.multiValued,
                mutability: values.mutability,
                sub_attributes: values.valueType === "complex" ? values.subAttributes : [],
                value_type: values.valueType,
                ...(scope === APPLICATION_DATA && applicationIdentifier
                    ? { application_identifier: applicationIdentifier }
                    : {})
            }
        ];

        setIsSubmitting(true);
        createSchemaAttributes(scope, payload)
            .then((created: ProfileSchemaAttribute[]): void => {
                const createdAttribute: ProfileSchemaAttribute | undefined = created?.[0];

                dispatch(
                    addAlert({
                        description: t(
                            "customerDataService:profileAttributes.create."+
                            "notifications.addProfileAttribute.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "customerDataService:profileAttributes.create."+
                            "notifications.addProfileAttribute.success.message"
                        )
                    })
                );

                if (createdAttribute?.attribute_id) {
                    history.push(
                        AppConstants.getPaths()
                            .get("PROFILE_ATTRIBUTE")
                            .replace(":scope", scope)
                            .replace(":id", createdAttribute.attribute_id)
                    );

                    return;
                }

                history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES"));
            })
            .catch((): void => {
                dispatch(
                    addAlert({
                        description: t(
                            "customerDataService:profileAttributes.create."+
                            "notifications.addProfileAttribute.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "customerDataService:profileAttributes.create."+
                            "notifications.addProfileAttribute.genericError.message"
                        )
                    })
                );
            })
            .finally((): void => setIsSubmitting(false));
    };

    return (
        <PageLayout
            title={ t("customerDataService:profileAttributes.create.pageLayout.title") }
            contentTopMargin={ true }
            description={ t("customerDataService:profileAttributes.create.pageLayout.description") }
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                onClick: (): void =>
                    history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")),
                text: t("customerDataService:profileAttributes.create.pageLayout.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            <EmphasizedSegment padded="very" data-componentid={ `${componentId}-segment` }>
                <Stepper
                    activeStep={ activeStep }
                    orientation="vertical"
                    data-componentid={ `${componentId}-stepper` }
                >
                    { /* ── Step 1 – Attribute & General Details ── */ }
                    <Step data-componentid={ `${componentId}-step-1` }>
                        <StepLabel
                            optional={
                                (
                                    <Typography variant="body2">
                                        { t("customerDataService:profileAttributes.create."+
                                        "pageLayout.stepper.step1.description") }
                                    </Typography>
                                )
                            }
                        >
                            <Typography variant="h4">
                                { t("customerDataService:profileAttributes.create.pageLayout.stepper.step1.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent>
                            <AttributeGeneralForm
                                ref={ attributeGeneralFormRef }
                                initialValues={ formData.attributeGeneral ?? {} }
                                onSubmit={ onAttributeGeneralFormSubmit }
                                data-componentid={ `${componentId}-attribute-general-form` }
                            />
                            <Button
                                variant="contained"
                                onClick={ (): void =>
                                    attributeGeneralFormRef.current?.triggerSubmit()
                                }
                                sx={ { mt: 2 } }
                                data-componentid={ `${componentId}-step-1-next-button` }
                            >
                                { t("common:next") }
                            </Button>
                        </StepContent>
                    </Step>

                    { /* ── Step 2 – Type, Config & Advanced Settings ── */ }
                    <Step data-componentid={ `${componentId}-step-2` }>
                        <StepLabel
                            optional={
                                (
                                    <Typography variant="body2">
                                        { t("customerDataService:profileAttributes.create."+
                                        "pageLayout.stepper.step2.description") }
                                    </Typography>
                                )
                            }
                        >
                            <Typography variant="h4">
                                { t("customerDataService:profileAttributes.create.pageLayout.stepper.step2.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent>
                            <TypeAndAdvancedForm
                                ref={ typeAndAdvancedFormRef }
                                initialValues={ formData.typeAndAdvanced ?? {} }
                                scope={ formData.attributeGeneral?.scope ?? (TRAITS as ProfileSchemaScope) }
                                attributeNamePrefix={ formData.attributeGeneral?.name ?? "" }
                                onSubmit={ onTypeAndAdvancedFormSubmit }
                                data-componentid={ `${componentId}-type-advanced-form` }
                            />
                            <StepActionsContainer>
                                <Button
                                    variant="outlined"
                                    disabled={ isSubmitting }
                                    onClick={ (): void =>
                                        setActiveStep((prev: number): number => prev - 1)
                                    }
                                    data-componentid={ `${componentId}-step-2-previous-button` }
                                >
                                    { t("common:previous") }
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={ (): void =>
                                        typeAndAdvancedFormRef.current?.triggerSubmit()
                                    }
                                    loading={ isSubmitting }
                                    data-componentid={ `${componentId}-finish-button` }
                                >
                                    { t("common:finish") }
                                </Button>
                            </StepActionsContainer>
                        </StepContent>
                    </Step>
                </Stepper>
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default ProfileAttributeCreatePage;
