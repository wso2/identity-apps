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

import Autocomplete from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardActions from "@oxygen-ui/react/CardActions";
import CardContent from "@oxygen-ui/react/CardContent";
import CardHeader from "@oxygen-ui/react/CardHeader";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import Link from "@oxygen-ui/react/Link";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon, TrashIcon, XMarkIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { PreviewScreenType } from "@wso2is/common.branding.v1/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocaleMeta } from "@wso2is/i18n";
import cloneDeep from "lodash-es/cloneDeep";
import lowerCase from "lodash-es/lowerCase";
import upperFirst from "lodash-es/upperFirst";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { createPortal } from "react-dom";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import "./i18n-configuration-card.scss";

/**
 * Interface for screen type option.
 */
interface ScreenTypeOption {
    id: string;
    label: string;
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
    /**
     * Current selected i18n key.
     */
    i18nKey: string;
    /**
     * Callback fired when the i18n key is changed.
     *
     * @param i18nKey - The new i18n key.
     */
    onChange: (i18nKey: string) => void;
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
    onClose,
    onChange,
    i18nKey: selectedI18nKey
}: I18nConfigurationCardPropsInterface): ReactElement | null => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const {
        i18nText,
        i18nTextLoading,
        isBrandingEnabled,
        screenMeta,
        isCustomI18nKey,
        updateI18nKey,
        isI18nSubmitting,
        language: selectedLanguage,
        setLanguage: setSelectedLanguage,
        supportedLocales
    } = useAuthenticationFlowBuilderCore();

    const cardRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const [ position, setPosition ] = useState<{ top: number; left: number }>({ left: 0, top: 0 });
    const [ selectedScreenType, setSelectedScreenType ] = useState<ScreenTypeOption>(null);
    const [ isCustomizeView, setIsCustomizeView ] = useState<boolean>(false);
    const [ i18nKeyInputValue, setI18nKeyInputValue ] = useState<string>("");
    const [ languageTexts, setLanguageTexts ] = useState<{
        [key in PreviewScreenType]?: Record<string, Record<string, string>>}>({});
    const [ deletedI18nKeys, setDeletedI18nKeys ] = useState<{ [key in PreviewScreenType]?: string[] }>({});

    /**
     * Effect to update the position of the card based on the anchor element.
     */
    useEffect(() => {

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

        // Update position on scroll or resize.
        const handleScroll = () => requestAnimationFrame(updatePosition);
        const handleResize = () => requestAnimationFrame(updatePosition);

        if (open && anchorEl && cardRef.current) {
            requestAnimationFrame(updatePosition);

            window.addEventListener("scroll", handleScroll, true);
            window.addEventListener("resize", handleResize);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleResize);
        };
    }, [ open, anchorEl, isCustomizeView ]);

    /**
     * Build the list of all available screen types.
     */
    const screenTypes: ScreenTypeOption[] = useMemo(() => {
        if (!i18nText || !screenMeta) {
            return [];
        }

        return Object.keys(i18nText).map((key: string) => ({
            id: key,
            label: screenMeta[ key ]?.label ?? upperFirst(lowerCase(key))
        }));
    }, [ i18nText, screenMeta ]);

    /**
     * Build the list of all available i18n keys.
     */
    const i18nKeys: string[] = useMemo(() => {
        if (!i18nText) {
            return [];
        }

        const keys: string[] = [];

        Object.values(i18nText).forEach((screenTexts: Record<string, string>) => {
            keys.push(...Object.keys(screenTexts));
        });

        return keys;
    },  [ i18nText ]);

    /**
     * Get available i18n keys for the selected screen type.
     */
    const availableI18nKeys: string[] = useMemo(() => {
        if (!selectedScreenType || !i18nText || !i18nText[selectedScreenType.id]) {
            return [];
        }

        const keys: string[] = [];

        Object.keys(i18nText[selectedScreenType.id]).forEach((key: string) => {
            if (!deletedI18nKeys?.[selectedScreenType.id]?.includes(key)) {
                keys.push(key);
            }
        });

        return keys;
    }, [ selectedScreenType, i18nText, deletedI18nKeys ]);

    /**
     * Handles deleting an i18n key.
     */
    const handleDeleteI18nKey = (keyId: string): void => {
        setDeletedI18nKeys((prevKeys: { [key in PreviewScreenType]?: string[] }) => ({
            ...prevKeys,
            [selectedScreenType.id]: [ ...(prevKeys?.[selectedScreenType.id] || []), keyId ]
        }));
        setLanguageTexts((prevTexts: { [key in PreviewScreenType]: Record<string, Record<string, string>> }) => {
            if (prevTexts?.[selectedScreenType.id]?.[selectedLanguage]?.[keyId]) {
                const updatedTexts: { [key in PreviewScreenType]: Record<string, Record<string, string>> } =
                    cloneDeep(prevTexts);

                delete updatedTexts[selectedScreenType.id][selectedLanguage][keyId];

                return updatedTexts;
            }

            const originalTexts: Record<string, string> = i18nText[selectedScreenType.id];

            delete originalTexts[keyId];

            return {
                ...prevTexts,
                [selectedScreenType.id]: {
                    ...prevTexts?.[selectedScreenType.id],
                    [selectedLanguage]: {
                        ...originalTexts,
                        ...prevTexts?.[selectedScreenType.id]?.[selectedLanguage]
                    }
                }
            };
        });
    };

    /**
     * Handles save in customize view and return to simple view.
     */
    const handleSaveCustomize = async (): Promise<void> => {
        const updateCalls: Promise<boolean>[] = [];
        const clonedLanguageTexts: { [key in PreviewScreenType]?: Record<string, Record<string, string>> } =
            cloneDeep(languageTexts);

        // Delete keys that are marked for deletion.
        Object.keys(deletedI18nKeys).forEach((screen: PreviewScreenType) => {
            if (deletedI18nKeys[screen]?.length > 0) {
                deletedI18nKeys[screen].forEach((key: string) => {
                    delete clonedLanguageTexts[screen][selectedLanguage][key];
                });
            }
        });

        Object.keys(clonedLanguageTexts).forEach((screen: PreviewScreenType) => {
            Object.keys(clonedLanguageTexts[screen]).forEach((locale: string) => {
                updateCalls.push(
                    updateI18nKey(screen, locale, clonedLanguageTexts[screen][locale])
                );
            });
        });

        const results: boolean[] = await Promise.all(updateCalls);

        if (results.every((result: boolean) => result)) {
            dispatch(addAlert({
                description: t("flows:core.notifications.updateI18nKey.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("flows:core.notifications.updateI18nKey.success.message")
            }));
            setLanguageTexts({});
        } else {
            dispatch(addAlert({
                description: t("flows:core.notifications.updateI18nKey.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.notifications.updateI18nKey.genericError.message")
            }));
        }
    };

    /**
     * Handles changes to the language text input.
     *
     * @param event - The change event from the language text input.
     */
    const handleLanguageTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLanguageTexts((prevTexts: { [key in PreviewScreenType]: Record<string, Record<string, string>> }) => ({
            ...prevTexts,
            [selectedScreenType.id]: {
                ...prevTexts?.[selectedScreenType.id],
                [selectedLanguage]: {
                    ...prevTexts?.[selectedScreenType.id]?.[selectedLanguage],
                    [i18nKeyInputValue]: event.target.value
                }
            }
        }));
    };

    /**
     * Handles navigation to the branding section.
     */
    const handleNavigateToBranding = (): void => {
        history.push(AppConstants.getPaths().get("BRANDING"));
    };

    /**
     * Renders the card content based on the current view mode.
     */
    const renderCardContent = (): ReactElement => {
        if (i18nTextLoading) {
            return (
                <div className="i18n-config-container loading">
                    <CircularProgress size={ 20 } />
                </div>
            );
        }

        if (!isCustomizeView) {
            return (
                <div className="i18n-config-container">
                    <div>
                        <Typography variant="subtitle2" gutterBottom>
                            { t("flows:core.elements.textPropertyField.i18nCard.i18nKey") }
                        </Typography>
                        <div className="i18n-selection-row">
                            <Autocomplete
                                options={ i18nKeys }
                                value={ selectedI18nKey }
                                onChange={ (
                                    _event: SyntheticEvent,
                                    newValue: string
                                ) => {
                                    onChange(newValue);
                                } }
                                renderInput={ (params: any) => (
                                    <TextField
                                        { ...params }
                                        placeholder={
                                            t("flows:core.elements.textPropertyField.i18nCard.selectI18nKey")
                                        }
                                        size="small"
                                    />
                                ) }
                                renderOption={ (props: any, option: string) => (
                                    <li { ...props } className="option-item">
                                        <Tooltip title={ option } placement="top">
                                            <span className="option-text">{ option }</span>
                                        </Tooltip>
                                    </li>
                                ) }
                                slotProps={ {
                                    popper: {
                                        className: "flow-builder-resource-property-panel-i18n-configuration"
                                    }
                                } }
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="i18n-config-container">
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("flows:core.elements.textPropertyField.i18nCard.language") }
                    </Typography>
                    <Select
                        fullWidth
                        value={ selectedLanguage }
                        onChange={ (event: SelectChangeEvent<unknown>): void => {
                            setSelectedLanguage(event.target.value as string);
                        } }
                        displayEmpty
                        size="small"
                        placeholder={
                            t("flows:core.elements.textPropertyField.i18nCard.selectLanguage")
                        }
                        renderValue={ (value: string) => (
                            <>
                                <i
                                    className={
                                        `${supportedLocales[value]?.flag} flag`
                                    }
                                ></i>
                                <span>
                                    { `${supportedLocales[value]?.name}, ` +
                                        supportedLocales[value]?.code }
                                </span>
                            </>
                        ) }
                    >
                        { Object.values(supportedLocales).map((locale: LocaleMeta) => (
                            <MenuItem
                                key={ locale.code }
                                value={ locale.code }
                            >
                                <i className={ `${locale.flag} flag` }></i>
                                <span>{ locale.name }, { locale.code }</span>
                            </MenuItem>
                        )) }
                    </Select>
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("flows:core.elements.textPropertyField.i18nCard.screenName") }
                    </Typography>
                    <Autocomplete
                        options={ screenTypes }
                        getOptionLabel={ (option: ScreenTypeOption) => option.label }
                        value={ selectedScreenType }
                        onChange={ (
                            _event: React.SyntheticEvent,
                            newValue: ScreenTypeOption
                        ): void => {
                            setSelectedScreenType(newValue);
                            setI18nKeyInputValue("");
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
                            </li>
                        ) }
                        slotProps={ {
                            popper: {
                                className: "flow-builder-resource-property-panel-i18n-configuration"
                            }
                        } }
                        isOptionEqualToValue={ (option: ScreenTypeOption, value: ScreenTypeOption) =>
                            option.id === value.id }
                        disabled={ !selectedLanguage }
                    />
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("flows:core.elements.textPropertyField.i18nCard.i18nKey") }
                    </Typography>
                    <Autocomplete
                        freeSolo
                        options={ availableI18nKeys }
                        inputValue={ i18nKeyInputValue }
                        onInputChange={ (_event: SyntheticEvent, newInputValue: string) => {
                            const value: string = newInputValue.trim();

                            if (!/^[a-z.]*$/.test(value)) {
                                return;
                            }

                            setI18nKeyInputValue(newInputValue.trim());
                        } }
                        disabled={ !selectedScreenType }
                        renderInput={ (params: any) => (
                            <TextField
                                { ...params }
                                placeholder={ t("flows:core.elements.textPropertyField.i18nCard." +
                                                "selectOrAddI18nKey") }
                                size="small"
                            />
                        ) }
                        renderOption={ (props: any, option: string) => (
                            <li { ...props } className="option-item">
                                <Tooltip title={ option } placement="top">
                                    <span className="option-text">{ option }</span>
                                </Tooltip>
                                {
                                    isCustomI18nKey(selectedScreenType?.id as PreviewScreenType, option) && (
                                        <IconButton
                                            size="small"
                                            onClick={ (e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                handleDeleteI18nKey(option);
                                            } }
                                            aria-label={ t("common:delete") }
                                            className="delete-icon-button"
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    )
                                }
                            </li>
                        ) }
                        slotProps={ {
                            popper: {
                                className: "flow-builder-resource-property-panel-i18n-configuration"
                            }
                        } }
                    />
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("flows:core.elements.textPropertyField.i18nCard.languageText") }
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={
                            t("flows:core.elements.textPropertyField.i18nCard.languageTextPlaceholder")
                        }
                        value={ languageTexts?.[selectedScreenType?.id]?.[selectedLanguage]?.[i18nKeyInputValue]
                            ?? i18nText?.[selectedScreenType?.id]?.[i18nKeyInputValue] ?? "" }
                        onChange={ handleLanguageTextChange }
                        disabled={ !selectedScreenType || !i18nKeyInputValue }
                        multiline
                        rows={ 3 }
                    />
                </div>
            </div>
        );
    };

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            className="flow-builder-resource-property-panel-i18n-configuration card-backdrop"
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
                    title={ isCustomizeView
                        ? t("flows:core.elements.textPropertyField.i18nCard.configureTitle")
                        : t("flows:core.elements.textPropertyField.i18nCard.title", {
                            propertyKey: upperFirst(lowerCase(propertyKey))
                        })
                    }
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
                    { renderCardContent() }
                </CardContent>
                <CardActions className="card-actions">
                    { !isCustomizeView ? (
                        <Tooltip
                            title={ !isBrandingEnabled ? (
                                <Trans
                                    i18nKey={ "flows:core.elements.textPropertyField.i18nCard.tooltip" +
                                        ".enableBrandingRequired" }
                                >
                                    Enable <Link
                                        onClick={ handleNavigateToBranding }
                                        className="branding-link"
                                    >branding</Link> to update translation text.
                                </Trans>
                            ) : "" }
                            placement="top"
                            slotProps={ {
                                popper: {
                                    className: "flow-builder-resource-property-panel-i18n-configuration"
                                }
                            } }
                        >
                            <span>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={ (): void => {
                                        setIsCustomizeView(true);
                                    } }
                                    startIcon={ <GearIcon /> }
                                    disabled={ !isBrandingEnabled }
                                >
                                    { t("flows:core.elements.textPropertyField.i18nCard.configure") }
                                </Button>
                            </span>
                        </Tooltip>
                    ) : (
                        <>
                            <Button
                                size="small"
                                onClick={ (): void => {
                                    setIsCustomizeView(false);
                                    setSelectedScreenType(null);
                                    setI18nKeyInputValue("");
                                    setLanguageTexts({});
                                } }
                                variant="outlined"
                            >
                                { t("common:back") }
                            </Button>
                            <Button
                                size="small"
                                onClick={ handleSaveCustomize }
                                variant="contained"
                                color="primary"
                                disabled={ Object.keys(languageTexts).length === 0 || isI18nSubmitting }
                                loading={ isI18nSubmitting }
                            >
                                { t("common:save") }
                            </Button>
                        </>
                    ) }
                </CardActions>
            </Card>
        </div>,
        document.body
    );
};

export default I18nConfigurationCard;
