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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Typography from "@oxygen-ui/react/Typography";
import { i18nLink } from "@wso2is/common.branding.v1/utils/i18n-link";
import { sanitizedHtmlWithLocalizedLinks } from "@wso2is/common.branding.v1/utils/sanitized-html";
import { ConsentInterface, PurposeElementDTOInterface, useGetPurposesByIds } from "@wso2is/common.consents.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import parse from "html-react-parser";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidatePurposes from "../../../../hooks/use-validate-purposes";
import { PurposeInterface } from "../../../../models/purpose";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link MarketingConsentAdapter}
 */
type MarketingConsentAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

const PlaceholderText: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: theme.typography.body2.fontSize,
    fontStyle: "italic"
}));

const EmptyState: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    fontSize: "13px",
    padding: theme.spacing(2),
    textAlign: "center"
}));

const RichTextLabel: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "& .rich-text-align-center": {
        textAlign: "center"
    },
    "& .rich-text-align-justify": {
        textAlign: "justify"
    },
    "& .rich-text-align-left": {
        textAlign: "left"
    },
    "& .rich-text-align-right": {
        textAlign: "right"
    },
    "& .rich-text-bold": {
        fontWeight: "bold"
    },
    "& .rich-text-italic": {
        fontStyle: "italic"
    },
    "& .rich-text-pre-wrap": {
        whiteSpace: "pre-wrap"
    },
    "& .rich-text-underline": {
        textDecoration: "underline"
    },
    "& a.rich-text-link": {
        color: theme.palette.primary.main,
        textDecoration: "underline"
    },
    fontSize: "14px",
    lineHeight: 1.5
}));

const CheckboxRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5)
}));

const AttributesSection: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(1.5),
    marginLeft: theme.spacing(3.5),
    marginTop: theme.spacing(-1)
}));

const AttributeRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.25),
    marginTop: theme.spacing(0.5)
}));

/**
 * Resolves a purpose description to the best matching string for the current locale.
 * Falls back to `en-US`, then to the first available locale, then to an empty string.
 */
const resolveDescription = (
    description: string | Record<string, string>,
    language: string
): string => {
    if (!description) {
        return "";
    }
    if (typeof description === "string") {
        return description;
    }

    return description[language]
        ?? description["en-US"]
        ?? Object.values(description)[0]
        ?? "";
};

/**
 * Adapter for the Marketing Consent element.
 * Renders a config-driven preview of purposes, their i18n descriptions, and selectable user attributes.
 *
 * @param props - Props injected to the component.
 * @returns The MarketingConsentAdapter component.
 */
const MarketingConsentAdapter: FunctionComponent<MarketingConsentAdapterPropsInterface> = ({
    resource
}: MarketingConsentAdapterPropsInterface): ReactElement => {
    const { i18n, t } = useTranslation();

    const purposes: PurposeInterface[] = useMemo(
        (): PurposeInterface[] => resource.config?.purposes ?? [],
        [ resource.config?.purposes ]
    );

    const purposeIds: string[] = useMemo(
        (): string[] => purposes.map((p: PurposeInterface): string => p.purposeId),
        [ purposes ]
    );

    const { data: purposeDetails } = useGetPurposesByIds(purposeIds);

    useValidatePurposes(resource, purposes, null, {
        messageKeyPrefix: "marketingConsent",
        type: "marketing",
        validateAvailability: false
    });

    return (
        <Box>
            { purposes.length === 0 ? (
                <EmptyState>{ t("flows:core.elements.marketingConsent.emptyState") }</EmptyState>
            ) : (
                purposes.map((purpose: PurposeInterface): ReactElement => {
                    const detail: ConsentInterface | undefined = purposeDetails?.find(
                        (d: ConsentInterface): boolean => d.id === purpose.purposeId
                    );
                    const description: string = resolveDescription(
                        detail?.description ?? purpose.description,
                        i18n.language
                    );
                    const sanitized: string = sanitizedHtmlWithLocalizedLinks(
                        description,
                        i18n.language,
                        i18nLink
                    );
                    const elements: PurposeElementDTOInterface[] = detail?.elements ?? [];

                    return (
                        <Box key={ purpose.purposeId }>
                            <CheckboxRow>
                                <Checkbox
                                    checked={ false }
                                    disabled
                                    size="small"
                                    sx={ { padding: 0 } }
                                />
                                <FormLabel sx={ { fontSize: "14px", lineHeight: 1.5 } }>
                                    { sanitized ? (
                                        <RichTextLabel>
                                            { parse(sanitized) }
                                        </RichTextLabel>
                                    ) : detail?.name ? (
                                        t("consents:marketingConsents.preview.exampleDescription", { consentName: detail.name })
                                    ) : (
                                        <PlaceholderText>
                                            { t("consents:marketingConsents.preview.emptyDescription") }
                                        </PlaceholderText>
                                    ) }
                                </FormLabel>
                            </CheckboxRow>
                            { elements.length > 0 && (
                                <AttributesSection>
                                    { elements.map(
                                        (el: PurposeElementDTOInterface): ReactElement => (
                                            <AttributeRow key={ el.id }>
                                                <Checkbox
                                                    checked={ false }
                                                    disabled
                                                    size="small"
                                                    sx={ { padding: 0 } }
                                                />
                                                <FormLabel sx={ { fontSize: "14px" } }>
                                                    { el.displayName ?? el.name }
                                                </FormLabel>
                                            </AttributeRow>
                                        )
                                    ) }
                                </AttributesSection>
                            ) }
                        </Box>
                    );
                })
            ) }
        </Box>
    );
};

export default MarketingConsentAdapter;
