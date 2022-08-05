/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getAllLocalClaims } from "@wso2is/core/api";
import {
    AlertInterface,
    AlertLevels,
    Claim,
    ClaimsGetParams,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, FormValue } from "@wso2is/forms";
import {
    ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Header, Segment } from "semantic-ui-react";
import { attributeConfig } from "../../../../configs";
import {
    AttributeMapping,
    CONSUMER_USERSTORE,
    updateUserStoreAttributeMappings,
    UserStore
} from "../../../../../features/userstores";
import difference from "lodash-es/difference";

/**
 * Prop types of the attribute mappings edit component
 */
interface AttributeMappingsPropsInterface extends TestableComponentInterface {
    /**
     * User store object.
     */
    userStore: UserStore;
    /**
     * User store ID
     */
    userStoreId: string;
}

/**
 * This component renders the attribute mappings component.
 *
 * @param {AttributeMappingsPropsInterface} props - Props injected to the component.
 *
 * @returns {React.ReactElement}
 */
export const AttributeMappings: FunctionComponent<AttributeMappingsPropsInterface> = (
    props: AttributeMappingsPropsInterface
): ReactElement => {

    const {
        userStore,
        userStoreId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ attributes, setAttributes ] = useState<Claim[]>(null);
    const [ localAttributes, setLocalAttributes ] = useState<Claim[]>(null);
    const [ customAttributes, setCustomAttributes ] = useState<Claim[]>(null);
    const [ isAttributesListRequestLoading, setAttributesListRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        getLocalClaims(null, null, null, null, attributeConfig.attributes.excludeIdentityClaims);
    }, []);

    useEffect(() => {
        if (!attributes) {
            return;
        }

        const customAttr: Claim[] = [];

        attributes.map((attribute) => {
            attribute.properties.map((property) => {
                if (property["key"] === "USER_CUSTOM_ATTRIBUTE" && property["value"] === "TRUE") {
                    customAttr.push(attribute);
                }
            })
        })

        setCustomAttributes(customAttr);
        setLocalAttributes(difference(attributes, customAttr));

    }, [ attributes ]);

    /**
     * Fetches all the local claims.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     * @param { boolean } excludeIdentity
     */
    const getLocalClaims = (limit?: number, sort?: string, offset?: number, filter?: string,
                            excludeIdentity?: boolean) => {
        setAttributesListRequestLoading(true);
        const params: ClaimsGetParams = {
            "exclude-identity-claims": excludeIdentity,
            filter: filter || null,
            limit: limit || null,
            offset: offset || null,
            sort: sort || null
        };
        getAllLocalClaims(params).then(response => {
            setAttributes(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                }
            ));
        }).finally(() => {
            setAttributesListRequestLoading(false);
        });
    };

    /**
     * The following function handles resolving the mapped attribute.
     *
     * @param {Claim} attribute
     */
    const resolveMappedAttribute = (attribute: Claim): string => {
        let mappedAttribute: string = "";

        attribute.attributeMapping.map((mapping) => {
            if (mapping.userstore === userStore?.name.toUpperCase()) {
                mappedAttribute = mapping["mappedAttribute"];
            } else if (mapping.userstore === CONSUMER_USERSTORE) {
                mappedAttribute = mapping["mappedAttribute"];
            } else {
                mappedAttribute = mapping["mappedAttribute"];
            }
        });

        return mappedAttribute;
    };

    /**
     * The following function handles updating attribute mappings.
     *
     * @param {Claim[]} attributeMappings - Attribute mappings.
     */
    const handleUpdateUserStoreAttributeMappings = (attributeMappings: AttributeMapping[]) => {
        updateUserStoreAttributeMappings(userStoreId, attributeMappings)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.userstores.notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.userstores.notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once the backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.userstores.notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:manage.features.userstores.notifications.updateDelay.message")
                }));
            })
            .catch(error => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("console:manage.features.userstores.notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("console:manage.features.userstores.notifications." +
                        "updateUserstore.genericError.message")
                }));
            })
    };

    /**
     * The following function handles attribute mappings submit.
     *
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleAttributeMappingsSubmit = (values: Map<string, FormValue>) => {

        const attributeMappings = [];

        values.forEach((value, key) => {
            attributeMappings.push({
                "claimURI": key,
                "mappedAttribute": value
            })
        });

        handleUpdateUserStoreAttributeMappings(attributeMappings);
    }

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h3">
                Update Attribute Mappings
                <Heading subHeading as="h6">
                    Update the attribute mappings you have added for the default and custom attributes
                </Heading>
            </Heading>
            <Divider hidden/>
            <Forms
                onSubmit={ (values: Map<string, FormValue>) => {
                    handleAttributeMappingsSubmit(values);
                } }
            >
                <Heading as="h5">Custom Attributes</Heading>
                <Segment className="attribute-mapping-section" padded="very">
                    {
                        !isAttributesListRequestLoading
                            ? customAttributes && customAttributes.length > 0
                                ? (
                                    <Grid width={ 10 }>
                                        {
                                            customAttributes?.map((attribute, index) => (
                                                <Grid.Row key={ index } columns={ 2 } verticalAlign="middle">
                                                    <Grid.Column width={ 6 }>
                                                        <Header.Content>
                                                            { attribute?.displayName }
                                                            <Header.Subheader>
                                                                <code className="inline-code compact transparent">
                                                                    { attribute?.claimURI }
                                                                </code>
                                                            </Header.Subheader>
                                                        </Header.Content>
                                                    </Grid.Column>
                                                    <Grid.Column width={ 6 }>
                                                        <Field
                                                            name={ attribute?.claimURI }
                                                            requiredErrorMessage=""
                                                            type="text"
                                                            required={ true }
                                                            minLength={ 3 }
                                                            maxLength={ 50 }
                                                            data-testid={ `${ testId }-user-store-name-input` }
                                                            width={ 14 }
                                                            hint="This will appear as the name of the  remote user store that you connect."
                                                            value={ resolveMappedAttribute(attribute) }
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            ))
                                        }
                                    </Grid>
                                ) : (
                                    <EmptyPlaceholder
                                        title="No Custom Attributes"
                                        subtitle={ [ "There are no custom attributes created in the system." ] }
                                    />
                                )
                            : <ContentLoader/>
                    }
                </Segment>
                <PrimaryButton
                    type="submit"
                >
                    { t("common:update") }
                </PrimaryButton>
                <Divider hidden/>
                <Divider/>
                <Heading as="h5">Local Attributes</Heading>
                <Segment className="attribute-mapping-section" padded="very">
                    {
                        !isAttributesListRequestLoading
                            ? localAttributes && localAttributes.length > 0
                                ? (
                                    <Grid width={ 10 }>
                                        {
                                            localAttributes?.map((attribute, index) => (
                                                <Grid.Row key={ index } columns={ 2 } verticalAlign="middle">
                                                    <Grid.Column width={ 6 }>
                                                        <Header.Content>
                                                            { attribute?.displayName }
                                                            <Header.Subheader>
                                                                <code className="inline-code compact transparent">
                                                                    { attribute?.claimURI }
                                                                </code>
                                                            </Header.Subheader>
                                                        </Header.Content>
                                                    </Grid.Column>
                                                    <Grid.Column width={ 6 }>
                                                        <Field
                                                            name={ attribute?.claimURI }
                                                            requiredErrorMessage=""
                                                            type="text"
                                                            required={ true }
                                                            minLength={ 3 }
                                                            maxLength={ 50 }
                                                            data-testid={ `${ testId }-user-store-name-input` }
                                                            width={ 14 }
                                                            hint="This will appear as the name of the  remote user store that you connect."
                                                            value={ resolveMappedAttribute(attribute) }
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            ))
                                        }
                                    </Grid>
                                ) : (
                                    <EmptyPlaceholder
                                        title="No Custom Attributes"
                                        subtitle={ [ "There are no custom attributes created in the system." ] }
                                    />
                                )
                            : <ContentLoader/>
                    }
                </Segment>
                <PrimaryButton
                    type="submit"
                >
                    { t("common:update") }
                </PrimaryButton>
            </Forms>
        </EmphasizedSegment>
    );
};
