/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, Claim, Property, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DynamicField , KeyValue, useTrigger } from "@wso2is/forms";
import {
    EmphasizedSegment,
    Link,
    PrimaryButton,
    TAB_URL_HASH_FRAGMENT
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { updateAClaim } from "../../../api";
import { ClaimManagementConstants, ClaimTabIDs } from "../../../constants";

/**
 * Prop types for `EditAdditionalPropertiesLocalClaims` component
 */
interface EditAdditionalPropertiesLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The Local claim to be edited
     */
    claim: Claim;
    /**
     * The function to be called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the additional properties pane.
 *
 * @param props - Props injected to the component.
 *
 * @returns EditAdditionalPropertiesLocalClaims.
 */
export const EditAdditionalPropertiesLocalClaims:
    FunctionComponent<EditAdditionalPropertiesLocalClaimsPropsInterface> = (
        props: EditAdditionalPropertiesLocalClaimsPropsInterface
    ): ReactElement => {
        const { claim, update, [ "data-testid" ]: testId } = props;

        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

        const [ submit, setSubmit ] = useTrigger();

        const dispatch: Dispatch = useDispatch();

        const { t } = useTranslation();

        const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
        const hasAttributeUpdatePermissions: boolean = useRequiredScopes(
            featureConfig?.attributeDialects?.scopes?.update
        );

        const { isSubOrganization } = useGetCurrentOrganizationType();

        const { UIConfig } = useUIConfig();

        const isReadOnly: boolean = !hasAttributeUpdatePermissions;

        const filteredClaimProperties: Property[] = useMemo(() => {
            if (claim?.properties) {
                const properties: Property[] = claim.properties.filter((property: Property) => {
                    return property.key !== ClaimManagementConstants.SYSTEM_CLAIM_PROPERTY_NAME
                        && property.key !== ClaimManagementConstants.AGENT_CLAIM_PROPERTY_NAME;
                });

                return properties;
            }

            return [];
        }, [ claim ]);

        return (
            <EmphasizedSegment>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                            <p>{ t("claims:local.additionalProperties.hint") }</p>
                            <DynamicField
                                data={ filteredClaimProperties }
                                keyType="text"
                                keyName={ t("claims:local.additionalProperties.key") }
                                valueName={ t("claims:local.additionalProperties.value") }
                                submit={ submit }
                                keyRequiredMessage={ t(
                                    "claims:local.additionalProperties." +
                                    "keyRequiredErrorMessage"
                                ) }
                                valueRequiredErrorMessage={ t(
                                    "claims:local.additionalProperties." +
                                "valueRequiredErrorMessage"
                                ) }
                                requiredField={ true }
                                keyValidation={ (key: string) => {
                                    if (ClaimManagementConstants.RESTRICTED_PROPERTY_KEYS.includes(key)) {
                                        return false;
                                    }

                                    return true;
                                } }
                                keyValidationWarningMessage={
                                    UIConfig?.isClaimUniquenessValidationEnabled ? (
                                        <Trans
                                            i18nKey={
                                                "claims:local.additionalProperties." +
                                                "isUniqueDeprecationMessage.uniquenessEnabled"
                                            }
                                        >
                                            The &apos;isUnique&apos; property is deprecated. Please use
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push({
                                                        hash: `#${TAB_URL_HASH_FRAGMENT}${ClaimTabIDs.GENERAL}`,
                                                        pathname: AppConstants.getPaths()
                                                            .get("LOCAL_CLAIMS_EDIT")
                                                            .replace(":id", claim.id)
                                                    });
                                                } }
                                            > Uniqueness Validation </Link>
                                            option to configure attribute uniqueness.
                                        </Trans>
                                    ) : (
                                        <Trans
                                            i18nKey={
                                                "claims:local.additionalProperties." +
                                                "isUniqueDeprecationMessage.uniquenessDisabled"
                                            }
                                        >
                                            The &apos;isUnique&apos; property is deprecated.
                                        </Trans>
                                    )
                                }
                                update={ (data: KeyValue[]) => {
                                    const claimData: Claim = { ...claim };

                                    delete claimData.id;
                                    delete claimData.dialectURI;
                                    const submitData: Claim = {
                                        ...claimData,
                                        properties: [ ...data ]
                                    };

                                    setIsSubmitting(true);
                                    updateAClaim(claim.id, submitData)
                                        .then(() => {
                                            dispatch(
                                                addAlert({
                                                    description: t(
                                                        "claims:local.notifications." +
                                                    "updateClaim.success.description"
                                                    ),
                                                    level: AlertLevels.SUCCESS,
                                                    message: t(
                                                        "claims:local.notifications." +
                                                    "updateClaim.success.message"
                                                    )
                                                })
                                            );
                                            update();
                                        })
                                        .catch((error: IdentityAppsError) => {
                                            dispatch(
                                                addAlert({
                                                    description:
                                                    error?.description ||
                                                    t(
                                                        "claims:local.notifications." +
                                                        "updateClaim.genericError.description"
                                                    ),
                                                    level: AlertLevels.ERROR,
                                                    message:
                                                    error?.message ||
                                                    t(
                                                        "claims:local.notifications." +
                                                        "updateClaim.genericError.message"
                                                    )
                                                })
                                            );
                                        })
                                        .finally(() => {
                                            setIsSubmitting(false);
                                        });
                                } }
                                data-testid={ `${ testId }-form-properties-dynamic-field` }
                                readOnly={ isSubOrganization() || isReadOnly }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    { !isSubOrganization() && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 6 }>
                                <Show
                                    when={ featureConfig?.attributeDialects?.scopes?.update }
                                >
                                    <PrimaryButton
                                        onClick={ () => {
                                            setSubmit();
                                        } }
                                        data-testid={ `${ testId }-submit-button` }
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                </Show>
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                </Grid>
            </EmphasizedSegment>
        );
    };

/**
 * Default props for the component.
 */
EditAdditionalPropertiesLocalClaims.defaultProps = {
    "data-testid": "edit-local-claims-additional-properties"
};
