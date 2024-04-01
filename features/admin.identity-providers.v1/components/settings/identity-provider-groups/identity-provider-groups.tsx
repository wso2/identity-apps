/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { ContentLoader, EmphasizedSegment, Hint, PrimaryButton } from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Form, Grid } from "semantic-ui-react";
import { IdentityProviderGroupsList } from "./identity-provider-groups-list";
import { AppState, FeatureConfigInterface, store } from "../../../../admin.core.v1";
import {
    IdentityProviderClaimMappingInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderInterface
} from "../../../../admin-identity-providers-v1/models/identity-provider";
import { updateClaimsConfigs, useClaimConfigs } from "../../../api/identity-provider";
import { IdentityProviderConstants } from "../../../constants/identity-provider-constants";

const FORM_ID: string = "idp-group-attributes-form";

/**
 * Proptypes for the identity provider groups component.
 */
interface IdentityProviderGroupsPropsInterface extends SBACInterface<FeatureConfigInterface>, 
    IdentifiableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
    /**
     * Make the form read only.
     */
    isReadOnly?: boolean;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Identity provider groups component.
 * 
 * @param props - Props related to identity provider groups component.
 */
export const IdentityProviderGroupsTab: FunctionComponent<IdentityProviderGroupsPropsInterface> = ( 
    props: IdentityProviderGroupsPropsInterface
): ReactElement => {

    const {
        editingIDP,
        isReadOnly,
        featureConfig,
        [ "data-componentid" ]: componentId
    } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ claimConfigs, setClaimConfigs ] = useState<IdentityProviderClaimsInterface>(undefined);
    const [ groupAttribute, setGroupAttribute ] = useState<string>("");

    const {
        data: originalClaimConfigs,
        isLoading: isClaimConfigsFetchRequestLoading,
        mutate: mutateClaimConfigsFetchRequest,
        error: claimConfigsFetchRequestError
    } = useClaimConfigs(editingIDP?.id);

    useEffect(() => {
        if (originalClaimConfigs instanceof IdentityAppsApiException
                || claimConfigsFetchRequestError) {
            handleRetrieveError();
            
            return;
        }
        
        if (!originalClaimConfigs) {
            return;
        }
        
        setClaimConfigs(originalClaimConfigs);
        setGroupAttribute(getGroupAttribute());        
    }, [ originalClaimConfigs ]);

    /**
     * Displays the error banner when unable to fetch identity claim configurations.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("extensions:console.identityProviderGroups.claimConfigs." +
                    "notifications.fetchConfigs.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.identityProviderGroups.claimConfigs." +
                    "notifications.fetchConfigs.genericError.message")
            })
        );
    };

    const getGroupAttribute = (): string => {
        if (originalClaimConfigs?.mappings?.length > 0) {
            const groupAttribute: IdentityProviderClaimMappingInterface = originalClaimConfigs.mappings.find(
                (claim: IdentityProviderClaimMappingInterface) => {
                    return claim.localClaim.uri === IdentityProviderConstants.CLAIM_APP_ROLE;
                }
            );

            if (groupAttribute) {
                return groupAttribute.idpClaim;
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    const handleGroupMappingUpdate =() : void => {
        if (groupAttribute.trim()) {            
            setIsSubmitting(true);
            const mappedAttribute: IdentityProviderClaimsInterface = {
                ...claimConfigs,
                mappings: [
                    {
                        idpClaim: groupAttribute.trim(),
                        localClaim: {
                            uri: IdentityProviderConstants.CLAIM_APP_ROLE
                        }
                    }
                ],
                roleClaim: {
                    uri: ""
                },
                userIdClaim: {
                    uri: ""
                }
            };

            claimConfigs.mappings?.forEach((claim: IdentityProviderClaimMappingInterface) => {
                if (claim.localClaim.uri === IdentityProviderConstants.CLAIM_USERNAME) {
                    mappedAttribute.mappings.push(claim);
                    mappedAttribute.userIdClaim = claimConfigs.userIdClaim;
                }

                if (claim.localClaim.uri === IdentityProviderConstants.CLAIM_ROLE) {
                    mappedAttribute.mappings.push(claim);
                    mappedAttribute.roleClaim = claimConfigs.roleClaim;
                }
            });

            // Update the identity provider group mapping.
            updateClaimsConfigs(editingIDP?.id, mappedAttribute)
                .then(() => {    
                    store.dispatch(addAlert({
                        description: I18n.instance.t("authenticationProvider:" +
                                "notifications.updateAttributes.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: I18n.instance.t("authenticationProvider:" +
                                "notifications.updateAttributes." +
                                "success.message")
                    }));
                    mutateClaimConfigsFetchRequest();
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        store.dispatch(addAlert({
                            description: I18n.instance.t("authenticationProvider:" +
                                "notifications.updateClaimsConfigs.error.description",
                            { description: error.response.data.description }),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t("authenticationProvider:" +
                                "notifications.updateClaimsConfigs." +
                                "error.message")
                        }));
                    }
    
                    store.dispatch(addAlert({
                        description: I18n.instance.t("authenticationProvider:notifications." +
                            "updateClaimsConfigs.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("authenticationProvider:notifications." +
                            "updateClaimsConfigs.genericError.message")
                    }));
                }).finally(() => {
                    setIsSubmitting(false);
                });
        }
    };


    return (
        !isClaimConfigsFetchRequestLoading
            ? (
                <>
                    <EmphasizedSegment padded="very">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={ 8 }>
                                    <Form
                                        id={ FORM_ID }
                                        onSubmit={ handleGroupMappingUpdate }
                                    >
                                        <Form.Input
                                            name="groupAttribute"
                                            label={ t("extensions:console.identityProviderGroups.claimConfigs." +
                                                "groupAttributeLabel") }
                                            placeholder={ t("extensions:console.identityProviderGroups.claimConfigs." +
                                                "groupAttributePlaceholder") }
                                            readOnly={ isReadOnly }
                                            maxLength={ IdentityProviderConstants.CLAIM_CONFIG_FIELD_MAX_LENGTH }
                                            minLength={ IdentityProviderConstants.CLAIM_CONFIG_FIELD_MIN_LENGTH }
                                            data-componentid={ `${ componentId }-group-attribute-input` }
                                            value={ groupAttribute }
                                            onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                                setGroupAttribute(e.target.value);
                                            } }
                                            width={ 16 }
                                        />
                                        <Hint>
                                            { t("extensions:console.identityProviderGroups.claimConfigs." +
                                                "groupAttributeHint") }
                                        </Hint>
                                        <Divider hidden />
                                        { !isReadOnly && (
                                            <Show when={ AccessControlConstants.IDP_EDIT }>
                                                <PrimaryButton
                                                    size="small"
                                                    loading={ isSubmitting }
                                                    disabled={ isSubmitting }
                                                    type="submit"
                                                    ariaLabel="Update group attributes button"
                                                    data-componentid={ `${ componentId }-update-button` }
                                                >
                                                    { t("common:update") }
                                                </PrimaryButton>
                                            </Show>
                                        ) }
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EmphasizedSegment>
                    <Divider hidden/>
                    <EmphasizedSegment padded="very">
                        <IdentityProviderGroupsList
                            idpId={ editingIDP?.id }
                            featureConfig={ featureConfig }
                            readOnly={ isReadOnly }
                            allowedScopes={ allowedScopes }
                            isGroupListLoading={ false }
                        />
                    </EmphasizedSegment>
                </>
            )
            : (
                <EmphasizedSegment padded>
                    <ContentLoader inline="centered" active/>
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for identity provider groups tab component.
 */
IdentityProviderGroupsTab.defaultProps = {
    "data-componentid": "identity-provider-groups-tab"
};
