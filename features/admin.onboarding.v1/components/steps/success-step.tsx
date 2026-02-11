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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowUpRightFromSquareIcon, CheckIcon } from "@oxygen-ui/react-icons";
import useGetApplicationTemplateMetadata
    from "@wso2is/admin.application-templates.v1/api/use-get-application-template-metadata";
import { ApplicationTemplateConstants } from "@wso2is/admin.application-templates.v1/constants/templates";
import useGetApplicationInboundConfigs
    from "@wso2is/admin.applications.v1/api/use-get-application-inbound-configs";
import { OIDCApplicationConfigurationInterface } from "@wso2is/admin.applications.v1/models/application";
import { OIDCDataInterface } from "@wso2is/admin.applications.v1/models/application-inbound";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import {
    OnboardingComponentIds,
    getIntegrationGuide,
    getTemplateDocsUrl
} from "../../constants";
import { FrameworkIntegrationGuideInterface, IntegrationConfigInterface } from "../../constants/integration-guides";
import {
    CreatedApplicationResultInterface,
    OnboardingBrandingConfigInterface,
    SignInOptionsConfigInterface
} from "../../models";
import { buildOnboardingGuideData } from "../../utils/build-guide-data";
import { resolveGuideContent } from "../../utils/guide-content-resolver";
import CodeBlock from "../shared/code-block";
import CopyableField from "../shared/copyable-field";
import IntegrationAccordion from "../shared/integration-accordion";
import LoginBoxPreview from "../shared/login-box-preview";
import { LeftColumn, RightColumn, TwoColumnLayout } from "../shared/onboarding-styles";
import SuccessConfetti from "../shared/success-confetti";

/**
 * Props interface for SuccessStep component.
 */
interface SuccessStepPropsInterface extends IdentifiableComponentInterface {
    /** Created application result */
    createdApplication?: CreatedApplicationResultInterface;
    /** Template ID */
    templateId?: string;
    /** Framework display name */
    framework?: string;
    /** Sign-in options for preview */
    signInOptions?: SignInOptionsConfigInterface;
    /** Branding configuration for preview */
    brandingConfig?: OnboardingBrandingConfigInterface;
    /** Whether this is an M2M application */
    isM2M?: boolean;
    /** Redirect URLs configured for the application */
    redirectUrls?: string[];
}

/**
 * Success header container.
 */
const SuccessHeader: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3),
    position: "relative"
}));

/**
 * Title text with icon.
 */
const TitleContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(1.5)
}));

/**
 * Success icon styling.
 */
const SuccessIcon: typeof CheckIcon = styled(CheckIcon)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.success.main,
    height: 32,
    width: 32
}));

/**
 * Title text.
 */
const Title: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "1.5rem",
    fontWeight: 600
}));

/**
 * Subtitle text.
 */
const Subtitle: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.9375rem"
}));

/**
 * Helper text.
 */
const HelperText: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    fontStyle: "italic"
}));

/**
 * Scrollable left column override for success step.
 * Overrides the parent LeftColumn's `overflow: hidden` to allow scrolling
 * when accordion content expands beyond the available height.
 */
const ScrollableLeftColumn: typeof LeftColumn = styled(LeftColumn)(({ theme }: { theme: Theme }) => ({
    "&::-webkit-scrollbar": {
        width: 6
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[300],
        borderRadius: 3
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent"
    },
    overflow: "auto",
    paddingRight: theme.spacing(1)
}));

/**
 * Preview column styling.
 */
const PreviewColumn: typeof Box = styled(RightColumn)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius * 2,
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(4)
}));

/**
 * Success step component for onboarding.
 * Shows success message and integration options after application creation.
 */
const SuccessStep: FunctionComponent<SuccessStepPropsInterface> = (
    props: SuccessStepPropsInterface
): ReactElement => {
    const {
        createdApplication,
        templateId,
        signInOptions,
        brandingConfig,
        isM2M = false,
        redirectUrls,
        ["data-componentid"]: componentId = OnboardingComponentIds.SUCCESS_STEP
    } = props;

    const customServerHost: string = useSelector((state: AppState) =>
        state.config?.deployment?.customServerHost || ""
    );
    const serverOrigin: string = useSelector((state: AppState) =>
        state.config?.deployment?.serverOrigin || ""
    );
    const tenantDomain: string = useSelector((state: AppState) =>
        state.auth?.tenantDomain || ""
    );
    const clientOrigin: string = useSelector((state: AppState) =>
        state.config?.deployment?.clientOrigin || ""
    );
    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector((state: AppState) =>
        state.application?.oidcConfigurations
    );
    const productName: string = useSelector((state: AppState) =>
        state.config?.ui?.productName || ""
    );
    const accountAppURL: string = useSelector((state: AppState) =>
        state.config?.deployment?.accountApp?.tenantQualifiedPath || ""
    );
    const docSiteURL: string = useSelector((state: AppState) =>
        state.config?.deployment?.docSiteURL || ""
    );

    // Excluded templates don't have API-served metadata; passing shouldFetch: true
    // for them leaves isLoading stuck at true and blocks the config section.
    const hasApiMetadata: boolean = !!templateId &&
        !ApplicationTemplateConstants.EXCLUDED_APP_TEMPLATES_FOR_EXTENSION_API.includes(templateId);

    const {
        data: templateMetadata,
        isLoading: isMetadataLoading
    } = useGetApplicationTemplateMetadata(
        templateId,
        !isM2M && hasApiMetadata && !!createdApplication
    );

    const {
        data: inboundOidcConfig,
        isLoading: isInboundConfigLoading
    } = useGetApplicationInboundConfigs<OIDCDataInterface>(
        createdApplication?.applicationId,
        "oidc",
        !!createdApplication?.applicationId
    );

    const guideContent: string | undefined = useMemo(
        () => resolveGuideContent(templateMetadata),
        [ templateMetadata ]
    );

    const guideData: Record<string, unknown> = useMemo(() => buildOnboardingGuideData({
        accountAppURL,
        clientOrigin,
        createdApplication,
        customServerHost,
        docSiteURL,
        inboundProtocolConfig: inboundOidcConfig,
        oidcConfigurations,
        productName,
        redirectUrls,
        serverOrigin,
        tenantDomain
    }), [
        accountAppURL, clientOrigin, createdApplication, customServerHost, docSiteURL,
        inboundOidcConfig, oidcConfigurations, productName, redirectUrls, serverOrigin,
        tenantDomain
    ]);

    const isGuideLoading: boolean = isMetadataLoading || isInboundConfigLoading;

    const integrationGuide: FrameworkIntegrationGuideInterface | undefined = useMemo(() => {
        if (templateId && !isM2M) {
            return getIntegrationGuide(templateId);
        }

        return undefined;
    }, [ templateId, isM2M ]);

    const integrationConfig: IntegrationConfigInterface = useMemo(() => ({
        appName: createdApplication?.name || "My Application",
        baseUrl: customServerHost,
        clientId: inboundOidcConfig?.clientId || createdApplication?.clientId || "",
        clientSecret: inboundOidcConfig?.clientSecret || createdApplication?.clientSecret,
        redirectUrl: redirectUrls?.[0] || "http://localhost:3000",
        templateId
    }), [ createdApplication, customServerHost, inboundOidcConfig, redirectUrls, templateId ]);

    const appName: string = createdApplication?.name || "Your application";

    const docsUrl: string | undefined = getTemplateDocsUrl(templateId, docSiteURL);

    const getSuccessTitle: () => string = (): string => {
        return `Your application ${appName} is ready!`;
    };

    const getSuccessSubtitle: () => string = (): string => {
        if (isM2M) {
            return "Use the credentials below to authenticate your service.";
        }

        if (integrationGuide || guideContent) {
            return "Follow the guide below to integrate login into your application.";
        }

        if (!isGuideLoading) {
            return "Use the configuration below to integrate login into your application.";
        }

        return "Get started by integrating login into your application.";
    };

    const tokenEndpoint: string = oidcConfigurations?.tokenEndpoint
        || `${customServerHost}/oauth2/token`;

    const m2mCurlCommand: string = useMemo(() => {
        if (!isM2M || !createdApplication) {
            return "";
        }

        const secret: string = integrationConfig.clientSecret || "YOUR_CLIENT_SECRET";
        const basicAuth: string = btoa(`${integrationConfig.clientId}:${secret}`);

        return `curl --location '${tokenEndpoint}' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -H 'Authorization: Basic ${basicAuth}' \\
  -d 'grant_type=client_credentials'`;
    }, [ isM2M, createdApplication, integrationConfig, tokenEndpoint ]);

    return (
        <TwoColumnLayout data-componentid={ componentId }>
            <ScrollableLeftColumn>
                <SuccessHeader>
                    <SuccessConfetti primaryColor={ brandingConfig?.primaryColor } />
                    <TitleContainer>
                        <SuccessIcon />
                        <Title>{ getSuccessTitle() }</Title>
                    </TitleContainer>
                    <Subtitle>{ getSuccessSubtitle() }</Subtitle>
                    { !isM2M && (
                        <HelperText>
                            This is optional. Skip if you&apos;ll configure later.
                        </HelperText>
                    ) }
                </SuccessHeader>

                { isM2M && createdApplication && (
                    <Box sx={ { display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 480 } }>
                        <CopyableField
                            data-componentid={ `${componentId}-client-id` }
                            label="Client ID"
                            value={ integrationConfig.clientId }
                        />
                        { integrationConfig.clientSecret && (
                            <CopyableField
                                data-componentid={ `${componentId}-client-secret` }
                                label="Client Secret"
                                secret
                                value={ integrationConfig.clientSecret }
                            />
                        ) }
                        <CopyableField
                            data-componentid={ `${componentId}-token-endpoint` }
                            label="Token Endpoint"
                            value={ tokenEndpoint }
                        />
                        <CodeBlock
                            code={ m2mCurlCommand }
                            data-componentid={ `${componentId}-m2m-curl` }
                            label="Token Request"
                        />
                        { docsUrl && (
                            <Link
                                href={ docsUrl }
                                rel="noopener noreferrer"
                                sx={ {
                                    alignItems: "center",
                                    display: "inline-flex",
                                    fontSize: "0.875rem",
                                    gap: 0.5,
                                    mt: 0.5
                                } }
                                target="_blank"
                            >
                                Read the full integration guide
                                <ArrowUpRightFromSquareIcon size={ 14 } />
                            </Link>
                        ) }
                    </Box>
                ) }

                { !isM2M && (integrationGuide || guideContent) && (
                    <>
                        <IntegrationAccordion
                            config={ integrationConfig }
                            guide={ integrationGuide }
                            guideContent={ guideContent }
                            guideData={ guideData }
                            isGuideLoading={ isGuideLoading }
                            testUserCredentials={ createdApplication?.testUserCredentials }
                            data-componentid={ `${componentId}-integration` }
                        />
                        { docsUrl && (
                            <Link
                                href={ docsUrl }
                                rel="noopener noreferrer"
                                sx={ {
                                    alignItems: "center",
                                    display: "inline-flex",
                                    fontSize: "0.875rem",
                                    gap: 0.5
                                } }
                                target="_blank"
                            >
                                Read the full integration guide
                                <ArrowUpRightFromSquareIcon size={ 14 } />
                            </Link>
                        ) }
                    </>
                ) }

                { !isM2M && !integrationGuide && !guideContent && !isGuideLoading && (
                    <Box sx={ { display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 480 } }>
                        <Typography sx={ { fontWeight: 600 } } variant="subtitle2">
                            Application Configuration
                        </Typography>
                        <CopyableField
                            data-componentid={ `${componentId}-client-id` }
                            label="Client ID"
                            value={ integrationConfig.clientId }
                        />
                        { templateId === "oidc-web-application" && integrationConfig.clientSecret && (
                            <CopyableField
                                data-componentid={ `${componentId}-client-secret` }
                                label="Client Secret"
                                secret
                                value={ integrationConfig.clientSecret }
                            />
                        ) }
                        <CopyableField
                            data-componentid={ `${componentId}-redirect-url` }
                            label={ templateId === "mobile-application"
                                ? "Redirect URI" : "Redirect URL" }
                            value={ integrationConfig.redirectUrl }
                        />
                        { templateId === "mobile-application" ? (
                            <CopyableField
                                data-componentid={ `${componentId}-discovery-url` }
                                label="Discovery URL"
                                value={ oidcConfigurations?.wellKnownEndpoint || "" }
                            />
                        ) : (
                            <CopyableField
                                data-componentid={ `${componentId}-base-url` }
                                label="Base URL"
                                value={ customServerHost }
                            />
                        ) }
                        <CopyableField
                            data-componentid={ `${componentId}-scope` }
                            label="Scope"
                            value="openid profile"
                        />
                        { docsUrl && (
                            <Link
                                href={ docsUrl }
                                rel="noopener noreferrer"
                                sx={ {
                                    alignItems: "center",
                                    display: "inline-flex",
                                    fontSize: "0.875rem",
                                    gap: 0.5,
                                    mt: 0.5
                                } }
                                target="_blank"
                            >
                                Read the full integration guide
                                <ArrowUpRightFromSquareIcon size={ 14 } />
                            </Link>
                        ) }
                    </Box>
                ) }

            </ScrollableLeftColumn>

            { !isM2M && (
                <PreviewColumn>
                    <LoginBoxPreview
                        brandingConfig={ brandingConfig }
                        signInOptions={ signInOptions }
                        data-componentid={ `${componentId}-preview` }
                    />
                </PreviewColumn>
            ) }
        </TwoColumnLayout>
    );
};

export default SuccessStep;
