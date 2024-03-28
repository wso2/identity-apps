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

import { Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AttributesSelection } from "./attribute-management/attribute-selection";
import { AccessControlConstants } from "../../../admin-access-control-v1/constants/access-control";
import {
    IDVPClaimMappingInterface,
    IDVPClaimsInterface,
    IdentityVerificationProviderInterface
} from "../../models";
import { updateIDVP } from "../../utils";

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
    initialClaims?: IDVPClaimMappingInterface[];
    /**
     * Is the IDVP info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to call on updating the IDVP details.
     */
    onUpdate: () => void;
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
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Component to edit the IDVP attribute settings.
 *
 * @param props - Props injected to the component.
 * @returns Attribute settings component.
 */
export const AttributeSettings: FunctionComponent<AttributeSettingsPropsInterface> = (
    props: AttributeSettingsPropsInterface
): ReactElement => {

    const {
        idvp,
        initialClaims,
        isLoading,
        onUpdate,
        hideIdentityClaimAttributes,
        isReadOnly,
        loader: Loader,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    // Selected local claims in claim mapping.
    const [ selectedClaimsWithMapping, setSelectedClaimsWithMapping ] = useState<IDVPClaimMappingInterface[]>([]);
    const [ isSubmissionLoading, setIsSubmissionLoading ] = useState<boolean>(false);

    /**
     * Evaluates whether the attribute update can be submitted or not.
     *
     * @returns true if the attribute update can be submitted.
     */
    const canSubmitAttributeUpdate = (): boolean => {
        return isEmpty(selectedClaimsWithMapping?.filter(
            (element: IDVPClaimMappingInterface) => isEmpty(element.idvpClaim)
        ));
    };

    /**
     * Handles updating the IDVP attribute.
     *
     * @returns void
     */
    const handleAttributesUpdate = (): void => {

        idvp.claims = selectedClaimsWithMapping.map((element: IDVPClaimMappingInterface) => {
            return {
                idvpClaim: element.idvpClaim,
                localClaim: element.localClaim.uri
            } as IDVPClaimsInterface;
        });

        if (canSubmitAttributeUpdate()) {
            updateIDVP(idvp, setIsSubmissionLoading, onUpdate);
        } else {
            dispatch(addAlert(
                {
                    description: t("idvp:notifications.submitAttributeSettings" +
                        ".error.description"),
                    level: AlertLevels.WARNING,
                    message: t("idvp:notifications.submitAttributeSettings.error.message")
                }
            ));
        }
    };


    if (isLoading) {
        return <Loader/>;
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
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>
                    <Grid.Row>
                        <Grid.Column>
                            <Show when={ AccessControlConstants.IDVP_EDIT }>
                                <Button
                                    primary
                                    size="small"
                                    loading={ isSubmissionLoading }
                                    disabled={ isSubmissionLoading }
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

/**
 * Default proptypes for the IDVP attribute settings component.
 */
AttributeSettings.defaultProps = {
    "data-componentid": "idvp-edit-attribute-settings",
    hideIdentityClaimAttributes: true
};
