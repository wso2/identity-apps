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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ClaimsGetParams, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { EmphasizedSegment, PageLayout, Text } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import { getAllLocalClaims } from "../../../../admin-claims-v1/api";
import { ClaimManagementConstants } from "../../../../admin-claims-v1/constants";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../../../admin-core-v1";
import { addUserStore, getAType } from "../../../../features/userstores/api/user-stores";
import { UserStoreManagementConstants } from "../../../../features/userstores/constants/user-store-constants";
import {
    AttributeMapping,
    TypeProperty,
    UserStore,
    UserStorePostData,
    UserStoreProperty,
    UserstoreType
} from "../../../../features/userstores/models/user-stores";
import { userstoresConfig } from "../../../configs";
import { VerticalStepper, VerticalStepperStepInterface } from "../../component-extensions";
import { AttributeMappingsComponent, GeneralUserStoreDetails } from "../components";
import { RemoteUserStoreAccessTypes, RemoteUserStoreConstants, RemoteUserStoreTypes } from "../constants";

/**
 * Props for the remote customer user store page.
 */
type RemoteCustomerUserStoreCreatePageInterface = TestableComponentInterface;

/**
 * Remote customer user store create page.
 *
 * @param props - Props injected to the component.
 *
 * @returns ReactElement
 */
const RemoteCustomerUserStoreCreatePage: FunctionComponent<RemoteCustomerUserStoreCreatePageInterface> = (
    props: RemoteCustomerUserStoreCreatePageInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const enableIdentityClaims: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const [ triggerBasicDetailsSubmit, setTriggerBasicDetailsSubmit ] = useTrigger();
    const [ triggerAttributeMappingsSubmit, setTriggerAttributeMappingsSubmit ] = useTrigger();

    const [ userStoreDetails, setUserStoreDetails ] = useState<UserstoreType>(null);
    const [ basicDetails, setBasicDetails ] = useState({ description: "", name: "" });
    const [ userStoreType, setUserStoreType ] = useState<string>(RemoteUserStoreTypes.LDAP);
    const [ userStoreAccessType, setUserStoreAccessType ] = useState<string>(RemoteUserStoreAccessTypes.ReadOnly);
    const [ isUserStoreNameValid, setUserStoreNameValid ] = useState(false);
    const [ isAttributesListRequestLoading, setAttributesListRequestLoading ] = useState<boolean>(false);
    const [ mandatoryAttributes, setMandatoryAttributes ] = useState<Claim[]>(null);

    useEffect(() => {
        getLocalClaims(null, null, null, null, !enableIdentityClaims);
    }, []);

    useEffect(() => {
        getAType(RemoteUserStoreConstants.OUTBOUND_USER_STORE_TYPE_ID, null)
            .then((response: UserstoreType) => {
                setUserStoreDetails(response);
            });
    }, []);

    const handleUserStoreAccessTypeChange = (userStoreAccessType: RemoteUserStoreAccessTypes) => {
        setUserStoreAccessType(userStoreAccessType);
    };

    const handleUserStoreTypeChange = (userStoreType: RemoteUserStoreTypes) => {
        setUserStoreType(userStoreType);
    };

    /**
     * Fetches all the local claims.
     *
     * @param limit - number
     * @param offset - number
     * @param sort - string
     * @param filter - string
     * @param excludeIdentity - boolean
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

        getAllLocalClaims(params).then((attributes: Claim[]) => {
            // Set mandatory attributes that the user needs to update.
            setMandatoryAttributes(attributes.filter((attribute: Claim) =>
                attribute.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI ||
                attribute.claimURI === ClaimManagementConstants.USER_ID_CLAIM_URI
            ));
        }).catch((error: IdentityAppsApiException) => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("claims:local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("claims:local.notifications.getClaims.genericError.message")
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
                value: getValueForUserStoreProperty(property.name)
            });

        });

        userStoreDetails.properties.Optional.map((property: TypeProperty) => {

            userStoreProperties.push({
                name: property.name,
                value: property.defaultValue
            });

        });
        // todo : Need to move this property to either `userStoreDetails.properties.Mandatory` or
        // `userStoreDetails.properties.Optional`. This can be done after the necessary backend fix is complete
        userStoreProperties.push(
            {
                name: RemoteUserStoreConstants.PROPERTY_NAME_READ_ONLY,
                value: getValueForUserStoreProperty(RemoteUserStoreConstants.PROPERTY_NAME_READ_ONLY)
            }
        );

        return userStoreProperties;
    };

    const getValueForUserStoreProperty = (propertyName: string): string => {
        switch (propertyName) {
            case RemoteUserStoreConstants.PROPERTY_NAME_CONNECTED_USERSTORE_TYPE:
                return userStoreType.toString();

            case RemoteUserStoreConstants.PROPERTY_NAME_READ_ONLY:
                return userStoreAccessType.toString();

            default:
                break;
        }
    };

    const handleUserStoreRegistration = (data: UserStorePostData) => {

        // Create the user store in Asgardeo.
        addUserStore(data)
            .then((response: UserStore) => {
                dispatch(addAlert({
                    description: t("userstores:notifications.addUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("userstores:notifications.addUserstore.success.message")
                }));
                dispatch(addAlert({
                    description: t("userstores:notifications.delay.description"),
                    level: AlertLevels.WARNING,
                    message: t("userstores:notifications.delay.message")
                }));

                history.push({
                    pathname: AppConstants.getPaths().get("USERSTORES_EDIT").replace(":id", response.id
                    ).replace("edit-user-store", userstoresConfig.userstoreEdit.remoteUserStoreEditPath)
                        + "#tab=1", search: "?isNew=true"
                });

            })
            .catch((error: AxiosError) => {
                if (error.response?.status === 403 &&
                    error.response.data?.code === UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()
                ) {

                    dispatch(addAlert({
                        description: t(UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorDescription()),
                        level: AlertLevels.ERROR,
                        message: t(UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorMessage())
                    }));
                }

                dispatch(addAlert({
                    description: t("userstores:notifications." +
                        "addUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message ?? t("userstores:notifications.addUserstore" +
                        ".genericError.message")
                }));
            });
    };

    const handleBasicDetailsSubmit = (values: Map<string, FormValue>) => {
        setBasicDetails({
            description: values.get("description").toString(),
            name: values.get("name").toString()
        });
    };

    const handleAttributeMappingsSubmit = (values: Map<string, FormValue>) => {
        if (!isUserStoreNameValid) {
            return;
        }

        const attributeMappings: AttributeMapping[] = [];
        const userStoreProperties: UserStoreProperty[] = serializeProperties();

        values.forEach((value: string, key: string) => {
            attributeMappings.push({
                "claimURI": key,
                "mappedAttribute": value
            });
        });

        const userStoreData: UserStorePostData = {
            claimAttributeMappings: attributeMappings,
            description: basicDetails.description,
            name: basicDetails.name,
            properties: userStoreProperties,
            typeId: RemoteUserStoreConstants.OUTBOUND_USER_STORE_TYPE_ID
        };

        handleUserStoreRegistration(userStoreData);
    };

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
            preventGoToNextStep: !isUserStoreNameValid,
            stepAction: setTriggerBasicDetailsSubmit,
            stepContent: (
                <GeneralUserStoreDetails
                    triggerSubmit={ triggerBasicDetailsSubmit }
                    featureConfig = { featureConfig }
                    handleBasicDetailsSubmit={ handleBasicDetailsSubmit }
                    handleUserStoreTypeChange={ handleUserStoreTypeChange }
                    handleUserStoreAccessTypeChange={ handleUserStoreAccessTypeChange }
                    setUserStoreNameValid={ setUserStoreNameValid }
                />
            ),
            stepTitle: t("extensions:manage.features.userStores.create.pageLayout.steps.generalSettings.title")
        },
        {
            stepAction: setTriggerAttributeMappingsSubmit,
            stepContent: resolveAttributeMappingSection(),
            stepTitle: t("extensions:manage.features.userStores.create.pageLayout.steps.attributeMappings.title")
        }
    ];

    return (
        <PageLayout
            title={ t("extensions:manage.features.userStores.create.pageLayout.title") }
            contentTopMargin={ true }
            description={ t("extensions:manage.features.userStores.create.pageLayout.description") }
            backButton={ {
                "data-testid": `${testId}-page-back-button`,
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t("userstores:pageLayout.edit.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
            data-testid={ `${testId}-page-layout` }
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
                                    data-testid={ `${testId}-vertical-stepper` }
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
