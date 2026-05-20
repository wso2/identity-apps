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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import parse from "html-react-parser";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

const PreviewContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    background: theme.palette.grey[200],
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: theme.spacing(2.5, 1.5),
    width: "100%"
}));

const PREVIEW_CARD_MAX_WIDTH: string = "400px";

const PreviewCard: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[4],
    maxWidth: PREVIEW_CARD_MAX_WIDTH,
    padding: theme.spacing(4, 3.5, 3.5),
    width: "100%"
}));

const PreviewTitle: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    fontSize: theme.typography.h4.fontSize,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing(3.5),
    textAlign: "center"
}));

const PreviewHeader: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.5,
    marginBottom: theme.spacing(2.25)
}));

const CheckboxRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(3)
}));

const RichTextDescription: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
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
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.5
}));

const PlaceholderText: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: theme.typography.body2.fontSize,
    fontStyle: "italic"
}));


/**
 * Props interface for the ConsentDescriptionPreview component.
 */
interface ConsentDescriptionPreviewPropsInterface extends IdentifiableComponentInterface {
    /**
     * HTML description string rendered as the checkbox label.
     */
    description: string;
    /**
     * When true, indicates this is a mandatory policy consent.
     */
    mandatory?: boolean;
    /**
     * Optional policy name used as fallback text when description is empty.
     */
    policyName?: string;
}

/**
 * Preview panel mimicking the login-flow consent page.
 *
 * Shows a grey background, a centred white card with a bold title, a dashed form area with
 * the consent header and checkbox, and a pill-shaped gradient Continue button.
 *
 * A "How it maps" legend sits below the card to make the relationship between
 * the Name / Description fields and the rendered checkbox label explicit without
 * requiring the user to discover it through trial-and-error.
 */
export const ConsentDescriptionPreview: FunctionComponent<ConsentDescriptionPreviewPropsInterface> = ({
    "data-componentid": componentId = "consent-description-preview",
    description,
    mandatory = false,
    policyName
}: ConsentDescriptionPreviewPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const [ isChecked, setIsChecked ] = useState<boolean>(false);

    const i18nKeyMatch: RegExpMatchArray | null = description?.match(/^\{\{(.+)\}\}$/);
    const resolvedDescription: string = i18nKeyMatch ? i18nKeyMatch[1] : description;
    const sanitized: string = i18nKeyMatch ? "" : sanitizedHtml(description);

    return (
        <PreviewContainer data-componentid={ componentId }>
            <PreviewCard>
                <PreviewTitle>
                    { t("consents:wizard.create.preview.pageTitle") }
                </PreviewTitle>

                <PreviewHeader>
                    { t("consents:wizard.create.preview.consentHeader") }
                </PreviewHeader>

                <CheckboxRow>
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
                                    { mandatory && (
                                        <Box component="span" sx={ { color: "error.main" } } aria-hidden="true">
                                            { " *" }
                                        </Box>
                                    ) }
                                </>
                            ) : i18nKeyMatch ? (
                                <>
                                    { resolvedDescription }
                                    { mandatory && (
                                        <Box component="span" sx={ { color: "error.main" } } aria-hidden="true">
                                            { " *" }
                                        </Box>
                                    ) }
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
                                    { mandatory && (
                                        <Box component="span" sx={ { color: "error.main" } } aria-hidden="true">
                                            { " *" }
                                        </Box>
                                    ) }
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

        </PreviewContainer>
    );
};
