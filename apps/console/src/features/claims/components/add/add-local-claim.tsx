/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { getProfileSchemas, getUserStoreList } from "@wso2is/core/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ProfileSchemaInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert, setProfileSchemaRequestLoadingStatus, setSCIMSchemas } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { UserStoreListItem } from "../../../../features/userstores";
import { attributeConfig } from "../../../../extensions";
import { AppState, EventPublisher } from "../../../core";
import { AppConstants } from "../../../core/constants";
import { history } from "../../../core/helpers";
import { addDialect, addExternalClaim, addLocalClaim } from "../../api";
import { getAddLocalClaimWizardStepIcons } from "../../configs";
import { ClaimManagementConstants } from "../../constants";
import { BasicDetailsLocalClaims, MappedAttributes, SummaryLocalClaims } from "../wizard";

/**
 * Prop types for `AddLocalClaims` component
 */
interface AddLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * Open the modal
     */
    open: boolean;
    /**
     * Handler to be called when the modal is closed
     */
    onClose: () => void;
    /**
     * Function to be called to initiate an update
     */
    update: () => void;
    /**
     * The base URI of the claim
     */
    claimURIBase: string;
}

/**
 * A component that lets you add a local claim
 *
 * @param {AddLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AddLocalClaims: FunctionComponent<AddLocalClaimsPropsInterface> = (
    props: AddLocalClaimsPropsInterface
): ReactElement => {

    const {
        open,
        onClose,
        update,
        claimURIBase,
        [ "data-testid" ]: testId
    } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ data, setData ] = useState<Claim>(null);
    const [ basicDetailsData, setBasicDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ mappedAttributesData, setMappedAttributesData ] = useState<Map<string, FormValue>>(null);
    const [ mappedCustomAttribues, setMappedCustomAttribues ] = useState<Map<string, string>>(null);
    const [ showMapAttributes, setShowMapAttributes ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ validateMapping, setValidateMapping ] = useState<boolean>(false);
    const [ scimMapping, setScimMapping ] = useState<boolean>(false);
    const [ oidcMapping, setOidcMapping ] = useState<boolean>(false);
    const [ createdClaim, setCreatedClaim ] = useState<string>(null);

    const hiddenUserStores: string[] = useSelector((state: AppState) => state.config.ui.hiddenUserStores);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const [ userStore, setUserStore ] = useState<UserStoreListItem[]>([]);

    useEffect(() => {
        const userstore: UserStoreListItem[] = [];

        if (attributeConfig.localAttributes.createWizard.showPrimaryUserStore) {
            userstore.push({
                description: "",
                enabled: true,
                id: "PRIMARY",
                name: "PRIMARY",
                self: ""
            });
        }
        getUserStoreList().then((response) => {
            if (hiddenUserStores && hiddenUserStores.length > 0) {
                response.data.map((store: UserStoreListItem) => {
                    if (hiddenUserStores.length > 0 && !hiddenUserStores.includes(store.name)) {
                        userstore.push(store);
                    }
                });
            } else {
                userstore.push(...response.data);
            }
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    /**
     * Conditionally disable map attribute step
     * if there are no secondary user stores.
     */
    useEffect(() => {
        userStore.map((store: UserStoreListItem) => {   
            if ( hiddenUserStores && hiddenUserStores.length > 0 ) {
                attributeConfig.localAttributes.isUserStoresHidden(hiddenUserStores).then(state => {
                    setShowMapAttributes(state.length > 0 && store.enabled);
                });
            } else {
                setShowMapAttributes(true);
            }
        });

    }, [ hiddenUserStores, userStore ]);

    /**
     * Navigate to the claim edit page after adding a claim.
     */
    useEffect(() => {
        if (!oidcMapping || !scimMapping || !createdClaim) {
            return;
        }

        history.push({
            pathname: AppConstants.getPaths().get("LOCAL_CLAIMS_EDIT")
                .replace(":id", createdClaim),
            search: ClaimManagementConstants.NEW_LOCAL_CLAIM_URL_SEARCH_PARAM
        });

        setIsSubmitting(false);
        onClose();
        update();
    }, [ oidcMapping, scimMapping, createdClaim ]);

    /**
     * Submit handler that sends the API request to add the local claim
     */
    const handleSubmit = async (data, customMappings?, skipSCIM?) => {

        if ( attributeConfig.localAttributes.createCustomDialect ) {

            await attributeConfig.localAttributes.isSCIMCustomDialectAvailable().then(available => {
                if (available === "") {
                    addDialect(attributeConfig.localAttributes.customDialectURI);
                }
            });

        }

        setIsSubmitting(true);
        addLocalClaim(data)
            .then((response) => {
                eventPublisher.publish("manage-attribute-add-new-attribute");

                dispatch(addAlert(
                    {
                        description: t("console:manage.features.claims.local.notifications." +
                            "addLocalClaim.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.claims.local.notifications." +
                            "addLocalClaim.success.message")
                    }
                ));

                if (attributeConfig.localAttributes.mapClaimToCustomDialect && customMappings) {

                    if (!skipSCIM) {
                        attributeConfig.localAttributes.isSCIMCustomDialectAvailable().then((claimId: string) => {
                            addExternalClaim(claimId, {
                                claimURI: `${ attributeConfig.localAttributes.customDialectURI
                                }:${ customMappings.get("scim") }`,
                                mappedLocalClaimURI: data.claimURI
                            }).then(() => {
                                fetchUpdatedSchemaList();
                            }).finally(() => setScimMapping(true));
                        });
                    } else {
                        setScimMapping(true);
                    }

                    attributeConfig.localAttributes.getDialect(ClaimManagementConstants.OIDC_MAPPING[ 0 ]).then(
                        response => {
                            addExternalClaim(response.id, {
                                claimURI: `${ customMappings.get("oidc") }`,
                                mappedLocalClaimURI: data.claimURI
                            }).finally(() => setOidcMapping(true));
                        });
                } else {
                    setOidcMapping(true);
                    setScimMapping(true);
                }

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdClaim = location.substring(location.lastIndexOf("/") + 1);

                    setCreatedClaim(createdClaim);

                    return;
                } else {
                    // Fallback to listing, if the location header is not present.
                    // `onClose()` closes the modal and `update()` re-fetches the list.
                    // Check `LocalClaimsPage` component for the respective callback actions.
                    onClose();
                    update();
                    setIsSubmitting(false);
                }
            }).catch((error) => {
                setIsSubmitting(false);
                setAlert(
                    {
                        description: error?.description
                            || t("console:manage.features.claims.local.notifications." +
                                "addLocalClaim.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.claims.local.notifications.addLocalClaim." +
                                "genericError.message")
                    }
                );
            });
    };

    /**
     * Fetch the updated SCIM2 schema list.
     */
    const fetchUpdatedSchemaList = (): void => {
        dispatch(setProfileSchemaRequestLoadingStatus(true));

        getProfileSchemas()
            .then((response: ProfileSchemaInterface[]) => {
                dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.notifications.getProfileSchema.error.message")
                    }));
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.notifications.getProfileSchema.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.notifications.getProfileSchema.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                dispatch(setProfileSchemaRequestLoadingStatus(false));
            });
    };

    /**
     * Handler that is called when the `Basic Details` wizard step is completed
     * @param {Claim} dataFromForm
     * @param {Map<string, FormValue>} values
     */
    const onSubmitBasicDetails = (dataFromForm: Claim, values: Map<string, FormValue>) => {
        const tempData = { ...data, ...dataFromForm };
        const customMappings: Map<string, string> = new Map();
        let skipSCIM = false;

        setData(tempData);
        setBasicDetailsData(values);

        if (values.has("scim") ) {
            customMappings.set("scim", values.get("scim").toString());
        } else {
            skipSCIM = true;
        }

        if (values.has("oidc") ) {
            customMappings.set("oidc", values.get("oidc").toString());
        }

        setMappedCustomAttribues(customMappings);

        if (attributeConfig.localAttributes.createWizard.identifyAsCustomAttrib) {
            if (tempData.properties && tempData.properties.length > 0) {
                tempData.properties.push( {
                    key: "USER_CUSTOM_ATTRIBUTE",
                    value: "TRUE"
                } );
            } else {
                tempData.properties = [ {
                    key: "USER_CUSTOM_ATTRIBUTE",
                    value: "TRUE"
                } ];
            }

        }

        if (!showMapAttributes) {
            tempData.attributeMapping = [
                {
                    mappedAttribute: tempData.claimURI.split("/").pop(),
                    userstore: "PRIMARY"
                }
            ];
            handleSubmit(tempData, customMappings, skipSCIM);
        } else {
            setCurrentWizardStep(1);
        }
    };

    /**
     * Handler that is called when the `Mapped Attributes` step of the wizard is completed
     * @param {Claim} dataFromForm
     * @param {KeyValue[]} values
     */
    const onSubmitMappedAttributes = (dataFromForm: Claim, values: Map<string, FormValue>) => {
        const tempData = { ...data, ...dataFromForm };

        setData(tempData);
        setMappedAttributesData(values);

        if (!attributeConfig.localAttributes.createWizard.showPrimaryUserStore) {
            tempData.attributeMapping.push({
                mappedAttribute: tempData.claimURI.split("/").pop(),
                userstore: "PRIMARY"
            });
        }

        if (!attributeConfig.localAttributes.createWizard.showSummary) {
            handleSubmit(tempData, mappedCustomAttribues);
        } else {
            setCurrentWizardStep(2);
        }
    };

    /**
     * An array of objects that contains data of each step of the wizard
     */
    const STEPS = [
        {
            content: (
                <BasicDetailsLocalClaims
                    submitState={ firstStep }
                    validateMapping={ validateMapping }
                    setValidateMapping={ setValidateMapping }
                    onSubmit={ onSubmitBasicDetails }
                    values={ basicDetailsData }
                    claimURIBase={ claimURIBase }
                    data-testid={ `${ testId }-local-claims-basic-details` }
                />
            ),
            icon: getAddLocalClaimWizardStepIcons().general,
            title: t("console:manage.features.claims.local.wizard.steps.general")
        },
        ( showMapAttributes ?
            {
                content: (
                    <MappedAttributes
                        submitState={ secondStep }
                        onSubmit={ onSubmitMappedAttributes }
                        values={ mappedAttributesData }
                        data-testid={ `${ testId }-mapped-attributes` }
                    />
                ),
                icon: getAddLocalClaimWizardStepIcons().general,
                title: t("console:manage.features.claims.local.wizard.steps.mapAttributes")
            }
            : undefined
        ),
        (
            attributeConfig.localAttributes.createWizard.showSummary
                ? {
                    content: (
                        <SummaryLocalClaims
                            data={ data }
                            data-testid={ `${ testId }-local-claims-summary` }
                        />
                    ),
                    icon: getAddLocalClaimWizardStepIcons().general,
                    title: t("console:manage.features.claims.local.wizard.steps.summary")

                }
                : undefined
        )
    ].filter(el => el !== undefined);

    /**
     * Moves the wizard to the next step
     */
    const next = () => {

        if (STEPS.length === 1) {
            setFirstStep();
        }

        if (STEPS.length === 2) {
            switch (currentWizardStep) {
                case 0:
                    setFirstStep();

                    break;
                case 1:
                    setSecondStep();

                    break;
            }
        }

        switch (currentWizardStep) {
            case 0:
                setFirstStep();

                break;
            case 1:
                setSecondStep();

                break;
            case 2:
                handleSubmit(data);

                break;
        }
    };

    /**
     * Moves wizard to teh previous step
     */
    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    return (
        <Modal
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            open={ open }
            onClose={ onClose }
            data-testid={ testId }
            closeOnDimmerClick={ false }
        >
            <Modal.Header className="wizard-header">
                { t("console:manage.features.claims.local.wizard.header") }
                {
                    basicDetailsData && basicDetailsData.get("name")
                        ? " - " + basicDetailsData.get("name")
                        : ""
                }
            </Modal.Header>
            {
                STEPS.length > 1 && (
                    <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                        <Steps.Group
                            current={ currentWizardStep }
                        >
                            { STEPS.map((step, index) => (
                                <Steps.Step
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }
                                    data-testid={ `${ testId }-step-${ index }` }
                                />
                            )) }
                        </Steps.Group>
                    </Modal.Content >
                )
            }
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    loading={ validateMapping }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("common:next") } <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-finish-button` }
                                    loading={ isSubmitting || validateMapping }
                                    disabled={ isSubmitting }
                                >
                                    { t("common:finish") }</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ previous }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" /> { t("common:previous") }
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal >
    );
};

/**
 * Default props for the component.
 */
AddLocalClaims.defaultProps = {
    "data-testid": "add-local-claims-wizard"
};
