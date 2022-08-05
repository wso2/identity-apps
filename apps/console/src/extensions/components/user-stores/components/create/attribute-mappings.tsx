/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface, Claim } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid, Header, Segment } from "semantic-ui-react";
import { Field, Forms, FormValue } from "@wso2is/forms";
import { ClaimManagementConstants } from "../../../../../features/claims";
import { ContentLoader, Hint } from "@wso2is/react-components";

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
 * @param {AttributeMappingsComponentPropsInterface} props - Props injected to the component.
 *
 * @returns {React.ReactElement}
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

    useEffect(() => {

        if (mandatoryAttributes) {

            const username = mandatoryAttributes.filter((attribute) =>
                attribute.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI);

            const userID = mandatoryAttributes.filter((attribute) =>
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
                                    usernameAttr?.map((attribute, index) => (
                                        <Grid.Row key={ index } columns={ 2 }>
                                            <Grid.Column width={ 8 }>
                                                <Header.Content>
                                                    { attribute?.displayName }
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
                                                    The mapped attribute for username should be <strong>unique </strong>
                                                    and be of <strong>type email</strong>. This field cannot be empty as
                                                    email is the primary identifier of the user.
                                                </Hint>
                                            </Grid.Column>
                                        </Grid.Row>
                                    ))
                                }
                                {
                                    userIDAttr?.map((attribute, index) => (
                                        <Grid.Row key={ index } columns={ 2 }>
                                            <Grid.Column width={ 8 }>
                                                <Header.Content>
                                                    { attribute?.displayName }
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
