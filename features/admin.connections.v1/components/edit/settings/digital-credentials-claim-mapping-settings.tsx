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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetFederatedAuthenticator } from "../../../hooks/use-get-federated-authenticator";
import { useGetPresentationDefinition } from "../../../hooks/use-get-presentation-definition";
import {
    CommonPluggableComponentPropertyInterface,
    DigitalCredentialsClaimMappingSettingsPropsInterface,
    PresentationDefinitionAttributeConstraintInterface,
    PresentationDefinitionCredentialInterface
} from "../../../models/connection";
import { AttributeSettings } from "./attribute-settings";

/**
 * Claim mapping settings for Digital Credentials connection.
 * Fetches the linked Presentation Definition and restricts the external-claim
 * input to a dropdown pre-populated with the PD's configured claim paths.
 *
 * Other IDP types are unaffected: they don't use this component, and the
 * shared AttributeSettings/AttributesSelectionV2/AttributeMappingAddItem
 * components already fall back to a free-text input when allowedMappedValues
 * is undefined.
 *
 * @param props - Component props.
 * @returns React element.
 */
export const DigitalCredentialsClaimMappingSettings: FunctionComponent<
    DigitalCredentialsClaimMappingSettingsPropsInterface
> = (
    props: DigitalCredentialsClaimMappingSettingsPropsInterface
): ReactElement => {

    const {
        identityProvider,
        isLoading,
        isReadOnly,
        loader,
        onUpdate,
        [ "data-componentid" ]: componentId = "digital-credentials-claim-mapping-settings"
    } = props;

    const { t } = useTranslation();

    const idpId: string | undefined = identityProvider?.id;
    const defaultAuthenticatorId: string | undefined =
        identityProvider?.federatedAuthenticators?.defaultAuthenticatorId;

    // Fetch full authenticator details to read the presentationDefinitionId property.
    // getConnectionDetails returns authenticators without their property values,
    // requiring this separate /federated-authenticators/{id} call.
    const {
        data: authenticatorData,
        isLoading: isAuthenticatorLoading
    } = useGetFederatedAuthenticator(idpId, defaultAuthenticatorId);

    // Extract presentationDefinitionId from the authenticator properties.
    const presentationDefinitionId: string | undefined = useMemo((): string | undefined => {
        const definitionIdProperty: CommonPluggableComponentPropertyInterface | undefined =
            (authenticatorData?.properties ?? []).find(
                (property: CommonPluggableComponentPropertyInterface) => property.key === "presentationDefinitionId"
            );

        return definitionIdProperty?.value ?? undefined;
    }, [ authenticatorData ]);

    // Fetch the Presentation Definition to derive the list of mappable attribute paths.
    const {
        data: presentationDefinitionData,
        isLoading: isPresentationDefinitionLoading
    } = useGetPresentationDefinition(presentationDefinitionId);

    // Track each request's in-flight state independently of its data value so that
    // undefined data during loading is never confused with "no paths configured".
    const isResolvingPresentationDefinition: boolean =
        (!!idpId && !!defaultAuthenticatorId && isAuthenticatorLoading) ||
        (!!presentationDefinitionId && isPresentationDefinitionLoading);

    // Flatten credential attribute paths to dot-joined strings (e.g. "address.street_address").
    // These match the remote claim URIs stored in IDP_CLAIM by the OpenID4VP authenticator.
    // Returns an empty array (not undefined) when the PD has no paths, so callers can
    // distinguish "not yet loaded" from "loaded but empty".
    const allowedMappedValues: string[] = useMemo((): string[] => {
        if (!presentationDefinitionData?.credentials) {
            return [];
        }
        const paths: string[] = [];

        for (const credential of presentationDefinitionData.credentials as PresentationDefinitionCredentialInterface[]) {
            for (const attributeConstraint of (credential.claims ?? []) as PresentationDefinitionAttributeConstraintInterface[]) {
                if (attributeConstraint.path) {
                    paths.push(attributeConstraint.path);
                }
            }
        }

        return paths;
    }, [ presentationDefinitionData ]);

    if (isLoading || isResolvingPresentationDefinition) {
        return loader();
    }

    if (allowedMappedValues.length === 0) {
        return (
            <EmptyPlaceholder
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
                title={ t("authenticationProvider:templates.digitalWallet.claimMapping.notifications.noClaimPaths.header") }
                subtitle={ [
                    t("authenticationProvider:templates.digitalWallet.claimMapping.notifications.noClaimPaths.description")
                ] }
                action={ (
                    <PrimaryButton
                        onClick={ (): void => {
                            history.push(
                                `${ AppConstants.getPaths().get("VP_DEFINITION_EDIT")
                                    ?.replace(":id", presentationDefinitionId) }?tab=1`
                            );
                        } }
                        data-componentid={ `${ componentId }-no-claim-paths-action` }
                    >
                        { t("authenticationProvider:templates.digitalWallet.claimMapping.notifications.noClaimPaths.action") }
                    </PrimaryButton>
                ) }
                data-componentid={ `${ componentId }-no-claim-paths` }
            />
        );
    }

    return (
        <AttributeSettings
            idpId={ identityProvider?.id }
            initialClaims={ identityProvider?.claims }
            initialRoleMappings={ identityProvider?.roles?.mappings }
            isLoading={ isLoading }
            onUpdate={ onUpdate }
            hideIdentityClaimAttributes={ false }
            isRoleMappingsEnabled={ true }
            data-testid={ `${ componentId }-attribute-settings` }
            provisioningAttributesEnabled={ false }
            isReadOnly={ isReadOnly }
            loader={ loader }
            isOIDC={ false }
            isSaml={ false }
            allowedMappedValues={ allowedMappedValues }
            attributeMappingHeading={ t(
                "authenticationProvider:templates.digitalWallet.claimMapping.heading"
            ) }
            attributeMappingSubheading={ t(
                "authenticationProvider:templates.digitalWallet.claimMapping.subheading"
            ) }
            externalAttributeLabel={ t(
                "authenticationProvider:templates.digitalWallet.claimMapping.pdClaimAttribute.label"
            ) }
            externalAttributeTooltip={ t(
                "authenticationProvider:templates.digitalWallet.claimMapping.pdClaimAttribute.tooltip"
            ) }
        />
    );
};

