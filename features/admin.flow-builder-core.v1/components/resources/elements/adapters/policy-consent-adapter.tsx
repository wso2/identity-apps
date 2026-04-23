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
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormLabel from "@oxygen-ui/react/FormLabel";
import { i18nLink } from "@wso2is/common.branding.v1/utils/i18n-link";
import { sanitizedHtmlWithLocalizedLinks } from "@wso2is/common.branding.v1/utils/sanitized-html";
import { useGetPurposes } from "@wso2is/common.consents.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import parse from "html-react-parser";
import React, { CSSProperties, FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useValidatePolicyConsent from "../../../../hooks/use-validate-policy-consent";
import { PolicyConfigItemInterface } from "../../../../models/policies";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link PolicyConsentAdapter}
 */
export type PolicyConsentAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

const CONSENT_DESCRIPTION_STYLE: CSSProperties = {
    fontSize: "13px",
    margin: "0.5em 0"
};

const CheckboxRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    display: "flex",
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5)
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

/**
 * Adapter for Policy Consent component.
 *
 * @param props - Props injected to the component.
 * @returns The PolicyConsentAdapter component.
 */
const PolicyConsentAdapter: FunctionComponent<PolicyConsentAdapterPropsInterface> = ({
    resource
}: PolicyConsentAdapterPropsInterface): ReactElement => {
    const { i18n } = useTranslation();

    const { mappedData: allPolicies, isLoading: isAllPoliciesLoading } = useGetPurposes({
        filter: "type eq Policy",
        limit: 50
    });

    const selectedPolicies: PolicyConfigItemInterface[] = useMemo((): PolicyConfigItemInterface[] => {
        return resource.config?.policies ?? [];
    }, [ resource.config?.policies ]);

    useValidatePolicyConsent(resource, selectedPolicies, allPolicies);

    return (
        <Box>
            { resource.config?.description && (
                <div className="rich-text-content">
                    <p className="rich-text-paragraph" style={ CONSENT_DESCRIPTION_STYLE }>
                        { resource.config.description }
                    </p>
                </div>
            ) }
            <Box sx={ { display: "flex", flexDirection: "column" } }>
                { isAllPoliciesLoading ? (
                    <CircularProgress size={ 24 } />
                ) : selectedPolicies.length > 0 ? (
                    selectedPolicies.map((policy: PolicyConfigItemInterface): ReactElement => {
                        const sanitized: string = sanitizedHtmlWithLocalizedLinks(
                            policy.description ?? "",
                            i18n.language,
                            i18nLink
                        );

                        return (
                            <CheckboxRow
                                key={ policy.purposeId }
                                data-componentid={ `policy-consent-${policy.purposeId}` }
                            >
                                <Checkbox
                                    checked={ false }
                                    disabled
                                    size="small"
                                    sx={ { padding: 0 } }
                                />
                                <FormLabel>
                                    <RichTextLabel>
                                        { sanitized ? (
                                            <>
                                                { parse(sanitized) }
                                                { policy.mandatory && (
                                                    <Box
                                                        component="span"
                                                        sx={ { color: "error.main" } }
                                                        aria-hidden="true"
                                                    >
                                                        { " *" }
                                                    </Box>
                                                ) }
                                            </>
                                        ) : (
                                            <>
                                                <Trans
                                                    i18nKey="consents:wizard.create.preview.exampleDescription"
                                                    values={ {
                                                        policyName: policy.name
                                                            || i18nLink(i18n.language, policy.policyUrl)
                                                    } }
                                                    components={ [
                                                        <a
                                                            href={
                                                                i18nLink(i18n.language, policy.policyUrl)
                                                                || undefined
                                                            }
                                                            className="rich-text-link"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        />
                                                    ] }
                                                />
                                                { policy.mandatory && (
                                                    <Box
                                                        component="span"
                                                        sx={ { color: "error.main" } }
                                                        aria-hidden="true"
                                                    >
                                                        { " *" }
                                                    </Box>
                                                ) }
                                            </>
                                        ) }
                                    </RichTextLabel>
                                </FormLabel>
                            </CheckboxRow>
                        );
                    })
                ) : null }
            </Box>
        </Box>
    );
};

export default PolicyConsentAdapter;
