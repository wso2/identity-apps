/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import {
    Code,
    GenericIcon,
    Heading,
    ImagePreview,
    Logo,
    ProductBrand,
    SegmentedAccordion,
    Text
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    Ref,
    SyntheticEvent,
    forwardRef,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, DropdownItemProps, Grid, Menu, Placeholder, Segment } from "semantic-ui-react";
import { IllustrationsPreview } from "./illustrations-preview";
import * as LayoutDesignExtensions from "./layout-design-extensions";
import { LayoutSwatchAdapter } from "./layout-swatch";
import { ThemeSwatchAdapter, ThemeSwatchUIConfigsInterface } from "./theme-swatch";
import { commonConfig } from "../../../../extensions/configs";
import { AppConstants } from "../../../core/constants";
import { AppState } from "../../../core/store";
import { useLayout } from "../../api";
import { BrandingPreferencesConstants } from "../../constants";
import { BrandingPreferenceMeta, PredefinedLayouts } from "../../meta";
import {
    BrandingPreferenceInterface,
    BrandingPreferenceLayoutInterface,
    BrandingPreferenceThemeInterface,
    FontConfigurationStrategies,
    PredefinedThemes
} from "../../models";

/**
 * Interface for Branding Preference Design Form props.
 */
interface DesignFormPropsInterface extends IdentifiableComponentInterface {

    /**
     * Broadcast realtime edited values to subscribers.
     * @param values - Form values.
     */
    broadcastValues: (values: DesignFormValuesInterface) => void;
    /**
     * Design form initial values.
     */
    initialValues: DesignFormValuesInterface;
    /**
     * Is loading.
     */
    isLoading?: boolean;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: DesignFormValuesInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Ref for the form.
     */
    ref: Ref<FormPropsInterface>;
}

/**
 * Form initial values interface.
 */
export type DesignFormValuesInterface =
    Pick<BrandingPreferenceInterface, "theme">
    & Pick<BrandingPreferenceInterface, "layout">;

/* eslint-disable sort-keys */
/**
 * The tab indexes of the accordion items.
 */
const ACCORDION_TAB_INDEXES: {
    IMAGES: number;
    COLORS: number;
    PAGE: number;
    FOOTER: number;
    TYPOGRAPHY: number;
    HEADINGS: number;
    BUTTONS: number;
    LOGIN_BOX: number;
    INPUTS: number;
} = {
    IMAGES: 0,
    COLORS: 1,
    PAGE: 2,
    FOOTER: 3,
    TYPOGRAPHY: 4,
    HEADINGS: 5,
    BUTTONS: 6,
    LOGIN_BOX: 7,
    INPUTS: 8
};
/* eslint-enable sort-keys */

const FORM_ID: string = "branding-design-form";

/**
 * Branding Preference Design Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const DesignForm: FunctionComponent<DesignFormPropsInterface> = forwardRef((
    props: DesignFormPropsInterface,
    ref: MutableRefObject<FormPropsInterface>): ReactElement => {

    const {
        broadcastValues,
        initialValues,
        isLoading,
        onSubmit,
        readOnly,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const productName: string = useSelector((state: AppState) => state.config.ui.productName);
    const themeName: string = useSelector((state: AppState) => state.config.ui.theme?.name);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);

    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>([]);
    const [ theme, setTheme ] = useState<BrandingPreferenceThemeInterface>(initialValues.theme);
    const [ layout, setLayout ] = useState<BrandingPreferenceLayoutInterface>(initialValues.layout);
    const [
        fontConfigurationStrategy,
        setFontConfigurationStrategy
    ] = useState<FontConfigurationStrategies>(
        isEmpty(initialValues.theme[theme.activeTheme].typography.font.importURL)
            ? FontConfigurationStrategies.BROWSER_DEFAULT
            : FontConfigurationStrategies.CDN
    );
    const [ fontFamilyFromBrowserDefaults, setFontFamilyFromBrowserDefaults ] = useState<string>(
        initialValues.theme[theme.activeTheme].typography.font.importURL
            ? BrandingPreferencesConstants.DEFAULT_FONT_FROM_THEME
            : initialValues.theme[theme.activeTheme].typography.font.fontFamily
    );
    const [
        fontImportURLFromCDN,
        setFontImportURLFromCDN
    ] = useState<string>(initialValues.theme[theme.activeTheme].typography.font.importURL);
    const [ fontFamilyFromCDN, setFontFamilyFromCDN ] = useState<string>(
        initialValues.theme[theme.activeTheme].typography.font.importURL
            ? initialValues.theme[theme.activeTheme].typography.font.fontFamily
            : ""
    );
    /**
     * Layout design extensions name for the current layout.
     */
    const [ layoutDesignExtensionsName, setLayoutDesignExtensionsName ] = useState<string>(null);

    const {
        data: customLayoutBlob,
        isLoading: customLayoutLoading
    } = useLayout(PredefinedLayouts.CUSTOM, tenantDomain, commonConfig?.checkCustomLayoutExistanceBeforeEnabling);

    /**
     * Set the internal initial theme state.
     */
    useEffect(() => {

        setTheme(initialValues.theme);
    }, [ initialValues.theme ]);

    /**
     * Set the internal initial layout state.
     */
    useEffect(() => {

        setLayout(initialValues.layout);
    }, [ initialValues.layout ]);

    /**
     * Broadcast values to the outside when internals change.
     */
    useEffect(() => {

        broadcastValues({
            ...initialValues,
            layout: {
                ...initialValues.layout,
                ...layout
            },
            theme: {
                ...initialValues.theme,
                ...theme
            }
        });
    }, [ theme, layout ]);

    useEffect(() => {

        setLayoutDesignExtensionsName(
            layout.activeLayout.split("-").map(
                (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
            ).join("") + "LayoutExtensionComponents"
        );
    }, [ layout.activeLayout ]);

    /**
     * Browser default font family dropdown.
     *
     * @returns Font family dropdown component.
     */
    const FontFamilyDropdown = (): ReactElement => {

        const getFontList = (): DropdownItemProps[] => {

            return BrandingPreferenceMeta.getWebSafeFonts()
                .map((font: string, index: number) => {
                    return {
                        content: <span style={ { fontFamily: font } }>{ font }</span>,
                        key: index,
                        text: font,
                        value: font
                    };
                });
        };

        return (
            <Field.Dropdown
                ariaLabel="Browser default font family dropdown"
                name="fontFamilyFromBrowserDefaults"
                label={ t("extensions:develop.branding.forms.design.theme.font.fields.fontFamilyDropdown.label") }
                options={ getFontList() }
                value={ fontFamilyFromBrowserDefaults }
                required={ false }
                readOnly={ readOnly }
                data-componentid={ `${componentId}-typography-font-family-dropdown` }
                hint={ t("extensions:develop.branding.forms.design.theme.font.fields.fontFamilyDropdown.hint") }
                placeholder={
                    t("extensions:develop.branding.forms.design.theme.font.fields.fontFamilyDropdown.placeholder")
                }
                listen={ (value: string) => {
                    setFontFamilyFromBrowserDefaults(value);
                    setTheme({
                        ...theme,
                        [theme.activeTheme]: {
                            ...theme[theme.activeTheme],
                            typography: {
                                ...theme[theme.activeTheme].typography,
                                font: {
                                    ...theme[theme.activeTheme].typography.font,
                                    fontFamily: value
                                }
                            }
                        }
                    });
                } }
                style={ {
                    fontFamily: fontFamilyFromBrowserDefaults
                } }
            />
        );
    };

    /**
     * Handles Form Submit.
     *
     * @param values - Raw values.
     */
    const handleFormSubmit = (values: DesignFormValuesInterface): void => {

        const _values: DesignFormValuesInterface = cloneDeep(values);

        // Delete the temp form attrs since they are merged in to the main object.
        _values[ "fontFamilyFromCDN" ] && delete _values[ "fontFamilyFromCDN" ];
        _values[ "fontFamilyFromBrowserDefaults" ] && delete _values[ "fontFamilyFromBrowserDefaults" ];

        // Remove  `importURL` from the theme if the strategy is browser default.
        if (fontConfigurationStrategy === FontConfigurationStrategies.BROWSER_DEFAULT) {
            _values.theme[theme.activeTheme].typography.font.importURL = "";
            _values.theme[theme.activeTheme].typography.font.fontFamily = fontFamilyFromBrowserDefaults;
            setTheme({
                ...theme,
                [theme.activeTheme]: {
                    ...theme[theme.activeTheme],
                    typography: {
                        ...theme[theme.activeTheme].typography,
                        font: {
                            ...theme[theme.activeTheme].typography.font,
                            importURL: ""
                        }
                    }
                }
            });
            setFontImportURLFromCDN("");
            setFontFamilyFromCDN("");
        } else {
            _values.theme[theme.activeTheme].typography.font.importURL = theme[
                theme.activeTheme
            ].typography.font.importURL;
            _values.theme[theme.activeTheme].typography.font.fontFamily = fontFamilyFromCDN;
            setFontFamilyFromBrowserDefaults(BrandingPreferencesConstants.DEFAULT_FONT_FROM_THEME);
        }

        // Avoid activating the custom layout when there is no deployed custom layout.
        if (commonConfig?.checkCustomLayoutExistanceBeforeEnabling
                && _values?.layout?.activeLayout === PredefinedLayouts.CUSTOM) {
            while (customLayoutLoading) {
                // Wait until finished the loading of custom layout.
            }

            if (customLayoutBlob) {
                onSubmit(_values);
            } else {
                dispatch(addAlert<AlertInterface>({
                    description:
                        t("extensions:develop.branding.notifications.fetch.customLayoutNotFound.description",
                            { tenant: tenantDomain }),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.branding.notifications.fetch.customLayoutNotFound.message")
                }));
            }
        } else {
            onSubmit(_values);
        }
    };

    /**
     * Handles accordion title click.
     *
     * @param e - Click event.
     * @param index - Clicked on index.
     */
    const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {

        const newIndexes: number[] = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(index)) {
            const removingIndex: number = newIndexes.indexOf(index);

            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(index);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    /**
     * Renders the form fields for the images section.
     *
     * @returns Image field components.
     */
    const renderImageFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.images.logo.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <ImagePreview
                        label={ t("extensions:develop.branding.forms.design.theme.images.logo.preview") }
                        style={
                            layout.activeLayout !== PredefinedLayouts.CUSTOM
                                ? {
                                    background: theme[ theme?.activeTheme ]?.colors?.background?.body?.main
                                }
                                : null
                        }
                        data-componentid={ `${componentId}-logo-image-preview` }
                    >
                        <GenericIcon
                            transparent
                            size="tiny"
                            icon={
                                !isEmpty(theme[theme.activeTheme].images.logo.imgURL)
                                    ? theme[theme.activeTheme].images.logo.imgURL
                                    : Object.prototype.hasOwnProperty.call(
                                        BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(themeName).theme,
                                        theme.activeTheme
                                    )
                                        ? BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(themeName)
                                            .theme[theme.activeTheme].images.logo.imgURL
                                        : BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(themeName)
                                            .theme[BrandingPreferencesConstants.DEFAULT_THEME].images.logo.imgURL
                            }
                        />
                    </ImagePreview>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference logo URL"
                        inputType="url"
                        name={ `theme.${theme.activeTheme}.images.logo.imgURL` }
                        label={ t("extensions:develop.branding.forms.design.theme.images.logo.fields.url.label") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.images.logo.fields.url.placeholder")
                        }
                        hint={ (
                            <Trans
                                i18nKey={ "extensions:develop.branding.forms.design.theme.images.logo.fields.url.hint" }
                                tOptions={ {
                                    productName
                                } }
                            >
                                Use an image that’s atleast <Code>600x600 pixels</Code> and less than
                                <Code>1mb</Code> in size for better performance. If not set,
                                { productName } defaults will be used.
                            </Trans>
                        ) }
                        required={ false }
                        value={ initialValues.theme[theme.activeTheme].images.logo.imgURL }
                        readOnly={ readOnly }
                        maxLength={ BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.LOGO_URL_MAX_LENGTH }
                        minLength={ BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.LOGO_URL_MIN_LENGTH }
                        width={ 16 }
                        data-componentid={ `${componentId}-logo-url` }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    images: {
                                        ...theme[theme.activeTheme].images,
                                        logo: {
                                            ...theme[theme.activeTheme].images.logo,
                                            imgURL: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference logo alt text"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.images.logo.altText` }
                        label={ t("extensions:develop.branding.forms.design.theme.images.logo.fields.alt.label") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.images.logo.fields.alt.placeholder")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.images.logo.fields.alt.hint",
                                { productName })
                        }
                        required={ false }
                        value={ initialValues.theme[theme.activeTheme].images.logo.altText }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.LOGO_ALT_TEXT_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.LOGO_ALT_TEXT_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-logo-alt-text` }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    images: {
                                        ...theme[theme.activeTheme].images,
                                        logo: {
                                            ...theme[theme.activeTheme].images.logo,
                                            altText: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.images.favicon.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <ImagePreview
                        label={ t("extensions:develop.branding.forms.design.theme.images.favicon.preview") }
                        data-componentid={ `${componentId}-favicon-image-preview` }
                    >
                        <GenericIcon
                            square
                            transparent
                            size="x22"
                            icon={
                                !isEmpty(theme[theme.activeTheme].images.favicon.imgURL)
                                    ? theme[theme.activeTheme].images.favicon.imgURL
                                    : Object.prototype.hasOwnProperty.call(
                                        BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(themeName).theme,
                                        theme.activeTheme
                                    )
                                        ? BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(themeName)
                                            .theme[theme.activeTheme].images.favicon.imgURL
                                        : BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(themeName)
                                            .theme[BrandingPreferencesConstants.DEFAULT_THEME].images.favicon.imgURL
                            }
                        />
                    </ImagePreview>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference favicon URL"
                        inputType="url"
                        name={ `theme.${theme.activeTheme}.images.favicon.imgURL` }
                        label={ t("extensions:develop.branding.forms.design.theme.images.favicon.fields.url.label") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.images.favicon.fields.url.placeholder")
                        }
                        hint={ (
                            <Trans
                                i18nKey={
                                    "extensions:develop.branding.forms.design.theme.images.favicon.fields.url.hint"
                                }
                                tOptions={ {
                                    productName
                                } }
                            >
                                Use an image that’s atleast <Code>16x16 pixels</Code> or more with square pixel
                                aspect ratio for better results. If not set, { productName } defaults will be used.
                            </Trans>
                        ) }
                        required={ false }
                        value={ initialValues.theme[theme.activeTheme].images.favicon.imgURL }
                        readOnly={ readOnly }
                        maxLength={ BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.FAVICON_URL_MAX_LENGTH }
                        minLength={ BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.FAVICON_URL_MIN_LENGTH }
                        width={ 16 }
                        data-componentid={ `${componentId}-favicon-url` }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    images: {
                                        ...theme[theme.activeTheme].images,
                                        favicon: {
                                            ...theme[theme.activeTheme].images.favicon,
                                            imgURL: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* My Account Logo */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.images.myAccountLogo.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <ImagePreview
                        label={ t("extensions:develop.branding.forms.design.theme.images.myAccountLogo.preview") }
                        style={
                            layout.activeLayout !== PredefinedLayouts.CUSTOM
                                ? {
                                    background: theme[ theme?.activeTheme ]?.colors?.background?.surface?.inverted
                                }
                                : null
                        }
                        data-componentid={ `${componentId}-myaccount-logo-image-preview` }
                    >
                        <ProductBrand
                            appName={ theme[theme.activeTheme].images?.myAccountLogo?.title }
                            style={ { marginTop: 0 } }
                            logo={ (
                                <Logo
                                    className="portal-logo"
                                    image={
                                        theme[
                                            theme.activeTheme
                                        ].images?.myAccountLogo?.imgURL
                                        || BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(
                                            themeName
                                        ).theme[theme.activeTheme].images?.myAccountLogo?.imgURL
                                    }
                                />
                            ) }
                        />
                    </ImagePreview>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference My Account Logo URL"
                        inputType="url"
                        name={ `theme.${theme.activeTheme}.images.myAccountLogo.imgURL` }
                        label={
                            t("extensions:develop.branding.forms.design.theme.images.myAccountLogo.fields.url.label")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".images.myAccountLogo.fields.url.placeholder")
                        }
                        hint={ (
                            <Trans
                                i18nKey={
                                    "extensions:develop.branding.forms.design.theme"
                                    + ".images.myAccountLogo.fields.url.hint"
                                }
                                tOptions={ {
                                    productName
                                } }
                            >
                                Use an image that’s atleast <Code>250x50 pixels</Code> for better results. If not set,
                                { productName } defaults will be used.
                            </Trans>
                        ) }
                        required={ false }
                        value={ initialValues.theme[theme.activeTheme].images?.myAccountLogo?.imgURL }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS
                                .MYACCOUNT_LOGO_URL_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS
                                .MYACCOUNT_LOGO_URL_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-myaccount-logo-url` }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    images: {
                                        ...theme[theme.activeTheme].images,
                                        myAccountLogo: {
                                            ...theme[theme.activeTheme].images.myAccountLogo,
                                            imgURL: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference myaccount logo alt text"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.images.myAccountLogo.altText` }
                        label={
                            t("extensions:develop.branding.forms.design.theme.images.myAccountLogo.fields.alt.label")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".images.myAccountLogo.fields.alt.placeholder")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".images.myAccountLogo.fields.alt.hint", { productName })
                        }
                        required={ false }
                        value={ initialValues.theme[theme.activeTheme].images?.myAccountLogo?.altText }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS
                                .MYACCOUNT_LOGO_ALT_TEXT_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS
                                .MYACCOUNT_LOGO_ALT_TEXT_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-myaccount-logo-alt-text` }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    images: {
                                        ...theme[theme.activeTheme].images,
                                        myAccountLogo: {
                                            ...theme[theme.activeTheme].images.myAccountLogo,
                                            altText: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Branding preference myaccount logo title"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.images.myAccountLogo.title` }
                        label={
                            t("extensions:develop.branding.forms.design.theme.images.myAccountLogo.fields.title.label")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".images.myAccountLogo.fields.title.placeholder")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".images.myAccountLogo.fields.title.hint", { productName })
                        }
                        required={ false }
                        value={ initialValues.theme[theme.activeTheme].images?.myAccountLogo?.title }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.MYACCOUNT_LOGO_TITLE_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.MYACCOUNT_LOGO_TITLE_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-myaccount-logo-title` }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    images: {
                                        ...theme[theme.activeTheme].images,
                                        myAccountLogo: {
                                            ...theme[theme.activeTheme].images.myAccountLogo,
                                            title: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Layout Design Image Extension Fields. */ }
            { LayoutDesignExtensions[layoutDesignExtensionsName] &&
                LayoutDesignExtensions[layoutDesignExtensionsName].renderImageExtensionFields
                ? LayoutDesignExtensions[layoutDesignExtensionsName].renderImageExtensionFields({
                    "data-componentid": componentId,
                    initialValues,
                    layout,
                    readOnly,
                    setLayout,
                    t
                })
                : null
            }
        </Grid>
    );

    /**
     * Renders the form fields for the colors section.
     *
     * @returns Color pallette field components.
     */
    const renderColorPaletteFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Primary color input field"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.fields.primaryColor.label") }
                        name={ `theme.${theme.activeTheme}.colors.primary.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.primary?.main }
                        data-componentid={ `${componentId}-primary-color` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.colors.fields.primaryColor.hint") }
                        placeholder={ t(
                            "extensions:develop.branding.forms.design.theme.colors.fields.primaryColor.placeholder"
                        ) }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        primary: {
                                            main: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Secondary color input field"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.fields.secondaryColor.label") }
                        name={ `theme.${theme.activeTheme}.colors.secondary.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.secondary?.main }
                        data-componentid={ `${componentId}-secondary-color` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.colors.fields.secondaryColor.hint") }
                        placeholder={ t(
                            "extensions:develop.branding.forms.design.theme.colors.fields.secondaryColor.placeholder"
                        ) }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        secondary: {
                                            main: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Body Background */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.colors.bodyBackground.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Body background color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme.colors.bodyBackground.fields.main.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.background.body.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.background?.body?.main }
                        data-componentid={ `${componentId}-colors-background-body-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.colors.bodyBackground.fields.main.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.bodyBackground.fields.main.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        background: {
                                            ...theme[theme.activeTheme].colors.background,
                                            body: {
                                                ...theme[theme.activeTheme].colors.background.body,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Surface */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.colors.surfaceBackground.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Surface background color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.main.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.background.surface.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.background?.surface?.main }
                        data-componentid={ `${componentId}-colors-background-surface-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.main.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.main.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        background: {
                                            ...theme[theme.activeTheme].colors.background,
                                            surface: {
                                                ...theme[theme.activeTheme].colors.background.surface,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Surface background light color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.light.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.background.surface.light` }
                        value={ initialValues.theme[theme.activeTheme].colors?.background?.surface?.light }
                        data-componentid={ `${componentId}-colors-background-surface-light` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.light.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.light.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        background: {
                                            ...theme[theme.activeTheme].colors.background,
                                            surface: {
                                                ...theme[theme.activeTheme].colors.background.surface,
                                                light: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Surface background dark color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.dark.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.background.surface.dark` }
                        value={ initialValues.theme[theme.activeTheme].colors?.background?.surface?.dark }
                        data-componentid={ `${componentId}-colors-background-surface-dark` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.dark.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.dark.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        background: {
                                            ...theme[theme.activeTheme].colors.background,
                                            surface: {
                                                ...theme[theme.activeTheme].colors.background.surface,
                                                dark: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Surface background inverted color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.inverted.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.background.surface.inverted` }
                        value={ initialValues.theme[theme.activeTheme].colors?.background?.surface?.inverted }
                        data-componentid={ `${componentId}-colors-background-surface-inverted` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.inverted.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.surfaceBackground.fields.inverted.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        background: {
                                            ...theme[theme.activeTheme].colors.background,
                                            surface: {
                                                ...theme[theme.activeTheme].colors.background.surface,
                                                inverted: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Outlined */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.colors.outlines.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Default outline color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.outlines.fields.main.label") }
                        name={ `theme.${theme.activeTheme}.colors.outlined.default` }
                        value={ initialValues.theme[theme.activeTheme].colors?.outlined?.default }
                        data-componentid={ `${componentId}-colors-outlined-default` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.outlines.fields.main.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.outlines.fields.main.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        outlined: {
                                            ...theme[theme.activeTheme].colors.outlined,
                                            default: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Text */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.colors.text.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Primary text color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.text.fields.primary.label") }
                        name={ `theme.${theme.activeTheme}.colors.text.primary` }
                        value={ initialValues.theme[theme.activeTheme].colors?.text?.primary }
                        data-componentid={ `${componentId}-colors-text-primary` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.colors.text.fields.primary.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.text.fields.primary.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        text: {
                                            ...theme[theme.activeTheme].colors.text,
                                            primary: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Secondary text color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.text.fields.secondary.label") }
                        name={ `theme.${theme.activeTheme}.colors.text.secondary` }
                        value={ initialValues.theme[theme.activeTheme].colors?.text?.secondary }
                        data-componentid={ `${componentId}-colors-text-secondary` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.colors.text.fields.secondary.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.colors.text.fields.secondary.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        text: {
                                            ...theme[theme.activeTheme].colors.text,
                                            secondary: value
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Alerts */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.colors.alerts.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Neutral alert background color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.neutral.label") }
                        name={ `theme.${theme.activeTheme}.colors.alerts.neutral.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.alerts?.neutral?.main }
                        data-componentid={ `${componentId}-colors-neutral-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.neutral.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.neutral.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        alerts: {
                                            ...theme[theme.activeTheme].colors.alerts,
                                            neutral: {
                                                ...theme[theme.activeTheme].colors.alerts.neutral,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Info alert background color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.info.label") }
                        name={ `theme.${theme.activeTheme}.colors.alerts.info.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.alerts?.info?.main }
                        data-componentid={ `${componentId}-colors-info-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.info.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.info.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        alerts: {
                                            ...theme[theme.activeTheme].colors.alerts,
                                            info: {
                                                ...theme[theme.activeTheme].colors.alerts.info,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Warning alert background color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.warning.label") }
                        name={ `theme.${theme.activeTheme}.colors.alerts.warning.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.alerts?.warning?.main }
                        data-componentid={ `${componentId}-colors-warning-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.warning.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.warning.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        alerts: {
                                            ...theme[theme.activeTheme].colors.alerts,
                                            warning: {
                                                ...theme[theme.activeTheme].colors.alerts.warning,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Error alert background color picker"
                        label={ t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.error.label") }
                        name={ `theme.${theme.activeTheme}.colors.alerts.error.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.alerts?.error?.main }
                        data-componentid={ `${componentId}-colors-error-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.error.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.colors.alerts.fields.error.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        alerts: {
                                            ...theme[theme.activeTheme].colors.alerts,
                                            error: {
                                                ...theme[theme.activeTheme].colors.alerts.error,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>

            { /* Illustrations */ }
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.colors.illustrations.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <ImagePreview
                        relaxed
                        label={ t("extensions:develop.branding.forms.design.theme.colors.illustrations.preview") }
                        style={
                            layout.activeLayout !== PredefinedLayouts.CUSTOM
                                ? {
                                    background: theme[ theme?.activeTheme ]?.colors?.background?.body?.main
                                }
                                : null
                        }
                        data-componentid={ `${componentId}-illustrations-preview` }
                    >
                        <IllustrationsPreview colors={ theme[theme?.activeTheme]?.colors?.illustrations } />
                    </ImagePreview>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Illustration primary color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.primaryColor.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.illustrations.primary.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.illustrations?.primary?.main }
                        data-componentid={ `${componentId}-colors-illustrations-primary-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.primaryColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.primaryColor.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        illustrations: {
                                            ...theme[theme.activeTheme].colors.illustrations,
                                            primary: {
                                                ...theme[theme.activeTheme].colors.illustrations.primary,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Illustration secondary color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.secondaryColor.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.illustrations.secondary.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.illustrations?.secondary?.main }
                        data-componentid={ `${componentId}-colors-illustrations-secondary-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.secondaryColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.secondaryColor.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        illustrations: {
                                            ...theme[theme.activeTheme].colors.illustrations,
                                            secondary: {
                                                ...theme[theme.activeTheme].colors.illustrations.secondary,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Illustration accent1 color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor1.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.illustrations.accent1.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.illustrations?.accent1?.main }
                        data-componentid={ `${componentId}-colors-illustrations-accent1-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor1.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor1.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        illustrations: {
                                            ...theme[theme.activeTheme].colors.illustrations,
                                            accent1: {
                                                ...theme[theme.activeTheme].colors.illustrations.accent1,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Illustration accent2 color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor2.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.illustrations.accent2.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.illustrations?.accent2?.main }
                        data-componentid={ `${componentId}-colors-illustrations-accent2-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor2.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor2.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        illustrations: {
                                            ...theme[theme.activeTheme].colors.illustrations,
                                            accent2: {
                                                ...theme[theme.activeTheme].colors.illustrations.accent2,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Illustration accent3 color picker"
                        label={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor3.label")
                        }
                        name={ `theme.${theme.activeTheme}.colors.illustrations.accent3.main` }
                        value={ initialValues.theme[theme.activeTheme].colors?.illustrations?.accent3?.main }
                        data-componentid={ `${componentId}-colors-illustrations-accent3-main` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor3.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".colors.illustrations.fields.accentColor3.placeholder")
                        }
                        listen={ (value: string) => {
                            setTheme({
                                ...theme,
                                [theme.activeTheme]: {
                                    ...theme[theme.activeTheme],
                                    colors: {
                                        ...theme[theme.activeTheme].colors,
                                        illustrations: {
                                            ...theme[theme.activeTheme].colors.illustrations,
                                            accent3: {
                                                ...theme[theme.activeTheme].colors.illustrations.accent3,
                                                main: value
                                            }
                                        }
                                    }
                                }
                            });
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    /**
     * Renders the form fields for the page section.
     *
     * @returns Page fields components.
     */
    const renderLoginPageFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Page background color input field"
                        label={
                            t("extensions:develop.branding.forms.design.theme.loginPage.fields.backgroundColor.label")
                        }
                        name={ `theme.${theme.activeTheme}.loginPage.background.backgroundColor` }
                        value={ initialValues.theme[theme.activeTheme].loginPage.background.backgroundColor }
                        data-componentid={ `${componentId}-login-page-background-color` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.loginPage.fields.backgroundColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme"
                            + ".loginPage.fields.backgroundColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginPage: {
                                    ...theme[theme.activeTheme].loginPage,
                                    background: {
                                        ...theme[theme.activeTheme].loginPage.background,
                                        backgroundColor: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Page font color input field"
                        label={ t("extensions:develop.branding.forms.design.theme.loginPage.fields.fontColor.label") }
                        name={ `theme.${theme.activeTheme}.loginPage.font.color` }
                        value={ initialValues.theme[theme.activeTheme].loginPage.font.color }
                        data-componentid={ `${componentId}-login-page-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.loginPage.fields.fontColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.loginPage.fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginPage: {
                                    ...theme[theme.activeTheme].loginPage,
                                    font: {
                                        ...theme[theme.activeTheme].loginPage.font,
                                        color: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    /**
     * Renders the form fields for the footer section.
     *
     * @returns Footer fields components.
     */
    const renderFooterFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Footer border color input field"
                        label={ t("extensions:develop.branding.forms.design.theme.footer.fields.borderColor.label") }
                        name={ `theme.${theme.activeTheme}.footer.border.borderColor` }
                        value={ initialValues.theme[theme.activeTheme].footer.border.borderColor }
                        data-componentid={ `${componentId}-footer-border-color` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.footer.fields.borderColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.footer.fields.borderColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                footer: {
                                    ...theme[theme.activeTheme].footer,
                                    border: {
                                        ...theme[theme.activeTheme].footer.border,
                                        borderColor: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Footer font color input field"
                        label={ t("extensions:develop.branding.forms.design.theme.footer.fields.fontColor.label") }
                        name={ `theme.${theme.activeTheme}.footer.font.color` }
                        value={ initialValues.theme[theme.activeTheme].footer.font.color }
                        data-componentid={ `${componentId}-footer-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        hint={ t("extensions:develop.branding.forms.design.theme.footer.fields.fontColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.footer.fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                footer: {
                                    ...theme[theme.activeTheme].footer,
                                    font: {
                                        ...theme[theme.activeTheme].footer.font,
                                        color: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    /**
     * Renders the form fields for the typography section.
     *
     * @returns Typography field components.
     */
    const renderTypographyFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <div className="font-family-selector">
                        <Menu pointing widths={ 2 }>
                            <Menu.Item
                                name={ t("extensions:develop.branding.forms.design.theme.font.types.fromDefaults") }
                                active={ fontConfigurationStrategy === FontConfigurationStrategies.BROWSER_DEFAULT }
                                onClick={ () => {
                                    if (fontConfigurationStrategy === FontConfigurationStrategies.BROWSER_DEFAULT) {
                                        return;
                                    }

                                    setTheme({
                                        ...theme,
                                        [theme.activeTheme]: {
                                            ...theme[theme.activeTheme],
                                            typography: {
                                                ...theme[theme.activeTheme].typography,
                                                font: {
                                                    ...theme[theme.activeTheme].typography.font,
                                                    fontFamily: fontFamilyFromBrowserDefaults,
                                                    importURL: ""
                                                }
                                            }
                                        }
                                    });
                                    setFontConfigurationStrategy(FontConfigurationStrategies.BROWSER_DEFAULT);
                                } }
                            />
                            <Menu.Item
                                name={ t("extensions:develop.branding.forms.design.theme.font.types.fromCDN") }
                                active={ fontConfigurationStrategy === FontConfigurationStrategies.CDN }
                                onClick={ () => {
                                    if (fontConfigurationStrategy === FontConfigurationStrategies.CDN) {
                                        return;
                                    }

                                    setTheme({
                                        ...theme,
                                        [theme.activeTheme]: {
                                            ...theme[theme.activeTheme],
                                            typography: {
                                                ...theme[theme.activeTheme].typography,
                                                font: {
                                                    ...theme[theme.activeTheme].typography.font,
                                                    // Avoid a null font family being shown in the preview.
                                                    fontFamily: !isEmpty(fontFamilyFromCDN)
                                                        ? fontFamilyFromCDN
                                                        : fontFamilyFromBrowserDefaults,
                                                    importURL: fontImportURLFromCDN
                                                }
                                            }
                                        }
                                    });
                                    setFontConfigurationStrategy(FontConfigurationStrategies.CDN);
                                } }
                            />
                        </Menu>
                        <Segment>
                            {
                                fontConfigurationStrategy === FontConfigurationStrategies.BROWSER_DEFAULT
                                    ? FontFamilyDropdown()
                                    : (
                                        <>
                                            <Field.Input
                                                ariaLabel="Branding preference font import URL"
                                                inputType="url"
                                                name={ `theme.${theme.activeTheme}.typography.font.importURL` }
                                                label={
                                                    t("extensions:develop.branding.forms.design.theme.font.fields"
                                                        + ".importURL.label")
                                                }
                                                placeholder={
                                                    t("extensions:develop.branding.forms.design.theme.font.fields"
                                                        + ".importURL.placeholder")
                                                }
                                                hint={
                                                    t("extensions:develop.branding.forms.design.theme.font.fields"
                                                        + ".importURL.hint")
                                                }
                                                required={ false }
                                                value={
                                                    theme[theme.activeTheme].typography.font.importURL
                                                }
                                                readOnly={ readOnly }
                                                maxLength={
                                                    BrandingPreferencesConstants
                                                        .DESIGN_FORM_FIELD_CONSTRAINTS.FONT_IMPORT_URL_MAX_LENGTH
                                                }
                                                minLength={
                                                    BrandingPreferencesConstants
                                                        .DESIGN_FORM_FIELD_CONSTRAINTS.FONT_IMPORT_URL_MIN_LENGTH
                                                }
                                                data-componentid={ `${componentId}-typography-font-cdn-url` }
                                                listen={ (value: string) => {
                                                    setFontImportURLFromCDN(value);
                                                    setTheme({
                                                        ...theme,
                                                        [theme.activeTheme]: {
                                                            ...theme[theme.activeTheme],
                                                            typography: {
                                                                ...theme[theme.activeTheme].typography,
                                                                font: {
                                                                    ...theme[theme.activeTheme].typography.font,
                                                                    importURL: value
                                                                }
                                                            }
                                                        }
                                                    });
                                                } }
                                            />
                                            <Divider hidden />
                                            <Field.Input
                                                ariaLabel="Font family input field"
                                                inputType="default"
                                                name="fontFamilyFromCDN"
                                                label={
                                                    t("extensions:develop.branding.forms.design.theme.font.fields"
                                                        + ".fontFamilyInput.label")
                                                }
                                                placeholder={
                                                    t("extensions:develop.branding.forms.design.theme.font.fields"
                                                        + ".fontFamilyInput.placeholder")
                                                }
                                                hint={
                                                    t("extensions:develop.branding.forms.design.theme.font.fields"
                                                        + ".fontFamilyInput.hint")
                                                }
                                                required={ !!theme[theme.activeTheme].typography.font.importURL }
                                                disabled={ !theme[theme.activeTheme].typography.font.importURL }
                                                readOnly={ readOnly }
                                                value={ fontFamilyFromCDN }
                                                maxLength={
                                                    BrandingPreferencesConstants
                                                        .DESIGN_FORM_FIELD_CONSTRAINTS.FONT_FAMILY_MAX_LENGTH
                                                }
                                                minLength={
                                                    BrandingPreferencesConstants
                                                        .DESIGN_FORM_FIELD_CONSTRAINTS.FONT_FAMILY_MIN_LENGTH
                                                }
                                                width={ 16 }
                                                data-componentid={ `${componentId}-typography-font-family-input` }
                                                listen={ (value: string) => {
                                                    setFontFamilyFromCDN(value);
                                                    setTheme({
                                                        ...theme,
                                                        [theme.activeTheme]: {
                                                            ...theme[theme.activeTheme],
                                                            typography: {
                                                                ...theme[theme.activeTheme].typography,
                                                                font: {
                                                                    ...theme[theme.activeTheme].typography.font,
                                                                    fontFamily: value
                                                                }
                                                            }
                                                        }
                                                    });
                                                } }
                                            />
                                        </>
                                    )
                            }
                        </Segment>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    /**
     * Renders the form fields for the headings section.
     *
     * @returns Headings field components.
     */
    const renderHeadingsFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Heading font color input field"
                        name={ `theme.${theme.activeTheme}.typography.heading.font.color` }
                        value={ initialValues.theme[theme.activeTheme].typography.heading.font.color }
                        data-componentid={ `${componentId}-typography-headings-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={ t("extensions:develop.branding.forms.design.theme.headings.fields.fontColor.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.headings.fields.fontColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.headings.fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                typography: {
                                    ...theme[theme.activeTheme].typography,
                                    heading: {
                                        ...theme[theme.activeTheme].typography.heading,
                                        font: {
                                            ...theme[theme.activeTheme].typography.heading.font,
                                            color: value
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            { /* Layout Design Headings Extension Fields. */ }
            { LayoutDesignExtensions[layoutDesignExtensionsName] &&
                LayoutDesignExtensions[layoutDesignExtensionsName].renderHeadingsExtensionFields
                ? LayoutDesignExtensions[layoutDesignExtensionsName].renderHeadingsExtensionFields({
                    "data-componentid": componentId,
                    initialValues,
                    layout,
                    readOnly,
                    setLayout,
                    t
                })
                : null
            }
        </Grid>
    );

    /**
     * Renders the form fields for the buttons section.
     *
     * @returns Button fields component.
     */
    const renderButtonsFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.buttons.primary.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Primary button font color picker"
                        name={ `theme.${theme.activeTheme}.buttons.primary.base.font.color` }
                        value={ initialValues.theme[theme.activeTheme].buttons.primary.base.font.color }
                        data-componentid={ `${componentId}-primary-button-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.primary.fields.fontColor.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.buttons.primary.fields.fontColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.primary.fields." +
                                "fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    primary: {
                                        ...theme[theme.activeTheme].buttons.primary,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.primary.base,
                                            font: {
                                                ...theme[theme.activeTheme].buttons.primary.base.font,
                                                color: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Primary button border radius input field"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.buttons.primary.base.border.borderRadius` }
                        value={ initialValues.theme[theme.activeTheme].buttons.primary.base.border.borderRadius }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.primary." +
                                "fields.borderRadius.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.buttons.primary." +
                                "fields.borderRadius.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.primary." +
                                "fields.borderRadius.placeholder")
                        }
                        required={ false }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-primary-button-border-radius` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    primary: {
                                        ...theme[theme.activeTheme].buttons.primary,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.primary.base,
                                            border: {
                                                ...theme[theme.activeTheme].buttons.primary.base.border,
                                                borderRadius: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.buttons.secondary.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Secondary button font color picker"
                        name={ `theme.${theme.activeTheme}.buttons.secondary.base.font.color` }
                        value={ initialValues.theme[theme.activeTheme].buttons.secondary.base.font.color }
                        data-componentid={ `${componentId}-secondary-button-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.secondary." +
                                "fields.fontColor.label") }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.buttons.secondary." +
                                "fields.fontColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.secondary." +
                                "fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    secondary: {
                                        ...theme[theme.activeTheme].buttons.secondary,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.secondary.base,
                                            font: {
                                                ...theme[theme.activeTheme].buttons.secondary.base.font,
                                                color: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Secondary button border radius input field"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.buttons.secondary.base.border.borderRadius` }
                        value={ initialValues.theme[theme.activeTheme].buttons.secondary.base.border.borderRadius }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.secondary." +
                                "fields.borderRadius.label")
                        }
                        hint={ t("extensions:develop.branding.forms.design.theme.buttons.secondary." +
                            "fields.borderRadius.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.secondary.fields"
                                + ".borderRadius.placeholder")
                        }
                        required={ false }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-secondary-button-border-radius` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    secondary: {
                                        ...theme[theme.activeTheme].buttons.secondary,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.secondary.base,
                                            border: {
                                                ...theme[theme.activeTheme].buttons.secondary.base.border,
                                                borderRadius: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.buttons.externalConnections.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="External Connection button background color picker"
                        name={
                            `theme.${theme.activeTheme}.buttons.externalConnection.base.background.backgroundColor`
                        }
                        value={
                            initialValues.theme[
                                theme.activeTheme
                            ].buttons.externalConnection.base.background.backgroundColor
                        }
                        data-componentid={ `${componentId}-external-connection-button-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.backgroundColor.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.backgroundColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.backgroundColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    externalConnection: {
                                        ...theme[theme.activeTheme].buttons.externalConnection,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.externalConnection.base,
                                            background: {
                                                ...theme[
                                                    theme.activeTheme
                                                ].buttons.externalConnection.base.background,
                                                backgroundColor: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="External Connection button font color picker"
                        name={ `theme.${theme.activeTheme}.buttons.externalConnection.base.font.color` }
                        value={ initialValues.theme[theme.activeTheme].buttons.externalConnection.base.font.color }
                        data-componentid={ `${componentId}-external-connection-button-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.fontColor.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.fontColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    externalConnection: {
                                        ...theme[theme.activeTheme].buttons.externalConnection,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.externalConnection.base,
                                            font: {
                                                ...theme[theme.activeTheme].buttons.externalConnection.base.font,
                                                color: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="External connection button border radius input field"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.buttons.externalConnection.base.border.borderRadius` }
                        value={
                            initialValues.theme[
                                theme.activeTheme
                            ].buttons.externalConnection.base.border.borderRadius
                        }
                        label={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.borderRadius.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.borderRadius.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.buttons.externalConnections"
                                + ".fields.borderRadius.placeholder")
                        }
                        required={ false }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-external-connection-button-border-radius` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                buttons: {
                                    ...theme[theme.activeTheme].buttons,
                                    externalConnection: {
                                        ...theme[theme.activeTheme].buttons.externalConnection,
                                        base: {
                                            ...theme[theme.activeTheme].buttons.externalConnection.base,
                                            border: {
                                                ...theme[theme.activeTheme].buttons.externalConnection.base.border,
                                                borderRadius: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    /**
     * Renders the form fields for the login box section.
     *
     * @returns Login box fields components.
     */
    const renderLoginBoxFields = (): React.ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Login box background color picker"
                        name={ `theme.${theme.activeTheme}.loginBox.background.backgroundColor` }
                        value={ initialValues.theme[theme.activeTheme].loginBox.background.backgroundColor }
                        data-componentid={ `${componentId}-login-box-background-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.loginBox.fields.backgroundColor.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.loginBox.fields.backgroundColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.loginBox." +
                                "fields.backgroundColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginBox: {
                                    ...theme[theme.activeTheme].loginBox,
                                    background: {
                                        ...theme[theme.activeTheme].loginBox.background,
                                        backgroundColor: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Login box font color picker"
                        name={ `theme.${theme.activeTheme}.loginBox.font.color` }
                        value={ initialValues.theme[theme.activeTheme].loginBox.font.color }
                        data-componentid={ `${componentId}-login-box-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.fontColor.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.fontColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.loginBox.fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginBox: {
                                    ...theme[theme.activeTheme].loginBox,
                                    font: {
                                        ...theme[theme.activeTheme].loginBox.font,
                                        color: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Login box border color picker"
                        name={ `theme.${theme.activeTheme}.loginBox.border.borderColor` }
                        value={ initialValues.theme[theme.activeTheme].loginBox.border.borderColor }
                        data-componentid={ `${componentId}-login-box-border-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderColor.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginBox: {
                                    ...theme[theme.activeTheme].loginBox,
                                    border: {
                                        ...theme[theme.activeTheme].loginBox.border,
                                        borderColor: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Login box border width input field"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.loginBox.border.borderWidth` }
                        value={ initialValues.theme[theme.activeTheme].loginBox.border.borderWidth }
                        label={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderWidth.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderWidth.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderWidth.placeholder")
                        }
                        required={ false }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_WIDTH_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_WIDTH_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-login-box-border-width` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginBox: {
                                    ...theme[theme.activeTheme].loginBox,
                                    border: {
                                        ...theme[theme.activeTheme].loginBox.border,
                                        borderWidth: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Login box border radius input field"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.loginBox.border.borderRadius` }
                        value={ initialValues.theme[theme.activeTheme].loginBox.border.borderRadius }
                        label={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderRadius.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderRadius.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.loginBox.fields.borderRadius.placeholder")
                        }
                        required={ false }
                        readOnly={ readOnly }
                        maxLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants
                                .DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-login-box-border-radius` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                loginBox: {
                                    ...theme[theme.activeTheme].loginBox,
                                    border: {
                                        ...theme[theme.activeTheme].loginBox.border,
                                        borderRadius: value
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    /**
     * Renders the form fields for the inputs section.
     *
     * @returns Input field components.
     */
    const renderInputFields = (): ReactElement => (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Input field background color picker"
                        name={ `theme.${theme.activeTheme}.inputs.base.background.backgroundColor` }
                        value={ initialValues.theme[theme.activeTheme].inputs.base.background.backgroundColor }
                        data-componentid={ `${componentId}-input-field-background-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.inputs.fields.backgroundColor.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.inputs.fields.backgroundColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.inputs." +
                                "fields.backgroundColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                inputs: {
                                    ...theme[theme.activeTheme].inputs,
                                    base: {
                                        ...theme[theme.activeTheme].inputs.base,
                                        background: {
                                            ...theme[theme.activeTheme].inputs.base.background,
                                            backgroundColor: value
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Input field font color picker"
                        name={ `theme.${theme.activeTheme}.inputs.base.font.color` }
                        value={ initialValues.theme[theme.activeTheme].inputs.base.font.color }
                        data-componentid={ `${componentId}-input-field-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={ t("extensions:develop.branding.forms.design.theme.inputs.fields.fontColor.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.inputs.fields.fontColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.inputs.fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                inputs: {
                                    ...theme[theme.activeTheme].inputs,
                                    base: {
                                        ...theme[theme.activeTheme].inputs.base,
                                        font: {
                                            ...theme[theme.activeTheme].inputs.base.font,
                                            color: value
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Input field border color picker"
                        name={ `theme.${theme.activeTheme}.inputs.base.border.borderColor` }
                        value={ initialValues.theme[theme.activeTheme].inputs.base.border.borderColor }
                        required={ false }
                        readOnly={ readOnly }
                        label={ t("extensions:develop.branding.forms.design.theme.inputs.fields.borderColor.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.inputs.fields.borderColor.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.inputs.fields.borderColor.placeholder")
                        }
                        data-componentid={ `${componentId}-input-field-border-color` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                inputs: {
                                    ...theme[theme.activeTheme].inputs,
                                    base: {
                                        ...theme[theme.activeTheme].inputs.base,
                                        border: {
                                            ...theme[theme.activeTheme].inputs.base.border,
                                            borderColor: value
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.Input
                        ariaLabel="Input field border radius input field"
                        inputType="default"
                        name={ `theme.${theme.activeTheme}.inputs.base.border.borderRadius` }
                        value={ initialValues.theme[theme.activeTheme].inputs.base.border.borderRadius }
                        required={ false }
                        readOnly={ readOnly }
                        label={ t("extensions:develop.branding.forms.design.theme.inputs.fields.borderRadius.label") }
                        hint={ t("extensions:develop.branding.forms.design.theme.inputs.fields.borderRadius.hint") }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.inputs.fields.borderRadius.placeholder")
                        }
                        maxLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MAX_LENGTH
                        }
                        minLength={
                            BrandingPreferencesConstants.DESIGN_FORM_FIELD_CONSTRAINTS.BORDER_RADIUS_MIN_LENGTH
                        }
                        width={ 16 }
                        data-componentid={ `${componentId}-input-field-border-radius` }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                inputs: {
                                    ...theme[theme.activeTheme].inputs,
                                    base: {
                                        ...theme[theme.activeTheme].inputs.base,
                                        border: {
                                            ...theme[theme.activeTheme].inputs.base.border,
                                            borderRadius: value
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Divider horizontal>
                        <Heading as="h6">
                            { t("extensions:develop.branding.forms.design.theme.inputs.labels.heading") }
                        </Heading>
                    </Divider>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Field.ColorPicker
                        ariaLabel="Input field labels font color picker"
                        name={ `theme.${theme.activeTheme}.inputs.base.labels.font.color` }
                        value={ initialValues.theme[theme.activeTheme].inputs.base.labels.font.color }
                        data-componentid={ `${componentId}-input-field-labels-font-color` }
                        required={ false }
                        readOnly={ readOnly }
                        label={
                            t("extensions:develop.branding.forms.design.theme.inputs.labels.fields.fontColor.label")
                        }
                        hint={
                            t("extensions:develop.branding.forms.design.theme.inputs.labels.fields.fontColor.hint")
                        }
                        placeholder={
                            t("extensions:develop.branding.forms.design.theme.inputs." +
                                "labels.fields.fontColor.placeholder")
                        }
                        listen={ (value: string) => setTheme({
                            ...theme,
                            [theme.activeTheme]: {
                                ...theme[theme.activeTheme],
                                inputs: {
                                    ...theme[theme.activeTheme].inputs,
                                    base: {
                                        ...theme[theme.activeTheme].inputs.base,
                                        labels: {
                                            ...theme[theme.activeTheme].inputs.base.labels,
                                            font: {
                                                ...theme[theme.activeTheme].inputs.base.labels.font,
                                                color: value
                                            }
                                        }
                                    }
                                }
                            }
                        }) }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );

    if (isLoading) {
        return (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line length="very short" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Paragraph>
            </Placeholder>
        );
    }

    return (
        <Form
            id={ FORM_ID }
            ref={ ref }
            uncontrolledForm={ true }
            onSubmit={ handleFormSubmit }
            enableReinitialize={ true }
            initialValues={ initialValues }
        >
            <div>
                <Heading as="h4">
                    { t("extensions:develop.branding.tabs.design.sections.layoutVariation.heading") }
                </Heading>
                <Text muted compact>
                    { t("extensions:develop.branding.tabs.design.sections.layoutVariation.description") }
                </Text>
            </div>
            <div>
                {

                    Object.keys(PredefinedLayouts)
                        .map((layoutKey: PredefinedLayouts, index: number) => {
                            const layoutName: PredefinedLayouts = PredefinedLayouts[layoutKey];

                            const basename: string = AppConstants.getAppBasename()
                                ? `/${AppConstants.getAppBasename()}`
                                : "";
                            const imageURL: string = `${basename}/libs/themes/${
                                themeName
                            }/assets/images/branding/layouts/${layoutName}.svg`;

                            return (
                                <Field.Radio
                                    key={ index }
                                    ariaLabel={ `${layoutName} layout swatch` }
                                    name="layout.activeLayout"
                                    label={
                                        t(
                                            "extensions:develop.branding.forms.design."
                                                + `layout.variations.fields.${
                                                    layoutName
                                                }.label`
                                        )
                                    }
                                    required={ false }
                                    readOnly={ readOnly }
                                    value={ layoutName }
                                    component={ LayoutSwatchAdapter }
                                    image={
                                        {
                                            altText: t("extensions:develop.branding.forms.design."
                                                + `layout.variations.fields.${
                                                    layoutName
                                                }.imgAlt`),
                                            imgURL: imageURL
                                        }
                                    }
                                    data-componentid={ `${componentId}-${layoutName}-layout-swatch` }
                                    premium={
                                        !commonConfig.enableDefaultBrandingPreviewSection
                                            && (layoutName === PredefinedLayouts.CUSTOM)
                                    }
                                    listen={ () => {
                                        setLayout({
                                            ...layout,
                                            activeLayout: layoutName
                                        });
                                    } }
                                />
                            );
                        })
                }
            </div>
            <div>
                <Heading as="h4">
                    { t("extensions:develop.branding.tabs.design.sections.themeVariation.heading") }
                </Heading>
                <Text muted compact>
                    <Trans
                        i18nKey={
                            "extensions:develop.branding.tabs.design.sections.themeVariation.description"
                        }
                        tOptions={ {
                            productName: productName
                        } }
                    >
                        Select a color theme for your interfaces. You can further customize
                        these themes using the options given below. By default, the light theme
                        ({ productName } theme) is selected.
                    </Trans>
                </Text>
            </div>
            <div>
                {
                    Object.keys(BrandingPreferenceMeta.getThemes())
                        .map((_theme: PredefinedThemes, index: number) => {
                            const meta: ThemeSwatchUIConfigsInterface = BrandingPreferenceMeta
                                .getThemeSwatchConfigs(_theme as PredefinedThemes);

                            return (
                                <Field.Radio
                                    key={ index }
                                    ariaLabel={ `${_theme} Theme swatch` }
                                    name="theme.activeTheme"
                                    label={
                                        t(
                                            "extensions:develop.branding.forms.design."
                                                + `theme.variations.fields.${
                                                    _theme.toLocaleLowerCase()
                                                }.label`
                                        )
                                    }
                                    required={ false }
                                    readOnly={ readOnly }
                                    value={ _theme }
                                    component={ ThemeSwatchAdapter }
                                    colors={ meta.colors }
                                    data-componentid={ `${componentId}-${_theme}-theme-swatch` }
                                    listen={ () => setTheme({
                                        ...theme,
                                        activeTheme: _theme
                                    }) }
                                />
                            );
                        })
                }
            </div>
            <div>
                <Heading as="h4">
                    { t("extensions:develop.branding.tabs.design.sections.themePreferences.heading") }
                </Heading>
                <Text muted compact>
                    { t("extensions:develop.branding.tabs.design.sections.themePreferences.description") }
                </Text>
            </div>
            <SegmentedAccordion
                fluid
                className="design-preferences-accordion"
                data-componentid={ `${componentId}-accordion` }
            >
                <React.Fragment>
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.IMAGES) }
                        index={ ACCORDION_TAB_INDEXES.IMAGES }
                        data-componentid={ `${componentId}-images-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.images.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.IMAGES) }
                        data-componentid={ `${componentId}-images-accordion-content` }
                    >
                        { renderImageFields() }
                    </SegmentedAccordion.Content>
                    { /* Color Palette */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.COLORS) }
                        index={ ACCORDION_TAB_INDEXES.COLORS }
                        data-componentid={ `${componentId}-color-palette-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.colors.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.COLORS) }
                        data-componentid={ `${componentId}-color-palette-accordion-content` }
                    >
                        { renderColorPaletteFields() }
                    </SegmentedAccordion.Content>

                    { /* Footer Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.FOOTER) }
                        index={ ACCORDION_TAB_INDEXES.FOOTER }
                        data-componentid={ `${componentId}-footer-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.footer.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.FOOTER) }
                        data-componentid={ `${componentId}-footer-accordion-content` }
                    >
                        { renderFooterFields() }
                    </SegmentedAccordion.Content>

                    { /* Typography Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.TYPOGRAPHY) }
                        index={ ACCORDION_TAB_INDEXES.TYPOGRAPHY }
                        data-componentid={ `${componentId}-typography-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.font.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.TYPOGRAPHY) }
                        data-componentid={ `${componentId}-typography-accordion-content` }
                    >
                        { renderTypographyFields() }
                    </SegmentedAccordion.Content>

                    { /* Headings Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.HEADINGS) }
                        index={ ACCORDION_TAB_INDEXES.HEADINGS }
                        data-componentid={ `${componentId}-headings-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.headings.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.HEADINGS) }
                        data-componentid={ `${componentId}-headings-accordion-content` }
                    >
                        { renderHeadingsFields() }
                    </SegmentedAccordion.Content>

                    { /* Button Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.BUTTONS) }
                        index={ ACCORDION_TAB_INDEXES.BUTTONS }
                        data-componentid={ `${componentId}-buttons-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.buttons.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.BUTTONS) }
                        data-componentid={ `${componentId}-buttons-accordion-content` }
                    >
                        { renderButtonsFields() }
                    </SegmentedAccordion.Content>

                    { /* Input Field Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.INPUTS) }
                        index={ ACCORDION_TAB_INDEXES.INPUTS }
                        data-componentid={ `${componentId}-inputs-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.inputs.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.INPUTS) }
                        data-componentid={ `${componentId}-inputs-accordion-content` }
                    >
                        { renderInputFields() }
                    </SegmentedAccordion.Content>

                    { /* Login Page Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.PAGE) }
                        index={ ACCORDION_TAB_INDEXES.PAGE }
                        data-componentid={ `${componentId}-login-page-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.loginPage.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.PAGE) }
                        data-componentid={ `${componentId}-login-page-accordion-content` }
                    >
                        { renderLoginPageFields() }
                    </SegmentedAccordion.Content>

                    { /* Login Box Preferences */ }
                    <SegmentedAccordion.Title
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.LOGIN_BOX) }
                        index={ ACCORDION_TAB_INDEXES.LOGIN_BOX }
                        data-componentid={ `${componentId}-login-box-accordion-item` }
                        onClick={ handleAccordionOnClick }
                    >
                        <Heading as="h5">
                            { t("extensions:develop.branding.forms.design.theme.loginBox.heading") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ accordionActiveIndexes.includes(ACCORDION_TAB_INDEXES.LOGIN_BOX) }
                        data-componentid={ `${componentId}-login-box-accordion-content` }
                    >
                        { renderLoginBoxFields() }
                    </SegmentedAccordion.Content>
                </React.Fragment>
            </SegmentedAccordion>
        </Form>
    );
});

/**
 * Default props for the component.
 */
DesignForm.defaultProps = {
    "data-componentid": "design-form"
};
