/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { Claim, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { ContentLoader, Hint, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, Header, Segment } from "semantic-ui-react";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";

/**
 * Prop types of the attribute mappings component
 */
interface AttributeMappingsComponentPropsInterface extends TestableComponentInterface {
    /**
     * Flag to hold the submit state.
     */
    triggerSubmit: boolean;
    /**
     * List of mandatory attributes.
     */
    mandatoryAttributes?: Claim[];
    /**
     * Callback function to handle attribute mapping submit.
     */
    handleAttributeMappingsSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * Flag to hold the status of the attribute listing request.
     */
    isAttributesListRequestLoading: boolean;
}

/**
 * This component renders the attribute mappings component.
 *
 * @param props - Props injected to the component.
 *
 * @returns AttributeMappingsComponent.
 */
export const AttributeMappingsComponent: FunctionComponent<AttributeMappingsComponentPropsInterface> = (
    props: AttributeMappingsComponentPropsInterface
): ReactElement => {

    const {
        triggerSubmit,
        handleAttributeMappingsSubmit,
        mandatoryAttributes,
        isAttributesListRequestLoading,
        [ "data-testid" ]: testId
    } = props;

    const [ usernameAttr, setUsernameAttr ] = useState<Claim[]>([]);
    const [ userIDAttr, setUserIDAttr ] = useState<Claim[]>([]);
    const [ usernameType, setUsernameType ] = useState<string>("");
    const { t } = useTranslation();

    const { data: validationData } = useValidationConfigData();

    useEffect(() => {
        if (validationData) {
            setUsernameType(
                getUsernameConfiguration(validationData)?.enableValidator === "false"
                    ? t("extensions:manage.features.userStores.create.pageLayout." +
                        "steps.attributeMappings.emailUsername")
                    : t("extensions:manage.features.userStores.create.pageLayout." +
                        "steps.attributeMappings.alphanumericUsername")
            );
        }
    }, [ validationData ]);

    useEffect(() => {

        if (mandatoryAttributes) {

            const username: Claim[] = mandatoryAttributes.filter((attribute: Claim) =>
                attribute.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI);

            const userID: Claim[] = mandatoryAttributes.filter((attribute: Claim) =>
                attribute.claimURI !== ClaimManagementConstants.USER_NAME_CLAIM_URI);

            setUsernameAttr(username);
            setUserIDAttr(userID);

        }

    }, [ mandatoryAttributes ]);

    return (
        <Forms
            submitState={ triggerSubmit }
            onSubmit={ (values: Map<string, FormValue>) => {
                handleAttributeMappingsSubmit(values);
            } }
        >
            <Segment className="attribute-mapping-section" padded="very">
                {
                    !isAttributesListRequestLoading
                        ? (
                            <Grid width={ 10 }>
                                {
                                    usernameAttr?.map((attribute: Claim, index: number) => (
                                        <Grid.Row key={ index } columns={ 2 }>
                                            <Grid.Column width={ 8 }>
                                                <Header.Content>
                                                    { attribute?.displayName }
                                                    <Text display="inline" styles={ { color: "red" } } > *</Text>
                                                    <Header.Subheader>
                                                        <code className="inline-code compact transparent">
                                                            { attribute?.claimURI }
                                                        </code>
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Grid.Column>
                                            <Grid.Column width={ 8 }>
                                                <Field
                                                    name={ attribute?.claimURI }
                                                    requiredErrorMessage="This field cannot be empty as
                                                    email is the primary identifier of the user"
                                                    type="text"
                                                    required={ true }
                                                    minLength={ 3 }
                                                    maxLength={ 50 }
                                                    data-testid={ `${ testId }-user-store-name-input` }
                                                    width={ 14 }
                                                />
                                                <Hint>
                                                    <Trans
                                                        i18nKey={
                                                            "extensions:manage.features.userStores.create.pageLayout." +
                                                            "steps.attributeMappings.usernameHint"
                                                        }
                                                        tOptions={ { usernameType: usernameType } }
                                                    >
                                                        The mapped attribute for username should
                                                        be <strong>unique </strong> and be of 
                                                        <strong> type { usernameType }</strong>. 
                                                        This field cannot be empty as
                                                        username is the primary identifier of the user.
                                                    </Trans>
                                                    
                                                </Hint>
                                            </Grid.Column>
                                        </Grid.Row>
                                    ))
                                }
                                {
                                    userIDAttr?.map((attribute: Claim, index: number) => (
                                        <Grid.Row key={ index } columns={ 2 }>
                                            <Grid.Column width={ 8 }>
                                                <Header.Content>
                                                    { attribute?.displayName }
                                                    <Text display="inline" styles={ { color: "red" } } > *</Text>
                                                    <Header.Subheader>
                                                        <code className="inline-code compact transparent">
                                                            { attribute?.claimURI }
                                                        </code>
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Grid.Column>
                                            <Grid.Column width={ 8 }>
                                                <Field
                                                    name={ attribute?.claimURI }
                                                    requiredErrorMessage="This field cannot be empty."
                                                    type="text"
                                                    required={ true }
                                                    minLength={ 3 }
                                                    maxLength={ 50 }
                                                    data-testid={ `${ testId }-user-store-name-input` }
                                                    width={ 14 }
                                                />
                                                <Hint>
                                                    The mapped attribute for user ID should be <strong>unique</strong>.
                                                </Hint>
                                            </Grid.Column>
                                        </Grid.Row>
                                    ))
                                }
                            </Grid>
                        )
                        : <ContentLoader/>
                }
            </Segment>
        </Forms>
    );
};
