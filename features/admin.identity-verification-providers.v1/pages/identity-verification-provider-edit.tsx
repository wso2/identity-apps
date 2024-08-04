/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    TabPageLayout
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
    useIDVPTemplateTypeMetadata,
    useIdentityVerificationProvider,
    useUIMetadata
} from "../api";
import { EditIdentityVerificationProvider } from "../components";
import { IdentityVerificationProviderConstants } from "../constants";
import { IDVPTemplateItemInterface } from "../models";
import { handleIDVPFetchRequestError, handleIDVPTemplateTypesLoadError, handleUIMetadataLoadError } from "../utils";

/**
 * Proptypes for the IDVP edit page component.
 */
type IDVPEditPagePropsInterface = IdentifiableComponentInterface;

/**
 * Identity Verification Provider Edit page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const IdentityVerificationProviderEditPage: FunctionComponent<IDVPEditPagePropsInterface> = (
    props: IDVPEditPagePropsInterface & RouteComponentProps
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const [ tabIdentifier, setTabIdentifier ] = useState<string>();
    const [ isAutomaticTabRedirectionEnabled, setIsAutomaticTabRedirectionEnabled ] = useState<boolean>(false);

    const getIDVPId = (pathname : string): string => {

        const path: string[] = pathname.split("/");

        return path[ path.length - 1 ];
    };

    const {
        data: idvp,
        error: idvpFetchError,
        isLoading: isIDVPFetchInProgress,
        mutate: refetchIDVP
    } = useIdentityVerificationProvider(getIDVPId(location.pathname));

    const {
        data: uiMetaData,
        error: uiMetaDataLoadError,
        isLoading: isUIMetadataLoading
    } = useUIMetadata(idvp?.Type);

    const {
        data: idvpTemplateTypeMetadata,
        error: idvpTemplateTypeMetadataLoadError,
        isLoading: isIDVPTemplateTypeMetadataLoading
    } = useIDVPTemplateTypeMetadata(idvp?.Type);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isReadOnly: boolean = useMemo(() => {
        return !hasRequiredScopes(
            featureConfig?.identityVerificationProviders,
            featureConfig?.identityVerificationProviders?.scopes?.update,
            allowedScopes
        );
    }, [ featureConfig, allowedScopes ]);

    const isDeletePermitted: boolean = useMemo(() => {
        return hasRequiredScopes(
            featureConfig?.identityVerificationProviders,
            featureConfig?.identityVerificationProviders?.scopes?.delete,
            allowedScopes
        );
    }, [ featureConfig, allowedScopes ]);

    /**
     * Checks if the user needs to go to a specific tab index.
     */
    useEffect(() => {
        const tabName: string =  location.state as string;

        if (!tabName) {
            return;
        } else {
            setIsAutomaticTabRedirectionEnabled(true);
            setTabIdentifier(tabName);
        }
    }, []);

    /**
     * Show error notification if the API encounters an error while fetching the IDVP.
     */
    useEffect(() => {
        if (!idvpFetchError) {
            return;
        }
        handleIDVPFetchRequestError(idvpFetchError);
    }, [ idvpFetchError ]);

    /**
     * Show error notification if the API encounters an error while fetching the UI metadata for IDVP.
     */
    useEffect(() => {
        if(!uiMetaDataLoadError){
            return;
        }
        handleUIMetadataLoadError(uiMetaDataLoadError);
    }, [ uiMetaDataLoadError ]);

    /**
     * Show error notification if the API encounters an error while fetching the IDVP template types.
     */
    useEffect(() => {
        if(!idvpTemplateTypeMetadataLoadError){
            return;
        }
        handleIDVPTemplateTypesLoadError(idvpTemplateTypeMetadataLoadError);
    }, [ idvpTemplateTypeMetadataLoadError ]);

    /**
     * Handles the back button click event.
     *
     * @returns void
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get(IdentityVerificationProviderConstants.IDVP_PATH));
    };

    /**
     * Called when an identity verification provider is deleted.
     *
     * @returns void
     */
    const onIdentityVerificationProviderDelete = (): void => {

        history.push(AppConstants.getPaths().get(IdentityVerificationProviderConstants.IDVP_PATH));
    };

    /**
     * Called when an identity verification provider updates.
     *
     * @returns void
     */
    const onIdentityVerificationProviderUpdate = async () => {
        await refetchIDVP();
    };

    /**
     * Resolves the identity verification provider image.
     *
     * @param idvpTemplateType - Evaluating idvpTemplateType.
     * @returns React element containing IDVP image.
     */
    const resolveIDVPImage = (idvpTemplateType: IDVPTemplateItemInterface): ReactElement => {

        if (!idvpTemplateType) {
            return (
                <AppAvatar
                    hoverable={ false }
                    isLoading={ true }
                    size="tiny"
                />
            );
        }

        if (idvpTemplateType.image) {
            return (
                <AppAvatar
                    hoverable={ false }
                    name={ idvpTemplateType.name }
                    image={ idvpTemplateType.image }
                    size="tiny"
                />
            );
        }

        return (
            <AnimatedAvatar
                hoverable={ false }
                name={ idvpTemplateType.name }
                size="tiny"
                floated="left"
            />
        );


    };

    return (
        <TabPageLayout
            pageTitle="Edit Identity Verification Provider"
            isLoading={ isIDVPFetchInProgress || isIDVPTemplateTypeMetadataLoading }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            title={ idvp?.Name }
            contentTopMargin={ true }
            description={ idvp?.description }
            image={ resolveIDVPImage(idvpTemplateTypeMetadata) }
            backButton={ {
                "data-componentid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.idvpTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${ componentId }-page-layout` }
        >
            {
                <EditIdentityVerificationProvider
                    identityVerificationProvider={ idvp }
                    isLoading={ isIDVPFetchInProgress || isUIMetadataLoading }
                    onDelete={ onIdentityVerificationProviderDelete }
                    onUpdate={ onIdentityVerificationProviderUpdate }
                    data-testid={ componentId }
                    isReadOnly={ isReadOnly }
                    isDeletePermitted={ isDeletePermitted }
                    isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
                    tabIdentifier={ tabIdentifier }
                    uiMetaData={ uiMetaData }
                />
            }
        </TabPageLayout>
    );
};

/**
 * Default proptypes for the IDVP edit page component.
 */
IdentityVerificationProviderEditPage.defaultProps = {
    "data-componentid": "idvp-edit-page"
};

export default IdentityVerificationProviderEditPage;
