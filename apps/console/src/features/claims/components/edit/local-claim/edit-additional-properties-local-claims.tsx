/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { DynamicField, EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { AppState, FeatureConfigInterface } from "../../../../core";
import { updateAClaim } from "../../../api";

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
 * @param {EditAdditionalPropertiesLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditAdditionalPropertiesLocalClaims:
    FunctionComponent<EditAdditionalPropertiesLocalClaimsPropsInterface> = (
        props: EditAdditionalPropertiesLocalClaimsPropsInterface
    ): ReactElement => {
        const { claim, update, [ "data-testid" ]: testId } = props;

        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

        const [ submit, setSubmit ] = useTrigger();

        const dispatch = useDispatch();

        const { t } = useTranslation();

        const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
        const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

        const isReadOnly = useMemo(
            () =>
                !hasRequiredScopes(
                    featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.update,
                    allowedScopes
                ),
            [ featureConfig, allowedScopes ]
        );

        return (
            <EmphasizedSegment>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                            <p>{ t("console:manage.features.claims.local.additionalProperties.hint") }</p>
                            <DynamicField
                                data={ claim.properties }
                                keyType="text"
                                keyName={ t("console:manage.features.claims.local.additionalProperties.key") }
                                valueName={ t("console:manage.features.claims.local.additionalProperties.value") }
                                submit={ submit }
                                keyRequiredMessage={ t(
                                    "console:manage.features.claims.local.additionalProperties." +
                                    "keyRequiredErrorMessage"
                                ) }
                                valueRequiredErrorMessage={ t(
                                    "console:manage.features.claims.local.additionalProperties." +
                                "valueRequiredErrorMessage"
                                ) }
                                requiredField={ true }
                                update={ (data) => {
                                    const claimData = { ...claim };

                                    delete claimData.id;
                                    delete claimData.dialectURI;
                                    const submitData = {
                                        ...claimData,
                                        properties: [ ...data ]
                                    };

                                    setIsSubmitting(true);
                                    updateAClaim(claim.id, submitData)
                                        .then(() => {
                                            dispatch(
                                                addAlert({
                                                    description: t(
                                                        "console:manage.features.claims.local.notifications." +
                                                    "updateClaim.success.description"
                                                    ),
                                                    level: AlertLevels.SUCCESS,
                                                    message: t(
                                                        "console:manage.features.claims.local.notifications." +
                                                    "updateClaim.success.message"
                                                    )
                                                })
                                            );
                                            update();
                                        })
                                        .catch((error) => {
                                            dispatch(
                                                addAlert({
                                                    description:
                                                    error?.description ||
                                                    t(
                                                        "console:manage.features.claims.local.notifications." +
                                                        "updateClaim.genericError.description"
                                                    ),
                                                    level: AlertLevels.ERROR,
                                                    message:
                                                    error?.message ||
                                                    t(
                                                        "console:manage.features.claims.local.notifications." +
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
                                readOnly={ isReadOnly }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 6 }>
                            <Show when={ AccessControlConstants.ATTRIBUTE_EDIT }>
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
