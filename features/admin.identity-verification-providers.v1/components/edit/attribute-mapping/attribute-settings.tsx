/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AttributesSelection } from "./attribute-selection";
import {
    IdVPClaimMappingInterface,
    IdVPClaimsInterface,
    IdentityVerificationProviderInterface
} from "../../../models/identity-verification-providers";

/**
 * Proptypes for the identity verification provider attribute settings component.
 */
interface AttributeSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Identity verification provider that is being edited.
     */
    idvp: IdentityVerificationProviderInterface;
    /**
     * Initial claims of the IDVP.
     */
    initialClaims?: IdVPClaimMappingInterface[];
    /**
     * Is the IDVP info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to call on updating the IDVP details.
     */
    handleUpdate: (data: IdentityVerificationProviderInterface, callback: () => void) => void;
    /**
     * List of mandatory claims.
     */
    mandatoryClaims: IdVPClaimsInterface[];
    /**
     * This boolean attribute specifies whether local identity claims
     * should be hidden or not. By default, we will show these attributes
     * see {@link AttributeSettings.defaultProps}.
     *
     * For an example, setting this to `true` will hide:-
     *  - http://wso2.org/claims/identity/accountLocked
     *  - http://wso2.org/claims/identity/isExistingLiteUser
     *  - etc...
     */
    hideIdentityClaimAttributes?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Whether the update is in progress or not.
     */
    isUpdating?: boolean;
}

/**
 * Component to edit the IDVP attribute settings.
 *
 * @param props - Props injected to the component.
 * @returns Attribute settings component.
 */
export const AttributeSettings: FunctionComponent<AttributeSettingsPropsInterface> = (
    {
        idvp,
        initialClaims,
        isLoading,
        handleUpdate,
        hideIdentityClaimAttributes = true,
        isReadOnly,
        mandatoryClaims,
        ["data-componentid"]: componentId = "idvp-edit-attribute-settings"
    }: AttributeSettingsPropsInterface
): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ selectedClaimsWithMapping, setSelectedClaimsWithMapping ] = useState<IdVPClaimMappingInterface[]>([]);
    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);

    /**
     * Evaluates whether the attribute update can be submitted or not.
     *
     * @returns true if the attribute update can be submitted.
     */
    const canSubmitAttributeUpdate = (): boolean => {
        return isEmpty(selectedClaimsWithMapping?.filter(
            (element: IdVPClaimMappingInterface) => isEmpty(element.idvpClaim)
        ));
    };

    /**
     * Callback to be called on update success or failure.
     */
    const handleUpdateCallback = (): void => {
        setIsUpdating(false);
    };

    /**
     * Handles updating the IDVP attribute.
     *
     * @returns void
     */
    const handleAttributesUpdate = (): void => {
        if (!canSubmitAttributeUpdate()) {
            dispatch(addAlert(
                {
                    description: t("idvp:notifications.submitAttributeSettings" +
                        ".error.description"),
                    level: AlertLevels.WARNING,
                    message: t("idvp:notifications.submitAttributeSettings.error.message")
                }
            ));

            return;
        }
        setIsUpdating(true);

        const updatedData: IdentityVerificationProviderInterface = {
            ...idvp,
            claims: selectedClaimsWithMapping.map((element: IdVPClaimMappingInterface) => {
                return {
                    idvpClaim: element.idvpClaim,
                    localClaim: element.localClaim.uri
                } as IdVPClaimsInterface;
            })
        };

        handleUpdate(updatedData, handleUpdateCallback);
    };

    if (isLoading) {
        return (
            <EmphasizedSegment
                data-componentid={ `${ componentId }-loader` }
                padded="very"
            >
                <ContentLoader inline="centered" active/>
            </EmphasizedSegment>
        );
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid className="attributes-settings">
                <div className="form-container with-max-width">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <AttributesSelection
                                initialClaims={ initialClaims }
                                setMappedAttributes={ setSelectedClaimsWithMapping }
                                hideIdentityClaimAttributes={ hideIdentityClaimAttributes }
                                mappedAttributesList={ [ ...selectedClaimsWithMapping ] }
                                isReadOnly={ isReadOnly }
                                mandatoryClaims={ mandatoryClaims }
                                isUpdating={ isUpdating }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>
                    <Grid.Row>
                        <Grid.Column>
                            <Show when={ featureConfig?.identityVerificationProviders?.scopes?.update }>
                                <Button
                                    primary
                                    size="small"
                                    loading={ isUpdating }
                                    disabled={ isUpdating }
                                    onClick={ handleAttributesUpdate }
                                    data-componentid={ `${ componentId }-update-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Show>
                        </Grid.Column>
                    </Grid.Row>
                </div>
            </Grid>
        </EmphasizedSegment>
    );
};
