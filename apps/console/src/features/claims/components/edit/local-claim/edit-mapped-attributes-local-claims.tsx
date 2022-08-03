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
import { getUserStoreList } from "@wso2is/core/api";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AppState, FeatureConfigInterface, store } from "../../../../core";
import { UserStoreListItem } from "../../../../userstores";
import { updateAClaim } from "../../../api";

/**
 * Prop types of `EditMappedAttributesLocalClaims` component
 */
interface EditMappedAttributesLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * Claim to be edited
     */
    claim: Claim;
    /**
     * Called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the Mapped Attribute pane of
 * the edit local claim screen
 *
 * @param {EditMappedAttributesLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditMappedAttributesLocalClaims: FunctionComponent<EditMappedAttributesLocalClaimsPropsInterface> = (
    props: EditMappedAttributesLocalClaimsPropsInterface
): ReactElement => {

    const {
        claim,
        update,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ userStore, setUserStore ] = useState([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ submit, setSubmit ] = useTrigger();

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    useEffect(() => {
        const userstore = [];

        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });

        getUserStoreList(store.getState().config.endpoints.userStores).then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    const isReadOnly = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.attributeDialects, featureConfig?.attributeDialects?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

    return (
        <EmphasizedSegment padded="very">
            <Grid data-testid={ testId }>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                        <p>
                            { t("console:manage.features.claims.local.mappedAttributes.hint") }
                        </p>
                        <Divider hidden />
                        <Forms
                            submitState={ submit }
                            onSubmit={ (values: Map<string, FormValue>) => {
                                const claimData = { ...claim };

                                delete claimData.id;
                                delete claimData.dialectURI;

                                const submitData = {
                                    ...claimData,
                                    attributeMapping: Array.from(values).map(([ userstore, attribute ]) => {
                                        return {
                                            mappedAttribute: attribute.toString(),
                                            userstore: userstore.toString()
                                        };
                                    })
                                };

                                setIsSubmitting(true);

                                updateAClaim(claim.id, submitData).then(() => {
                                    dispatch(addAlert(
                                        {
                                            description: t("console:manage.features.claims.local.notifications." +
                                                "updateClaim.success.description"),
                                            level: AlertLevels.SUCCESS,
                                            message: t("console:manage.features.claims.local.notifications." +
                                                "updateClaim.success.message")
                                        }
                                    ));
                                    update();
                                }).catch(error => {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description
                                                || t("console:manage.features.claims.local.notifications." +
                                                    "updateClaim.genericError.description"),
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                                || t("console:manage.features.claims.local.notifications." +
                                                    "updateClaim.genericError.message")
                                        }
                                    ));
                                }).finally(() => {
                                    setIsSubmitting(false);
                                });
                            } }
                        >
                            <Grid>
                                { userStore.map((store: UserStoreListItem, index: number) => {
                                    return (
                                        <Grid.Row columns={ 2 } key={ index }>
                                            <Grid.Column width={ 4 }>
                                                { store.name }
                                            </Grid.Column>
                                            <Grid.Column width={ 12 }>
                                                <Field
                                                    type="text"
                                                    name={ store.name }
                                                    placeholder={ t("console:manage.features.claims.local.forms." +
                                                        "attribute.placeholder") }
                                                    required={ true }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.claims.local.forms." +
                                                        "attribute.requiredErrorMessage")
                                                    }
                                                    value={ claim?.attributeMapping?.find((attribute) => {
                                                        return attribute.userstore
                                                            .toLowerCase() === store.name.toLowerCase();
                                                    })?.mappedAttribute }
                                                    data-testid={ `${ testId }-form-store-name-input` }
                                                    readOnly={ isReadOnly }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    );
                                }) }
                            </Grid>
                        </Forms>

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <Show when={ AccessControlConstants.ATTRIBUTE_EDIT }>
                            <PrimaryButton
                                onClick={ () => {
                                    setSubmit();
                                } }
                                data-testid={ `${ testId }-form-submit-button` }
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
EditMappedAttributesLocalClaims.defaultProps = {
    "data-testid": "edit-local-claims-mapped-attributes"
};
