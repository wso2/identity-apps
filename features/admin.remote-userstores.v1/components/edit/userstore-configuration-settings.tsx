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

import Button from "@oxygen-ui/react/Button";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppState, sortList } from "@wso2is/admin.core.v1";
import { patchUserStore, updateUserStoreAttributeMappings } from "@wso2is/admin.userstores.v1/api/user-stores";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import {
    PatchData,
    AttributeMapping as UserStoreAttributeMapping,
    UserStoreDetails,
    UserStoreProperty
} from "@wso2is/admin.userstores.v1/models/user-stores";
import {
    AlertInterface,
    AlertLevels,
    AttributeMapping,
    Claim,
    IdentifiableComponentInterface,
    Property
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import {
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    useDocumentation
} from "@wso2is/react-components";
import difference from "lodash-es/difference";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import CustomAttributeMappings from "./configurations/custom-attributes";
import GroupAttributesSection from "./configurations/group-attributes";
import LocalAttributeMappings from "./configurations/local-attributes";
import UserAttributesSection from "./configurations/user-attributes";
import { RemoteUserStoreConstants } from "../../constants/remote-user-stores-constants";
import "./userstore-configuration-settings.scss";

/**
 * Prop types of the attribute mappings edit component
 */
interface ConfigurationSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store object.
     */
    userStore: UserStoreDetails;
    /**
     * User store ID
     */
    userStoreId: string;
    /**
     * User store manager.
     */
    userStoreManager: RemoteUserStoreManagerType;
    /**
     * Whether the data is loading or not.
     */
    isLoading: boolean;
    /**
     * Whether the component is read only or not.
     */
    isReadOnly?: boolean;
    /**
     * Callback to be triggered when the user store is updated.
     */
    onUpdate: () => void;
    /**
     * Whether the user store is disabled or not.
     */
    isUserStoreDisabled: boolean;
}

/**
 * This component renders the attribute mappings component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Attribute mappings component.
 */
export const ConfigurationSettings: FunctionComponent<ConfigurationSettingsPropsInterface> = (
    props: ConfigurationSettingsPropsInterface
): ReactElement => {

    const {
        userStore,
        userStoreId,
        userStoreManager,
        isLoading,
        isReadOnly = false,
        onUpdate,
        isUserStoreDisabled,
        [ "data-componentid" ]: componentId = "configuration-settings"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const enableIdentityClaims: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);

    const {
        data: fetchedAttributes,
        isLoading: isFetchAttributesRequestLoading,
        error: fetchAttributesRequestError,
        mutate: mutateGetAllLocalClaimsRequest
    } = useGetAllLocalClaims({
        "exclude-identity-claims": !enableIdentityClaims,
        filter: null,
        limit: null,
        offset: null,
        sort: null
    });

    useEffect(() => {
        if (fetchAttributesRequestError) {
            dispatch(addAlert(
                {
                    description: t("claims:local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:local.notifications.getClaims.genericError.message")
                }
            ));
        }
    }, [ fetchAttributesRequestError ] );

    const sortedAttributes: Claim[] = useMemo(() => {
        if (isFetchAttributesRequestLoading || !fetchedAttributes) {
            return null;
        }

        return sortList(fetchedAttributes, RemoteUserStoreConstants.DISPLAY_NAME_VALUE, true);
    }, [ isFetchAttributesRequestLoading, fetchedAttributes ]);

    /**
     * Filter out the custom attributes.
     */
    const customAttributes: Claim[] = useMemo(() => {
        if (!sortedAttributes) {
            return null;
        }

        return sortedAttributes.filter((attribute: Claim) =>
            attribute.properties.some(
                (property: Property) =>
                    property.key === "USER_CUSTOM_ATTRIBUTE" && property.value === "TRUE"
            )
        );
    }, [ sortedAttributes ]);

    /**
     * Filter out the default attributes.
     */
    const localAttributes: Claim[] = useMemo(() => {
        if (!sortedAttributes || !customAttributes) {
            return null;
        }

        return difference(sortedAttributes, customAttributes);
    }, [ sortedAttributes, customAttributes ]);

    /**
     * The following function handles resolving the mapped attribute.
     *
     * @param attribute - Mapped attribute.
     */
    const resolveMappedAttribute = (attribute: Claim): string => {
        let mappedAttribute: string = "";

        attribute.attributeMapping.forEach((mapping: AttributeMapping) => {
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
    const handleUpdateUserStoreAttributeMappings = (attributeMappings: UserStoreAttributeMapping[]) => {
        updateUserStoreAttributeMappings(userStoreId, attributeMappings)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("userstores:notifications.updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userstores:notifications.updateUserstore.success.message")
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

                mutateGetAllLocalClaimsRequest();

                onUpdate();
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
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const flattenValues = (
        values: Record<string, unknown>,
        parentKey: string = "",
        result: Record<string, string> = {}
    ): Record<string, string> => {
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                const fullKey: string = parentKey ? `${parentKey}.${key}` : key;

                if (typeof values[key] === "object" && !Array.isArray(values[key]) && values[key] !== null) {
                    flattenValues(values[key] as Record<string, unknown>, fullKey, result);
                } else {
                    result[fullKey] = String(values[key]);
                }
            }
        }

        return result;
    };

    /**
     * Handles updating the user store.
     *
     * @param userStoreProperties - User store properties to be updated.
     * @param attributeMappings - Attribute mappings to be updated.
     */
    const handleUpdateUserStore = (
        userStoreProperties: UserStoreProperty[],
        attributeMappings: UserStoreAttributeMapping[]
    ) => {
        const patchData: PatchData[] = [];

        for (const property of userStoreProperties) {
            patchData.push({
                "operation": "REPLACE",
                "path": `/properties/${property.name}`,
                "value": property.value
            });
        }

        patchUserStore(userStoreId, patchData)
            .then(() => {
                handleUpdateUserStoreAttributeMappings(attributeMappings);
            })
            .catch(() => {
                setIsUpdating(false);
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("userstores:notifications.updateUserstore.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("userstores:notifications.updateUserstore.genericError.message")
                    })
                );
            });
    };

    /**
     * Handles form submit and prepare the data to be updated.
     * @param values - Form values.
     */
    const handleFormSubmit = (values: Record<string, unknown>) => {
        const formValues: Record<string, unknown> = { ...values };

        const userStorePropertyValues: Record<string, string> =
            { ...(formValues["userstore-properties"] as Record<string, string>) };

        const updatedUserStoreProperties: UserStoreProperty[] = [ ];

        for (const property of userStore.properties) {
            if (Object.prototype.hasOwnProperty.call(userStorePropertyValues, property.name)) {
                property.value = userStorePropertyValues[property.name].toString();
                updatedUserStoreProperties.push({ ...property });
            }
        }

        delete formValues["userstore-properties"];

        const flattenedValues: Record<string, string> = flattenValues(formValues);
        const attributeMappings: UserStoreAttributeMapping[] = [];

        for (const [ key, value ] of Object.entries(flattenedValues)) {
            const decodedKey: string = decodeURIComponent(key);

            attributeMappings.push({
                "claimURI": decodedKey,
                "mappedAttribute": value
            });

            if (userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager) {
                if (decodedKey === ClaimManagementConstants.USER_NAME_CLAIM_URI) {
                    updatedUserStoreProperties.push({
                        name: RemoteUserStoreConstants.PROPERTY_NAME_USERNAME,
                        value
                    });
                } else if (decodedKey === ClaimManagementConstants.USER_ID_CLAIM_URI) {
                    updatedUserStoreProperties.push({
                        name: RemoteUserStoreConstants.PROPERTY_NAME_USERID,
                        value
                    });
                }
            }
        }

        setIsUpdating(true);
        handleUpdateUserStore(updatedUserStoreProperties, attributeMappings);
    };

    /**
     * Initial values for the user attributes and group attributes form fields.
     */
    const initialValues: Record<string, string | boolean> = useMemo(() => {
        const _values: Record<string, string | boolean> = {};

        if (!userStore) {
            return _values;
        }

        for (const userStoreProperty of userStore?.properties) {
            _values[ userStoreProperty.name ] = userStoreProperty.value;
        }

        return _values;
    }, [ userStore ]);

    if (isLoading || isFetchAttributesRequestLoading || !localAttributes || !customAttributes) {
        return (
            <EmphasizedSegment
                padded="very"
                className="userstore-configuration-settings"
                data-componentid={ `${componentId}-loading-skeleton` }
            >
                <Skeleton component="h1" width={ "40%" } />
                <Skeleton />
                <Skeleton />
                <br />
                <Skeleton />
                <Skeleton />
                <br />
                <Skeleton component="h1" width={ "40%" } />
                <Skeleton />
                <Skeleton />
            </EmphasizedSegment>
        );
    }

    return (
        <EmphasizedSegment padded="very" className="userstore-configuration-settings">
            <FinalForm
                onSubmit={ (values: Record<string, unknown>) => {
                    handleFormSubmit(values);
                } }
                render={ ({ handleSubmit }: FormRenderProps) => (
                    <form onSubmit={ handleSubmit }>
                        <Stack spacing={ 3 }>
                            <UserAttributesSection
                                localAttributes={ localAttributes }
                                resolveMappedAttribute={ resolveMappedAttribute }
                                isReadOnly={ isReadOnly }
                                data-componentid={ `${componentId}-user-attributes` }
                            />

                            <GroupAttributesSection
                                userStoreManager={ userStoreManager }
                                initialValues={ initialValues }
                                isReadOnly={ isReadOnly }
                                data-componentid={ `${componentId}-group-attributes` }
                            />

                            <Heading as="h3">
                                { t("remoteUserStores:pages.edit.configurations.attributes.heading") }
                                <Heading subHeading as="h6">
                                    { t("extensions:manage.features.userStores.edit." +
                                        "attributeMappings.description") }
                                    <DocumentationLink
                                        link={ getLink("manage.userStores.attributeMappings.learnMore") }
                                    >
                                        { t("console:common.learnMore") }
                                    </DocumentationLink>
                                </Heading>
                            </Heading>
                            <CustomAttributeMappings
                                attributesList={ customAttributes }
                                resolveMappedAttribute={ resolveMappedAttribute }
                                isReadOnly={ isReadOnly }
                                data-componentid={ `${componentId}-custom-attribute-mappings` }
                            />
                            <LocalAttributeMappings
                                attributesList={ localAttributes }
                                resolveMappedAttribute={ resolveMappedAttribute }
                                isReadOnly={ isReadOnly }
                                data-componentid={ `${componentId}-local-attribute-mappings` }
                            />
                            <Button
                                variant="contained"
                                className="update-button"
                                onClick={ handleSubmit }
                                loading={ isUpdating }
                                disabled={ isUpdating || isReadOnly || isUserStoreDisabled }
                                data-componentid={ `${componentId}-update-button` }
                            >
                                { t("common:update") }
                            </Button>
                        </Stack>
                    </form>
                ) }
            />
        </EmphasizedSegment>
    );
};
