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

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardActions from "@oxygen-ui/react/CardActions";
import CardContent from "@oxygen-ui/react/CardContent";
import CardHeader from "@oxygen-ui/react/CardHeader";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon, TrashIcon, XMarkIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import lowerCase from "lodash-es/lowerCase";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Interface for screen type option.
 */
interface ScreenTypeOption {
    id: string;
    label: string;
}

/**
 * Interface for i18n key option.
 */
interface I18nKeyOption {
    label: string;
}

/**
 * Interface for language locale option.
 */
interface LocaleOption {
    value: string;
    label: ReactElement;
    code: string;
}

/**
 * Props interface of {@link I18nConfigurationCard}
 */
export interface I18nConfigurationCardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the card is open or not.
     */
    open: boolean;
    /**
     * The reference element for positioning.
     */
    anchorEl: HTMLElement | null;
    /**
     * The property key being configured.
     */
    propertyKey: string;
    /**
     * Callback fired when the card should be closed.
     */
    onClose: () => void;
}

/**
 * I18n configuration floating card component.
 *
 * @param props - Props injected to the component.
 * @returns The I18nConfigurationCard component.
 */
const I18nConfigurationCard: FunctionComponent<I18nConfigurationCardPropsInterface> = ({
    "data-componentid": componentId = "i18n-configuration-card",
    open,
    anchorEl,
    propertyKey,
    onClose
}: I18nConfigurationCardPropsInterface): ReactElement | null => {
    const { t } = useTranslation();
    const cardRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const [ position, setPosition ] = useState<{ top: number; left: number }>({ left: 0, top: 0 });

    // Get supported languages from Redux store
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    // State for screen types and i18n keys
    const [ screenTypes, setScreenTypes ] = useState<ScreenTypeOption[]>([
        { id: "login", label: "Login Screen" },
        { id: "signup", label: "Sign Up Screen" },
        { id: "profile", label: "Profile Screen This is tool login screen name" },
        { id: "settings", label: "Settings Screen" }
    ]);
    const [ selectedScreenType, setSelectedScreenType ] = useState<ScreenTypeOption | null>(null);
    const [ screenTypeInputValue, setScreenTypeInputValue ] = useState<string>("");

    const [ i18nKeys, setI18nKeys ] = useState<Record<string, I18nKeyOption[]>>({
        login: [
            { label: "login.title" },
            { label: "login.subtitle" },
            { label: "login.button" }
        ],
        profile: [
            { label: "profile.title" },
            { label: "profile.edit.hdkaj.hdajkd.dhjhahd.dhjad.dajhd.dhagh" }
        ],
        settings: [
            { label: "settings.title" },
            { label: "settings.save" }
        ],
        signup: [
            { label: "signup.title" },
            { label: "signup.subtitle" },
            { label: "signup.button" }
        ]
    });
    const [ selectedI18nKey, setSelectedI18nKey ] = useState<I18nKeyOption | null>(null);
    const [ i18nKeyInputValue, setI18nKeyInputValue ] = useState<string>("");

    // State for language configuration
    const [ selectedLanguage, setSelectedLanguage ] = useState<string>("");
    const [ languageTexts, setLanguageTexts ] = useState<Record<string, string>>({});

    // Create dropdown options from supported languages
    const supportedLocales: LocaleOption[] = useMemo(() => {
        if (!supportedI18nLanguages) {
            return [];
        }

        const supportedLocales: LocaleOption[] = [];

        Object.keys(supportedI18nLanguages).map((key: string) => {
            supportedLocales.push({
                code: supportedI18nLanguages[key].code,
                label: (
                    <div className="language-flag-display">
                        <i className={ `${supportedI18nLanguages[key].flag} flag` }></i>
                        <span>{ supportedI18nLanguages[key].name }, { supportedI18nLanguages[key].code }</span>
                    </div>
                ),
                value: supportedI18nLanguages[key].code
            });
        });

        return supportedLocales;
    }, [ supportedI18nLanguages ]);

    // Set default language to first available language
    useEffect(() => {
        if (supportedLocales.length > 0 && !selectedLanguage) {
            setSelectedLanguage(supportedLocales[0].value as string);
        }
    }, [ supportedLocales, selectedLanguage ]);

    /**
     * Handles adding a new screen type.
     */
    const handleAddScreenType = (): void => {
        if (screenTypeInputValue.trim()) {
            const newScreenType: ScreenTypeOption = {
                id: screenTypeInputValue.toLowerCase().replace(/\s+/g, "-"),
                label: screenTypeInputValue.trim()
            };

            setScreenTypes([ ...screenTypes, newScreenType ]);
            setI18nKeys({ ...i18nKeys, [newScreenType.id]: [] });
            setSelectedScreenType(newScreenType);
            setScreenTypeInputValue("");
        }
    };

    /**
     * Checks if the screen type input contains a new value not in the existing options.
     */
    const isNewScreenType = (): boolean => {
        return screenTypeInputValue.trim() !== "" &&
               !screenTypes.some((type: ScreenTypeOption) =>
                   type.label.toLowerCase() === screenTypeInputValue.toLowerCase().trim()
               );
    };

    /**
     * Handles adding a new i18n key.
     */
    const handleAddI18nKey = (): void => {
        if (selectedScreenType && i18nKeyInputValue.trim()) {
            const keyParts: string[] = i18nKeyInputValue.split(":");
            const key: string = keyParts[0]?.trim() || i18nKeyInputValue.trim();

            const newKey: I18nKeyOption = {
                label: `${selectedScreenType.id}-${key.toLowerCase().replace(/\s+/g, "-")}`
            };
            const updatedKeys: I18nKeyOption[] = [ ...i18nKeys[selectedScreenType.id], newKey ];

            setI18nKeys({ ...i18nKeys, [selectedScreenType.id]: updatedKeys });
            setSelectedI18nKey(newKey);
            setI18nKeyInputValue("");
        }
    };

    /**
     * Checks if the i18n key input contains a new value not in the existing options.
     */
    const isNewI18nKey = (): boolean => {
        if (!selectedScreenType || i18nKeyInputValue.trim() === "") return false;

        const keyParts: string[] = i18nKeyInputValue.split(":");
        const inputKey: string = keyParts[0]?.trim() || i18nKeyInputValue.trim();

        return !i18nKeys[selectedScreenType.id]?.some((key: I18nKeyOption) =>
            key.label.toLowerCase() === inputKey.toLowerCase()
        );
    };

    /**
     * Handles deleting a screen type.
     */
    const handleDeleteScreenType = (screenTypeId: string): void => {
        setScreenTypes(screenTypes.filter((type: ScreenTypeOption) => type.id !== screenTypeId));
        const updatedI18nKeys: Record<string, I18nKeyOption[]> = { ...i18nKeys };

        delete updatedI18nKeys[screenTypeId];
        setI18nKeys(updatedI18nKeys);
        if (selectedScreenType?.id === screenTypeId) {
            setSelectedScreenType(null);
            setSelectedI18nKey(null);
        }
    };

    /**
     * Handles deleting an i18n key.
     */
    const handleDeleteI18nKey = (keyId: string): void => {
        if (selectedScreenType) {
            const updatedKeys: I18nKeyOption[] = i18nKeys[selectedScreenType.id]
                .filter((key: I18nKeyOption) => key.label !== keyId);

            setI18nKeys({ ...i18nKeys, [selectedScreenType.id]: updatedKeys });
            if (selectedI18nKey?.label === keyId) {
                setSelectedI18nKey(null);
            }
        }
    };

    /**
     * Gets the available i18n keys for the selected screen type.
     */
    const getAvailableI18nKeys = (): I18nKeyOption[] => {
        return selectedScreenType ? i18nKeys[selectedScreenType.id] || [] : [];
    };

    /**
     * Handles language selection from the dropdown.
     */
    const handleLanguageChange = (event: SelectChangeEvent<unknown>): void => {
        setSelectedLanguage(event.target.value as string);
    };

    /**
     * Handles text change for the current language.
     */
    const handleLanguageTextChange = (value: string): void => {
        setLanguageTexts({
            ...languageTexts,
            [selectedLanguage]: value
        });
    };

    /**
     * Effect to update the position of the card based on the anchor element.
     */
    useEffect(() => {
        if (open && anchorEl && cardRef.current) {
            const updatePosition = () => {
                const anchorRect: DOMRect = anchorEl.getBoundingClientRect();
                const cardRect: DOMRect = cardRef.current.getBoundingClientRect();
                const viewportWidth: number = window.innerWidth;
                const viewportHeight: number = window.innerHeight;

                let left: number = anchorRect.right + 8;
                let top: number = anchorRect.top;

                // Adjust horizontal position if card would go off-screen.
                if (left + cardRect.width > viewportWidth) {
                    left = anchorRect.left - cardRect.width - 8;
                }

                // Adjust vertical position if card would go off-screen.
                if (top + cardRect.height > viewportHeight) {
                    top = viewportHeight - cardRect.height - 16;
                }

                setPosition({ left, top });
            };

            updatePosition();

            // Update position on scroll or resize.
            const handleScroll = () => updatePosition();
            const handleResize = () => updatePosition();

            window.addEventListener("scroll", handleScroll, true);
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("scroll", handleScroll, true);
                window.removeEventListener("resize", handleResize);
            };
        }
    }, [ open, anchorEl ]);

    /**
     * Handles the save action of the i18n configuration card.
     */
    const handleSave = (): void => {
        if (selectedScreenType && selectedI18nKey) {
            // TODO: Implement save logic here - update the property with selected i18n key
            // eslint-disable-next-line no-console
            console.log("Saving i18n configuration:", {
                i18nKey: selectedI18nKey,
                propertyKey,
                screenType: selectedScreenType
            });
        } else if (selectedScreenType && isNewI18nKey()) {
            // Handle new i18n key creation and save
            handleAddI18nKey();
            // The save logic will be called again after the key is added

            return;
        }
        onClose();
    };

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            className="flow-builder-resource-property-panel-text-field card-backdrop"
            onClick={ onClose }
            data-componentid={ `${componentId}-backdrop` }
        >
            <Card
                ref={ cardRef }
                className="card"
                style={ {
                    left: position.left,
                    top: position.top
                } }
                onClick={ (e: React.MouseEvent) => e.stopPropagation() }
                data-componentid={ componentId }
            >
                <CardHeader
                    title={ t("flows:core.elements.textPropertyField.i18nCard.title", {
                        propertyKey: lowerCase(propertyKey)
                    }) }
                    action={ (
                        <IconButton
                            aria-label={ t("common:close") }
                            onClick={ onClose }
                            size="small"
                        >
                            <XMarkIcon />
                        </IconButton>
                    ) }
                    className="card-header"
                />
                <CardContent className="card-content">
                    <div className="i18n-config-container">
                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                { t("flows:core.elements.textPropertyField.i18nCard.screenName") }
                            </Typography>
                            <div className="i18n-selection-row">
                                <Autocomplete
                                    freeSolo
                                    options={ screenTypes }
                                    getOptionLabel={ (option: ScreenTypeOption | string) =>
                                        typeof option === "string" ? option : option.label
                                    }
                                    value={ selectedScreenType }
                                    inputValue={ screenTypeInputValue }
                                    onChange={ (
                                        _event: React.SyntheticEvent,
                                        newValue: ScreenTypeOption | string | null
                                    ) => {
                                        if (typeof newValue === "string") {
                                            // Handle free solo input
                                            setScreenTypeInputValue(newValue);
                                            setSelectedScreenType(null);
                                        } else {
                                            setSelectedScreenType(newValue);
                                            setScreenTypeInputValue(newValue?.label || "");
                                        }
                                        setSelectedI18nKey(null);
                                    } }
                                    onInputChange={ (_event: React.SyntheticEvent, newInputValue: string) => {
                                        setScreenTypeInputValue(newInputValue);
                                        if (newInputValue === "") {
                                            setSelectedScreenType(null);
                                        }
                                    } }
                                    renderInput={ (params: any) => (
                                        <TextField
                                            { ...params }
                                            placeholder={
                                                t("flows:core.elements.textPropertyField.i18nCard.selectScreenName")
                                            }
                                            size="small"
                                        />
                                    ) }
                                    renderOption={ (props: any, option: ScreenTypeOption) => (
                                        <li { ...props } className="option-item">
                                            <Tooltip title={ option.label } placement="top">
                                                <span className="option-text">{ option.label }</span>
                                            </Tooltip>
                                            <IconButton
                                                size="small"
                                                onClick={ (e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    handleDeleteScreenType(option.id);
                                                } }
                                                aria-label={ t("common:delete") }
                                                className="delete-icon-button"
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        </li>
                                    ) }
                                    slotProps={ {
                                        popper: {
                                            className: "flow-builder-resource-property-panel-text-field"
                                        }
                                    } }
                                />
                                <Tooltip
                                    title={ t("flows:core.elements.textPropertyField.tooltip.addScreenName") }
                                >
                                    <span>
                                        <IconButton
                                            size="small"
                                            onClick={ handleAddScreenType }
                                            disabled={ !isNewScreenType() }
                                            className="add-icon-button"
                                        >
                                            <PlusIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </div>
                        </div>

                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                { t("flows:core.elements.textPropertyField.i18nCard.i18nKey") }
                            </Typography>
                            <div className="i18n-selection-row">
                                <Autocomplete
                                    freeSolo
                                    options={ getAvailableI18nKeys() }
                                    getOptionLabel={ (option: I18nKeyOption) =>
                                        `${option.label}`
                                    }
                                    value={ selectedI18nKey }
                                    inputValue={ i18nKeyInputValue }
                                    onChange={ (
                                        _event: React.SyntheticEvent,
                                        newValue: I18nKeyOption | string | null
                                    ) => {
                                        if (typeof newValue === "string") {
                                            // Handle free solo input
                                            setI18nKeyInputValue(newValue);
                                            setSelectedI18nKey(null);
                                        } else {
                                            setSelectedI18nKey(newValue);
                                            setI18nKeyInputValue(newValue ? `${newValue.label}` : "");
                                        }
                                    } }
                                    onInputChange={ (_event: React.SyntheticEvent, newInputValue: string) => {
                                        setI18nKeyInputValue(newInputValue);
                                        if (newInputValue === "") {
                                            setSelectedI18nKey(null);
                                        }
                                    } }
                                    disabled={ !selectedScreenType }
                                    renderInput={ (params: any) => (
                                        <TextField
                                            { ...params }
                                            placeholder={ selectedScreenType
                                                ? t("flows:core.elements.textPropertyField.i18nCard.selectI18nKey")
                                                : t("flows:core.elements.textPropertyField.i18nCard.selectScreen"
                                                        + "TypeFirst")
                                            }
                                            size="small"
                                        />
                                    ) }
                                    renderOption={ (props: any, option: I18nKeyOption) => (
                                        <li { ...props } className="option-item">
                                            <Tooltip title={ option.label } placement="top">
                                                <span className="option-text">{ option.label }</span>
                                            </Tooltip>
                                            <IconButton
                                                size="small"
                                                onClick={ (e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    handleDeleteI18nKey(option.label);
                                                } }
                                                aria-label={ t("common:delete") }
                                                className="delete-icon-button"
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        </li>
                                    ) }
                                    slotProps={ {
                                        popper: {
                                            className: "flow-builder-resource-property-panel-text-field"
                                        }
                                    } }
                                />
                                <Tooltip
                                    title={ t("flows:core.elements.textPropertyField.tooltip.addI18nKey") }
                                >
                                    <span>
                                        <IconButton
                                            size="small"
                                            onClick={ handleAddI18nKey }
                                            disabled={ !selectedScreenType || !isNewI18nKey() }
                                            className="add-icon-button"
                                        >
                                            <PlusIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </div>
                        </div>

                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                { t("flows:core.elements.textPropertyField.i18nCard.languageText") }
                            </Typography>
                            <div className="i18n-selection-row">
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={
                                        t("flows:core.elements.textPropertyField.i18nCard.languageTextPlaceholder")
                                    }
                                    value={ languageTexts[selectedLanguage] || "" }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleLanguageTextChange(e.target.value)
                                    }
                                    disabled={ !selectedScreenType || !selectedI18nKey }
                                />
                                <Select
                                    value={ selectedLanguage }
                                    onChange={ handleLanguageChange }
                                    displayEmpty
                                    size="small"
                                    disabled={ !selectedScreenType || !selectedI18nKey }
                                    placeholder={ t("flows:core.elements.textPropertyField.i18nCard.selectLanguage") }
                                    renderValue={ (value: string) => (
                                        <i
                                            className={
                                                `${supportedI18nLanguages[value]?.flag} flag`
                                            }
                                        ></i>
                                    ) }
                                >
                                    { supportedLocales.map((locale: LocaleOption) => (
                                        <MenuItem
                                            key={ locale.code }
                                            value={ locale.value }
                                        >
                                            <i
                                                className={
                                                    `${supportedI18nLanguages[locale.code]?.flag} flag`
                                                }
                                            ></i>
                                            <span>
                                                { supportedI18nLanguages[locale.code]?.name }, { locale.code }
                                            </span>
                                        </MenuItem>
                                    )) }
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardActions className="card-actions">
                    <Button
                        size="small"
                        onClick={ handleSave }
                        variant="contained"
                        color="primary"
                    >
                        { t("common:save") }
                    </Button>
                </CardActions>
            </Card>
        </div>,
        document.body
    );
};

export default I18nConfigurationCard;
