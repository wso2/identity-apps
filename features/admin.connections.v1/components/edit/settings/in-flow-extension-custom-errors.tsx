/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Link from "@oxygen-ui/react/Link";
import MenuItem from "@oxygen-ui/react/MenuItem";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import deleteCustomTextPreference from "@wso2is/admin.branding.v1/api/delete-custom-text-preference";
import updateCustomTextPreference from "@wso2is/admin.branding.v1/api/update-custom-text-preference";
import { InFlowExtensionResponseInterface } from "@wso2is/admin.flow-builder-core.v1/models/in-flow-extension";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { BrandingPreferenceAPIResponseInterface } from "@wso2is/common.branding.v1/models";
import useGetBrandingPreference from "@wso2is/common.branding.v1/api/use-get-branding-preference";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal } from "@wso2is/react-components";
import { LocaleMeta, SupportedLanguagesMeta } from "@wso2is/i18n";
import React, {
    FunctionComponent,
    KeyboardEvent,
    ReactElement,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useInflowExtensionTranslations, {
    TranslationEntry
} from "../../../api/use-inflow-extension-translations";
import {
    INFLOW_EXTENSION_SCREEN,
    getConnectionKeyPrefix
} from "../../../utils/inflow-extension-utils";
import "./in-flow-extension-custom-errors.scss";

/**
 * Props interface for `InFlowExtensionCustomErrors` component.
 */
export interface InFlowExtensionCustomErrorsPropsInterface extends IdentifiableComponentInterface {
    "data-componentid"?: string;
    action: InFlowExtensionResponseInterface;
    isLoading: boolean;
    isReadOnly: boolean;
    loader: () => ReactElement;
}

const DEFAULT_LOCALE: string = "en-US";

/**
 * Local state shape for an entry being created or edited inline.
 */
interface EditState {
    shortKey: string;
    translations: Record<string, string>;
    isNew: boolean;
    selectedLocale: string;
}

// ---------------------------------------------------------------------------
// ExpandedEntryForm sub-component (shared by new-entry card and edit-in-place)
// ---------------------------------------------------------------------------

interface ExpandedEntryFormProps {
    editState: EditState;
    keyPrefix: string;
    supportedLocales: SupportedLanguagesMeta;
    isSaving: boolean;
    onKeyChange: (v: string) => void;
    onLocaleChange: (locale: string) => void;
    onTranslationChange: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const ExpandedEntryForm: FunctionComponent<ExpandedEntryFormProps> = ({
    editState,
    keyPrefix,
    supportedLocales,
    isSaving,
    onKeyChange,
    onLocaleChange,
    onTranslationChange,
    onSave,
    onCancel
}: ExpandedEntryFormProps): ReactElement => {

    const { t } = useTranslation();
    const hasKey: boolean = editState.shortKey.trim().length > 0;
    const configuredLocales: string[] = Object.entries(editState.translations)
        .filter(([ , value ]: [string, string]) => value?.trim().length > 0)
        .map(([ locale ]: [string, string]) => locale);
    const currentValue: string = editState.translations[editState.selectedLocale] ?? "";
    const currentLocaleMeta: LocaleMeta | undefined = supportedLocales[editState.selectedLocale];

    return (
        <Box
            className="inflow-error-entry-expanded-body"
            onClick={ (e) => e.stopPropagation() }
        >
            {/* Error key input */}
            <TextField
                label={ t("inFlowExtension:customErrors.form.keyLabel", { defaultValue: "Error Key" }) }
                value={ editState.shortKey }
                onChange={ (e) => onKeyChange(e.target.value) }
                InputProps={ {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Typography
                                variant="body2"
                                className="inflow-error-key-prefix"
                            >
                                { keyPrefix }
                            </Typography>
                        </InputAdornment>
                    )
                } }
                inputProps={ { pattern: "[a-z.]*" } }
                fullWidth
                size="small"
                disabled={ isSaving }
                sx={ { mb: 2 } }
            />

            <Divider sx={ { mb: 2 } } />

            {/* Locale dropdown */}
            <TextField
                select
                label={ t("inFlowExtension:customErrors.form.localeLabel", { defaultValue: "Locale" }) }
                value={ editState.selectedLocale }
                onChange={ (e) => onLocaleChange(e.target.value) }
                fullWidth
                size="small"
                disabled={ isSaving }
                sx={ { mb: 1.5 } }
                SelectProps={ {
                    renderValue: (selected: unknown) => {
                        const localeKey: string = selected as string;
                        const meta: LocaleMeta | undefined = supportedLocales[localeKey];

                        return (
                            <Box component="span" className="inflow-error-locale-option">
                                { meta && <i className={ `${meta.flag} flag` } /> }
                                <span>{ meta ? `${meta.name} (${meta.code || localeKey})` : localeKey }</span>
                            </Box>
                        );
                    }
                } }
            >
                { Object.entries(supportedLocales).map(([ locale, meta ]: [string, LocaleMeta]) => (
                    <MenuItem key={ locale } value={ locale }>
                        <Box component="span" className="inflow-error-locale-option">
                            <i className={ `${meta.flag} flag` } />
                            <span>{ `${meta.name} (${meta.code || locale})` }</span>
                        </Box>
                    </MenuItem>
                )) }
            </TextField>

            {/* Translation label + input for the selected locale */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={ { mt: 0.5, mb: 0.5, display: "block" } }
            >
                { t("inFlowExtension:customErrors.form.translationLabel", { defaultValue: "Translation" }) }
            </Typography>
            <TextField
                value={ currentValue }
                onChange={ (e) => onTranslationChange(e.target.value) }
                placeholder={ t("inFlowExtension:customErrors.form.translationPlaceholder", {
                    defaultValue: "Enter error message for this locale..."
                }) }
                multiline
                minRows={ 3 }
                fullWidth
                size="small"
                disabled={ isSaving }
                className="inflow-error-locale-textfield"
                helperText={ currentLocaleMeta
                    ? t("inFlowExtension:customErrors.form.translationHelper", {
                        defaultValue: `Shown to users whose locale is ${currentLocaleMeta.name}.`,
                        locale: currentLocaleMeta.name
                    })
                    : undefined
                }
            />

            {/* Configured locales summary */}
            { configuredLocales.length > 0 && (
                <Box sx={ { mt: 1.5 } }>
                    <Typography variant="caption" color="text.secondary">
                        { t("inFlowExtension:customErrors.form.configuredLocales",
                            { defaultValue: "Configured locales:" }) }
                    </Typography>
                    <Box className="inflow-error-configured-chips">
                        { configuredLocales.map((locale: string) => {
                            const meta: LocaleMeta | undefined = supportedLocales[locale];

                            return (
                                <Chip
                                    key={ locale }
                                    label={
                                        <>
                                            { meta && (
                                                <i
                                                    className={ `${meta.flag} flag` }
                                                    style={ { marginRight: 4 } }
                                                />
                                            ) }
                                            { meta?.code || locale }
                                        </>
                                    }
                                    size="small"
                                    variant="outlined"
                                    className="inflow-error-locale-chip"
                                />
                            );
                        }) }
                    </Box>
                </Box>
            ) }

            {/* Action buttons */}
            <Box className="inflow-error-entry-actions-expanded">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={ onCancel }
                    disabled={ isSaving }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={ onSave }
                    disabled={ isSaving || !hasKey || configuredLocales.length === 0 }
                    startIcon={ isSaving ? <CircularProgress size={ 14 } /> : undefined }
                >
                    { editState.isNew
                        ? t("common:create", { defaultValue: "Create" })
                        : t("common:update", { defaultValue: "Update" })
                    }
                </Button>
            </Box>
        </Box>
    );
};

// ---------------------------------------------------------------------------
// EntryCard sub-component (collapsed / expanded)
// ---------------------------------------------------------------------------

interface EntryCardProps {
    entry: TranslationEntry;
    keyPrefix: string;
    supportedLocales: SupportedLanguagesMeta;
    isExpanded: boolean;
    editState: EditState | null;
    isSaving: boolean;
    isDeleting: boolean;
    isReadOnly: boolean;
    onExpand: () => void;
    onKeyChange: (v: string) => void;
    onLocaleChange: (locale: string) => void;
    onTranslationChange: (v: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDeleteRequest: () => void;
}

const EntryCard: FunctionComponent<EntryCardProps> = ({
    entry,
    keyPrefix,
    supportedLocales,
    isExpanded,
    editState,
    isSaving,
    isDeleting,
    isReadOnly,
    onExpand,
    onKeyChange,
    onLocaleChange,
    onTranslationChange,
    onSave,
    onCancel,
    onDeleteRequest
}: EntryCardProps): ReactElement => {

    const { t } = useTranslation();

    return (
        <Box
            className={ `inflow-error-entry-card${isExpanded ? " inflow-error-entry-card--expanded" : ""}` }
            onClick={ !isExpanded ? onExpand : undefined }
            role={ !isExpanded ? "button" : undefined }
            tabIndex={ !isExpanded ? 0 : undefined }
            onKeyDown={ !isExpanded
                ? (e: KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onExpand();
                    }
                }
                : undefined
            }
        >
            {/* Header row: key badge + delete button */}
            <Box className="inflow-error-entry-header">
                <Typography
                    variant="body2"
                    component="code"
                    className="inflow-error-entry-key"
                >
                    { entry.shortKey }
                </Typography>
                { !isReadOnly && (
                    <Tooltip title={ t("common:delete") }>
                        <span>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={ (e) => { e.stopPropagation(); onDeleteRequest(); } }
                                disabled={ isDeleting || isSaving }
                                aria-label={ `Delete ${entry.shortKey}` }
                            >
                                { isDeleting
                                    ? <CircularProgress size={ 16 } />
                                    : <TrashIcon />
                                }
                            </IconButton>
                        </span>
                    </Tooltip>
                ) }
            </Box>

            {/* Collapsed: locale chips */}
            { !isExpanded && (
                <Box className="inflow-error-entry-locales">
                    { Object.entries(entry.translations).map(([ locale, text ]: [string, string]) => {
                        const meta: LocaleMeta = supportedLocales[locale];

                        return (
                            <Tooltip key={ locale } title={ text } placement="bottom">
                                <Chip
                                    size="small"
                                    label={
                                        <>
                                            { meta && (
                                                <i
                                                    className={ `${meta.flag} flag` }
                                                    style={ { marginRight: 4 } }
                                                />
                                            ) }
                                            { meta?.code || locale }
                                        </>
                                    }
                                    className="inflow-error-locale-chip"
                                    variant="outlined"
                                />
                            </Tooltip>
                        );
                    }) }
                </Box>
            ) }

            {/* Expanded: inline edit form */}
            { isExpanded && editState && (
                <ExpandedEntryForm
                    editState={ editState }
                    keyPrefix={ keyPrefix }
                    supportedLocales={ supportedLocales }
                    isSaving={ isSaving }
                    onKeyChange={ onKeyChange }
                    onLocaleChange={ onLocaleChange }
                    onTranslationChange={ onTranslationChange }
                    onSave={ onSave }
                    onCancel={ onCancel }
                />
            ) }
        </Box>
    );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Custom errors tab for in-flow extensions.
 * Allows admins to manage locale-specific error messages for a connection.
 */
export const InFlowExtensionCustomErrors: FunctionComponent<InFlowExtensionCustomErrorsPropsInterface> = ({
    action,
    isLoading: externalLoading,
    isReadOnly,
    loader: Loader,
    ["data-componentid"]: componentId = "in-flow-extension-custom-errors"
}: InFlowExtensionCustomErrorsPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const keyPrefix: string = action ? getConnectionKeyPrefix(action.name) : "";

    const {
        entries,
        localeData,
        isConfiguredPerLocale,
        supportedLocales,
        isLoading: translationsLoading,
        refetch
    } = useInflowExtensionTranslations(keyPrefix, !!action && !externalLoading);

    const {
        data: brandingPreferenceData,
        error: brandingPreferenceError
    } = useGetBrandingPreference<BrandingPreferenceAPIResponseInterface>(tenantDomain);

    const isBrandingEnabled: boolean = useMemo(
        () => (!brandingPreferenceError && brandingPreferenceData?.preference?.configs?.isBrandingEnabled) ?? false,
        [ brandingPreferenceData, brandingPreferenceError ]
    );

    // ---- Local state ----
    const [ expandedKey, setExpandedKey ] = useState<string | null>(null);
    const [ editState, setEditState ] = useState<EditState | null>(null);
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ deletingKey, setDeletingKey ] = useState<string | null>(null);
    const [ deleteConfirmKey, setDeleteConfirmKey ] = useState<string | null>(null);

    // ---- Expand / collapse ----
    const handleExpand = (entry: TranslationEntry): void => {
        if (!isBrandingEnabled || isSaving) return;
        if (expandedKey === entry.shortKey) {
            // Toggle collapse
            setExpandedKey(null);
            setEditState(null);

            return;
        }
        const translations: Record<string, string> = {};

        Object.keys(supportedLocales).forEach((locale: string) => {
            translations[locale] = entry.translations[locale] ?? "";
        });

        const initialLocale: string = supportedLocales[DEFAULT_LOCALE]
            ? DEFAULT_LOCALE
            : Object.keys(supportedLocales)[0] ?? DEFAULT_LOCALE;

        setExpandedKey(entry.shortKey);
        setEditState({
            isNew: false,
            selectedLocale: initialLocale,
            shortKey: entry.shortKey,
            translations
        });
    };

    // ---- Add new ----
    const handleAddNew = (): void => {
        if (!isBrandingEnabled || isSaving) return;
        const translations: Record<string, string> = {};

        Object.keys(supportedLocales).forEach((locale: string) => { translations[locale] = ""; });

        const initialLocale: string = supportedLocales[DEFAULT_LOCALE]
            ? DEFAULT_LOCALE
            : Object.keys(supportedLocales)[0] ?? DEFAULT_LOCALE;

        setExpandedKey("__new__");
        setEditState({
            isNew: true,
            selectedLocale: initialLocale,
            shortKey: "",
            translations
        });
    };

    // ---- Cancel ----
    const handleCancel = (): void => {
        setExpandedKey(null);
        setEditState(null);
    };

    // ---- Field change handlers ----
    const handleKeyChange = (value: string): void => {
        if (!/^[a-z.]*$/.test(value)) return;
        setEditState((prev: EditState | null) => prev ? { ...prev, shortKey: value } : null);
    };

    const handleLocaleChange = (locale: string): void => {
        setEditState((prev: EditState | null) => prev ? { ...prev, selectedLocale: locale } : null);
    };

    const handleTranslationChange = (value: string): void => {
        setEditState((prev: EditState | null) => prev
            ? { ...prev, translations: { ...prev.translations, [prev.selectedLocale]: value } }
            : null
        );
    };

    // ---- Save (create / update) ----
    const handleSave = async (): Promise<void> => {
        if (!editState || !editState.shortKey.trim()) return;

        const newFullKey: string = `${keyPrefix}${editState.shortKey}`;
        const originalFullKey: string | null = editState.isNew ? null : `${keyPrefix}${expandedKey}`;

        setIsSaving(true);
        try {
            for (const locale of Object.keys(supportedLocales)) {
                const newText: string = editState.translations[locale]?.trim() ?? "";
                const currentMap: Record<string, string> = { ...(localeData[locale] ?? {}) };

                // Remove the old key when it has been renamed
                if (originalFullKey && originalFullKey !== newFullKey) {
                    delete currentMap[originalFullKey];
                }

                // Apply new translation (or remove it if cleared)
                if (newText) {
                    currentMap[newFullKey] = newText;
                } else {
                    delete currentMap[newFullKey];
                }

                const wasConfigured: boolean = isConfiguredPerLocale[locale] ?? false;

                if (Object.keys(currentMap).length === 0) {
                    if (wasConfigured) {
                        await deleteCustomTextPreference(tenantDomain, INFLOW_EXTENSION_SCREEN, locale);
                    }
                } else {
                    await updateCustomTextPreference(
                        wasConfigured,
                        { text: currentMap },
                        tenantDomain,
                        INFLOW_EXTENSION_SCREEN,
                        locale
                    );
                }
            }

            await refetch();
            handleCancel();
            dispatch(addAlert({
                description: t("inFlowExtension:customErrors.notifications.save.success.description",
                    { defaultValue: "Translation saved successfully." }),
                level: AlertLevels.SUCCESS,
                message: t("inFlowExtension:customErrors.notifications.save.success.message",
                    { defaultValue: "Translation Saved" })
            }));
        } catch {
            dispatch(addAlert({
                description: t("inFlowExtension:customErrors.notifications.save.error.description",
                    { defaultValue: "Failed to save translation. Please try again." }),
                level: AlertLevels.ERROR,
                message: t("inFlowExtension:customErrors.notifications.save.error.message",
                    { defaultValue: "Save Failed" })
            }));
        } finally {
            setIsSaving(false);
        }
    };

    // ---- Delete ----
    const handleDelete = async (shortKey: string): Promise<void> => {
        const fullKey: string = `${keyPrefix}${shortKey}`;

        setDeletingKey(shortKey);
        try {
            for (const [ locale, textMap ] of Object.entries(localeData)) {
                if (!textMap[fullKey]) continue;

                const { [fullKey]: _removed, ...remaining } = textMap;

                if (Object.keys(remaining).length === 0) {
                    await deleteCustomTextPreference(tenantDomain, INFLOW_EXTENSION_SCREEN, locale);
                } else {
                    await updateCustomTextPreference(
                        true,
                        { text: remaining },
                        tenantDomain,
                        INFLOW_EXTENSION_SCREEN,
                        locale
                    );
                }
            }

            await refetch();
            // Collapse if the deleted entry was expanded
            if (expandedKey === shortKey) {
                setExpandedKey(null);
                setEditState(null);
            }
            dispatch(addAlert({
                description: t("inFlowExtension:customErrors.notifications.delete.success.description",
                    { defaultValue: "Translation deleted successfully." }),
                level: AlertLevels.SUCCESS,
                message: t("inFlowExtension:customErrors.notifications.delete.success.message",
                    { defaultValue: "Translation Deleted" })
            }));
        } catch {
            dispatch(addAlert({
                description: t("inFlowExtension:customErrors.notifications.delete.error.description",
                    { defaultValue: "Failed to delete translation. Please try again." }),
                level: AlertLevels.ERROR,
                message: t("inFlowExtension:customErrors.notifications.delete.error.message",
                    { defaultValue: "Delete Failed" })
            }));
        } finally {
            setDeletingKey(null);
            setDeleteConfirmKey(null);
        }
    };

    // ---- Loading guard ----
    if (externalLoading || translationsLoading) {
        return <Loader />;
    }

    const hasLocales: boolean = Object.keys(supportedLocales).length > 0;
    const isNewEntryOpen: boolean = expandedKey === "__new__";

    return (
        <div
            className="inflow-extension-custom-errors"
            data-componentid={ componentId }
        >
            <Grid container spacing={ 3 }>
                {/* ── Entry management ── */}
                <Grid xs={ 12 } sm={ 8 } md={ 6 }>
                    <Box className="inflow-error-left-panel">

                        {/* Header */}
                        <Box className="inflow-error-panel-header">
                            <Typography variant="h6">
                                { t("inFlowExtension:customErrors.title",
                                    { defaultValue: "Custom Error Messages" }) }
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={ { mt: 0.5 } }>
                                { t("inFlowExtension:customErrors.description", {
                                    defaultValue:
                                        "Define error messages this extension can return. " +
                                        "Click a card to edit, or add a new translation below."
                                }) }
                            </Typography>
                        </Box>

                        {/* Branding disabled warning */}
                        { !isBrandingEnabled && (
                            <Alert severity="warning" className="inflow-error-branding-warning">
                                <Trans
                                    i18nKey="inFlowExtension:customErrors.brandingDisabledWarning"
                                    defaults={ "Enable <brandingLink>branding</brandingLink> to manage " +
                                        "custom error translations." }
                                    components={ {
                                        brandingLink: (
                                            <Link
                                                onClick={ () => history.push(
                                                    AppConstants.getPaths().get("BRANDING")
                                                ) }
                                                sx={ { cursor: "pointer", fontWeight: 500 } }
                                            />
                                        )
                                    } }
                                />
                            </Alert>
                        ) }

                        {/* No-locales warning */}
                        { !hasLocales && (
                            <Alert severity="warning">
                                { t("inFlowExtension:customErrors.noLocalesWarning", {
                                    defaultValue:
                                        "No supported locales found. Check your branding configuration."
                                }) }
                            </Alert>
                        ) }

                        {/* New entry card (always in expanded / create mode) */}
                        { isNewEntryOpen && editState && (
                            <Box className="inflow-error-entry-card inflow-error-entry-card--expanded
                                inflow-error-entry-card--new">
                                <Box className="inflow-error-entry-header">
                                    <Typography variant="subtitle2">
                                        { t("inFlowExtension:customErrors.newEntry.heading",
                                            { defaultValue: "New Translation" }) }
                                    </Typography>
                                </Box>
                                <ExpandedEntryForm
                                    editState={ editState }
                                    keyPrefix={ keyPrefix }
                                    supportedLocales={ supportedLocales }
                                    isSaving={ isSaving }
                                    onKeyChange={ handleKeyChange }
                                    onLocaleChange={ handleLocaleChange }
                                    onTranslationChange={ handleTranslationChange }
                                    onSave={ handleSave }
                                    onCancel={ handleCancel }
                                />
                            </Box>
                        ) }

                        {/* Existing entry cards */}
                        { entries.length > 0 ? (
                            <Box className="inflow-error-entries-list">
                                { entries.map((entry: TranslationEntry) => (
                                    <EntryCard
                                        key={ entry.shortKey }
                                        entry={ entry }
                                        keyPrefix={ keyPrefix }
                                        supportedLocales={ supportedLocales }
                                        isExpanded={ expandedKey === entry.shortKey }
                                        editState={ expandedKey === entry.shortKey ? editState : null }
                                        isSaving={ isSaving }
                                        isDeleting={ deletingKey === entry.shortKey }
                                        isReadOnly={ isReadOnly }
                                        onExpand={ () => handleExpand(entry) }
                                        onKeyChange={ handleKeyChange }
                                        onLocaleChange={ handleLocaleChange }
                                        onTranslationChange={ handleTranslationChange }
                                        onSave={ handleSave }
                                        onCancel={ handleCancel }
                                        onDeleteRequest={ () => setDeleteConfirmKey(entry.shortKey) }
                                    />
                                )) }
                            </Box>
                        ) : (
                            !isNewEntryOpen && (
                                <Box className="inflow-error-empty-state">
                                    <Typography variant="body2" color="text.secondary">
                                        { t("inFlowExtension:customErrors.emptyState", {
                                            defaultValue:
                                                "No custom error messages configured. Add translations to " +
                                                "customize the error text your users see."
                                        }) }
                                    </Typography>
                                </Box>
                            )
                        ) }

                        {/* Add translation button */}
                        { !isReadOnly && (
                            <Button
                                variant="outlined"
                                startIcon={ <PlusIcon /> }
                                onClick={ handleAddNew }
                                disabled={ isSaving || !hasLocales || !isBrandingEnabled || isNewEntryOpen }
                                className="inflow-error-add-button"
                            >
                                { t("inFlowExtension:customErrors.addButton",
                                    { defaultValue: "Add Translation" }) }
                            </Button>
                        ) }
                    </Box>
                </Grid>
            </Grid>

            {/* Delete confirmation modal */}
            { deleteConfirmKey && (
                <ConfirmationModal
                    onClose={ () => setDeleteConfirmKey(null) }
                    type="negative"
                    open={ !!deleteConfirmKey }
                    assertionHint={ t("inFlowExtension:customErrors.deleteConfirm.assertionHint",
                        { defaultValue: "Please confirm the action." }) }
                    assertionType="checkbox"
                    primaryAction={ t("common:delete") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ () => setDeleteConfirmKey(null) }
                    onPrimaryActionClick={ () => handleDelete(deleteConfirmKey) }
                    data-componentid="inflow-extension-delete-confirmation-modal"
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("inFlowExtension:customErrors.deleteConfirm.header",
                            { defaultValue: "Delete Translation?" }) }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("inFlowExtension:customErrors.deleteConfirm.message", {
                            defaultValue:
                                `This will delete all locale translations for key "${deleteConfirmKey}".`,
                            key: deleteConfirmKey
                        }) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("inFlowExtension:customErrors.deleteConfirm.content",
                            { defaultValue: "This action cannot be undone." }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </div>
    );
};
