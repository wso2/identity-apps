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
import Step from "@oxygen-ui/react/Step";
import StepContent from "@oxygen-ui/react/StepContent";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import useGetUserStoreTypes from "@wso2is/admin.userstores.v1/api/use-get-user-store-types";
import { addUserStore } from "@wso2is/admin.userstores.v1/api/user-stores";
import {
    RemoteUserStoreManagerType,
    UserStoreManagementConstants
} from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import {
    UserStore,
    UserStorePostData,
    UserStoreProperty,
    UserStoreType
} from "@wso2is/admin.userstores.v1/models/user-stores";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, EmphasizedSegment, Message, PageLayout, useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import ConfigurationsForm, { ConfigurationsFormRef } from "../components/create/configurations-form";
import GeneralUserStoreDetailsForm, {
    GeneralUserStoreDetailsFormRef
} from "../components/create/general-user-store-details-form";
import {
    ConnectedUserStoreTypes,
    RemoteUserStoreAccessTypes,
    RemoteUserStoreConstants,
    UserStoresFeatureDictionaryKeys
} from "../constants/remote-user-stores-constants";
import { RemoteUserStoreImplType, RemoteUserStoreUIConstants } from "../constants/ui-constants";
import {
    ConfigurationsFormValuesInterface,
    GeneralDetailsFormValuesInterface,
    UserStoreFormDataInterface
} from "../models/ui";

import "./remote-user-store-create-page.scss";

/**
 * Props for the remote customer user store page.
 */
type RemoteCustomerUserStoreCreatePageInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Remote customer user store create page.
 *
 * @param props - Props injected to the component.
 *
 * @returns the remote customer user store creation page
 */
const RemoteUserStoreCreatePage: FunctionComponent<RemoteCustomerUserStoreCreatePageInterface> = (
    props: RemoteCustomerUserStoreCreatePageInterface
): ReactElement => {
    const { location, ["data-componentid"]: testId = "remote-userstore-create-page" } = props;

    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const queryParamKey: string = RemoteUserStoreUIConstants.REMOTE_USER_STORE_TYPE_QUERY_PARAM;
    const userStoreImplTypeQueryParam: string = queryParams.get(queryParamKey);
    const remoteUserStoreCreatePath: string = RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE");

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();

    const generalUserStoreDetailsFormRef: MutableRefObject<GeneralUserStoreDetailsFormRef> = useRef<
        GeneralUserStoreDetailsFormRef
    >(null);
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<
        ConfigurationsFormRef
    >(null);

    const initialUserStoreFormData: UserStoreFormDataInterface = {
        configurations: {
            readGroups: true
        },
        generalDetails: {
            accessType: RemoteUserStoreAccessTypes.ReadOnly,
            connectedUserStoreType: ConnectedUserStoreTypes.LDAP
        }
    };

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);
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

    const [ userStoreImplType, setUserStoreImplType ] = useState<RemoteUserStoreImplType>(undefined);
    const [ activeStep, setActiveStep ] = useState<number>(0);
    const [ userStoreFormData, setUserStoreFormData ] = useState<UserStoreFormDataInterface>(initialUserStoreFormData);
    const [ isUserStoreCreateRequestLoading, setIsUserStoreCreateRequestLoading ] = useState<boolean>(false);

    const {
        data: userStoreTypeList,
        isLoading: isUserStoreTypesRequestLoading,
        error: userStoreTypeRequestError
    } = useGetUserStoreTypes();

    /**
     * Resolve the user store type ID from the available user store types.
     */
    const userStoreTypeID: string = useMemo(() => {
        if (!userStoreTypeList) {
            return null;
        }

        const _userStoreType: RemoteUserStoreManagerType = userStoreImplType === RemoteUserStoreImplType.OPTIMIZED
            ? RemoteUserStoreManagerType.RemoteUserStoreManager
            : RemoteUserStoreManagerType.WSOutboundUserStoreManager;

        return userStoreTypeList.find(
            (userStoreType: UserStoreType) => userStoreType.typeName === _userStoreType
        )?.typeId;
    }, [ userStoreTypeList, userStoreImplType ]);

    /**
     * Checks and validate the user store type query parameter.
     * If the query parameter is invalid or the user store type is not supported, redirects.
     */
    useEffect(() => {
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
        setActiveStep(0);
        setUserStoreFormData(initialUserStoreFormData);
    }, [ userStoreImplTypeQueryParam ]);

    /**
     * Handles the user store type request error.
     */
    useEffect(() => {
        if (userStoreTypeRequestError) {
            dispatch(
                addAlert({
                    description: t("remoteUserStores:notifications.typesFetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("remoteUserStores:notifications.typesFetchError.message")
                })
            );
        }
    }, [ userStoreTypeRequestError ]);

    /**
     * Handles the user store creation.
     *
     * @param data - User store creation data.
     */
    const handleUserStoreRegistration = (data: UserStorePostData) => {
        setIsUserStoreCreateRequestLoading(true);
        addUserStore(data)
            .then((response: UserStore) => {
                dispatch(
                    addAlert({
                        description: t(
                            "remoteUserStores:pages.create.notifications.createUserStore.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("remoteUserStores:pages.create.notifications.createUserStore.success.message")
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
                        "#tab=guide"
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
                        description: t(
                            "remoteUserStores:pages.create.notifications.createUserStore.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("remoteUserStores:pages.create.notifications.createUserStore.genericError.message")
                    })
                );

                setIsUserStoreCreateRequestLoading(false);
            });
    };

    /**
     * Handles the general details form submission.
     * @param values - Step 01 form values.
     */
    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        setUserStoreFormData((prevData: UserStoreFormDataInterface) => ({
            ...prevData,
            generalDetails: values
        }));
        setActiveStep(1);
    };

    /**
     * Handles the configurations form submission.
     * @param values - Step 02 form values.
     */
    const onConfigurationsFormSubmit = (values: ConfigurationsFormValuesInterface) => {
        const _userStoreManager: RemoteUserStoreManagerType = userStoreImplType === RemoteUserStoreImplType.OPTIMIZED
            ? RemoteUserStoreManagerType.RemoteUserStoreManager
            : RemoteUserStoreManagerType.WSOutboundUserStoreManager;

        setUserStoreFormData((prevData: UserStoreFormDataInterface) => ({
            ...prevData,
            configurations: values
        }));

        const userStoreProperties: UserStoreProperty[] = [
            {
                name: RemoteUserStoreConstants.PROPERTY_NAME_CONNECTED_USER_STORE_TYPE,
                value: userStoreFormData.generalDetails.connectedUserStoreType
            },
            {
                name: RemoteUserStoreConstants.PROPERTY_NAME_READ_ONLY,
                value: userStoreFormData.generalDetails.accessType
            },
            {
                name: RemoteUserStoreConstants.PROPERTY_NAME_DISABLED,
                value: "false"
            },
            {
                name: RemoteUserStoreConstants.PROPERTY_NAME_READ_GROUPS,
                value: values.readGroups.toString()
            }
        ];

        if (_userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager) {
            userStoreProperties.push(...[
                {
                    name: RemoteUserStoreConstants.PROPERTY_NAME_USERNAME,
                    value: values.usernameMapping
                },
                {
                    name: RemoteUserStoreConstants.PROPERTY_NAME_USERID,
                    value: values.userIdMapping
                }
            ]);

            if (values.readGroups) {
                userStoreProperties.push(...[
                    {
                        name: RemoteUserStoreConstants.PROPERTY_NAME_GROUPNAME,
                        value: values.groupnameMapping
                    },
                    {
                        name: RemoteUserStoreConstants.PROPERTY_NAME_GROUPID,
                        value: values.groupIdMapping
                    }
                ]);
            }
        }

        const userStorePayload: UserStorePostData = {
            claimAttributeMappings: [
                {
                    claimURI: ClaimManagementConstants.USER_NAME_CLAIM_URI,
                    mappedAttribute: values.usernameMapping
                },
                {
                    claimURI: ClaimManagementConstants.USER_ID_CLAIM_URI,
                    mappedAttribute: values.userIdMapping
                }
            ],
            description: userStoreFormData.generalDetails.description ?? "",
            name: userStoreFormData.generalDetails.name,
            properties: userStoreProperties,
            typeId: userStoreTypeID
        };

        handleUserStoreRegistration(userStorePayload);
    };

    const renderUserStoreImplMessageContent = () => {
        const onNavigate = () => {
            history.push(
                `${remoteUserStoreCreatePath}?${queryParamKey}=${
                    userStoreImplType === RemoteUserStoreImplType.OPTIMIZED
                        ? RemoteUserStoreImplType.CLASSIC
                        : RemoteUserStoreImplType.OPTIMIZED
                }`
            );
        };

        if (userStoreImplType === RemoteUserStoreImplType.OPTIMIZED) {
            return (
                <Trans i18nKey="remoteUserStores:pages.create.message.optimized">
                    This configuration supports Authentication Only. User and group management features are not
                    available in this setup. If user management is an essential requirement, please use
                    the <a onClick={ onNavigate }>Classic User Store Connection</a> instead.
                </Trans>
            );
        }

        return (
            <Trans i18nKey="remoteUserStores:pages.create.message.classic">
                If your requirement is only for authentication, we recommend using
                the <a onClick={ onNavigate }>Optimized User Store Connection</a> for efficiency.
            </Trans>
        );
    };

    /**
     * Renders the loading placeholder.
     */
    const renderLoadingPlaceholder = () => {
        return (
            <Stack spacing={ 3 } data-componentid={ `${testId}-loading-placeholder` }>
                <Skeleton variant="rectangular" height={ 40 } />
                <Stack spacing={ 1 }>
                    <Skeleton variant="rectangular" width={ 210 } height={ 10 } />
                    <Skeleton variant="text" />
                    <Skeleton variant="rectangular" width={ 210 } height={ 10 } />
                    <Skeleton variant="text" />
                    <Skeleton variant="rectangular" width={ 210 } height={ 10 } />
                    <Skeleton variant="text" />
                </Stack>
            </Stack>
        );
    };

    return (
        <PageLayout
            title={ t("remoteUserStores:pages.create.title") }
            contentTopMargin={ true }
            description={ (
                <>
                    { t("remoteUserStores:pages.create.description", { productName }) }
                    <DocumentationLink
                        link={ getLink("manage.userStores.createUserStore.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            className="remote-user-store-create-page-layout"
            backButton={ {
                "data-testid": `${testId}-back-button`,
                onClick: () => {
                    history.push(AppConstants.getPaths().get("USERSTORES"));
                },
                text: t("remoteUserStores:pages.create.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
            data-testid={ `${testId}-page-layout` }
        >
            { isOptimizedImplEnabled && userStoreImplType && (
                <Message
                    content={ renderUserStoreImplMessageContent() }
                    type="info"
                    data-componentid={ `${testId}-configuration-message` }
                    className="remote-user-store-impl-message"
                />
            ) }
            <EmphasizedSegment padded="very">
                { isUserStoreTypesRequestLoading || userStoreTypeRequestError ? (
                    renderLoadingPlaceholder()
                ) : (
                    <Stepper
                        activeStep={ activeStep }
                        orientation="vertical"
                        className="remote-user-store-create-stepper"
                        data-componentid={ `${testId}-stepper` }
                    >
                        <Step>
                            <StepLabel
                                optional={
                                    (<Typography variant="body2">
                                        { t("remoteUserStores:pages.create.stepper.step1.description") }
                                    </Typography>)
                                }
                            >
                                <Typography variant="h4">
                                    { t("remoteUserStores:pages.create.stepper.step1.title") }
                                </Typography>
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
                                    initialValues={ userStoreFormData.generalDetails ?? {} }
                                    onSubmit={ onGeneralDetailsFormSubmit }
                                    data-componentid="remote-user-store-create-general-details-form"
                                />
                                <Button
                                    variant="contained"
                                    disabled={ !hasUserStoreCreatePermissions }
                                    data-componentid={ `${testId}-next-button` }
                                    onClick={ () => {
                                        if (generalUserStoreDetailsFormRef?.current?.triggerSubmit)
                                            generalUserStoreDetailsFormRef.current.triggerSubmit();
                                    } }
                                    loading={ isUserStoreCreateRequestLoading }
                                >
                                    { t("common:next") }
                                </Button>
                            </StepContent>
                        </Step>

                        <Step>
                            <StepLabel
                                optional={
                                    (<Typography variant="body2">
                                        { t("remoteUserStores:pages.create.stepper.step2.description") }
                                    </Typography>)
                                }
                            >
                                <Typography variant="h4">
                                    { t("remoteUserStores:pages.create.stepper.step2.title") }
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <ConfigurationsForm
                                    ref={ configurationsFormRef }
                                    userStoreManager={
                                        userStoreImplType === RemoteUserStoreImplType.OPTIMIZED
                                            ? RemoteUserStoreManagerType.RemoteUserStoreManager
                                            : RemoteUserStoreManagerType.WSOutboundUserStoreManager
                                    }
                                    isReadOnly={ !hasUserStoreCreatePermissions }
                                    initialValues={ userStoreFormData.configurations ?? {} }
                                    onSubmit={ onConfigurationsFormSubmit }
                                    data-componentid="remote-user-store-create-configurations-form"
                                />
                                <div className="step-actions-container">
                                    <Button
                                        variant="outlined"
                                        disabled={ !hasUserStoreCreatePermissions || isUserStoreCreateRequestLoading }
                                        data-componentid={ `${testId}-previous-button` }
                                        onClick={ () => {
                                            setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
                                        } }
                                    >
                                        { t("common:previous") }
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={ !hasUserStoreCreatePermissions }
                                        data-componentid={ `${testId}-finish-button` }
                                        onClick={ () => {
                                            if (configurationsFormRef?.current?.triggerSubmit)
                                                configurationsFormRef.current.triggerSubmit();
                                        } }
                                        loading={ isUserStoreCreateRequestLoading }
                                    >
                                        { t("common:finish") }
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    </Stepper>
                ) }
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default RemoteUserStoreCreatePage;
