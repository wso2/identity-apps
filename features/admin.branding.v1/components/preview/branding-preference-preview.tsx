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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    DocumentationLink,
    EmptyPlaceholder,
    Iframe,
    Link,
    useDocumentation
} from "@wso2is/react-components";
import get from "lodash-es/get";
import Mustache from "mustache";
import React, {
    CSSProperties,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Placeholder } from "semantic-ui-react";
import { EmailTemplateScreenSkeleton } from "./email-template-screen-skeleton";
import { LoginScreenSkeleton } from "./login-screen-skeleton";
import { MyAccountScreenSkeleton } from "./my-account-screen-skeleton";
import { commonConfig } from "../../../admin.extensions.v1/configs";
import { ReactComponent as CustomLayoutSuccessImg } from
    "../../../themes/wso2is/assets/images/branding/custom-layout-success.svg";
import { ReactComponent as CustomLayoutWarningImg } from
    "../../../themes/wso2is/assets/images/branding/custom-layout-warning.svg";
import { AppState } from "../../../admin.core.v1/store";
import { useLayout, useLayoutStyle } from "../../api";
import { usePreviewContent, usePreviewStyle } from "../../api/preview-skeletons";
import { BrandingPreferenceMeta, LAYOUT_DATA, PredefinedLayouts } from "../../meta";
import { BrandingPreferenceInterface, PreviewScreenType } from "../../models";

/**
 * Proptypes for the Branding preference preview component.
 */
interface BrandingPreferencePreviewInterface extends IdentifiableComponentInterface {
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
    /**
     * Should the component render as loading.
     */
    isLoading: boolean;
    /**
     *
     */
    screenType: PreviewScreenType;
    /**
     * On preview resize callback.
     */
    onPreviewResize: (width: number) => void;
}

/**
 * Branding Preference Preview.
 *
 * @param props - Props injected to the component.
 *
 * @returns `BrandingPreferencePreview` component.
 */
export const BrandingPreferencePreview: FunctionComponent<BrandingPreferencePreviewInterface> = (
    props: BrandingPreferencePreviewInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        brandingPreference,
        isLoading,
        screenType,
        onPreviewResize
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const supportEmail: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.supportEmail as string);

    const brandingPreviewContainerRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [ isIframeReady, setIsIframeReady ] = useState<boolean>(false);
    const [ wrapperStyle, setWrapperStyle ] = useState<CSSProperties>(null);
    const [ iFrameStyle, setIFrameStyle ] = useState<CSSProperties>(null);
    const [ layoutContext, setLayoutContext ] = useState<string[]>([ "", "", "", "", "", "" ]);
    const [ isLayoutResolving, setIsLayoutResolving ] = useState<boolean>(true);
    const [ isErrorOccured, setIsErrorOccured ] = useState<boolean>(false);

    const {
        data: layoutBlob,
        isLoading: layoutLoading
    } = useLayout(brandingPreference.layout.activeLayout, tenantDomain);
    const {
        data: layoutStyleBlob,
        isLoading: layoutStyleLoading
    } = useLayoutStyle(brandingPreference.layout.activeLayout, tenantDomain);
    const {
        data: previewScreenSkeletonContent,
        isLoading: isPreviewScreenSkeletonContentLoading
    } = usePreviewContent(screenType);
    const { data: previewScreenSkeletonStyles } = usePreviewStyle(screenType);

    /**
     * Update the iframe styles to achieve responsiveness.
     */
    const updateStyles = () => {

        if (!brandingPreviewContainerRef?.current) {
            return;
        }

        const parentHeight: number = brandingPreviewContainerRef?.current?.clientHeight;
        const parentWidth: number = brandingPreviewContainerRef?.current?.clientWidth;

        const nodeStyle: CSSStyleDeclaration = window?.getComputedStyle(brandingPreviewContainerRef?.current);
        const topPadding: string = nodeStyle.getPropertyValue("padding-top");

        const effectedHeight: number = parentHeight - parseInt(topPadding.substring(0, topPadding.length - 2));

        const scalingFactor: number = 1.8;
        const iFrameOriginalWidth: number = parentWidth * scalingFactor;
        const iFrameOriginalHeight: number = effectedHeight * scalingFactor;

        setWrapperStyle({
            height: effectedHeight,
            overflow: "hidden",
            width: parentWidth
        });

        setIFrameStyle({
            height: iFrameOriginalHeight,
            transform: `scale(${1/scalingFactor})`,
            transformOrigin: "0 0",
            width: iFrameOriginalWidth
        });
        onPreviewResize(parentWidth);
    };

    /**
     * Set the initial styles for the iframe.
     */
    useEffect(() => {
        if (brandingPreviewContainerRef)
            updateStyles();
    }, [ brandingPreviewContainerRef ]);

    /**
     * Add and remove event listener for update the iframe styles.
     */
    useEffect(() => {
        window.addEventListener("resize", updateStyles);

        return () => window.removeEventListener("resize", updateStyles);
    }, []);

    /**
     * Read the layout resources.
     */
    useEffect(() => {

        const fetchLayoutResources = async () => {
            setIsLayoutResolving(true);

            const _layoutContext: string[] = [ ...layoutContext ];

            let htmlContent: string, cssContent: string;

            if (brandingPreference.layout.activeLayout !== _layoutContext[0]) {
                let layout: Blob;
                let styles: Blob;

                if (layoutLoading || layoutStyleLoading) {
                    return;
                } else {
                    if (layoutBlob) {
                        layout = layoutBlob;
                    }
                    if (layoutStyleBlob) {
                        styles = layoutStyleBlob;
                    }
                }

                try {
                    htmlContent = await layout.text();
                    cssContent = await styles.text();
                } catch (ex: any) {
                    setLayoutContext([ brandingPreference.layout.activeLayout, "", "", "", "", "" ]);
                    setIsErrorOccured(true);
                    setIsLayoutResolving(false);

                    return;
                }
            } else {
                if (isErrorOccured) {
                    setIsLayoutResolving(false);

                    return;
                }

                htmlContent = _layoutContext[1];
                cssContent = _layoutContext[2];
            }

            // Execute the layout using mustache library.
            const context: Record<string, string> =
                LAYOUT_DATA[brandingPreference.layout.activeLayout](brandingPreference.layout, tenantDomain);

            context.ProductHeader = "<section id='productHeader'></section>";
            context.MainSection = "<section id='mainSection'></section>";
            context.ProductFooter = "<section id='productFooter'></section>";
            const view: string = Mustache.render(htmlContent, context);

            const mergedCSSContent: string =
                BrandingPreferenceMeta.getThemeSkeleton(brandingPreference.theme)
                + BrandingPreferenceMeta.getStylesToDisablePointerEvents()
                + cssContent;

            setLayoutContext([
                brandingPreference.layout.activeLayout,
                htmlContent,
                cssContent,
                view,
                mergedCSSContent,
                get(brandingPreference, "stylesheets.accountApp")
            ]);
            if (isErrorOccured) setIsErrorOccured(false);
            setIsLayoutResolving(false);
        };

        fetchLayoutResources();
    }, [
        brandingPreference.theme,
        brandingPreference.layout,
        brandingPreference.layout.activeLayout,
        layoutLoading,
        layoutStyleLoading
    ]);

    const loginScreenCategory: PreviewScreenType[] = [
        PreviewScreenType.LOGIN,
        PreviewScreenType.SIGN_UP,
        PreviewScreenType.COMMON,
        PreviewScreenType.EMAIL_OTP,
        PreviewScreenType.SMS_OTP,
        PreviewScreenType.TOTP,
        PreviewScreenType.PASSWORD_RECOVERY,
        PreviewScreenType.PASSWORD_RESET,
        PreviewScreenType.PASSWORD_RESET_SUCCESS
    ];

    const resolvePreviewScreen = (): ReactElement => {
        if (loginScreenCategory.includes(screenType)) {
            return (
                <LoginScreenSkeleton
                    brandingPreference={ brandingPreference }
                    layoutContent = { layoutContext[3] }
                    data-componentid="branding-preference-preview-login-skeleton"
                />
            );
        }

        if (screenType === PreviewScreenType.MY_ACCOUNT) {
            return (
                <MyAccountScreenSkeleton
                    content={ previewScreenSkeletonContent }
                    brandingPreference={ brandingPreference }
                    data-componentid="branding-preference-preview-my-account-skeleton"
                />
            );
        }

        if (screenType === PreviewScreenType.EMAIL_TEMPLATE) {
            return (
                <EmailTemplateScreenSkeleton
                    content={ previewScreenSkeletonContent }
                    brandingPreference={ brandingPreference }
                    data-componentid="branding-preference-preview-email-template-skeleton"
                />
            );
        }

        return <ContentLoader data-componentid={ `${ componentId }-loader` } />;
    };

    const resolveIframeStyles = (): string => {
        if (isErrorOccured) {
            return "/*no-styles*/";
        }

        if (!loginScreenCategory.includes(screenType)) {
            if (screenType === PreviewScreenType.EMAIL_TEMPLATE) {
                return previewScreenSkeletonStyles;
            }

            return `${
                BrandingPreferenceMeta.getThemeSkeleton(brandingPreference.theme)
            }\n${previewScreenSkeletonStyles}}`;
        }

        return layoutContext[4];
    };

    return (
        <div
            className="branding-preference-preview-container"
            ref={ brandingPreviewContainerRef }
            data-componentid={ componentId }
        >
            {
                isLoading || !isIframeReady
                    ? (
                        <Placeholder
                            className="branding-preference-preview-loader"
                            data-componentid={ `${ componentId }-loader` }
                        >
                            <Placeholder.Image />
                        </Placeholder>
                    ) : null
            }
            <Iframe
                cloneParentStyleSheets
                injectStyleNodeAfterParentStyles
                styles={ resolveIframeStyles() }
                styleNodeInjectionStrategy="prepend"
                stylesheets={
                    isErrorOccured || layoutContext[0] === PredefinedLayouts.CUSTOM
                        ? null
                        : [ layoutContext[5] ]
                }
                isReady={ (status: boolean) => {
                    setIsIframeReady(status);
                } }
                isLoading={ !isLoading || !isIframeReady }
                data-componentid={ `${ componentId }-iframe` }
                className="branding-preference-preview-iframe"
                style={ iFrameStyle }
                wrapperStyle= { wrapperStyle }
                id="branding-preference-preview-iframe"
            >
                {
                    !isLoading && isIframeReady && !isLayoutResolving && !isPreviewScreenSkeletonContentLoading
                        ? (
                            commonConfig.enableDefaultBrandingPreviewSection
                                && layoutContext[0] === PredefinedLayouts.CUSTOM ? (
                                    <div className="branding-preference-preview-message" >
                                        <EmptyPlaceholder
                                            image={ CustomLayoutSuccessImg }
                                            imageSize="small"
                                            subtitle={
                                                [
                                                    t("extensions:develop.branding.tabs.preview."
                                                        + "info.layout.activatedMessage.subTitle"),
                                                    <>
                                                        { t("extensions:develop.branding.tabs.preview."
                                                            + "info.layout.activatedMessage.description") }
                                                        <DocumentationLink
                                                            link={ getLink("develop.branding.layout.custom.learnMore") }
                                                        >
                                                            { t("common:learnMore") }
                                                        </DocumentationLink>
                                                    </>
                                                ]
                                            }
                                            title={ t("extensions:develop.branding.tabs.preview."
                                                + "info.layout.activatedMessage.title") }
                                        />
                                    </div>
                                ) : (
                                    isErrorOccured
                                        ? (
                                            <div className="branding-preference-preview-message" >
                                                <EmptyPlaceholder
                                                    image={ CustomLayoutWarningImg }
                                                    imageSize="small"
                                                    subtitle={
                                                        layoutContext[0] === PredefinedLayouts.CUSTOM
                                                            ? [
                                                                t("extensions:develop.branding.tabs.preview."
                                                                    + "errors.layout.notFoundWithSupport.subTitle"),
                                                                <Trans
                                                                    key={ 1 }
                                                                    i18nKey={ "extensions:develop.branding."
                                                                        + "tabs.preview.errors.layout."
                                                                        + "notFoundWithSupport.description" }
                                                                    tOptions={ {
                                                                        supportEmail
                                                                    } }
                                                                >
                                                                    Need a fully customized layout for your
                                                                    organization? Reach us out at <Link
                                                                        data-componentid=
                                                                            { "branding-preference-"
                                                                            + "custom-request-mail-trigger" }
                                                                        link={ `mailto:${ supportEmail }` }
                                                                    >
                                                                        { supportEmail }
                                                                    </Link>
                                                                </Trans>
                                                            ]
                                                            : [
                                                                t("extensions:develop.branding.tabs."
                                                                    + "preview.errors.layout.notFound.subTitle")
                                                            ]

                                                    }
                                                    title={
                                                        layoutContext[0] === PredefinedLayouts.CUSTOM
                                                            ? t("extensions:develop.branding.tabs.preview.errors."
                                                                + "layout.notFoundWithSupport.title")
                                                            : t("extensions:develop.branding.tabs.preview.errors."
                                                                + "layout.notFound.title")
                                                    }
                                                />
                                            </div>
                                        )
                                        : resolvePreviewScreen()
                                )
                        ) : <ContentLoader data-componentid={ `${ componentId }-loader` } />
                }
            </Iframe>
        </div>
    );
};

/**
 * Default props for the component.
 */
BrandingPreferencePreview.defaultProps = {
    "data-componentid": "branding-preference-preview"
};
