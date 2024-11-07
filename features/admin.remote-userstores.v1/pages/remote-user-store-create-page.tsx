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

import { Typography } from "@mui/material";
import Button from "@oxygen-ui/react/Button";
import Step from "@oxygen-ui/react/Step";
import StepContent from "@oxygen-ui/react/StepContent";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { addUserStore, getAType } from "@wso2is/admin.userstores.v1/api/user-stores";
import {
    RemoteUserStoreManagerType,
    UserStoreManagementConstants
} from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import {
    AttributeMapping,
    TypeProperty,
    UserStore,
    UserStorePostData,
    UserStoreProperty,
    UserstoreType
} from "@wso2is/admin.userstores.v1/models/user-stores";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, Claim, ClaimsGetParams, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { EmphasizedSegment, PageLayout, Text } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { AttributeMappingsComponent } from "../components";
import ConfigurationsForm from "../components/create/configurations-form";
import GeneralUserStoreDetailsForm, {
    GeneralUserStoreDetailsFormRef
} from "../components/create/general-user-store-details-form";
import {
    ConnectedUserStoreTypes,
    RemoteUserStoreAccessTypes,
    RemoteUserStoreConstants,
    UserStoresFeatureDictionaryKeys
} from "../constants";
import { RemoteUserStoreImplType, RemoteUserStoreUIConstants } from "../constants/ui-constants";
import { GeneralDetailsFormValuesInterface } from "../models/ui";

import "./remote-user-store-create-page.scss";

/**
 * Props for the remote customer user store page.
 */
type RemoteCustomerUserStoreCreatePageInterface = TestableComponentInterface & RouteComponentProps;

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
    const { location, ["data-testid"]: testId } = props;

    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const userStoreImplTypeQueryParam: string = queryParams.get(
        RemoteUserStoreUIConstants.REMOTE_USER_STORE_TYPE_QUERY_PARAM
    );

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const generalUserStoreDetailsFormRef: MutableRefObject<GeneralUserStoreDetailsFormRef> = useRef<
        GeneralUserStoreDetailsFormRef
    >(null);

    const userStoreFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userStores
    );
    const isOptimizedImplEnabled: boolean = isFeatureEnabled(
        userStoreFeatureConfig,
        RemoteUserStoreConstants.FEATURE_DICTIONARY.get(UserStoresFeatureDictionaryKeys.OptimizedUserStore)
    );
    const isReadWriteUserStoresEnabled: boolean = isFeatureEnabled(
        userStoreFeatureConfig,
        RemoteUserStoreConstants.FEATURE_DICTIONARY.get(UserStoresFeatureDictionaryKeys.ReadWriteUserStores)
    );
    const hasUserStoreCreatePermissions: boolean = useRequiredScopes(userStoreFeatureConfig?.scopes?.update);

    const enableIdentityClaims: boolean = useSelector((state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const [ triggerAttributeMappingsSubmit, setTriggerAttributeMappingsSubmit ] = useTrigger();

    const [ userStoreImplType, setUserStoreImplType ] = useState<RemoteUserStoreImplType>(undefined);
    const [ userStoreDetails, setUserStoreDetails ] = useState<UserstoreType>(null);
    const [ basicDetails, setBasicDetails ] = useState({ description: "", name: "" });
    const [ userStoreType, setUserStoreType ] = useState<string>(ConnectedUserStoreTypes.LDAP);
    const [ userStoreAccessType, setUserStoreAccessType ] = useState<string>(RemoteUserStoreAccessTypes.ReadOnly);
    const [ isUserStoreNameValid, setUserStoreNameValid ] = useState(false);
    const [ isUserStoreDescriptionValid, setUserStoreDescriptionValid ] = useState(false);
    const [ inputDescription, setInputDescription ] = useState<string>("");
    const [ isAttributesListRequestLoading, setAttributesListRequestLoading ] = useState<boolean>(false);
    const [ mandatoryAttributes, setMandatoryAttributes ] = useState<Claim[]>(null);
    const [ activeStep, setActiveStep ] = useState<number>(0);

    /**
     * Checks and validate the user store type query parameter.
     */
    useEffect(() => {
        const remoteUserStoreCreatePath: string = RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE");
        const queryParamKey: string = RemoteUserStoreUIConstants.REMOTE_USER_STORE_TYPE_QUERY_PARAM;

        // Check if the provided query parameter is a valid enum value.
        const isValidType: boolean = Object.values(RemoteUserStoreImplType).includes(
            userStoreImplTypeQueryParam as RemoteUserStoreImplType
        );

        if (!isValidType) {
            const fallbackType: RemoteUserStoreImplType = isOptimizedImplEnabled
                ? RemoteUserStoreImplType.OPTIMIZED
                : RemoteUserStoreImplType.CLASSIC;

            history.replace(`${remoteUserStoreCreatePath}?${queryParamKey}=${fallbackType}`);

            return;
        }

        // If the query parameter is OPTIMIZED but it’s disabled, fallback to CLASSIC.
        if (userStoreImplTypeQueryParam === RemoteUserStoreImplType.OPTIMIZED && !isOptimizedImplEnabled) {
            history.replace(`${remoteUserStoreCreatePath}?${queryParamKey}=${RemoteUserStoreImplType.CLASSIC}`);

            return;
        }

        setUserStoreImplType(userStoreImplTypeQueryParam as RemoteUserStoreImplType);
    }, [ userStoreImplTypeQueryParam ]);

    useEffect(() => {
        getLocalClaims(null, null, null, null, !enableIdentityClaims);
    }, []);

    useEffect(() => {
        getAType(RemoteUserStoreConstants.OUTBOUND_USER_STORE_TYPE_ID, null).then((response: UserstoreType) => {
            setUserStoreDetails(response);
        });
    }, []);

    /**
     * Fetches all the local claims.
     *
     * @param limit - number
     * @param offset - number
     * @param sort - string
     * @param filter - string
     * @param excludeIdentity - boolean
     */
    const getLocalClaims = (
        limit?: number,
        sort?: string,
        offset?: number,
        filter?: string,
        excludeIdentity?: boolean
    ) => {
        setAttributesListRequestLoading(true);
        const params: ClaimsGetParams = {
            "exclude-identity-claims": excludeIdentity,
            filter: filter || null,
            limit: limit || null,
            offset: offset || null,
            sort: sort || null
        };

        getAllLocalClaims(params)
            .then((attributes: Claim[]) => {
                // Set mandatory attributes that the user needs to update.
                setMandatoryAttributes(
                    attributes.filter(
                        (attribute: Claim) =>
                            attribute.claimURI === ClaimManagementConstants.USER_NAME_CLAIM_URI ||
                            attribute.claimURI === ClaimManagementConstants.USER_ID_CLAIM_URI
                    )
                );
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t("claims:local.notifications.getClaims.genericError.description"),
                        level: AlertLevels.ERROR,
                        message:
                            error?.response?.data?.message ||
                            t("claims:local.notifications.getClaims.genericError.message")
                    })
                );
            })
            .finally(() => {
                setAttributesListRequestLoading(false);
            });
    };

    const serializeProperties = (): UserStoreProperty[] => {
        const userStoreProperties: UserStoreProperty[] = [];

        userStoreDetails?.properties?.Mandatory.map((property: TypeProperty) => {
            userStoreProperties.push({
                name: property?.name,
                value: getValueForUserStoreProperty(property?.name)
            });
        });

        userStoreDetails?.properties?.Optional.map((property: TypeProperty) => {
            userStoreProperties.push({
                name: property?.name,
                value: property?.defaultValue
            });
        });
        // todo : Need to move this property to either `userStoreDetails.properties.Mandatory` or
        // `userStoreDetails.properties.Optional`. This can be done after the necessary backend fix is complete
        userStoreProperties.push({
            name: RemoteUserStoreConstants.PROPERTY_NAME_READ_ONLY,
            value: getValueForUserStoreProperty(RemoteUserStoreConstants.PROPERTY_NAME_READ_ONLY)
        });

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
                dispatch(
                    addAlert({
                        description: t("userstores:notifications.addUserstore.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("userstores:notifications.addUserstore.success.message")
                    })
                );
                dispatch(
                    addAlert({
                        description: t("userstores:notifications.delay.description"),
                        level: AlertLevels.WARNING,
                        message: t("userstores:notifications.delay.message")
                    })
                );

                history.push({
                    pathname:
                        AppConstants.getPaths()
                            .get("USERSTORES_EDIT")
                            .replace(":id", response.id)
                            .replace("edit-user-store", userstoresConfig.userstoreEdit.remoteUserStoreEditPath) +
                        "#tab=1",
                    search: "?isNew=true"
                });
            })
            .catch((error: AxiosError) => {
                if (
                    error.response?.status === 403 &&
                    error.response.data?.code === UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()
                ) {
                    dispatch(
                        addAlert({
                            description: t(
                                UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorDescription()
                            ),
                            level: AlertLevels.ERROR,
                            message: t(UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorMessage())
                        })
                    );
                }

                dispatch(
                    addAlert({
                        description: t("userstores:notifications." + "addUserstore.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message ?? t("userstores:notifications.addUserstore" + ".genericError.message")
                    })
                );
            });
    };

    const preventBasicDetailsNext = (): boolean => {
        if (inputDescription) {
            return !isUserStoreNameValid || !isUserStoreDescriptionValid;
        } else {
            return !isUserStoreNameValid;
        }
    };

    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        console.log(values);
        setActiveStep(1);
    };

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
            <EmphasizedSegment padded="very">
                <Stepper activeStep={ activeStep } orientation="vertical" className="remote-user-store-create-stepper">
                    <Step>
                        <StepLabel
                            optional={
                                (<Typography variant="body2">
                                    Provide the basic details to identify and connect your user store.
                                </Typography>)
                            }
                        >
                            <Typography variant="h4">General Details</Typography>
                        </StepLabel>
                        <StepContent>
                            <GeneralUserStoreDetailsForm
                                ref={ generalUserStoreDetailsFormRef }
                                userStoreManager={
                                    userStoreImplType === RemoteUserStoreImplType.OPTIMIZED
                                        ? RemoteUserStoreManagerType.RemoteUserStoreManager
                                        : RemoteUserStoreManagerType.WSOutboundUserStoreManager
                                }
                                isReadOnly={ !hasUserStoreCreatePermissions }
                                isReadWriteUserStoresEnabled={ isReadWriteUserStoresEnabled }
                                onSubmit={ onGeneralDetailsFormSubmit }
                            />
                            <Button
                                variant="contained"
                                disabled={ !hasUserStoreCreatePermissions }
                                data-componentid={ `${testId}-next-button` }
                                onClick={ () => {
                                    if (generalUserStoreDetailsFormRef?.current?.triggerSubmit)
                                        generalUserStoreDetailsFormRef.current.triggerSubmit();
                                } }
                            >
                                Next
                            </Button>
                        </StepContent>
                    </Step>

                    <Step>
                        <StepLabel
                            optional={
                                (<Typography variant="body2">
                                    Complete the required settings to integrate your connected user store, enabling
                                    smooth user access to applications.
                                </Typography>)
                            }
                        >
                            <Typography variant="h4">Configurations</Typography>
                        </StepLabel>
                        <StepContent>
                            <ConfigurationsForm
                                userStoreManager={
                                    userStoreImplType === RemoteUserStoreImplType.OPTIMIZED
                                        ? RemoteUserStoreManagerType.RemoteUserStoreManager
                                        : RemoteUserStoreManagerType.WSOutboundUserStoreManager
                                }
                                isReadOnly={ !hasUserStoreCreatePermissions }
                            />
                            <div className="step-actions-container">
                                <Button
                                    variant="outlined"
                                    disabled={ !hasUserStoreCreatePermissions }
                                    data-componentid={ `${testId}-next-button` }
                                    onClick={ () => {
                                        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
                                    } }
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={ !hasUserStoreCreatePermissions }
                                    data-componentid={ `${testId}-next-button` }
                                    onClick={ () => {
                                        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
                                    } }
                                >
                                    Finish
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default RemoteCustomerUserStoreCreatePage;
