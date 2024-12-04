/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Code from "@oxygen-ui/react/Code";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Grid from "@oxygen-ui/react/Grid";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { Claim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Interface for the user attributes section component props.
 */
interface UserAttributesSectionPropsInterface extends IdentifiableComponentInterface {
    /**
     * Local attributes.
     */
    localAttributes: Claim[];
    /**
     * Whether the fields are read only or not.
     */
    isReadOnly?: boolean;
    /**
     * Function to resolve the mapped attribute.
     */
    resolveMappedAttribute: (attribute: Claim) => string;
}

/**
 * User attributes section component for the remote user store edit page.
 */
const UserAttributesSection: FunctionComponent<UserAttributesSectionPropsInterface> = (
    {
        localAttributes,
        resolveMappedAttribute,
        isReadOnly = false,
        ["data-componentid"]: componentId = "user-attributes-section"
    }: UserAttributesSectionPropsInterface
): ReactElement => {

    const { t } = useTranslation();

    const usernameClaimUri: string = ClaimManagementConstants.USER_NAME_CLAIM_URI;
    const userIDClaimUri: string = ClaimManagementConstants.USER_ID_CLAIM_URI;

    const usernameClaim: Claim = localAttributes.find((claim: Claim) => claim.claimURI === usernameClaimUri);
    const userIDClaim: Claim = localAttributes.find((claim: Claim) => claim.claimURI === userIDClaimUri);

    return (
        <div>
            <Heading as="h3">
                { t("remoteUserStores:form.sections.userAttributes") }
            </Heading>
            <Grid container spacing={ 2 } className="form-grid-container">
                <Grid xs={ 12 } lg={ 5 } xl={ 4 }>
                    <FormLabel required>
                        { t("remoteUserStores:form.fields.usernameMapping.label") }
                    </FormLabel>
                    <br />
                    <Code variant="caption">{ usernameClaimUri }</Code>
                </Grid>
                <Grid xs={ 12 } lg={ 6 } xl={ 4 }>
                    <FinalFormField
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        data-componentid={ `${componentId}-field-usernameMapping` }
                        name={ encodeURIComponent(usernameClaimUri) }
                        type="text"
                        placeholder={
                            t("remoteUserStores:form.fields.usernameMapping.placeholder")
                        }
                        component={ TextFieldAdapter }
                        disabled={ isReadOnly }
                        helperText={
                            (<Hint className="hint" compact>
                                {
                                    t("remoteUserStores:form.fields.usernameMapping.helperText")
                                }
                            </Hint>)
                        }
                        initialValue={ resolveMappedAttribute(usernameClaim) }
                    />
                </Grid>
                <Grid />

                <Grid xs={ 12 } lg={ 5 } xl={ 4 }>
                    <FormLabel required>
                        { t("remoteUserStores:form.fields.userIdMapping.label") }
                    </FormLabel>
                    <br />
                    <Code variant="caption">{ userIDClaimUri }</Code>
                </Grid>
                <Grid xs={ 12 } lg={ 6 } xl={ 4 }>
                    <FinalFormField
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        data-componentid={ `${componentId}-field-userIdMapping` }
                        name={ encodeURIComponent(userIDClaimUri) }
                        type="text"
                        placeholder={ t("remoteUserStores:form.fields.userIdMapping.placeholder") }
                        component={ TextFieldAdapter }
                        disabled={ isReadOnly }
                        helperText={
                            (<Hint className="hint" compact>
                                {
                                    t("remoteUserStores:form.fields.userIdMapping.helperText")
                                }
                            </Hint>)
                        }
                        initialValue={ resolveMappedAttribute(userIDClaim) }
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default UserAttributesSection;
