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
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Link from "@oxygen-ui/react/Link";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { LocaleMeta, SupportedLanguagesMeta } from "@wso2is/i18n";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";

/**
 * Props interface for `InFlowExtensionTranslationDialog`.
 */
export interface InFlowExtensionTranslationDialogPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
    mode: "create" | "edit";
    keyPrefix: string;
    initialKey: string;
    initialTranslations: Record<string, string>;
    supportedLocales: SupportedLanguagesMeta;
    isBrandingEnabled: boolean;
    onSave: (shortKey: string, translations: Record<string, string>) => Promise<void>;
    onClose: () => void;
}

/**
 * Translation dialog for creating/editing translation entries.
 * Matches the flow builder's i18n configuration card pattern.
 */
const InFlowExtensionTranslationDialog: FunctionComponent<InFlowExtensionTranslationDialogPropsInterface> = ({
    open,
    mode,
    keyPrefix,
    initialKey,
    initialTranslations,
    supportedLocales,
    isBrandingEnabled,
    onSave,
    onClose,
    ["data-componentid"]: componentId = "inflow-extension-translation-dialog"
}: InFlowExtensionTranslationDialogPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const localeEntries: [string, LocaleMeta][] = Object.entries(supportedLocales) as [string, LocaleMeta][];
    const defaultLocale: string = localeEntries.length > 0 ? localeEntries[0][0] : "";

    const [ keyValue, setKeyValue ] = useState<string>("");
    const [ selectedLocale, setSelectedLocale ] = useState<string>(defaultLocale);
    const [ translations, setTranslations ] = useState<Record<string, string>>({});
    const [ isSaving, setIsSaving ] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            setKeyValue(initialKey || "");
            setTranslations(initialTranslations ? { ...initialTranslations } : {});
            setSelectedLocale(
                initialTranslations && Object.keys(initialTranslations).length > 0
                    ? Object.keys(initialTranslations)[0]
                    : defaultLocale
            );
            setIsSaving(false);
        }
    }, [ open, initialKey, initialTranslations, defaultLocale ]);

    const handleKeyChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        const value: string = event.target.value.trim();

        if (!/^[a-z.]*$/.test(value)) {
            return;
        }

        setKeyValue(value);
    }, []);

    const handleLocaleChange = useCallback((event: SelectChangeEvent<unknown>): void => {
        setSelectedLocale(event.target.value as string);
    }, []);

    const handleTranslationChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        const text: string = event.target.value;

        setTranslations((prev: Record<string, string>) => ({
            ...prev,
            [selectedLocale]: text
        }));
    }, [ selectedLocale ]);

    const handleSave = useCallback(async (): Promise<void> => {
        if (!keyValue) return;

        const nonEmptyTranslations: Record<string, string> = {};

        Object.entries(translations).forEach(([ locale, text ]: [string, string]) => {
            if (text && text.trim()) {
                nonEmptyTranslations[locale] = text;
            }
        });

        if (Object.keys(nonEmptyTranslations).length === 0) return;

        setIsSaving(true);

        try {
            await onSave(keyValue, nonEmptyTranslations);
        } finally {
            setIsSaving(false);
        }
    }, [ keyValue, translations, onSave ]);

    const handleNavigateToBranding = useCallback((): void => {
        history.push(AppConstants.getPaths().get("BRANDING"));
    }, []);

    const currentTranslationText: string = translations[selectedLocale] ?? "";
    const hasValidInput: boolean = !!keyValue && Object.values(translations).some(
        (text: string) => text && text.trim()
    );

    return (
        <Dialog
            open={ open }
            onClose={ onClose }
            maxWidth="sm"
            fullWidth
            data-componentid={ componentId }
            PaperProps={ {
                sx: { borderRadius: "10px" }
            } }
        >
            <DialogTitle sx={ { pb: 0.5 } }>
                { mode === "create"
                    ? t("inFlowExtension:customErrors.dialog.createTitle",
                        { defaultValue: "Create Translation" })
                    : t("inFlowExtension:customErrors.dialog.updateTitle",
                        { defaultValue: "Update Translation" })
                }
            </DialogTitle>
            <DialogContent sx={ { display: "flex", flexDirection: "column", gap: 2.5, pt: "12px !important" } }>
                { !isBrandingEnabled && (
                    <Alert severity="warning">
                        <Trans
                            i18nKey="inFlowExtension:customErrors.dialog.brandingDisabledWarning"
                            defaults="Enable <brandingLink>branding</brandingLink> to manage translation text."
                            components={ {
                                brandingLink: (
                                    <Link
                                        onClick={ handleNavigateToBranding }
                                        sx={ { cursor: "pointer", fontWeight: 500 } }
                                    />
                                )
                            } }
                        />
                    </Alert>
                ) }

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("inFlowExtension:customErrors.dialog.keyLabel",
                            { defaultValue: "Translation Key" }) }
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={ t("inFlowExtension:customErrors.dialog.keyPlaceholder",
                            { defaultValue: "e.g. error.message" }) }
                        value={ keyValue }
                        onChange={ handleKeyChange }
                        disabled={ mode === "edit" || !isBrandingEnabled }
                        InputProps={ {
                            startAdornment: (
                                <InputAdornment position="start">
                                    { keyPrefix }
                                </InputAdornment>
                            )
                        } }
                        data-componentid={ `${componentId}-key-input` }
                    />
                    { mode === "create" && (
                        <Typography variant="caption" color="text.secondary" sx={ { mt: 0.5 } }>
                            { t("inFlowExtension:customErrors.dialog.keyHint",
                                {
                                    defaultValue: "Only lowercase letters and dots allowed. " +
                                        "The key will be prefixed with \"{{keyPrefix}}\".",
                                    keyPrefix
                                }) }
                        </Typography>
                    ) }
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("inFlowExtension:customErrors.dialog.languageLabel",
                            { defaultValue: "Language" }) }
                    </Typography>
                    <Select
                        fullWidth
                        value={ selectedLocale }
                        onChange={ handleLocaleChange }
                        size="small"
                        disabled={ !isBrandingEnabled }
                        displayEmpty
                        renderValue={ (value: string) => {
                            const meta: LocaleMeta = supportedLocales[value];

                            if (!meta) return value;

                            return (
                                <>
                                    <i className={ `${meta.flag} flag` }></i>
                                    <span>{ `${meta.name}, ${meta.code}` }</span>
                                </>
                            );
                        } }
                        data-componentid={ `${componentId}-language-select` }
                    >
                        { localeEntries.map(([ code, locale ]: [string, LocaleMeta]) => (
                            <MenuItem key={ code } value={ code }>
                                <i className={ `${locale.flag} flag` }></i>
                                <span>{ locale.name }, { locale.code }</span>
                            </MenuItem>
                        )) }
                    </Select>
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("inFlowExtension:customErrors.dialog.translationLabel",
                            { defaultValue: "Translation" }) }
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={ t("inFlowExtension:customErrors.dialog.translationPlaceholder",
                            { defaultValue: "Enter the translation text for the selected language..." }) }
                        value={ currentTranslationText }
                        onChange={ handleTranslationChange }
                        disabled={ !isBrandingEnabled }
                        multiline
                        rows={ 3 }
                        data-componentid={ `${componentId}-translation-input` }
                    />
                </div>
            </DialogContent>
            <DialogActions sx={ { px: 3, py: 2 } }>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={ onClose }
                >
                    { mode === "create"
                        ? t("common:cancel")
                        : t("common:cancel")
                    }
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={ handleSave }
                    disabled={ !hasValidInput || isSaving || !isBrandingEnabled }
                    loading={ isSaving }
                >
                    { mode === "create"
                        ? t("common:create")
                        : t("common:update")
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InFlowExtensionTranslationDialog;
