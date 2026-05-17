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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardActions from "@oxygen-ui/react/CardActions";
import CardContent from "@oxygen-ui/react/CardContent";
import CardHeader from "@oxygen-ui/react/CardHeader";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PenToSquareIcon, PlusIcon, XMarkIcon } from "@oxygen-ui/react-icons";
import updateCustomTextPreference from "@wso2is/common.branding.v1/api/update-custom-text-preference";
import useGetCustomTextPreferenceFallbacks from
    "@wso2is/common.branding.v1/api/use-get-custom-text-preference-fallbacks";
import useGetCustomTextPreferenceMeta from
    "@wso2is/common.branding.v1/api/use-get-custom-text-preference-meta";
import useGetCustomTextPreferenceResolve from "@wso2is/common.branding.v1/api/use-get-custom-text-preference-resolve";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetBrandingPreference from "@wso2is/common.branding.v1/api/use-get-branding-preference";
import { BrandingPreferenceTypes, PreviewScreenType } from "@wso2is/common.branding.v1/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocaleMeta, SupportedLanguagesMeta } from "@wso2is/i18n";
import classNames from "classnames";
import merge from "lodash-es/merge";
import pick from "lodash-es/pick";
import React, {
    ChangeEvent,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    RefObject,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import "./consent-i18n-configuration-card.scss";

const CONSENT_I18N_SCREEN: PreviewScreenType = PreviewScreenType.CONSENT;

/**
 * Props interface for a custom language text field component.
 */
export interface LanguageTextFieldPropsInterface {
    value: string;
    onChange: (_: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    policyUrl?: string;
}

/**
 * Props interface of {@link ConsentI18nConfigurationCard}
 */
interface ConsentI18nConfigurationCardPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
    anchorEl: HTMLElement | null;
    i18nKey: string;
    onClose: () => void;
    onChange: (_: string | null) => void;
    LanguageTextField?: FunctionComponent<LanguageTextFieldPropsInterface>;
    policyUrl?: string;
}

/**
 * Floating card for configuring i18n translation keys on the consent description field.
 */
const ConsentI18nConfigurationCard: FunctionComponent<ConsentI18nConfigurationCardPropsInterface> = ({
    "data-componentid": componentId = "consent-i18n-configuration-card",
    open,
    anchorEl,
    i18nKey: selectedI18nKey,
    onClose,
    onChange,
    LanguageTextField,
    policyUrl
}: ConsentI18nConfigurationCardPropsInterface): ReactElement | null => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );

    const cardRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const cardContentRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const isCreationMode: MutableRefObject<boolean> = useRef<boolean>(false);

    const [ position, setPosition ] = useState<{ top: number; left: number }>({ left: 0, top: 0 });
    const [ isCustomizeView, setIsCustomizeView ] = useState<boolean>(false);
    const [ i18nKeyInput, setI18nKeyInput ] = useState<string>("");
    const [ selectedLanguage, setSelectedLanguage ] = useState<string>("");
    const [ languageText, setLanguageText ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isScrolled, setIsScrolled ] = useState<boolean>(false);

    const { data: brandingPreference } = useGetBrandingPreference(tenantDomain);
    const { data: customTextMeta, isLoading: metaLoading } = useGetCustomTextPreferenceMeta();

    const isBrandingEnabled: boolean = useMemo(
        () => brandingPreference?.preference?.configs?.isBrandingEnabled ?? false,
        [ brandingPreference ]
    );

    const supportedLocales: SupportedLanguagesMeta = useMemo(() => {
        if (!supportedI18nLanguages || !customTextMeta?.locales?.length) {
            return {};
        }

        return pick(supportedI18nLanguages, customTextMeta.locales);
    }, [ supportedI18nLanguages, customTextMeta ]);

    useEffect(() => {
        const firstLocale: string = Object.keys(supportedLocales)[0];

        if (firstLocale && !selectedLanguage) {
            setSelectedLanguage(firstLocale);
        }
    }, [ supportedLocales, selectedLanguage ]);

    const { data: userTextData, isLoading: userTextLoading } = useGetCustomTextPreferenceResolve(
        open && !!selectedLanguage,
        tenantDomain,
        CONSENT_I18N_SCREEN,
        selectedLanguage,
        BrandingPreferenceTypes.ORG
    );

    const { data: fallbackTextData, isLoading: fallbackLoading } = useGetCustomTextPreferenceFallbacks(
        open && !!selectedLanguage,
        tenantDomain,
        CONSENT_I18N_SCREEN,
        selectedLanguage,
        BrandingPreferenceTypes.ORG
    );

    const isLoading: boolean = metaLoading || userTextLoading || fallbackLoading;

    const i18nText: Record<string, string> = useMemo(() => {
        return merge({}, fallbackTextData?.preference?.text ?? {}, userTextData?.preference?.text ?? {});
    }, [ fallbackTextData, userTextData ]);

    const isAlreadyConfigured: boolean = useMemo(
        () => Object.keys(userTextData?.preference?.text ?? {}).length > 0,
        [ userTextData ]
    );

    const availableKeys: string[] = useMemo(() => Object.keys(i18nText), [ i18nText ]);

    const i18nTextRef: MutableRefObject<Record<string, string>> = useRef<Record<string, string>>(i18nText);

    i18nTextRef.current = i18nText;

    useEffect(() => {
        if (i18nKeyInput && i18nTextRef.current[i18nKeyInput] !== undefined) {
            setLanguageText(i18nTextRef.current[i18nKeyInput]);
        } else {
            setLanguageText("");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ i18nKeyInput ]);

    useEffect(() => {
        const updatePosition = (): void => {
            if (!anchorEl || !cardRef.current) return;

            const anchorRect: DOMRect = anchorEl.getBoundingClientRect();
            const cardRect: DOMRect = cardRef.current.getBoundingClientRect();

            let left: number = anchorRect.right + 8;
            let top: number = anchorRect.top;

            if (left + cardRect.width > window.innerWidth) {
                left = anchorRect.left - cardRect.width - 8;
            }

            if (top + cardRect.height > window.innerHeight) {
                top = window.innerHeight - cardRect.height - 16;
            }

            setPosition({ left, top });
        };

        const handleScroll = (): void => { requestAnimationFrame(updatePosition); };
        const handleResize = (): void => { requestAnimationFrame(updatePosition); };

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

    useEffect(() => {
        const checkScrollState = (): void => {
            if (cardContentRef.current) {
                const { scrollHeight, clientHeight } = cardContentRef.current;

                setIsScrolled(scrollHeight > clientHeight);
            }
        };

        if (open && cardContentRef.current) {
            checkScrollState();

            const resizeObserver: ResizeObserver = new ResizeObserver(checkScrollState);

            resizeObserver.observe(cardContentRef.current);

            return () => resizeObserver.disconnect();
        }
    }, [ open, isCustomizeView ]);

    const handleSave: () => Promise<void> = useCallback(async (): Promise<void> => {
        if (!i18nKeyInput || !selectedLanguage) return;

        setIsSubmitting(true);

        try {
            const updatedText: Record<string, string> = Object.fromEntries(
                Object.entries({
                    ...(userTextData?.preference?.text ?? {}),
                    [i18nKeyInput]: languageText
                }).filter(([ , v ]: [ string, string ]) => v !== "")
            );

            await updateCustomTextPreference(
                isAlreadyConfigured,
                { text: updatedText },
                tenantDomain,
                CONSENT_I18N_SCREEN,
                selectedLanguage,
                BrandingPreferenceTypes.ORG
            );

            dispatch(addAlert({
                description: t("consents:wizard.create.form.description.i18nCard.saveSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("consents:wizard.create.form.description.i18nCard.saveSuccess.message")
            }));

            onChange(i18nKeyInput);
            setIsCustomizeView(false);
            setI18nKeyInput("");
        } catch {
            dispatch(addAlert({
                description: t("consents:wizard.create.form.description.i18nCard.saveError.description"),
                level: AlertLevels.ERROR,
                message: t("consents:wizard.create.form.description.i18nCard.saveError.message")
            }));
        } finally {
            setIsSubmitting(false);
        }
    }, [ i18nKeyInput, selectedLanguage, languageText, isAlreadyConfigured, userTextData, tenantDomain, onChange ]);

    const handleBack = (): void => {
        setIsCustomizeView(false);
        setI18nKeyInput("");
        setLanguageText("");
    };

    const renderCardContent = (): ReactElement => {
        if (isLoading) {
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
                            { t("consents:wizard.create.form.description.i18nCard.i18nKey") }
                        </Typography>
                        <Autocomplete
                            options={ availableKeys }
                            value={ selectedI18nKey || null }
                            onChange={ (
                                _event: SyntheticEvent,
                                newValue: string
                            ) => {
                                onChange(newValue);
                            } }
                            renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
                                <TextField
                                    { ...params }
                                    placeholder={
                                        t("consents:wizard.create.form.description.i18nCard.selectKey")
                                    }
                                    size="small"
                                />
                            ) }
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="i18n-config-container">
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("consents:wizard.create.form.description.i18nCard.i18nKey") }
                    </Typography>
                    { isCreationMode.current ? (
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={
                                t("consents:wizard.create.form.description.i18nCard.keyPlaceholder")
                            }
                            value={ i18nKeyInput }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                const value: string = e.target.value.trim();

                                if (!/^[a-zA-Z0-9._-]*$/.test(value)) return;
                                setI18nKeyInput(value);
                            } }
                        />
                    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            select
                            value={ i18nKeyInput }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                const newKey: string = e.target.value;

                                setLanguageText(i18nTextRef.current[newKey] ?? "");
                                setI18nKeyInput(newKey);
                            } }
                        >
                            { availableKeys.map((key: string) => (
                                <MenuItem key={ key } value={ key }>{ key }</MenuItem>
                            )) }
                        </TextField>
                    ) }
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("consents:wizard.create.form.description.i18nCard.language") }
                    </Typography>
                    <Select
                        fullWidth
                        value={ selectedLanguage }
                        onChange={ (e: SelectChangeEvent<unknown>) => setSelectedLanguage(e.target.value as string) }
                        displayEmpty
                        size="small"
                        renderValue={ (value: string) => (
                            <>
                                <i className={ `${supportedLocales[value]?.flag} flag` } />
                                <span>
                                    { `${supportedLocales[value]?.name}, ${supportedLocales[value]?.code}` }
                                </span>
                            </>
                        ) }
                    >
                        { Object.values(supportedLocales).map((locale: LocaleMeta) => (
                            <MenuItem key={ locale.code } value={ locale.code }>
                                <i className={ `${locale.flag} flag` } />
                                <span>{ locale.name }, { locale.code }</span>
                            </MenuItem>
                        )) }
                    </Select>
                </div>

                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        { t("consents:wizard.create.form.description.i18nCard.translationText") }
                    </Typography>
                    { LanguageTextField ? (
                        <LanguageTextField
                            key={ `${selectedLanguage}-${i18nKeyInput}` }
                            value={ languageText }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => setLanguageText(e.target.value) }
                            disabled={ !selectedLanguage || !i18nKeyInput }
                            policyUrl={ policyUrl }
                        />
                    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={ 4 }
                            placeholder={
                                t("consents:wizard.create.form.description.i18nCard.translationPlaceholder")
                            }
                            value={ languageText }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => setLanguageText(e.target.value) }
                            disabled={ !selectedLanguage || !i18nKeyInput }
                        />
                    ) }
                </div>
            </div>
        );
    };

    if (!open) return null;

    return createPortal(
        <div
            className="consent-i18n-configuration card-backdrop"
            onClick={ onClose }
            data-componentid={ `${componentId}-backdrop` }
        >
            <Card
                ref={ cardRef }
                className="card"
                style={ { left: position.left, top: position.top } }
                onClick={ (e: React.MouseEvent) => e.stopPropagation() }
                data-componentid={ componentId }
            >
                <CardHeader
                    title={ isCustomizeView
                        ? (isCreationMode.current
                            ? t("consents:wizard.create.form.description.i18nCard.createTitle")
                            : t("consents:wizard.create.form.description.i18nCard.updateTitle"))
                        : t("consents:wizard.create.form.description.i18nCard.title")
                    }
                    action={ (
                        <IconButton size="small" aria-label={ t("common:close") } onClick={ onClose }>
                            <XMarkIcon />
                        </IconButton>
                    ) }
                    className="card-header"
                />
                <CardContent
                    ref={ cardContentRef }
                    className={ classNames("card-content", { scrolled: isScrolled }) }
                >
                    { renderCardContent() }
                </CardContent>
                <CardActions className="card-actions">
                    { !isCustomizeView ? (
                        <>
                            { selectedI18nKey && (
                                <>
                                    <Tooltip
                                        title={ !isBrandingEnabled
                                            ? t("consents:wizard.create.form.description.i18nCard.brandingRequired")
                                            : t("consents:wizard.create.form.description.i18nCard.editTooltip")
                                        }
                                        placement="top"
                                    >
                                        <span>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="secondary"
                                                disabled={ !isBrandingEnabled }
                                                startIcon={ <PenToSquareIcon /> }
                                                onClick={ () => {
                                                    isCreationMode.current = false;
                                                    setLanguageText(i18nTextRef.current[selectedI18nKey] ?? "");
                                                    setI18nKeyInput(selectedI18nKey);
                                                    setIsCustomizeView(true);
                                                } }
                                            >
                                                { t("common:edit") }
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </>
                            ) }
                            { !selectedI18nKey && (
                                <Tooltip
                                    title={ !isBrandingEnabled
                                        ? t("consents:wizard.create.form.description.i18nCard.brandingRequired")
                                        : t("consents:wizard.create.form.description.i18nCard.newTooltip")
                                    }
                                    placement="top"
                                >
                                    <span>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={ !isBrandingEnabled }
                                            startIcon={ <PlusIcon /> }
                                            onClick={ () => {
                                                isCreationMode.current = true;
                                                setI18nKeyInput("");
                                                setIsCustomizeView(true);
                                            } }
                                        >
                                            { t("common:new") }
                                        </Button>
                                    </span>
                                </Tooltip>
                            ) }
                        </>
                    ) : (
                        <>
                            <Button size="small" variant="outlined" onClick={ handleBack }>
                                { t("common:back") }
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                disabled={ !i18nKeyInput || !selectedLanguage || isSubmitting }
                                loading={ isSubmitting }
                                onClick={ handleSave }
                            >
                                { isCreationMode.current ? t("common:create") : t("common:update") }
                            </Button>
                        </>
                    ) }
                </CardActions>
            </Card>
        </div>,
        document.body
    );
};

export default ConsentI18nConfigurationCard;
