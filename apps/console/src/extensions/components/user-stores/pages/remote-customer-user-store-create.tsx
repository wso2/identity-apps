/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, Claim, ClaimsGetParams, TestableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, PageLayout, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VerticalStepper, VerticalStepperStepInterface } from "../../component-extensions";
import { AttributeMappingsComponent, GeneralUserStoreDetails } from "../components";
import { attributeConfig, userstoresConfig } from "../../../configs";
import { getAllLocalClaims } from "@wso2is/core/api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { Divider, Grid } from "semantic-ui-react";
import { AppConstants, history } from "../../../../features/core";
import {
    addUserStore,
    getAType,
    TypeProperty,
    UserStoreManagementConstants,
    UserStoreProperty,
    UserstoreType
} from "../../../../features/userstores";
import { ClaimManagementConstants} from "../../../../features/claims";
import { RemoteUserStoreConstants } from "../constants";
import { FormValue, useTrigger } from "@wso2is/forms";

/**
 * Props for the remote customer user store page.
 */
type RemoteCustomerUserStoreCreatePageInterface = TestableComponentInterface;

/**
 * Enum for customer user store types.
 *
 * @readonly
 * @enum {string}
 */
export enum CustomerUserStoreTypes {
    AD = "Active Directory",
    LDAP = "LDAP"
}

/**
 * Remote customer user store create page.
 *
 * @param {RemoteCustomerUserStoreCreatePageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const RemoteCustomerUserStoreCreatePage: FunctionComponent<RemoteCustomerUserStoreCreatePageInterface> = (
    props: RemoteCustomerUserStoreCreatePageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ triggerBasicDetailsSubmit, setTriggerBasicDetailsSubmit ] = useTrigger();
    const [ triggerAttributeMappingsSubmit, setTriggerAttributeMappingsSubmit ] = useTrigger();

    const [ userStoreDetails, setUserStoreDetails ] = useState<UserstoreType>(null);
    const [ basicDetails, setBasicDetails ] = useState({ name: "", description: "" });
    const [ userStoreType, setUserStoreType ] = useState<string>(CustomerUserStoreTypes.LDAP);
    const [ isAttributesListRequestLoading, setAttributesListRequestLoading ] = useState<boolean>(false);
    const [ mandatoryAttributes, setMandatoryAttributes ] = useState<Claim[]>(null);

    useEffect(() => {
        getLocalClaims(null, null, null, null, attributeConfig.attributes.excludeIdentityClaims);
    }, []);

    useEffect(() => {
        getAType(RemoteUserStoreConstants.OUTBOUND_USER_STORE_TYPE_ID, null)
            .then((response) => {
                setUserStoreDetails(response);
            });
    }, []);

    const handleUserStoreTypeChange = (userStoreType: string) => {
        setUserStoreType(userStoreType);
    };

    /**
     * Fetches all the local claims.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     * @param {boolean} excludeIdentity
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

        getAllLocalClaims(params).then(attributes => {
            // Set mandatory attributes that the user needs to update.
            setMandatoryAttributes(attributes.filter((attribute) =>
                attribute.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI ||
                attribute.claimURI === ClaimManagementConstants.USER_ID_CLAIM_URI
            ));
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

    const serializeProperties = (): UserStoreProperty[] => {

        const userStoreProperties: UserStoreProperty[] = [];

        userStoreDetails.properties.Mandatory.map((property: TypeProperty) => {

            userStoreProperties.push({
                name: property.name,
                value: property.defaultValue
            });

            userStoreProperties.push(
                {
                    name: "ConnectedUserstoreType",
                    value: "LDAP"
                },
                {
                    name: "Disabled",
                    value: "false"
                },
                {
                    name: "ReadOnly",
                    value: "true"
                },
                {
                    name: "ReadGroups",
                    value: "true"
                }
            );
        });

        return userStoreProperties;
    };

    const handleUserStoreRegistration = (data) => {

        // Create the user store in Asgardeo.
        addUserStore(data)
            .then((response) => {
                dispatch(addAlert({
                    description: t("console:manage.features.userstores.notifications.addUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.userstores.notifications.addUserstore.success.message")
                }));
                dispatch(addAlert({
                    description: t("console:manage.features.userstores.notifications.delay.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:manage.features.userstores.notifications.delay.message")
                }));

                history.push({
                    pathname: AppConstants.getPaths().get("USERSTORES_EDIT").replace(":id", response.id
                        ).replace("edit-user-store", userstoresConfig.userstoreEdit.remoteUserStoreEditPath)
                        + "#tab=1", search: `?isNew=true`
                });

            })
            .catch((error) => {
                if (error.response?.status === 403 &&
                    error.response.data?.code === UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()
                ) {

                    dispatch(addAlert({
                        description: t(UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorDescription()),
                        level: AlertLevels.ERROR,
                        message: t(UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorMessage()),
                    }));
                }

                dispatch(addAlert({
                    description: error?.description ?? t("console:manage.features.userstores.notifications." +
                        "addUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message ?? t("console:manage.features.userstores.notifications.addUserstore" +
                        ".genericError.message")
                }));
            });
    };

    const handleBasicDetailsSubmit = (values: Map<string, FormValue>) => {
        setBasicDetails({
            name: values.get("name").toString(),
            description: values.get("description").toString()
        })
    }

    const handleAttributeMappingsSubmit = (values) => {

        const attributeMappings = [];
        const userStoreProperties: UserStoreProperty[] = serializeProperties();

        values.forEach((value, key) => {
            attributeMappings.push({
                "claimURI": key,
                "mappedAttribute": value
            })
        });

        const userStoreData = {
            typeId: RemoteUserStoreConstants.OUTBOUND_USER_STORE_TYPE_ID,
            description: basicDetails.description,
            name: basicDetails.name,
            properties: userStoreProperties,
            claimAttributeMappings: attributeMappings
        }

        handleUserStoreRegistration(userStoreData);
    }

    const resolveAttributeMappingSection = () => (
        <>
            <Text className="section-description">
                { t("extensions:manage.features.userStores.create.pageLayout.steps.attributeMappings.subTitle") }
            </Text>
            <Divider hidden />
            <AttributeMappingsComponent
                isAttributesListRequestLoading={ isAttributesListRequestLoading }
                triggerSubmit={ triggerAttributeMappingsSubmit }
                mandatoryAttributes={ mandatoryAttributes }
                handleAttributeMappingsSubmit={ handleAttributeMappingsSubmit }
            />
        </>
    );

    const creationFlowSteps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <GeneralUserStoreDetails
                    triggerSubmit={ triggerBasicDetailsSubmit }
                    handleBasicDetailsSubmit={ handleBasicDetailsSubmit }
                    handleUserStoreTypeChange={ handleUserStoreTypeChange }
                />
            ),
            stepAction: setTriggerBasicDetailsSubmit,
            stepTitle: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.title"),
        },
        {
            stepContent: resolveAttributeMappingSection(),
            stepAction: setTriggerAttributeMappingsSubmit,
            stepTitle: t("extensions:manage.features.userStores.create.pageLayout.steps.attributeMappings.title")
        }
    ];

    return (
        <PageLayout
            title={ t("extensions:manage.features.userStores.create.pageLayout.title") }
            contentTopMargin={ true }
            description={ t("extensions:manage.features.userStores.create.pageLayout.description") }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t("console:manage.features.userstores.pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
            data-testid={ `${ testId }-page-layout` }
        >
            <div className="remote-user-store-create-section">
                <EmphasizedSegment padded="very">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 10 }>
                                <VerticalStepper
                                    alwaysOpen={ false }
                                    isSidePanelOpen={ false }
                                    stepContent={ creationFlowSteps }
                                    isNextEnabled={ true }
                                    data-testid={ `${ testId }-vertical-stepper` }
                                    handleFinishAction={ () => setTriggerAttributeMappingsSubmit() }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>
            </div>
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteCustomerUserStoreCreatePage;
