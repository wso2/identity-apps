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

import useRequest, {
    RequestConfigInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";
import {
    CommonPluggableComponentPropertyInterface,
    ConnectionInterface
} from "../../../models/connection";
import { AttributeSettings } from "./attribute-settings";

/**
 * Minimal shape of the federated authenticator details response — only the
 * properties array is needed to read the presentationDefinitionId.
 * getConnectionDetails returns authenticators without property values,
 * so a separate call to /federated-authenticators/{id} is required.
 */
interface AuthenticatorDetailsInterface {
    properties?: CommonPluggableComponentPropertyInterface[];
}

interface PdClaimConstraintInterface {
    path?: string[];
}

interface PdCredentialInterface {
    claims?: PdClaimConstraintInterface[];
}

interface PdResponseInterface {
    credentials?: PdCredentialInterface[];
}

const I18N_PREFIX: string =
    "authenticationProvider:templates.digitalWallet.claimMapping.notifications";

interface DigitalCredentialsClaimMappingSettingsPropsInterface extends IdentifiableComponentInterface {
    identityProvider: ConnectionInterface;
    isLoading?: boolean;
    isReadOnly: boolean;
    loader: () => ReactElement;
    onUpdate: (id: string) => void;
}

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

    // Step 1: Fetch full authenticator details to read the presentationDefinitionId property.
    // getConnectionDetails returns authenticators without their property values,
    // requiring this separate /federated-authenticators/{id} call.
    const authRequestConfig: RequestConfigInterface | null =
        idpId && defaultAuthenticatorId
            ? {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: HttpMethods.GET,
                url: `${store.getState().config.endpoints.identityProviders}` +
                    `/${idpId}/federated-authenticators/${defaultAuthenticatorId}`
            }
            : null;

    const {
        data: authData,
        isLoading: isAuthLoading
    }: RequestResultInterface<AuthenticatorDetailsInterface> =
        useRequest<AuthenticatorDetailsInterface>(authRequestConfig);

    // Step 2: Extract presentationDefinitionId from the authenticator properties.
    const presentationDefinitionId: string | undefined = useMemo((): string | undefined => {
        const prop: CommonPluggableComponentPropertyInterface | undefined =
            (authData?.properties ?? []).find(
                (p: CommonPluggableComponentPropertyInterface) => p.key === "presentationDefinitionId"
            );

        return prop?.value ?? undefined;
    }, [ authData ]);

    // Step 3: Fetch the Presentation Definition to derive the list of mappable claim paths.
    // Passing null disables the SWR request when no PD is linked.
    const pdRequestConfig: RequestConfigInterface | null = presentationDefinitionId
        ? {
            headers: { "Accept": "application/json" },
            method: HttpMethods.GET,
            url: `${store.getState().config.endpoints.vpTemplates}/${presentationDefinitionId}`
        }
        : null;

    const {
        data: pdData,
        isLoading: isPdLoading
    }: RequestResultInterface<PdResponseInterface> =
        useRequest<PdResponseInterface>(pdRequestConfig);

    // Track each request's in-flight state independently of its data value so that
    // undefined data during loading is never confused with "no paths configured".
    const isResolvingPd: boolean =
        (authRequestConfig !== null && isAuthLoading) ||
        (pdRequestConfig !== null && isPdLoading);

    // Flatten credential claim paths to dot-joined strings (e.g. "address.street_address").
    // These match the remote claim URIs stored in IDP_CLAIM by the OpenID4VP authenticator.
    // Returns an empty array (not undefined) when the PD has no paths, so callers can
    // distinguish "not yet loaded" from "loaded but empty".
    const allowedMappedValues: string[] = useMemo((): string[] => {
        if (!pdData?.credentials) {
            return [];
        }
        const paths: string[] = [];

        for (const cred of pdData.credentials) {
            for (const claim of (cred.claims ?? [])) {
                if (claim.path && claim.path.length > 0) {
                    paths.push(claim.path.join("."));
                }
            }
        }

        return paths;
    }, [ pdData ]);

    if (isLoading || isResolvingPd) {
        return loader();
    }

    if (!presentationDefinitionId) {
        return (
            <Message warning data-componentid={ `${ componentId }-no-pd-linked` }>
                <Message.Header>{ t(`${ I18N_PREFIX }.noPdLinked.header`) }</Message.Header>
                <p>{ t(`${ I18N_PREFIX }.noPdLinked.description`) }</p>
            </Message>
        );
    }

    if (allowedMappedValues.length === 0) {
        return (
            <Message warning data-componentid={ `${ componentId }-no-claim-paths` }>
                <Message.Header>{ t(`${ I18N_PREFIX }.noClaimPaths.header`) }</Message.Header>
                <p>{ t(`${ I18N_PREFIX }.noClaimPaths.description`) }</p>
            </Message>
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
            data-componentid={ `${ componentId }-attribute-settings` }
            provisioningAttributesEnabled={ true }
            isReadOnly={ isReadOnly }
            loader={ loader }
            isOIDC={ false }
            isSaml={ false }
            allowedMappedValues={ allowedMappedValues }
        />
    );
};

