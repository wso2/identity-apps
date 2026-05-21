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
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Typography from "@oxygen-ui/react/Typography";
import { sanitizedHtml } from "@wso2is/common.branding.v1/utils/sanitized-html";
import parse from "html-react-parser";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header } from "semantic-ui-react";

const PreviewContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    background: theme.palette.grey[200],
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
}));

const PreviewCard: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[4],
    maxWidth: "400px",
    padding: theme.spacing(4, 3.5, 3.5),
    width: "100%"
}));

const PreviewHeader: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: theme.spacing(2)
}));

const CheckboxRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(3)
}));

const RichTextDescription: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "& .rich-text-align-center": { textAlign: "center" },
    "& .rich-text-align-justify": { textAlign: "justify" },
    "& .rich-text-align-left": { textAlign: "left" },
    "& .rich-text-align-right": { textAlign: "right" },
    "& .rich-text-bold": { fontWeight: "bold" },
    "& .rich-text-italic": { fontStyle: "italic" },
    "& .rich-text-pre-wrap": { whiteSpace: "pre-wrap" },
    "& .rich-text-underline": { textDecoration: "underline" },
    "& a.rich-text-link": { color: theme.palette.primary.main, textDecoration: "none" },
    "& a.rich-text-link:hover": { textDecoration: "underline" },
    color: theme.palette.text.primary,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.5
}));

const PlaceholderText: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: theme.typography.body2.fontSize,
    fontStyle: "italic"
}));

const AttributeRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.25),
    marginTop: theme.spacing(0.5)
}));

const MandatoryMarker: FunctionComponent = (): ReactElement => (
    <Box component="span" sx={ { color: "error.main" } } aria-hidden="true">
        { " *" }
    </Box>
);

interface PolicyConsentPreviewPropsInterface {
    componentId: string;
    description: string;
    mandatory?: boolean;
    policyName?: string;
}

export const PolicyConsentPreview: FunctionComponent<PolicyConsentPreviewPropsInterface> = ({
    componentId,
    description,
    mandatory = false,
    policyName
}: PolicyConsentPreviewPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const [ isChecked, setIsChecked ] = useState<boolean>(false);

    const i18nKeyMatch: RegExpMatchArray | null = description?.match(/^\{\{(.+)\}\}$/);
    const sanitized: string = i18nKeyMatch ? "" : sanitizedHtml(description);

    return (
        <PreviewContainer data-componentid={ componentId }>
            <Box
                sx={ {
                    alignItems: "center",
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "center",
                    padding: 2.5,
                    width: "100%"
                } }
            >
                <PreviewCard>
                    <Header as="h4" textAlign="center" style={ { marginBottom: 21 } }>
                        { t("consents:wizard.create.preview.pageTitle") }
                    </Header>

                    <PreviewHeader>
                        { t("consents:wizard.create.preview.consentHeader") }
                    </PreviewHeader>

                    <AttributeRow sx={ { alignItems: "center", mb: 1 } }>
                        <Box
                            component="span"
                            sx={ {
                                backgroundColor: "primary.main",
                                borderRadius: "50%",
                                display: "inline-block",
                                flexShrink: 0,
                                height: "6px",
                                width: "6px"
                            } }
                        />
                        <RichTextDescription>
                            { "Updated policies" }
                        </RichTextDescription>
                    </AttributeRow>
                    <CheckboxRow sx={ { pl: 2.5 } }>
                        <Checkbox
                            checked={ isChecked }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                setIsChecked(e.target.checked)
                            }
                            size="small"
                            sx={ { padding: 0 } }
                        />
                        <FormLabel>
                            <RichTextDescription>
                                { sanitized ? (
                                    <>
                                        { parse(sanitized) }
                                        { mandatory && <MandatoryMarker /> }
                                    </>
                                ) : i18nKeyMatch ? (
                                    <>
                                        { i18nKeyMatch[1] }
                                        { mandatory && <MandatoryMarker /> }
                                    </>
                                ) : policyName ? (
                                    <>
                                        <Trans
                                            i18nKey="consents:wizard.create.preview.exampleDescription"
                                            values={ { policyName } }
                                            components={ [
                                                <a className="rich-text-link" />
                                            ] }
                                        />
                                        { mandatory && <MandatoryMarker /> }
                                    </>
                                ) : (
                                    <PlaceholderText>
                                        { t("consents:wizard.create.preview.emptyDescription") }
                                    </PlaceholderText>
                                ) }
                            </RichTextDescription>
                        </FormLabel>
                    </CheckboxRow>

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={ { mb: 1 } }
                    >
                        { t("consents:wizard.create.preview.allowButton") }
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="secondary"
                    >
                        { t("consents:wizard.create.preview.denyButton") }
                    </Button>
                </PreviewCard>
            </Box>
        </PreviewContainer>
    );
};
