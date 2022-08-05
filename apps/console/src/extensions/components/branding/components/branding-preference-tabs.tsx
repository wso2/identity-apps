/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FormPropsInterface } from "@wso2is/form";
import { Heading, Link, ResourceTab } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Icon, Message, Segment, TabProps } from "semantic-ui-react";
import { AdvanceForm, AdvanceFormValuesInterface } from "./advanced";
import { DesignForm, DesignFormValuesInterface } from "./design";
import {
    GeneralDetailsForm,
    GeneralDetailsFormValuesInterface
} from "./general";
import { BrandingPreferencePreview } from "./preview";
import { StickyTabPaneActionPanel } from "./sticky-tab-pane-action-panel";
import { AppState } from "../../../../features/core/store";
import { BrandingPreferencesConstants } from "../constants";
import { BrandingPreferenceMeta, PredefinedThemes } from "../meta";
import {
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface
} from "../models";

/**
 * Proptypes for the Branding preference tabs component.
 */
interface BrandingPreferenceTabsInterface extends IdentifiableComponentInterface {

    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
    /**
     * Predefines themes configs with default values.
     */
    predefinedThemes: BrandingPreferenceThemeInterface;
    /**
     * Is the component loading.
     */
    isLoading: boolean;
    /**
     * Is Read only?
     */
    readOnly: boolean;
    /**
     * Should the tabs be split in to two views.
     */
    isSplitView: boolean;
    /**
     * Is the component updating.
     */
    isUpdating: boolean;
    /**
     *
     * @param {Partial<BrandingPreferenceInterface>} values - Form Values.
     */
    onSubmit: (values: Partial<BrandingPreferenceInterface>) => void;
}

/**
 * Branding Preference Tabs.
 *
 * @param {BrandingPreferenceTabsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const BrandingPreferenceTabs: FunctionComponent<BrandingPreferenceTabsInterface> = (
    props: BrandingPreferenceTabsInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        predefinedThemes,
        brandingPreference,
        isLoading,
        isSplitView,
        isUpdating,
        readOnly,
        onSubmit
    } = props;

    const { t } = useTranslation();

    const formRef = useRef<FormPropsInterface>(null);

    const supportEmail: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.supportEmail as string);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(isUpdating);
    const [
        brandingPreferenceForPreview,
        setBrandingPreferenceForPreview
    ] = useState<BrandingPreferenceInterface>(brandingPreference);

    /**
     * Sets the branding preference preview config.
     */
    useEffect(() => {

        if (isEmpty(brandingPreference)) {
            return;
        }

        setBrandingPreferenceForPreview(moderateValuesForPreview(brandingPreference));
    }, [ brandingPreference, predefinedThemes ]);

    /**
     * Sets the submitting state of the form.
     */
    useEffect(() => {

        setIsSubmitting(isUpdating);
    }, [ isUpdating ]);

    /**
     * General Preferences Tab.
     * @return {ReactElement}
     */
    const GeneralPreferenceTabPane = (): ReactElement => (
        <ResourceTab.Pane loading={ isLoading } attached="bottom" data-componentid="branding-preference-general-tab">
            <Segment
                basic
                padded="very"
                loading={ isLoading }
                className="preference-form-container"
                data-componentid="branding-preference-general-tab-content-container"
            >
                <GeneralDetailsForm
                    ref={ formRef }
                    onSubmit={ onSubmit }
                    initialValues={ {
                        organizationDetails: {
                            copyrightText: brandingPreference.organizationDetails?.copyrightText,
                            siteTitle: brandingPreference.organizationDetails?.siteTitle,
                            supportEmail: brandingPreference.organizationDetails?.supportEmail
                        }
                    } }
                    broadcastValues={ (values: GeneralDetailsFormValuesInterface) => {
                        setBrandingPreferenceForPreview({
                            ...moderateValuesForPreview({
                                ...brandingPreference,
                                organizationDetails: {
                                    copyrightText: !isEmpty(values.organizationDetails.copyrightText)
                                        ? values.organizationDetails.copyrightText
                                        : BrandingPreferenceMeta
                                            .getBrandingPreferenceInternalFallbacks().organizationDetails.copyrightText,
                                    siteTitle: values.organizationDetails.siteTitle,
                                    supportEmail: values.organizationDetails.supportEmail
                                }
                            })
                        });
                    } }
                    readOnly={ readOnly }
                    isLive={ brandingPreference.configs.isBrandingEnabled }
                    data-componentid="branding-preference-general-details-form"
                />
            </Segment>
            <StickyTabPaneActionPanel
                formRef={ formRef }
                saveButton={ {
                    "data-componentid": "branding-preference-general-details-form-submit-button",
                    isDisabled: isSubmitting,
                    isLoading: isSubmitting,
                    readOnly: readOnly
                } }
                data-componentid="sticky-tab-action-panel"
            />
        </ResourceTab.Pane>
    );

    /**
     * Design Preferences Tab.
     * @return {ReactElement}
     */
    const DesignPreferenceTabPane = (): ReactElement => (
        <ResourceTab.Pane loading={ isLoading } attached="bottom" data-componentid="branding-preference-design-tab">
            <Segment
                basic
                padded="very"
                loading={ isLoading }
                className="preference-form-container no-max-width"
                data-componentid="branding-preference-design-tab-content-container"
            >
                <DesignForm
                    initialValues={ {
                        theme: brandingPreference.theme
                    } }
                    ref={ formRef }
                    onSubmit={ onSubmit }
                    broadcastValues={ (values: DesignFormValuesInterface) => {
                        setBrandingPreferenceForPreview({
                            ...moderateValuesForPreview({
                                ...brandingPreference,
                                theme: values.theme
                            })
                        });
                    } }
                    readOnly={ readOnly }
                    data-componentid="branding-preference-design-form"
                />
            </Segment>
            <StickyTabPaneActionPanel
                formRef={ formRef }
                saveButton={ {
                    "data-componentid": "branding-preference-design-form-submit-button",
                    isDisabled: isSubmitting,
                    isLoading: isSubmitting,
                    readOnly: readOnly
                } }
                data-componentid="sticky-tab-action-panel"
            />
        </ResourceTab.Pane>
    );

    /**
     * Advance Preferences Tab.
     * @return {ReactElement}
     */
    const AdvancePreferenceTabPane = (): ReactElement => (
        <ResourceTab.Pane loading={ isLoading } attached="bottom" data-componentid="branding-preference-advanced-tab">
            <Segment
                basic
                padded="very"
                loading={ isLoading }
                className="preference-form-container"
                data-componentid="branding-preference-advanced-tab-content-container"
            >
                <AdvanceForm
                    ref={ formRef }
                    onSubmit={ onSubmit }
                    initialValues={ {
                        urls: {
                            cookiePolicyURL: brandingPreference.urls?.cookiePolicyURL,
                            privacyPolicyURL: brandingPreference.urls?.privacyPolicyURL,
                            termsOfUseURL: brandingPreference.urls?.termsOfUseURL
                        }
                    } }
                    isSubmitting={ isSubmitting }
                    broadcastValues={ (values: AdvanceFormValuesInterface) => {
                        setBrandingPreferenceForPreview({
                            ...moderateValuesForPreview({
                                ...brandingPreference,
                                urls: values.urls
                            })
                        });
                    } }
                    readOnly={ readOnly }
                    data-componentid="branding-preference-advanced-form"
                />
                <Divider hidden/>
                <Message info className={ "mb-5 connector-info" }>
                    <Heading as="h3">{ t("extensions:develop.branding.tabs.general.customRequest.heading") }</Heading>
                    <p>
                        <Trans
                            i18nKey={ "extensions:develop.branding.tabs.general.customRequest.description" }
                            tOptions={ {
                                supportEmail
                            } }
                        >
                            If you require further customizations, please reach to us at <Link
                                data-componentid="branding-preference-custom-request-mail-trigger"
                                link={ `mailto:${ supportEmail }` }>{ supportEmail }</Link>
                        </Trans>
                    </p>
                </Message>
            </Segment>
            <StickyTabPaneActionPanel
                formRef={ formRef }
                saveButton={ {
                    "data-componentid": "branding-preference-advanced-form-submit-button",
                    isDisabled: isSubmitting,
                    isLoading: isSubmitting,
                    readOnly: readOnly
                } }
                data-componentid="sticky-tab-action-panel"
            />
        </ResourceTab.Pane>
    );

    /**
     * Preview Preferences Tab.
     * @return {ReactElement}
     */
    const PreviewPreferenceTabPane = (): ReactElement => (
        <ResourceTab.Pane className="preview-tab" attached="bottom" data-componentid="branding-preference-preview-tab">
            <Message
                info
                floating
                attached="top"
                className="preview-disclaimer"
                content={ (
                    <>
                        <Icon name="info circle"/>
                        { t("extensions:develop.branding.tabs.preview.disclaimer") }
                    </>
                ) }
                data-componentid="branding-preference-preview-disclaimer"
            />
            <BrandingPreferencePreview
                isLoading={ isLoading }
                brandingPreference={ brandingPreferenceForPreview }
                data-componentid="branding-preference-preview"
            />
        </ResourceTab.Pane>
    );

    /**
     * Resolves the tab panes based on the application config.
     *
     * @return {TabProps [ "panes" ]} Resolved tab panes.
     */
    const resolveTabPanes = (): TabProps [ "panes" ] => {

        const panes: TabProps [ "panes" ] = [];

        panes.push({
            menuItem: t("extensions:develop.branding.tabs.general.label"),
            render: GeneralPreferenceTabPane
        });

        panes.push({
            menuItem: t("extensions:develop.branding.tabs.design.label"),
            render: DesignPreferenceTabPane
        });

        panes.push({
            menuItem: t("extensions:develop.branding.tabs.advance.label"),
            render: AdvancePreferenceTabPane
        });

        if (!isSplitView) {
            panes.push({
                menuItem: t("extensions:develop.branding.tabs.preview.label"),
                render: PreviewPreferenceTabPane
            });
        }

        return panes;
    };

    /**
     * Moderate the values for the preview window.
     * @param {BrandingPreferenceInterface} preference - Preference Object.
     */
    const moderateValuesForPreview = (preference: BrandingPreferenceInterface): BrandingPreferenceInterface => {

        const preferenceForPreview: BrandingPreferenceInterface = cloneDeep(preference);

        for (const key in PredefinedThemes) {
            if (isEmpty(preferenceForPreview.theme[ PredefinedThemes[ key ] ]?.images?.logo?.imgURL)) {
                set(preferenceForPreview,
                    `theme.${ PredefinedThemes[ key ] }.images.logo.imgURL`,
                    Object.prototype.hasOwnProperty.call(
                        BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks().theme,
                        PredefinedThemes[ key ]
                    )
                        ? BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks()
                            .theme[ PredefinedThemes[ key ] ].images.logo.imgURL
                        : BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks()
                            .theme[ BrandingPreferencesConstants.DEFAULT_THEME ].images.logo.imgURL
                );
            }
        }

        if (isEmpty(preferenceForPreview.organizationDetails?.copyrightText)) {
            set(preferenceForPreview,
                "organizationDetails.copyrightText",
                BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks().organizationDetails.copyrightText);
        }

        return preferenceForPreview;
    };

    return (
        <Segment.Group
            horizontal
            className="basic branding-preference-tab-group"
            data-componentid={ componentId }
        >
            <Segment basic padded={ false }>
                <ResourceTab
                    attached="top"
                    secondary={ false }
                    pointing={ false }
                    onTabChange={ () => setBrandingPreferenceForPreview(moderateValuesForPreview(brandingPreference)) }
                    panes={ resolveTabPanes() }
                    data-componentid={ `${ componentId }-forms` }
                />
            </Segment>
            {
                isSplitView && (
                    <Segment basic padded={ false } className="preview">
                        <ResourceTab
                            attached="top"
                            secondary={ false }
                            pointing={ false }
                            panes={ [
                                {
                                    menuItem: t("extensions:develop.branding.tabs.preview.label"),
                                    render: PreviewPreferenceTabPane
                                }
                            ] }
                            data-componentid={ `${ componentId }-preview` }
                        />
                    </Segment>
                )
            }
        </Segment.Group>
    );
};

/**
 * Default props for the component.
 */
BrandingPreferenceTabs.defaultProps = {
    "data-componentid": "branding-preference-tabs"
};
