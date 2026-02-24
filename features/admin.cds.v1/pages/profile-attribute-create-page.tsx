// /**
//  * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
//  *
//  * WSO2 LLC. licenses this file to you under the Apache License,
//  * Version 2.0 (the "License"); you may not use this file except
//  * in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing,
//  * software distributed under the License is distributed on an
//  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  * KIND, either express or implied. See the License for the
//  * specific language governing permissions and limitations
//  * under the License.
//  */

// import Alert from "@oxygen-ui/react/Alert";
// import Box from "@oxygen-ui/react/Box";
// import Button from "@oxygen-ui/react/Button";
// import Chip from "@oxygen-ui/react/Chip";
// import CircularProgress from "@oxygen-ui/react/CircularProgress";
// import Divider from "@oxygen-ui/react/Divider";
// import FormControl from "@oxygen-ui/react/FormControl";
// import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
// import FormHelperText from "@oxygen-ui/react/FormHelperText";
// import Grid from "@oxygen-ui/react/Grid";
// import InputAdornment from "@oxygen-ui/react/InputAdornment";
// import InputLabel from "@oxygen-ui/react/InputLabel";
// import MenuItem from "@oxygen-ui/react/MenuItem";
// import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
// import Step from "@oxygen-ui/react/Step";
// import StepContent from "@oxygen-ui/react/StepContent";
// import StepLabel from "@oxygen-ui/react/StepLabel";
// import Stepper from "@oxygen-ui/react/Stepper";
// import Switch from "@oxygen-ui/react/Switch";
// import TextField from "@oxygen-ui/react/TextField";
// import Typography from "@oxygen-ui/react/Typography";
// import { TrashIcon } from "@oxygen-ui/react-icons";
// import { styled, Theme } from "@mui/material/styles";
// import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
// import { history } from "@wso2is/admin.core.v1/helpers/history";
// import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
// import { addAlert } from "@wso2is/core/store";
// import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
// import React, {
//     FunctionComponent,
//     MutableRefObject,
//     ReactElement,
//     forwardRef,
//     useEffect,
//     useImperativeHandle,
//     useMemo,
//     useRef,
//     useState
// } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";
// import { Dispatch } from "redux";
// import { createSchemaAttributes } from "../api/profile-attributes";
// import { useProfileSchemaByScope } from "../hooks/use-profile-schema-by-scope";
// import type {
//     MergeStrategy,
//     Mutability,
//     ProfileSchemaAttribute,
//     ProfileSchemaSubAttributeRef,
//     ValueType
// } from "../models/profile-attributes";


// const StepActionsContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
//     display: "flex",
//     gap: theme.spacing(1),
//     marginTop: theme.spacing(2)
// }));

// const SubAttributeChipList: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
//     display: "flex",
//     flexWrap: "wrap",
//     gap: theme.spacing(1),
//     marginTop: theme.spacing(1)
// }));

// const CanonicalValuesList: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
//     border: `1px solid ${theme.palette.divider}`,
//     borderRadius: theme.shape.borderRadius,
//     marginTop: theme.spacing(1),
//     overflow: "hidden"
// }));

// const CanonicalValueRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
//     alignItems: "center",
//     borderBottom: `1px solid ${theme.palette.divider}`,
//     display: "flex",
//     gap: theme.spacing(1.5),
//     padding: theme.spacing(0.75, 1.5),
//     "&:last-child": {
//         borderBottom: "none"
//     }
// }));

// // =============================================================================
// // UI-only local types
// // =============================================================================

// /**
//  * Extends ValueType with the UI-only "options" pseudo-type.
//  * "options" is stored as value_type "string" with canonical_values populated.
//  */
// type TraitValueTypeSelectorType = ValueType | "options";

// /** Label → value pair used when building canonical_values for "options" attributes. */
// interface KeyValueInterface {
//     key: string;
//     value: string;
// }

// interface DropdownOptionInterface {
//     key: string;
//     text: string;
//     value: string;
// }

// interface StepFormRefInterface {
//     triggerSubmit: () => void;
// }

// interface GeneralDetailsFormValuesInterface {
//     name: string;
//     displayName: string;
//     description: string;
// }

// interface TypeConfigFormValuesInterface {
//     valueTypeSelector: TraitValueTypeSelectorType;
//     mutability: Mutability;
//     multiValued: boolean;
// }

// interface AdvancedSettingsFormValuesInterface {
//     mergeStrategy: MergeStrategy;
//     subAttributes?: ProfileSchemaSubAttributeRef[];
//     canonicalValues?: KeyValueInterface[];
// }

// /** Accumulated form state held by the page across all three steps. */
// interface AttributeCreateFormDataInterface {
//     generalDetails?: GeneralDetailsFormValuesInterface;
//     typeConfig?: TypeConfigFormValuesInterface;
//     advancedSettings?: AdvancedSettingsFormValuesInterface;
// }

// // =============================================================================
// // Dropdown option definitions (module-level — stable across renders)
// // =============================================================================

// const VALUE_TYPE_OPTIONS: Array<{
//     value: TraitValueTypeSelectorType;
//     label: string;
//     hint: string;
// }> = [
//     { hint: "A plain text value.", label: "Text", value: "string" },
//     { hint: "A whole number.", label: "Integer", value: "integer" },
//     { hint: "A number with decimal precision.", label: "Decimal", value: "decimal" },
//     { hint: "A true / false flag.", label: "Boolean", value: "boolean" },
//     { hint: "A calendar date (YYYY-MM-DD).", label: "Date", value: "date" },
//     { hint: "A date and time value.", label: "Date & Time", value: "date_time" },
//     { hint: "A Unix timestamp (seconds since epoch).", label: "Epoch", value: "epoch" },
//     { hint: "A fixed set of label-value pairs.", label: "Options", value: "options" },
//     { hint: "A nested object composed of other traits.", label: "Object (Complex)", value: "complex" }
// ];

// const MUTABILITY_OPTIONS: Array<{ value: Mutability; label: string; hint: string }> = [
//     { hint: "The attribute value can be read and updated freely.", label: "Read & Write", value: "readWrite" },
//     { hint: "The attribute can only be read; it cannot be modified.", label: "Read Only", value: "readOnly" },
//     { hint: "The attribute value cannot be changed after it is set.", label: "Immutable", value: "immutable" },
//     { hint: "The attribute can only be written once.", label: "Write Once", value: "writeOnce" }
// ];

// // MergeStrategy in the model is "overwrite" | "combine" only.
// const MERGE_STRATEGY_OPTIONS: Array<{ value: MergeStrategy; label: string; hint: string }> = [
//     { hint: "The incoming value replaces the stored one.", label: "Overwrite", value: "overwrite" },
//     { hint: "All values from different sources are combined.", label: "Combine", value: "combine" }
// ];

// // =============================================================================
// // Step 1 – General Details
// // =============================================================================

// interface GeneralDetailsFormPropsInterface {
//     initialValues: Partial<GeneralDetailsFormValuesInterface>;
//     /** Scope prefix used both for the uniqueness check filter and attribute_name construction. */
//     scope: "traits" | "application_data";
//     onSubmit: (values: GeneralDetailsFormValuesInterface) => void;
//     "data-componentid"?: string;
// }

// const GeneralDetailsForm = forwardRef<StepFormRefInterface, GeneralDetailsFormPropsInterface>(
//     (props: GeneralDetailsFormPropsInterface, ref): ReactElement => {
//         const {
//             initialValues,
//             scope,
//             onSubmit,
//             "data-componentid": componentId = "attribute-general-details-form"
//         } = props;

//         const { t } = useTranslation();

//         const [ name, setName ] = useState<string>(initialValues?.name ?? "");
//         const [ displayName, setDisplayName ] = useState<string>(initialValues?.displayName ?? "");
//         const [ description, setDescription ] = useState<string>(initialValues?.description ?? "");
//         const [ nameError, setNameError ] = useState<string>("");
//         const [ isCheckingName, setIsCheckingName ] = useState<boolean>(false);
//         const [ isNameAvailable, setIsNameAvailable ] = useState<boolean | null>(
//             initialValues?.name ? true : null
//         );

//         const debounceTimer: MutableRefObject<ReturnType<typeof setTimeout>> =
//             useRef<ReturnType<typeof setTimeout>>(null);

//         const fullAttributeName: string = useMemo(
//             (): string => (name.trim() ? `${scope}.${name.trim()}` : ""),
//             [ name, scope ]
//         );

//         // Debounced uniqueness check via the shared API utility.
//         useEffect((): (() => void) => {
//             if (!name.trim()) {
//                 setIsNameAvailable(null);
//                 setIsCheckingName(false);
//                 clearTimeout(debounceTimer.current);

//                 return (): void => undefined;
//             }

//             setIsNameAvailable(null);
//             clearTimeout(debounceTimer.current);

//             debounceTimer.current = setTimeout((): void => {
//                 setIsCheckingName(true);
//                 useProfileSchemaByScope(
//                     scope,
//                     `attribute_name+eq+${encodeURIComponent(fullAttributeName)}`
//                 )
//                     .then((list: ProfileSchemaAttribute[]): void => {
//                         setIsNameAvailable(list.length === 0);
//                     })
//                     .catch((): void => setIsNameAvailable(null))
//                     .finally((): void => setIsCheckingName(false));
//             }, 400);

//             return (): void => clearTimeout(debounceTimer.current);
//         }, [ name, scope, fullAttributeName ]);

//         const handleSubmit: () => void = (): void => {
//             if (!name.trim()) {
//                 setNameError(
//                     t("profileAttributes:forms.generalDetails.fields.name.validations.empty")
//                 );

//                 return;
//             }

//             if (isNameAvailable === false) {
//                 setNameError(
//                     t("profileAttributes:forms.generalDetails.fields.name.validations.exists")
//                 );

//                 return;
//             }

//             setNameError("");
//             onSubmit({
//                 description: description.trim(),
//                 displayName: displayName.trim(),
//                 name: name.trim()
//             });
//         };

//         useImperativeHandle(ref, () => ({ triggerSubmit: handleSubmit }));

//         return (
//             <Grid container spacing={ 2 } data-componentid={ componentId }>
//                 <Grid xs={ 12 } sm={ 6 }>
//                     <TextField
//                         label={ t("profileAttributes:forms.generalDetails.fields.name.label") }
//                         value={ name }
//                         onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => {
//                             setName(e.target.value);
//                             setNameError("");
//                         } }
//                         error={ Boolean(nameError) }
//                         helperText={
//                             nameError
//                                 ? nameError
//                                 : name.trim()
//                                     ? `Full attribute name: ${scope}.${name.trim()}`
//                                     : t(
//                                         "profileAttributes:forms.generalDetails.fields.name" +
//                                         ".placeholder"
//                                     )
//                         }
//                         placeholder={ t(
//                             "profileAttributes:forms.generalDetails.fields.name.placeholder"
//                         ) }
//                         required
//                         fullWidth
//                         InputProps={ {
//                             endAdornment: isCheckingName ? (
//                                 <InputAdornment position="end">
//                                     <CircularProgress size={ 16 } />
//                                 </InputAdornment>
//                             ) : null
//                         } }
//                         data-componentid={ `${componentId}-name-field` }
//                     />
//                     { isNameAvailable === false && !nameError && (
//                         <Alert severity="error" sx={ { mt: 1 } }>
//                             { t(
//                                 "profileAttributes:forms.generalDetails.fields.name" +
//                                 ".validations.exists"
//                             ) }
//                         </Alert>
//                     ) }
//                     { isNameAvailable === true && (
//                         <Alert severity="success" sx={ { mt: 1 } }>
//                             { t(
//                                 "profileAttributes:forms.generalDetails.fields.name" +
//                                 ".validations.available"
//                             ) }
//                         </Alert>
//                     ) }
//                 </Grid>

//                 <Grid xs={ 12 } sm={ 6 }>
//                     <TextField
//                         label={ t(
//                             "profileAttributes:forms.generalDetails.fields.displayName.label"
//                         ) }
//                         value={ displayName }
//                         onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
//                             setDisplayName(e.target.value)
//                         }
//                         placeholder={ t(
//                             "profileAttributes:forms.generalDetails.fields.displayName.placeholder"
//                         ) }
//                         fullWidth
//                         helperText={ t(
//                             "profileAttributes:forms.generalDetails.fields.displayName.hint"
//                         ) }
//                         data-componentid={ `${componentId}-display-name-field` }
//                     />
//                 </Grid>

//                 <Grid xs={ 12 }>
//                     <TextField
//                         label={ t(
//                             "profileAttributes:forms.generalDetails.fields.description.label"
//                         ) }
//                         value={ description }
//                         onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
//                             setDescription(e.target.value)
//                         }
//                         placeholder={ t(
//                             "profileAttributes:forms.generalDetails.fields.description.placeholder"
//                         ) }
//                         multiline
//                         rows={ 3 }
//                         fullWidth
//                         helperText={ t(
//                             "profileAttributes:forms.generalDetails.fields.description.hint"
//                         ) }
//                         data-componentid={ `${componentId}-description-field` }
//                     />
//                 </Grid>
//             </Grid>
//         );
//     }
// );

// GeneralDetailsForm.displayName = "GeneralDetailsForm";

// // =============================================================================
// // Step 2 – Type & Configuration
// // =============================================================================

// interface TypeConfigFormPropsInterface {
//     initialValues: Partial<TypeConfigFormValuesInterface>;
//     onSubmit: (values: TypeConfigFormValuesInterface) => void;
//     "data-componentid"?: string;
// }

// const TypeConfigForm = forwardRef<StepFormRefInterface, TypeConfigFormPropsInterface>(
//     (props: TypeConfigFormPropsInterface, ref): ReactElement => {
//         const {
//             initialValues,
//             onSubmit,
//             "data-componentid": componentId = "attribute-type-config-form"
//         } = props;

//         const { t } = useTranslation();

//         const [ valueTypeSelector, setValueTypeSelector ] = useState<TraitValueTypeSelectorType>(
//             initialValues?.valueTypeSelector ?? "string"
//         );
//         const [ mutability, setMutability ] = useState<Mutability>(
//             initialValues?.mutability ?? "readWrite"
//         );
//         const [ multiValued, setMultiValued ] = useState<boolean>(
//             initialValues?.multiValued ?? false
//         );

//         const handleSubmit: () => void = (): void => {
//             onSubmit({ multiValued, mutability, valueTypeSelector });
//         };

//         useImperativeHandle(ref, () => ({ triggerSubmit: handleSubmit }));

//         const valueTypeHint: string =
//             VALUE_TYPE_OPTIONS.find(
//                 (o: { value: TraitValueTypeSelectorType }): boolean =>
//                     o.value === valueTypeSelector
//             )?.hint ?? "";

//         const mutabilityHint: string =
//             MUTABILITY_OPTIONS.find(
//                 (o: { value: Mutability }): boolean => o.value === mutability
//             )?.hint ?? "";

//         return (
//             <Grid container spacing={ 2 } data-componentid={ componentId }>
//                 <Grid xs={ 12 } sm={ 6 }>
//                     <FormControl fullWidth data-componentid={ `${componentId}-value-type-field` }>
//                         <InputLabel id={ `${componentId}-value-type-label` }>
//                             { t("profileAttributes:forms.typeConfig.fields.valueType.label") }
//                         </InputLabel>
//                         <Select
//                             labelId={ `${componentId}-value-type-label` }
//                             value={ valueTypeSelector }
//                             label={ t(
//                                 "profileAttributes:forms.typeConfig.fields.valueType.label"
//                             ) }
//                             onChange={ (e: SelectChangeEvent): void =>
//                                 setValueTypeSelector(
//                                     e.target.value as TraitValueTypeSelectorType
//                                 )
//                             }
//                         >
//                             { VALUE_TYPE_OPTIONS.map(
//                                 (opt: {
//                                     value: TraitValueTypeSelectorType;
//                                     label: string;
//                                 }) => (
//                                     <MenuItem key={ opt.value } value={ opt.value }>
//                                         { opt.label }
//                                     </MenuItem>
//                                 )
//                             ) }
//                         </Select>
//                         <FormHelperText>{ valueTypeHint }</FormHelperText>
//                     </FormControl>
//                 </Grid>

//                 <Grid xs={ 12 } sm={ 6 }>
//                     <FormControl fullWidth data-componentid={ `${componentId}-mutability-field` }>
//                         <InputLabel id={ `${componentId}-mutability-label` }>
//                             { t("profileAttributes:forms.typeConfig.fields.mutability.label") }
//                         </InputLabel>
//                         <Select
//                             labelId={ `${componentId}-mutability-label` }
//                             value={ mutability }
//                             label={ t(
//                                 "profileAttributes:forms.typeConfig.fields.mutability.label"
//                             ) }
//                             onChange={ (e: SelectChangeEvent): void =>
//                                 setMutability(e.target.value as Mutability)
//                             }
//                         >
//                             { MUTABILITY_OPTIONS.map(
//                                 (opt: { value: Mutability; label: string }) => (
//                                     <MenuItem key={ opt.value } value={ opt.value }>
//                                         { opt.label }
//                                     </MenuItem>
//                                 )
//                             ) }
//                         </Select>
//                         <FormHelperText>{ mutabilityHint }</FormHelperText>
//                     </FormControl>
//                 </Grid>

//                 <Grid xs={ 12 }>
//                     <FormControlLabel
//                         control={
//                             (
//                                 <Switch
//                                     checked={ multiValued }
//                                     onChange={ (
//                                         e: React.ChangeEvent<HTMLInputElement>
//                                     ): void => setMultiValued(e.target.checked) }
//                                     data-componentid={ `${componentId}-multi-valued-toggle` }
//                                 />
//                             )
//                         }
//                         label={ t(
//                             "profileAttributes:forms.typeConfig.fields.multiValued.label"
//                         ) }
//                     />
//                     <FormHelperText>
//                         { t("profileAttributes:forms.typeConfig.fields.multiValued.hint") }
//                     </FormHelperText>
//                 </Grid>
//             </Grid>
//         );
//     }
// );

// TypeConfigForm.displayName = "TypeConfigForm";

// // =============================================================================
// // Step 3 – Advanced Settings
// // =============================================================================

// interface AdvancedSettingsFormPropsInterface {
//     initialValues: Partial<AdvancedSettingsFormValuesInterface>;
//     /** Scope used when fetching sub-attribute suggestions for complex types. */
//     scope: "traits" | "application_data";
//     /** Short attribute name without the scope prefix, sourced from step 1. */
//     attributeNamePrefix: string;
//     /** Value type selector choice from step 2. */
//     valueTypeSelector: TraitValueTypeSelectorType;
//     onSubmit: (values: AdvancedSettingsFormValuesInterface) => void;
//     "data-componentid"?: string;
// }

// const AdvancedSettingsForm = forwardRef<
//     StepFormRefInterface,
//     AdvancedSettingsFormPropsInterface
// >(
//     (props: AdvancedSettingsFormPropsInterface, ref): ReactElement => {
//         const {
//             initialValues,
//             scope,
//             attributeNamePrefix,
//             valueTypeSelector,
//             onSubmit,
//             "data-componentid": componentId = "attribute-advanced-settings-form"
//         } = props;

//         const { t } = useTranslation();

//         const [ mergeStrategy, setMergeStrategy ] = useState<MergeStrategy>(
//             initialValues?.mergeStrategy ?? "overwrite"
//         );
//         const [ subAttributes, setSubAttributes ] = useState<ProfileSchemaSubAttributeRef[]>(
//             initialValues?.subAttributes ?? []
//         );
//         const [ subAttributeOptions, setSubAttributeOptions ] = useState<
//             DropdownOptionInterface[]
//         >([]);
//         const [ canonicalValues, setCanonicalValues ] = useState<KeyValueInterface[]>(
//             initialValues?.canonicalValues ?? []
//         );
//         const [ newLabel, setNewLabel ] = useState<string>("");
//         const [ newValue, setNewValue ] = useState<string>("");
//         const [ pairError, setPairError ] = useState<string>("");

//         // Fetch sub-attribute suggestions via the shared API utility.
//         useEffect((): void => {
//             if (valueTypeSelector !== "complex" || !attributeNamePrefix.trim()) {
//                 setSubAttributeOptions([]);

//                 return;
//             }

//             fetchProfileSchemaByScope(
//                 scope,
//                 `attribute_name+co+${scope}.${attributeNamePrefix.trim()}.`
//             )
//                 .then((data: ProfileSchemaAttribute[]): void => {
//                     setSubAttributeOptions(
//                         data.map(
//                             (attr: ProfileSchemaAttribute): DropdownOptionInterface => ({
//                                 key: attr.attribute_id,
//                                 text: (attr.attribute_name ?? "").replace(
//                                     new RegExp(`^${scope}\\.`),
//                                     ""
//                                 ),
//                                 value: attr.attribute_name
//                             })
//                         )
//                     );
//                 })
//                 .catch((): void => setSubAttributeOptions([]));
//         }, [ attributeNamePrefix, scope, valueTypeSelector ]);

//         const availableSubAttributeOptions: DropdownOptionInterface[] = useMemo(
//             (): DropdownOptionInterface[] => {
//                 const selected: Set<string> = new Set(
//                     subAttributes.map(
//                         (s: ProfileSchemaSubAttributeRef): string => s.attribute_name
//                     )
//                 );

//                 return subAttributeOptions.filter(
//                     (opt: DropdownOptionInterface): boolean => !selected.has(opt.value)
//                 );
//             },
//             [ subAttributeOptions, subAttributes ]
//         );

//         const handleAddCanonicalValue: () => void = (): void => {
//             if (!newLabel.trim() || !newValue.trim()) {
//                 setPairError(
//                     t(
//                         "profileAttributes:forms.advancedSettings.fields" +
//                         ".canonicalValues.validations.empty"
//                     )
//                 );

//                 return;
//             }

//             setPairError("");
//             setCanonicalValues(
//                 (prev: KeyValueInterface[]): KeyValueInterface[] => [
//                     ...prev,
//                     { key: newLabel.trim(), value: newValue.trim() }
//                 ]
//             );
//             setNewLabel("");
//             setNewValue("");
//         };

//         const handleSubmit: () => void = (): void => {
//             if (valueTypeSelector === "options" && canonicalValues.length === 0) {
//                 setPairError(
//                     t(
//                         "profileAttributes:forms.advancedSettings.fields" +
//                         ".canonicalValues.validations.atLeastOne"
//                     )
//                 );

//                 return;
//             }

//             onSubmit({ canonicalValues, mergeStrategy, subAttributes });
//         };

//         useImperativeHandle(ref, () => ({ triggerSubmit: handleSubmit }));

//         const mergeHint: string =
//             MERGE_STRATEGY_OPTIONS.find(
//                 (o: { value: MergeStrategy }): boolean => o.value === mergeStrategy
//             )?.hint ?? "";

//         return (
//             <Grid container spacing={ 2 } data-componentid={ componentId }>
//                 <Grid xs={ 12 } sm={ 6 }>
//                     <FormControl
//                         fullWidth
//                         data-componentid={ `${componentId}-merge-strategy-field` }
//                     >
//                         <InputLabel id={ `${componentId}-merge-strategy-label` }>
//                             { t(
//                                 "profileAttributes:forms.advancedSettings.fields" +
//                                 ".mergeStrategy.label"
//                             ) }
//                         </InputLabel>
//                         <Select
//                             labelId={ `${componentId}-merge-strategy-label` }
//                             value={ mergeStrategy }
//                             label={ t(
//                                 "profileAttributes:forms.advancedSettings.fields" +
//                                 ".mergeStrategy.label"
//                             ) }
//                             onChange={ (e: SelectChangeEvent): void =>
//                                 setMergeStrategy(e.target.value as MergeStrategy)
//                             }
//                         >
//                             { MERGE_STRATEGY_OPTIONS.map(
//                                 (opt: { value: MergeStrategy; label: string }) => (
//                                     <MenuItem key={ opt.value } value={ opt.value }>
//                                         { opt.label }
//                                     </MenuItem>
//                                 )
//                             ) }
//                         </Select>
//                         <FormHelperText>{ mergeHint }</FormHelperText>
//                     </FormControl>
//                 </Grid>

//                 {/* Complex – sub-attributes ---------------------------------- */}
//                 { valueTypeSelector === "complex" && (
//                     <>
//                         <Grid xs={ 12 }>
//                             <Divider />
//                             <Typography variant="h6" sx={ { mt: 2, mb: 0.5 } }>
//                                 { t(
//                                     "profileAttributes:forms.advancedSettings.fields" +
//                                     ".subAttributes.label"
//                                 ) }
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 { t(
//                                     "profileAttributes:forms.advancedSettings.fields" +
//                                     ".subAttributes.hint"
//                                 ) }
//                             </Typography>
//                         </Grid>

//                         <Grid xs={ 12 } sm={ 8 }>
//                             <FormControl
//                                 fullWidth
//                                 disabled={ availableSubAttributeOptions.length === 0 }
//                                 data-componentid={ `${componentId}-sub-attributes-field` }
//                             >
//                                 <InputLabel id={ `${componentId}-sub-attributes-label` }>
//                                     { t(
//                                         "profileAttributes:forms.advancedSettings.fields" +
//                                         ".subAttributes.placeholder"
//                                     ) }
//                                 </InputLabel>
//                                 <Select
//                                     labelId={ `${componentId}-sub-attributes-label` }
//                                     value=""
//                                     label={ t(
//                                         "profileAttributes:forms.advancedSettings.fields" +
//                                         ".subAttributes.placeholder"
//                                     ) }
//                                     onChange={ (e: SelectChangeEvent): void => {
//                                         const selected: DropdownOptionInterface | undefined =
//                                             subAttributeOptions.find(
//                                                 (opt: DropdownOptionInterface): boolean =>
//                                                     opt.value === e.target.value
//                                             );

//                                         if (!selected) return;
//                                         if (
//                                             subAttributes.some(
//                                                 (a: ProfileSchemaSubAttributeRef): boolean =>
//                                                     a.attribute_name === selected.value
//                                             )
//                                         )
//                                             return;

//                                         setSubAttributes(
//                                             (
//                                                 prev: ProfileSchemaSubAttributeRef[]
//                                             ): ProfileSchemaSubAttributeRef[] => [
//                                                 ...prev,
//                                                 {
//                                                     attribute_id: String(selected.key),
//                                                     attribute_name: selected.value
//                                                 }
//                                             ]
//                                         );
//                                     } }
//                                 >
//                                     { availableSubAttributeOptions.length === 0 ? (
//                                         <MenuItem value="" disabled>
//                                             { t(
//                                                 "profileAttributes:forms.advancedSettings" +
//                                                 ".fields.subAttributes.noOptions"
//                                             ) }
//                                         </MenuItem>
//                                     ) : (
//                                         availableSubAttributeOptions.map(
//                                             (opt: DropdownOptionInterface) => (
//                                                 <MenuItem key={ opt.key } value={ opt.value }>
//                                                     { opt.text }
//                                                 </MenuItem>
//                                             )
//                                         )
//                                     ) }
//                                 </Select>
//                             </FormControl>
//                         </Grid>

//                         { subAttributes.length > 0 && (
//                             <Grid xs={ 12 }>
//                                 <SubAttributeChipList>
//                                     { subAttributes.map(
//                                         (attr: ProfileSchemaSubAttributeRef) => (
//                                             <Chip
//                                                 key={ `${attr.attribute_id}:${attr.attribute_name}` }
//                                                 label={ attr.attribute_name.replace(
//                                                     new RegExp(`^${scope}\\.`),
//                                                     ""
//                                                 ) }
//                                                 onDelete={ (): void =>
//                                                     setSubAttributes(
//                                                         (
//                                                             prev: ProfileSchemaSubAttributeRef[]
//                                                         ): ProfileSchemaSubAttributeRef[] =>
//                                                             prev.filter(
//                                                                 (
//                                                                     item: ProfileSchemaSubAttributeRef
//                                                                 ): boolean =>
//                                                                     item.attribute_name !==
//                                                                     attr.attribute_name
//                                                             )
//                                                     )
//                                                 }
//                                             />
//                                         )
//                                     ) }
//                                 </SubAttributeChipList>
//                             </Grid>
//                         ) }
//                     </>
//                 ) }

//                 {/* Options – canonical values -------------------------------- */}
//                 { valueTypeSelector === "options" && (
//                     <>
//                         <Grid xs={ 12 }>
//                             <Divider />
//                             <Typography variant="h6" sx={ { mt: 2, mb: 0.5 } }>
//                                 { t(
//                                     "profileAttributes:forms.advancedSettings.fields" +
//                                     ".canonicalValues.label"
//                                 ) }
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 { t(
//                                     "profileAttributes:forms.advancedSettings.fields" +
//                                     ".canonicalValues.hint"
//                                 ) }
//                             </Typography>
//                         </Grid>

//                         <Grid xs={ 12 } sm={ 4 }>
//                             <TextField
//                                 label={ t(
//                                     "profileAttributes:forms.advancedSettings.fields" +
//                                     ".canonicalValues.labelField"
//                                 ) }
//                                 value={ newLabel }
//                                 onChange={ (
//                                     e: React.ChangeEvent<HTMLInputElement>
//                                 ): void => {
//                                     setNewLabel(e.target.value);
//                                     setPairError("");
//                                 } }
//                                 fullWidth
//                                 placeholder="e.g. Blue"
//                                 data-componentid={ `${componentId}-canonical-label-field` }
//                             />
//                         </Grid>

//                         <Grid xs={ 12 } sm={ 4 }>
//                             <TextField
//                                 label={ t(
//                                     "profileAttributes:forms.advancedSettings.fields" +
//                                     ".canonicalValues.valueField"
//                                 ) }
//                                 value={ newValue }
//                                 onChange={ (
//                                     e: React.ChangeEvent<HTMLInputElement>
//                                 ): void => {
//                                     setNewValue(e.target.value);
//                                     setPairError("");
//                                 } }
//                                 fullWidth
//                                 placeholder="e.g. blue"
//                                 data-componentid={ `${componentId}-canonical-value-field` }
//                             />
//                         </Grid>

//                         <Grid
//                             xs={ 12 }
//                             sm={ 4 }
//                             sx={ { alignItems: "center", display: "flex" } }
//                         >
//                             <Button
//                                 variant="outlined"
//                                 onClick={ handleAddCanonicalValue }
//                                 data-componentid={ `${componentId}-add-canonical-value-button` }
//                             >
//                                 { t("common:add") }
//                             </Button>
//                         </Grid>

//                         { pairError && (
//                             <Grid xs={ 12 }>
//                                 <Alert severity="error">{ pairError }</Alert>
//                             </Grid>
//                         ) }

//                         { canonicalValues.length > 0 && (
//                             <Grid xs={ 12 }>
//                                 <CanonicalValuesList>
//                                     { canonicalValues.map(
//                                         (pair: KeyValueInterface, index: number) => (
//                                             <CanonicalValueRow key={ `${pair.key}-${index}` }>
//                                                 <Typography
//                                                     variant="body2"
//                                                     fontWeight="medium"
//                                                 >
//                                                     { pair.key }
//                                                 </Typography>
//                                                 <Typography
//                                                     variant="body2"
//                                                     color="text.secondary"
//                                                 >
//                                                     →
//                                                 </Typography>
//                                                 <Typography variant="body2" flexGrow={ 1 }>
//                                                     { pair.value }
//                                                 </Typography>
//                                                 <Button
//                                                     variant="text"
//                                                     color="error"
//                                                     size="small"
//                                                     onClick={ (): void =>
//                                                         setCanonicalValues(
//                                                             (
//                                                                 prev: KeyValueInterface[]
//                                                             ): KeyValueInterface[] =>
//                                                                 prev.filter(
//                                                                     (
//                                                                         _: KeyValueInterface,
//                                                                         i: number
//                                                                     ): boolean => i !== index
//                                                                 )
//                                                         )
//                                                     }
//                                                     startIcon={ <TrashIcon /> }
//                                                     data-componentid={ `${componentId}-remove-canonical-${index}` }
//                                                 />
//                                             </CanonicalValueRow>
//                                         )
//                                     ) }
//                                 </CanonicalValuesList>
//                             </Grid>
//                         ) }
//                     </>
//                 ) }
//             </Grid>
//         );
//     }
// );

// AdvancedSettingsForm.displayName = "AdvancedSettingsForm";

// // =============================================================================
// // Page
// // =============================================================================

// interface ProfileAttributeCreatePagePropsInterface extends IdentifiableComponentInterface {
//     /** The scope under which the new attribute will be created. Defaults to "traits". */
//     scope?: "traits" | "application_data";
// }

// /**
//  * Page component to handle creation of a new profile schema attribute.
//  *
//  * @param props - Props injected to the component.
//  * @returns The profile attribute creation page.
//  */
// const ProfileAttributeCreatePage: FunctionComponent<ProfileAttributeCreatePagePropsInterface> = (
//     props: ProfileAttributeCreatePagePropsInterface
// ): ReactElement => {
//     const {
//         scope = "traits",
//         ["data-componentid"]: componentId = "create-profile-attribute"
//     } = props;

//     const { t } = useTranslation();
//     const dispatch: Dispatch = useDispatch();

//     const generalDetailsFormRef: MutableRefObject<StepFormRefInterface> =
//         useRef<StepFormRefInterface>(null);
//     const typeConfigFormRef: MutableRefObject<StepFormRefInterface> =
//         useRef<StepFormRefInterface>(null);
//     const advancedSettingsFormRef: MutableRefObject<StepFormRefInterface> =
//         useRef<StepFormRefInterface>(null);

//     const [ activeStep, setActiveStep ] = useState<number>(0);
//     const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
//     const [ formData, setFormData ] = useState<AttributeCreateFormDataInterface>({});

//     const onGeneralDetailsFormSubmit: (
//         values: GeneralDetailsFormValuesInterface
//     ) => void = (values: GeneralDetailsFormValuesInterface): void => {
//         setFormData(
//             (prev: AttributeCreateFormDataInterface): AttributeCreateFormDataInterface => ({
//                 ...prev,
//                 generalDetails: values
//             })
//         );
//         setActiveStep(1);
//     };

//     const onTypeConfigFormSubmit: (
//         values: TypeConfigFormValuesInterface
//     ) => void = (values: TypeConfigFormValuesInterface): void => {
//         setFormData(
//             (prev: AttributeCreateFormDataInterface): AttributeCreateFormDataInterface => ({
//                 ...prev,
//                 typeConfig: values
//             })
//         );
//         setActiveStep(2);
//     };

//     const onAdvancedSettingsFormSubmit: (
//         values: AdvancedSettingsFormValuesInterface
//     ) => void = (values: AdvancedSettingsFormValuesInterface): void => {
//         const resolvedValueType: ValueType =
//             formData.typeConfig.valueTypeSelector === "options"
//                 ? "string"
//                 : (formData.typeConfig.valueTypeSelector as ValueType);

//         const payload: Array<Partial<ProfileSchemaAttribute>> = [
//             {
//                 attribute_name: `${scope}.${formData.generalDetails.name}`,
//                 canonical_values:
//                     formData.typeConfig.valueTypeSelector === "options"
//                         ? values.canonicalValues?.map(
//                             ({ key, value }: KeyValueInterface) => ({
//                                 label: key,
//                                 value
//                             })
//                         )
//                         : undefined,
//                 merge_strategy: values.mergeStrategy,
//                 multi_valued: formData.typeConfig.multiValued,
//                 mutability: formData.typeConfig.mutability,
//                 sub_attributes:
//                     formData.typeConfig.valueTypeSelector === "complex"
//                         ? values.subAttributes
//                         : undefined,
//                 value_type: resolvedValueType
//             }
//         ];

//         setIsSubmitting(true);
//         createSchemaAttributes(scope, payload)
//             .then((): void => {
//                 dispatch(
//                     addAlert({
//                         description: t(
//                             "profileAttributes:notifications.addProfileAttribute" +
//                             ".success.description"
//                         ),
//                         level: AlertLevels.SUCCESS,
//                         message: t(
//                             "profileAttributes:notifications.addProfileAttribute.success.message"
//                         )
//                     })
//                 );
//                 history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES"));
//             })
//             .catch((): void => {
//                 dispatch(
//                     addAlert({
//                         description: t(
//                             "profileAttributes:notifications.addProfileAttribute" +
//                             ".genericError.description"
//                         ),
//                         level: AlertLevels.ERROR,
//                         message: t(
//                             "profileAttributes:notifications.addProfileAttribute" +
//                             ".genericError.message"
//                         )
//                     })
//                 );
//             })
//             .finally((): void => setIsSubmitting(false));
//     };

//     return (
//         <PageLayout
//             title={ t("profileAttributes:pageLayout.create.title") }
//             contentTopMargin={ true }
//             description={ t("profileAttributes:pageLayout.create.description") }
//             data-componentid={ `${componentId}-page-layout` }
//             backButton={ {
//                 onClick: (): void =>
//                     history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")),
//                 text: t("profileAttributes:pageLayout.create.back")
//             } }
//             titleTextAlign="left"
//             bottomMargin={ false }
//             showBottomDivider
//         >
//             <EmphasizedSegment padded="very" data-componentid={ `${componentId}-segment` }>
//                 <Stepper
//                     activeStep={ activeStep }
//                     orientation="vertical"
//                     data-componentid={ `${componentId}-stepper` }
//                 >
//                     {/* Step 1 – General Details ------------------------------ */}
//                     <Step data-componentid={ `${componentId}-step-1` }>
//                         <StepLabel
//                             optional={
//                                 (
//                                     <Typography variant="body2">
//                                         { t(
//                                             "profileAttributes:pageLayout.create.stepper" +
//                                             ".step1.description"
//                                         ) }
//                                     </Typography>
//                                 )
//                             }
//                         >
//                             <Typography variant="h4">
//                                 { t(
//                                     "profileAttributes:pageLayout.create.stepper.step1.title"
//                                 ) }
//                             </Typography>
//                         </StepLabel>
//                         <StepContent>
//                             <GeneralDetailsForm
//                                 ref={ generalDetailsFormRef }
//                                 initialValues={ formData.generalDetails ?? {} }
//                                 scope={ scope }
//                                 onSubmit={ onGeneralDetailsFormSubmit }
//                                 data-componentid={ `${componentId}-general-details-form` }
//                             />
//                             <Button
//                                 variant="contained"
//                                 onClick={ (): void =>
//                                     generalDetailsFormRef.current?.triggerSubmit()
//                                 }
//                                 loading={ isSubmitting }
//                                 sx={ { mt: 2 } }
//                                 data-componentid={ `${componentId}-step-1-next-button` }
//                             >
//                                 { t("common:next") }
//                             </Button>
//                         </StepContent>
//                     </Step>

//                     {/* Step 2 – Type & Configuration ------------------------- */}
//                     <Step data-componentid={ `${componentId}-step-2` }>
//                         <StepLabel
//                             optional={
//                                 (
//                                     <Typography variant="body2">
//                                         { t(
//                                             "profileAttributes:pageLayout.create.stepper" +
//                                             ".step2.description"
//                                         ) }
//                                     </Typography>
//                                 )
//                             }
//                         >
//                             <Typography variant="h4">
//                                 { t(
//                                     "profileAttributes:pageLayout.create.stepper.step2.title"
//                                 ) }
//                             </Typography>
//                         </StepLabel>
//                         <StepContent>
//                             <TypeConfigForm
//                                 ref={ typeConfigFormRef }
//                                 initialValues={ formData.typeConfig ?? {} }
//                                 onSubmit={ onTypeConfigFormSubmit }
//                                 data-componentid={ `${componentId}-type-config-form` }
//                             />
//                             <StepActionsContainer>
//                                 <Button
//                                     variant="outlined"
//                                     disabled={ isSubmitting }
//                                     onClick={ (): void =>
//                                         setActiveStep((prev: number): number => prev - 1)
//                                     }
//                                     data-componentid={ `${componentId}-step-2-previous-button` }
//                                 >
//                                     { t("common:previous") }
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     onClick={ (): void =>
//                                         typeConfigFormRef.current?.triggerSubmit()
//                                     }
//                                     loading={ isSubmitting }
//                                     data-componentid={ `${componentId}-step-2-next-button` }
//                                 >
//                                     { t("common:next") }
//                                 </Button>
//                             </StepActionsContainer>
//                         </StepContent>
//                     </Step>

//                     {/* Step 3 – Advanced Settings ---------------------------- */}
//                     <Step data-componentid={ `${componentId}-step-3` }>
//                         <StepLabel
//                             optional={
//                                 (
//                                     <Typography variant="body2">
//                                         { t(
//                                             "profileAttributes:pageLayout.create.stepper" +
//                                             ".step3.description"
//                                         ) }
//                                     </Typography>
//                                 )
//                             }
//                         >
//                             <Typography variant="h4">
//                                 { t(
//                                     "profileAttributes:pageLayout.create.stepper.step3.title"
//                                 ) }
//                             </Typography>
//                         </StepLabel>
//                         <StepContent>
//                             <AdvancedSettingsForm
//                                 ref={ advancedSettingsFormRef }
//                                 initialValues={ formData.advancedSettings ?? {} }
//                                 scope={ scope }
//                                 attributeNamePrefix={ formData.generalDetails?.name ?? "" }
//                                 valueTypeSelector={
//                                     formData.typeConfig?.valueTypeSelector ?? "string"
//                                 }
//                                 onSubmit={ onAdvancedSettingsFormSubmit }
//                                 data-componentid={ `${componentId}-advanced-settings-form` }
//                             />
//                             <StepActionsContainer>
//                                 <Button
//                                     variant="outlined"
//                                     disabled={ isSubmitting }
//                                     onClick={ (): void =>
//                                         setActiveStep((prev: number): number => prev - 1)
//                                     }
//                                     data-componentid={ `${componentId}-step-3-previous-button` }
//                                 >
//                                     { t("common:previous") }
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     onClick={ (): void =>
//                                         advancedSettingsFormRef.current?.triggerSubmit()
//                                     }
//                                     loading={ isSubmitting }
//                                     data-componentid={ `${componentId}-finish-button` }
//                                 >
//                                     { t("common:finish") }
//                                 </Button>
//                             </StepActionsContainer>
//                         </StepContent>
//                     </Step>
//                 </Stepper>
//             </EmphasizedSegment>
//         </PageLayout>
//     );
// };

// export default ProfileAttributeCreatePage;