/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, ClaimDialect, ExternalClaim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { Code, Hint, Text } from "@wso2is/react-components";
import { getDialects, getExternalClaims } from "apps/console/src/features/claims/api";
import { IdentityAppsApiException } from "modules/core/dist/types/exceptions";
import React, { Dispatch, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps, Header } from "semantic-ui-react";
import { ImplicitAssociaionConfigInterface } from "../../../models/connection";

const FORM_ID: string = "idp-implicit-association-form";
const OIDC_DIALECT_URI: string = "http://wso2.org/oidc/claim";

interface TrustedTokenIssuerAdvanceConfigurationsFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to update the idp details.
     */
    onSubmit: (values: any) => void;
    /**
     * Specifies if the form is being submitted.
     */
    isSubmitting?: boolean;
    /**
     * connection implicit association configuration details.
     */
    config: ImplicitAssociaionConfigInterface

}

export const TrustedTokenIssuerAdvanceConfigurationsForm: 
FunctionComponent<TrustedTokenIssuerAdvanceConfigurationsFormPropsInterface> = (
    props: TrustedTokenIssuerAdvanceConfigurationsFormPropsInterface
): ReactElement => {

    const {
        onSubmit,
        isSubmitting,
        config,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const [ implicitAssociationEnabled, setImplicitAssociationEnabled ] = useState<boolean>(config.isEnabled);
    const [ claimList, setClaimList ] = useState<DropdownItemProps[]>([]);
    const [ selectedClaims, setSelectedClaims ] = useState<string[]>(config.lookupAttribute);
    const [ isClaimListRequestLoading, setClaimListRequestLoading ] = useState<boolean>(false);

    /**
     * This function process the form values and returns the request body of the API call to update the 
     * implicit association configuration.
     *
     * @param values - Form values.
     */
    const updateConfiguration = (values: ImplicitAssociaionConfigInterface): any => {

        if (selectedClaims.length > 5) { 
            dispatch(
                addAlert({
                    description:
                        t(
                            "console:manage.features.claims.dialects.notifications." +
                            "fetchADialect.genericError.description"
                        ),
                    level: AlertLevels.WARNING,
                    message:
                        t(
                            "console:manage.features.claims.dialects.notifications." +
                            "fetchADialect.genericError.message"
                        )
                })
            );
        }

        return {
            isEnabled: values.isEnabled,
            lookupAttribute: selectedClaims.length > 0 ? selectedClaims : [ "" ]
        };
    };

    const handleAttributesDropdownChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const claims: string[] = data.value as string[];

        setSelectedClaims(data.options.filter((option: DropdownItemProps) => {
            if (claims.includes(option.value.toString())) {
                return option;
            }
        }).map((option: DropdownItemProps) => option.value.toString()));
    };

    useEffect(() => {

        let oidcDialectId: string;

        setClaimListRequestLoading(true);
        getDialects(null)
            .then((response: ClaimDialect[]) => {
                response.forEach((dialect: ClaimDialect) => {
                    if (dialect.dialectURI === OIDC_DIALECT_URI) {
                        oidcDialectId = dialect.id;
                    }
                });

                if (oidcDialectId) {
                    getExternalClaims(oidcDialectId)
                        .then(( response: ExternalClaim[] ) => {
                            setClaimList(response.map((claim: ExternalClaim) => {
                                return {
                                    content: (
                                        <Header
                                            as="h6"
                                            className="header-with-icon"
                                        >
                                            <Header.Content>
                                                { claim.claimURI }
                                                <Header.Subheader>
                                                    <Code withBackground>{ claim.mappedLocalClaimURI }</Code>
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    ),
                                    key: claim.id,
                                    text: claim.claimURI,
                                    value: claim.mappedLocalClaimURI
                                };
                            }));
                            setClaimListRequestLoading(false);
                        })
                        .catch((error: IdentityAppsApiException) => {
                            dispatch(
                                addAlert({
                                    description:
                                        error?.response?.data?.description ||
                                        t(
                                            "console:manage.features.claims.dialects.notifications." +
                                            "fetchADialect.genericError.description"
                                        ),
                                    level: AlertLevels.ERROR,
                                    message:
                                        error?.message ||
                                        t(
                                            "console:manage.features.claims.dialects.notifications." +
                                            "fetchADialect.genericError.message"
                                        )
                                })
                            );
                        });
                }
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t(
                                "console:manage.features.claims.dialects.notifications." +
                                "fetchADialect.genericError.description"
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.message ||
                            t(
                                "console:manage.features.claims.dialects.notifications." +
                                "fetchADialect.genericError.message"
                            )
                    })
                );
            });
    }, []);

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ false }
            onSubmit={ (values: ImplicitAssociaionConfigInterface) => onSubmit(updateConfiguration(values)) }
            data-testid={ componentId }
        >
            <Field.Checkbox
                ariaLabel="implicitAccountLinking"
                name="isEnabled"
                label={ t("console:develop.features.idp.forms.advancedConfigs." +
                    "implicitAssociation.enable.label") }
                required={ false }
                disabled={ false }
                hint={ t("console:develop.features.idp.forms.advancedConfigs." +
                    "implicitAssociation.enable.hint") }
                width={ 16 }
                listen={ (value: boolean) => setImplicitAssociationEnabled(value) }
                data-testid={ `${ componentId }-enable-checkbox` }
                defaultValue={ config.isEnabled }
            />
            <div className="ml-6">
                <Text 
                    size={ 13 } 
                    muted={ !implicitAssociationEnabled }
                >
                    { t("console:develop.features.idp.forms.advancedConfigs." +
                        "implicitAssociation.attributes.label") }
                </Text>
                <Dropdown
                    className="mb-3"
                    data-componentid={ `${componentId}-attributes` }
                    placeholder={ t("console:develop.features.idp.forms.advancedConfigs." +
                        "implicitAssociation.attributes.placeholder") }
                    fluid
                    multiple
                    search
                    selection
                    required={ false }
                    value={ selectedClaims }
                    onChange={ handleAttributesDropdownChange }
                    loading={ isClaimListRequestLoading }
                    options={ claimList }
                    disabled={ !implicitAssociationEnabled }
                    error={ implicitAssociationEnabled && (selectedClaims.length > 3 || selectedClaims.length === 0) }
                />
                <Hint disabled={ !implicitAssociationEnabled }>
                    { t("console:develop.features.idp.forms.advancedConfigs." +
                        "implicitAssociation.attributes.hint") }
                </Hint>
            </div>
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                hidden={ false }
                loading={ isSubmitting }
                disabled={ implicitAssociationEnabled && (selectedClaims.length === 0 || selectedClaims.length > 3) }
                data-componentid={ `${componentId}-submit-button` }
                label={   t("common:update")  }
            />
        </Form>
    );
};

/**
 * Default proptypes for the trusted token issuer advance settings form component.
 */
TrustedTokenIssuerAdvanceConfigurationsForm.defaultProps = {
    "data-componentid": "trusted-token-issuer-advanced-settings"
};
