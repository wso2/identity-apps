/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    TabPageLayout
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { AppConstants, history } from "../../core";
import { useIdentityVerificationProvider } from "../api";
import { useIDVPTemplateTypeMetadata, useUIMetadata } from "../api/ui-metadata";
import { EditIdentityVerificationProvider } from "../components";
import { IDVPTemplateItemInterface } from "../models";
import { handleIDVPTemplateTypesLoadError, handleUIMetadataLoadError } from "../utils";

/**
 * Proptypes for the IDVP edit page component.
 */
type IDVPEditPagePropsInterface = IdentifiableComponentInterface;

/**
 * Identity Verification Provider Edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
const IdentityVerificationProviderEditPage: FunctionComponent<IDVPEditPagePropsInterface> = (
    props: IDVPEditPagePropsInterface & RouteComponentProps
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

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

    useEffect(() => {
        if (!idvpFetchError) {
            return;
        }

        if (idvpFetchError?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.idvp.notifications.getIDVP.error.description",
                        { description: idvpFetchError.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idvp.notifications.getIDVP.error.message")
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t("console:develop.features.idvp.notifications.getIDVP.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.idvp.notifications.getIDVP.genericError.message")
            })
        );

    }, [ idvpFetchError ]);

    useEffect(() => {
        handleUIMetadataLoadError(uiMetaDataLoadError);
    }, [ uiMetaDataLoadError ]);

    useEffect(() => {
        handleIDVPTemplateTypesLoadError(idvpTemplateTypeMetadataLoadError);
    }, [ idvpTemplateTypeMetadataLoadError ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get("IDVP"));
    };

    /**
     * Called when an identity verification provider is deleted.
     */
    const onIdentityVerificationProviderDelete = (): void => {

        history.push(AppConstants.getPaths().get("IDVP"));
    };

    /**
     * Called when an identity verification provider updates.
     */
    const onIdentityVerificationProviderUpdate = async () => {
        await refetchIDVP();
    };

    /**
     * Resolves the identity verification provider image.
     *
     * @param idvpTemplateType - Evaluating idvpTemplateType.
     *
     * @returns React element.
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
                    isReadOnly={ false }
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
