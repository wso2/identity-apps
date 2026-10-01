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
import { useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { i18nLink } from "@wso2is/common.branding.v1/utils/i18n-link";
import { sanitizedHtmlWithLocalizedLinks } from "@wso2is/common.branding.v1/utils/sanitized-html";
import { ConsentInterface, useGetPurposes, useGetPurposesByIds } from "@wso2is/common.consents.v1";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import parse from "html-react-parser";
import React, { CSSProperties, FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useValidatePurposes from "../../../../hooks/use-validate-purposes";
import { PurposeInterface } from "../../../../models/purpose";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link PolicyConsentAdapter}
 */
type PolicyConsentAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

const CONSENT_DESCRIPTION_STYLE: CSSProperties = {
    fontSize: "13px",
    margin: "0.5em 0"
};

const EmptyState: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    fontSize: "13px",
    padding: theme.spacing(2),
    textAlign: "center"
}));

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
    const { i18n, t } = useTranslation();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );

    const hasConsentsReadPermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.read);

    const { mappedData: allPurposes, isLoading: isAllPurposesLoading } = useGetPurposes(
        hasConsentsReadPermission ? { filter: "type eq Policy", limit: 50 } : null
    );

    const selectedPolicies: PurposeInterface[] = useMemo((): PurposeInterface[] => {
        return resource.config?.purposes ?? [];
    }, [ resource.config?.purposes ]);

    const selectedPurposeIds: string[] = useMemo((): string[] => {
        if (!hasConsentsReadPermission) {
            return [];
        }

        return selectedPolicies.map((p: PurposeInterface): string => p.purposeId);
    }, [ selectedPolicies, hasConsentsReadPermission ]);

    const { data: selectedPolicyDetails, isLoading: isPolicyDetailsLoading } = useGetPurposesByIds(selectedPurposeIds);

    useValidatePurposes(resource, selectedPolicies, allPurposes, {
        messageKeyPrefix: "policyConsent",
        type: "policy",
        validateAvailability: true
    });

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
                { isAllPurposesLoading || isPolicyDetailsLoading ? (
                    <CircularProgress size={ 24 } />
                ) : selectedPolicyDetails && selectedPolicyDetails.length > 0 ? (
                    selectedPolicyDetails.map((policy: ConsentInterface): ReactElement => {
                        const sanitized: string = sanitizedHtmlWithLocalizedLinks(
                            policy.description ?? "",
                            i18n.language,
                            i18nLink
                        );

                        return (
                            <CheckboxRow
                                key={ policy.id }
                                data-componentid={ `policy-consent-${policy.id}` }
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
                                                    // eslint-disable-next-line max-len
                                                    i18nKey="consents:policyConsents.wizard.create.preview.exampleDescription"
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
                                                            aria-label={
                                                                policy.name
                                                                || i18nLink(i18n.language, policy.policyUrl)
                                                                || "Policy link"
                                                            }
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
                ) : (
                    <EmptyState>{ t("flows:core.elements.policyConsent.emptyState") }</EmptyState>
                ) }
            </Box>
        </Box>
    );
};

export default PolicyConsentAdapter;
