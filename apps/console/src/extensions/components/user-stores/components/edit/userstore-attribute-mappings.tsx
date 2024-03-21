/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    AlertInterface,
    AlertLevels,
    Claim,
    ClaimsGetParams,
    Property,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    Popup,
    PrimaryButton,
    Text,
    useDocumentation,
    useMediaContext
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import difference from "lodash-es/difference";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Header, Segment } from "semantic-ui-react";
import { getAllLocalClaims } from "../../../../../features/claims/api";
import { AppState, sortList } from "../../../../../features/core";
import { updateUserStoreAttributeMappings } from "../../../../../features/userstores/api/user-stores";
import { DISABLED } from "../../../../../features/userstores/constants/user-store-constants";
import {
    AttributeMapping,
    UserStore,
    UserStoreProperty
} from "../../../../../features/userstores/models/user-stores";
import { RemoteUserStoreConstants } from "../../constants";

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
 * @param props - Props injected to the component.
 *
 * @returns Attribute mappings component.
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
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();
    const { isMobileViewport } = useMediaContext();

    const enableIdentityClaims: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const [ attributes, setAttributes ] = useState<Claim[]>(null);
    const [ localAttributes, setLocalAttributes ] = useState<Claim[]>(null);
    const [ customAttributes, setCustomAttributes ] = useState<Claim[]>(null);
    const [ isAttributesListRequestLoading, setAttributesListRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        getLocalClaims(null, null, null, null, !enableIdentityClaims);
    }, []);

    useEffect(() => {
        if (!attributes) {
            return;
        }

        const customAttr: Claim[] = [];

        attributes.map((attribute: Claim) => {
            attribute.properties.map((property: Property) => {
                if (property["key"] === "USER_CUSTOM_ATTRIBUTE" && property["value"] === "TRUE") {
                    customAttr.push(attribute);
                }
            });
        });

        setCustomAttributes(customAttr);
        setLocalAttributes(difference(attributes, customAttr));

    }, [ attributes ]);

    /**
     * Fetches all the local claims.
     *
     * @param limit - List limit.
     * @param offset - List offset.
     * @param sort - List sort order.
     * @param filter - List filter query.
     * @param excludeIdentity - Should exclude identity claims?
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

        getAllLocalClaims(params).then((response: Claim[]) => {
            setAttributes(sortList(response, RemoteUserStoreConstants.DISPLAY_NAME_VALUE, true));
        }).catch((error: AxiosError) => {
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
     * @param attribute - Mapped attribute.
     */
    const resolveMappedAttribute = (attribute: Claim): string => {
        let mappedAttribute: string = "";

        attribute.attributeMapping.forEach((mapping: AttributeMapping & { userstore: string; }) => {
            if (mapping.userstore === userStore?.name.toUpperCase()) {
                mappedAttribute = mapping["mappedAttribute"];
            } else if (mappedAttribute === ""
                && mapping.userstore === RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME) {
                mappedAttribute = mapping["mappedAttribute"];
            }
        });

        return mappedAttribute;
    };

    /**
     * The following function handles updating attribute mappings.
     *
     * @param attributeMappings - Attribute mappings.
     */
    const handleUpdateUserStoreAttributeMappings = (attributeMappings: AttributeMapping[]) => {
        updateUserStoreAttributeMappings(userStoreId, attributeMappings)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userstores:notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once the backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("userstores:notifications.updateDelay.message")
                }));
            })
            .catch((error: { description: string, message: string }) => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("userstores:notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("userstores:notifications." +
                        "updateUserstore.genericError.message")
                }));
            });
    };

    /**
     * The following function handles attribute mappings submit.
     *
     * @param values - Form values
     */
    const handleAttributeMappingsSubmit = (values: Map<string, FormValue>) => {

        const attributeMappings: AttributeMapping[] = [];

        values.forEach((value: FormValue, key: string) => {
            attributeMappings.push({
                "claimURI": key,
                "mappedAttribute": value as string
            });
        });

        handleUpdateUserStoreAttributeMappings(attributeMappings);
    };

    return (
        <>
            { !isAttributesListRequestLoading
                ? (
                    <EmphasizedSegment padded="very">
                        <Heading as="h3">
                            Update Attribute Mappings
                            <Heading subHeading as="h6">
                                { t("extensions:manage.features.userStores.edit." +
                                    "attributeMappings.description") }
                                <DocumentationLink
                                    link={ getLink("manage.userStores.attributeMappings.learnMore") }
                                >
                                    { t("extensions:common.learnMore") }
                                </DocumentationLink>
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
                                                        customAttributes?.map((attribute: Claim, index: number) => (
                                                            <Grid.Row
                                                                key={ index }
                                                                columns={ 2 }
                                                                verticalAlign="middle"
                                                            >
                                                                <Grid.Column width={ 6 }>
                                                                    <Header.Content>
                                                                        { attribute?.displayName }
                                                                        <Text
                                                                            display="inline"
                                                                            styles={ { color: "red" } }
                                                                        >
                                                                            *
                                                                        </Text>
                                                                        <Header.Subheader>
                                                                            <code
                                                                                className={
                                                                                    "inline-code compact transparent"
                                                                                }
                                                                            >
                                                                                { attribute?.claimURI }
                                                                            </code>
                                                                        </Header.Subheader>
                                                                    </Header.Content>
                                                                </Grid.Column>
                                                                <Grid.Column width={ 6 }>
                                                                    <Field
                                                                        name={ attribute?.claimURI }
                                                                        requiredErrorMessage={
                                                                            t("extensions:manage.features." +
                                                                            "userStores.edit.attributeMappings." +
                                                                            "validations.empty")
                                                                        }
                                                                        type="text"
                                                                        required={ true }
                                                                        minLength={ 3 }
                                                                        maxLength={ 50 }
                                                                        data-testid={
                                                                            `${ testId }-user-store-name-input`
                                                                        }
                                                                        width={ 14 }
                                                                        hint={
                                                                            // TODO: Add i18n strings here.
                                                                            "This will appear as the name of the " +
                                                                            "remote user store that you connect."
                                                                        }
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
                                                    subtitle={
                                                        // TODO: Add i18n strings here.
                                                        [ "There are no custom attributes created in the system." ]
                                                    }
                                                />
                                            )
                                        : <ContentLoader/>
                                }
                            </Segment>
                            {
                                (customAttributes?.length > 0
                                && userStore?.properties?.find(
                                    (property: UserStoreProperty) => property.name === DISABLED)?.value === "false")
                                ?? (
                                    <PrimaryButton
                                        type="submit"
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                )
                            }
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
                                                        localAttributes?.map((attribute: Claim, index: number) => (
                                                            <Grid.Row
                                                                key={ index }
                                                                columns={ 2 }
                                                                verticalAlign="middle"
                                                            >
                                                                <Grid.Column width={ 6 }>
                                                                    <Header.Content>
                                                                        { attribute?.displayName }
                                                                        <Text
                                                                            display="inline"
                                                                            styles={ { color: "red" } }
                                                                        >
                                                                            *
                                                                        </Text>
                                                                        <Header.Subheader>
                                                                            <code
                                                                                className={
                                                                                    "inline-code compact transparent"
                                                                                }
                                                                            >
                                                                                { attribute?.claimURI }
                                                                            </code>
                                                                        </Header.Subheader>
                                                                    </Header.Content>
                                                                </Grid.Column>
                                                                <Grid.Column width={ 6 }>
                                                                    <Field
                                                                        name={ attribute?.claimURI }
                                                                        requiredErrorMessage={ t("extensions:manage." +
                                                                            "features.userStores.edit." +
                                                                            "attributeMappings.validations.empty") }
                                                                        type="text"
                                                                        required={ true }
                                                                        minLength={ 3 }
                                                                        maxLength={ 50 }
                                                                        data-testid={
                                                                            `${ testId }-user-store-name-input`
                                                                        }
                                                                        width={ 14 }
                                                                        hint={
                                                                            // TODO: Add i18n strings here.
                                                                            "This will appear as the name of the " +
                                                                            "remote user store that you connect."
                                                                        }
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
                                                    subtitle={
                                                        // TODO: Add i18n strings here.
                                                        [ "There are no custom attributes created in the system." ]
                                                    }
                                                />
                                            )
                                        : <ContentLoader/>
                                }
                            </Segment>
                            <Popup
                                trigger={ (
                                    <div
                                        className={
                                            isMobileViewport
                                                ? "mb-1x mt-1x inline-button button-width"
                                                : "inline-button"
                                        }
                                    >
                                        <PrimaryButton
                                            type="submit"
                                            disabled={ !(userStore?.properties?.find(
                                                (property: UserStoreProperty) =>
                                                    property.name === DISABLED)?.value === "false") }
                                        >
                                            { t("common:update") }
                                        </PrimaryButton>
                                    </div>
                                ) }
                                content={ t("extensions:manage.features.userStores.edit." +
                                "attributeMappings.disable.buttonDisableHint") }
                                size="mini"
                                wide
                                disabled={ !!(userStore?.properties?.find(
                                    (property: UserStoreProperty) => property.name === DISABLED)?.value === "false") }
                            />
                        </Forms>
                    </EmphasizedSegment>
                ) :
                <ContentLoader/>
            }
        </>
    );
};
