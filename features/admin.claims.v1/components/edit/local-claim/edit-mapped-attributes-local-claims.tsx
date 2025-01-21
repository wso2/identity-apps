/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Typography from "@oxygen-ui/react/Typography";
import { Show, useRequiredScopes } from "@wso2is/access-control";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { UserStoreBasicData } from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertLevels, AttributeMapping, Claim, IdentifiableComponentInterface, Property } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import { updateAClaim } from "../../../api";
import { ClaimManagementConstants } from "../../../constants";

/**
 * Prop types of `EditMappedAttributesLocalClaims` component
 */
interface EditMappedAttributesLocalClaimsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Claim to be edited
     */
    claim: Claim;
    /**
     * Called to initiate an update
     */
    update: () => void;
    /**
     * User stores.
     */
    userStores: UserStoreBasicData[];
}

/**
 * This component renders the Mapped Attribute pane of
 * the edit local claim screen
 *
 * @param props - Props injected to the component.
 *
 * @returns Edit mapped attributes component.
 */
export const EditMappedAttributesLocalClaims: FunctionComponent<EditMappedAttributesLocalClaimsPropsInterface> = (
    props: EditMappedAttributesLocalClaimsPropsInterface
): ReactElement => {

    const {
        claim,
        update,
        userStores,
        [ "data-componentid" ]: componentId = "edit-local-claims-mapped-attributes"
    } = props;

    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ submit, setSubmit ] = useTrigger();

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const hiddenUserStores: string[] = useSelector((state: AppState) => state?.config?.ui?.hiddenUserStores);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const isReadOnly: boolean = !useRequiredScopes(
        featureConfig?.attributeDialects?.scopes?.update
    );

    const getExcludedStoresFromClaim = (claim: Claim): string[] => {
        const property: Property = claim?.properties?.find(
            (prop: Property) => prop?.key?.toLowerCase()
                === ClaimManagementConstants.EXCLUDED_USER_STORES_CLAIM_PROPERTY.toLowerCase()
        );

        return property?.value?.split(",") || [];
    };
    const [ excludedUserStores, setExcludedUserStores ] = useState<string[]>(
        getExcludedStoresFromClaim(claim)
    );

    const getMappedAttributeForUserStore = (userStore: string): string | undefined => {
        const mappingForGivenUserStore: string = claim?.attributeMapping?.find(
            (attribute: AttributeMapping) =>
                attribute.userstore.toLowerCase() === userStore.toLowerCase()
        )?.mappedAttribute;

        // If no specific mapping found, use primary userstore mapping.
        if (!mappingForGivenUserStore && userStore !== primaryUserStoreDomainName) {
            return claim?.attributeMapping?.find(
                (attribute: AttributeMapping) =>
                    attribute.userstore.toLowerCase() === primaryUserStoreDomainName.toLowerCase()
            )?.mappedAttribute;
        }

        return mappingForGivenUserStore;
    };

    const handleEnableForUserStore = (storeName: string, isChecked: boolean) => {
        if (isChecked) {
            setExcludedUserStores(excludedUserStores.filter((name: string) => name !== storeName));
        } else {
            setExcludedUserStores([ ...excludedUserStores, storeName ]);
        }
    };

    return (
        <EmphasizedSegment padded="very">
            <Grid data-componentid={ componentId }>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 12 } widescreen={ 9 } mobile={ 16 }>
                        <p>
                            { t("claims:local.mappedAttributes.hint") }
                        </p>
                        <Divider hidden />
                        <Forms
                            submitState={ submit }
                            onSubmit={ (values: Map<string, FormValue>) => {
                                const claimData: Claim = { ...claim };

                                delete claimData.id;
                                delete claimData.dialectURI;

                                const updatedMappings: AttributeMapping[] = Array.from(values)?.map(
                                    ([ userstore, attribute ]: [string, FormValue]) => ({
                                        mappedAttribute: attribute?.toString(),
                                        userstore: userstore?.toString()
                                    })
                                );
                                const existingMappings: AttributeMapping[] =
                                    claim?.attributeMapping?.filter((mapping: AttributeMapping) => {
                                        if (!mapping?.userstore) return false;

                                        const userstore: string = mapping?.userstore?.toUpperCase();
                                        const validStores: string[] = [
                                            primaryUserStoreDomainName.toUpperCase(),
                                            ...(hiddenUserStores?.map((store: string) => store.toUpperCase()) ?? [])
                                        ];

                                        return validStores?.includes(userstore) && !values?.has(mapping?.userstore);
                                    }) ?? [];

                                const validExcludedUserStores: string[] = excludedUserStores?.filter(
                                    (store: string) => userStores?.find((userStore: UserStoreBasicData) =>
                                        userStore?.name?.toUpperCase() === store?.toUpperCase()
                                    )
                                ) ?? [];

                                const submitData: Claim = {
                                    ...claimData,
                                    attributeMapping: [ ...existingMappings, ...updatedMappings ],
                                    properties: [
                                        ...(claimData?.properties?.filter((prop: Property) =>
                                            prop?.key?.toLowerCase() !==
                                            ClaimManagementConstants.EXCLUDED_USER_STORES_CLAIM_PROPERTY
                                                .toLowerCase()
                                        ) || []),
                                        {
                                            key: ClaimManagementConstants.EXCLUDED_USER_STORES_CLAIM_PROPERTY,
                                            value: validExcludedUserStores?.join(",")
                                        }
                                    ]
                                };

                                if (validExcludedUserStores?.length === 0) {
                                    submitData.properties = submitData?.properties?.filter((property: Property) =>
                                        property.key !== ClaimManagementConstants.EXCLUDED_USER_STORES_CLAIM_PROPERTY);
                                }

                                setIsSubmitting(true);

                                updateAClaim(claim.id, submitData)
                                    .then(() => {
                                        dispatch(addAlert(
                                            {
                                                description: t("claims:local.notifications." +
                                                "updateClaim.success.description"),
                                                level: AlertLevels.SUCCESS,
                                                message: t("claims:local.notifications." +
                                                "updateClaim.success.message")
                                            }
                                        ));
                                        update();
                                    })
                                    //TODO: [Type Fix] Fix the type of the `error` object
                                    .catch((error: any) => {
                                        dispatch(addAlert(
                                            {
                                                description: error?.description
                                                || t("claims:local.notifications." +
                                                    "updateClaim.genericError.description"),
                                                level: AlertLevels.ERROR,
                                                message: error?.message
                                                || t("claims:local.notifications." +
                                                    "updateClaim.genericError.message")
                                            }
                                        ));
                                    }).finally(() => {
                                        setIsSubmitting(false);
                                    });
                            } }
                        >
                            { userStores.map((store: UserStoreBasicData, index: number) => {
                                if (store.enabled || store.id.toUpperCase()
                                    === primaryUserStoreDomainName.toUpperCase()) {
                                    return (
                                        <Accordion
                                            defaultExpanded
                                            expanded={ true }
                                            key={ index }
                                            data-componentid={ `${componentId}-form-accordion-${store.name}` }
                                        >
                                            <AccordionSummary>
                                                <Typography variant="h6"> { store.name } </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid>
                                                    <Grid.Row columns={ 2 } key={ index } verticalAlign="middle">
                                                        <Grid.Column width={ 6 }>
                                                            <p> {
                                                                t("claims:local.mappedAttributes.mappedAttributeName")
                                                            }</p>
                                                        </Grid.Column>
                                                        <Grid.Column width={ 6 }>
                                                            <Field
                                                                type="text"
                                                                name={ store.name }
                                                                placeholder={ t("claims:local.forms.attribute." +
                                                                    "placeholder") }
                                                                required={ true }
                                                                requiredErrorMessage={
                                                                    t("claims:local.forms." +
                                                                        "attribute.requiredErrorMessage")
                                                                }
                                                                value={ getMappedAttributeForUserStore(store.name) }
                                                                data-componentid={
                                                                    `${componentId}-form-attribute-name-input-
                                                                        ${store.name}` }
                                                                readOnly={ isReadOnly }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    { ClaimManagementConstants.USER_STORE_CONFIG_SUPPORTED_CLAIMS
                                                        .includes(claim.claimURI) && (
                                                        <Grid.Row columns={ 2 } key={ index } verticalAlign="middle">
                                                            <Grid.Column width={ 6 }>
                                                                <p>{ t("claims:local.mappedAttributes." +
                                                                        "enableForUserStore") }</p>
                                                            </Grid.Column>
                                                            <Grid.Column width={ 6 }>
                                                                <Checkbox
                                                                    checked={ !excludedUserStores.includes(store.name) }
                                                                    onChange={
                                                                        (e: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleEnableForUserStore(
                                                                                store.name, e.target.checked
                                                                            ) }
                                                                    disabled={ isReadOnly }
                                                                    data-componentid={
                                                                        `${componentId}` +
                                                                        "-form-userstore-support-checkbox" +
                                                                        `-${store.name}` }
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    ) }
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                }
                            }) }
                        </Forms>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <Show
                            when={ featureConfig?.attributeDialects?.scopes?.update }
                        >
                            <PrimaryButton
                                onClick={ () => {
                                    setSubmit();
                                } }
                                data-componentid={ `${ componentId }-form-submit-button` }
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
