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

import { hasRequiredScopes } from "@wso2is/core/helpers";
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
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    FeatureConfigInterface,
    history
} from "../../core";
import { useIdentityVerificationProvider } from "../api";
import {useIDVPTemplateTypeMetadata, useUIMetadata} from "../api/ui-metadata";
import { EditIdentityVerificationProvider } from "../components";
import { IDVPTemplateItemInterface, IdentityVerificationProviderInterface } from "../models";
import {handleIDVPTemplateTypesLoadError} from "../utils";

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
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const idvpTemplates: IDVPTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider.templates);
    const idpDescElement: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isDescTruncated, setIsDescTruncated ] = useState<boolean>(false);
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

    const isReadOnly: boolean = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.identityProviders, featureConfig?.identityProviders?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

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

        if (!uiMetaDataLoadError) {
            return;
        }

        if (uiMetaDataLoadError?.response?.data?.description) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.idvp.notifications.getUIMetadata.error.description",
                        { description: uiMetaDataLoadError.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idvp.notifications.getUIMetadata.error.message")
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t("console:develop.features.idvp.notifications.getUIMetadata.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.idvp.notifications.getUIMetadata.genericError.message")
            })
        );

    }, [ uiMetaDataLoadError ]);

    useEffect(() => {
        handleIDVPTemplateTypesLoadError(idvpTemplateTypeMetadataLoadError);
    }, [ idvpTemplateTypeMetadataLoadError ]);

    useEffect(() => {
        /**
         * What's the goal of this effect?
         * To figure out the application's description is truncated or not.
         *
         * A comprehensive explanation is added in {@link ApplicationEditPage}
         * in a similar {@link useEffect}.
         */
        if (idpDescElement || isIDVPFetchInProgress) {
            const nativeElement: HTMLDivElement = idpDescElement.current;

            if (nativeElement && (nativeElement.offsetWidth < nativeElement.scrollWidth)) {
                setIsDescTruncated(true);
            }
        }
    }, [ idpDescElement, isIDVPFetchInProgress ]);


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
    const resolveConnectorImage = (idvpTemplateType: IDVPTemplateItemInterface): ReactElement => {

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
            image={ resolveConnectorImage(idvpTemplateTypeMetadata) }
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
