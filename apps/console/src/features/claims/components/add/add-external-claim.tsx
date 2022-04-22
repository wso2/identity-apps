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

import { getAllLocalClaims } from "@wso2is/core/api";
import { AlertLevels, Claim, ClaimsGetParams, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import { Code, ContentLoader, Hint, Link, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownItemProps, DropdownOnSearchChangeData, Grid, Label, Message } from "semantic-ui-react";
import { SCIMConfigs, attributeConfig } from "../../../../extensions";
import { AppConstants, history } from "../../../core";
import { addExternalClaim, getServerSupportedClaimsForSchema } from "../../api";
import { ClaimManagementConstants } from "../../constants";
import { AddExternalClaim } from "../../models";
import { resolveType } from "../../utils";

/**
 * Prop types for the `AddExternalClaims` component.
 */
interface AddExternalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The dialect ID.
     */
    dialectId?: string;
    /**
     * Function to be called to initiate an update.
     */
    update?: () => void;
    /**
     * Specifies if this is called from the wizard.
     */
    wizard?: boolean;
    /**
     * Called on submit.
     */
    onSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * The list of external claims belonging to the dialect.
     */
    externalClaims: ExternalClaim[] | AddExternalClaim[];
    /**
     * Triggers submit externally.
     */
    triggerSubmit?: boolean;
    /**
     * Triggers the cancel method internally.
     */
    cancel?: () => void;
    /**
     * Specifies the type of the attribute.
     */
    attributeType?: string;
    /**
     * Claim dialect URI
     */
    claimDialectUri?: string;
    /**
     * Mapped local claim list
     */
    mappedLocalClaims: string[];
}

/**
 * A component that lets you add an external claim.
 *
 * @param {AddExternalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement} Component.
 */
export const AddExternalClaims: FunctionComponent<AddExternalClaimsPropsInterface> = (
    props: AddExternalClaimsPropsInterface
): ReactElement => {

    const {
        dialectId,
        update,
        wizard,
        onSubmit,
        externalClaims,
        triggerSubmit,
        attributeType,
        claimDialectUri,
        mappedLocalClaims,
        cancel,
        [ "data-testid" ]: testId
    } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();
    const [ filteredLocalClaims, setFilteredLocalClaims ] = useState<Claim[]>();
    const [ localClaimsSearchResults, setLocalClaimsSearchResults ] = useState<Claim[]>();
    const [ serverSupportedClaims, setServerSupportedClaims ] = useState<string[]>([]);
    const [ localClaimsSet, setLocalClaimsSet ] = useState(false);
    const [ claim, setClaim ] = useState<string>("");
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isEmptyClaims, setEmptyClaims ] = useState<boolean>(false);
    const [ serverSideClaimsLoading, setServerSideClaimsLoading ] = useState<boolean>(true);
    const [ isEmptyServerSupportedClaims, setEmptyServerSupportedClaims ] = useState<boolean>(false);

    const [ reset, setReset ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Handle the visibility of button `Add Attribute Mapping` and warning message.
     */
    useEffect(() => {
        if (attributeType !== "oidc"
            && claimDialectUri !== attributeConfig.localAttributes.customDialectURI) {
            if (!serverSupportedClaims  || !filteredLocalClaims || serverSupportedClaims.length === 0
                || filteredLocalClaims.length === 0) {
                setEmptyClaims(true);
            } else {
                setEmptyClaims(false);
            }
        }
    }, [ serverSupportedClaims, filteredLocalClaims ]);


    /**
     * Handle the warning message to be shown.
     */
    useEffect(() => {
        if (SCIMConfigs.serverSupportedClaimsAvailable.includes(claimDialectUri) && 
            serverSupportedClaims?.length === 0) {
            setEmptyServerSupportedClaims(true);
        } else {
            setEmptyServerSupportedClaims(false);
        }
        if (attributeType !== "oidc"
            && claimDialectUri !== attributeConfig.localAttributes.customDialectURI) {
            if (!serverSupportedClaims || serverSupportedClaims.length === 0) {
                setEmptyClaims(false);
            } else {
                if (!filteredLocalClaims || filteredLocalClaims.length === 0) {
                    setEmptyClaims(true);
                } else {
                    setEmptyClaims(false);
                }
            }
        } else if (attributeType !== "oidc" &&
            claimDialectUri === attributeConfig.localAttributes.customDialectURI
            && (!filteredLocalClaims || filteredLocalClaims.length === 0)) {
            setEmptyClaims(true);
        } else {
            setEmptyClaims(false);
        }
    }, [ serverSupportedClaims, filteredLocalClaims ]);

    useEffect(() => {
        if (!SCIMConfigs.serverSupportedClaimsAvailable.includes(claimDialectUri)) {
            setServerSideClaimsLoading(false);

            return;
        }
        fetchServerSupportedClaims().finally();
    }, []);

    const fetchServerSupportedClaims = async (): Promise<void> => {
        setServerSideClaimsLoading(true);

        try {
            const response = await getServerSupportedClaimsForSchema(dialectId);

            setServerSupportedClaims(response.attributes);
        } catch (error) {
            dispatch(addAlert({
                description:
                    error?.response?.data?.description
                    || t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.response?.data?.message
                    || t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
            }));
        } finally {
            setServerSideClaimsLoading(false);
        }
    };

    useEffect(() => {
        // If there's no externalClaims but has serverSupportedClaims
        if (externalClaims && externalClaims.length && !serverSideClaimsLoading) {
            const _extClaims = new Set(externalClaims.map((c) => c.claimURI));

            setServerSupportedClaims([
                ...(serverSupportedClaims ?? []).filter((c) => !_extClaims.has(c))
            ]);
        }
    }, [ externalClaims, serverSideClaimsLoading ]);

    /**
     * Gets the list of local claims.
     */
    useEffect(() => {
        const params: ClaimsGetParams = {
            "exclude-identity-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        setIsLocalClaimsLoading(true);
        getAllLocalClaims(params).then(response => {
            const sortedClaims = response.sort((a: Claim, b: Claim) => {
                return a.displayName > b.displayName ? 1 : -1;
            });

            setLocalClaims(sortedClaims);
            setLocalClaimsSearchResults(sortedClaims);
            setIsLocalClaimsLoading(false);
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
            setIsLocalClaimsLoading(false);
        });
    }, []);

    /**
     * Remove local claims that have already been mapped.
     */
    useEffect(() => {
        if (externalClaims && localClaims) {
            let tempLocalClaims: Claim[] = [ ...localClaims ];

            mappedLocalClaims?.forEach((externalClaim: string) => {
                tempLocalClaims = [ ...removeMappedLocalClaim(externalClaim, tempLocalClaims) ];
            });
            setLocalClaimsSearchResults(tempLocalClaims);
            setFilteredLocalClaims(tempLocalClaims);
        }
    }, [ externalClaims, localClaimsSet ]);

    /**
     * Set `localClaimsSet`to true when `localClaims` is set.
     */
    useEffect(() => {
        localClaims && setLocalClaimsSet(true);
    }, [ localClaims ]);

    /**
     * This removes the mapped local claims from the local claims list.
     *
     * @param {string} claimURI The claim URI of the mapped local claim.
     * @param {Claim[]} claimListToFilter - Claims to filter.
     *
     * @returns {Claim[]} The array of filtered Claims.
     */
    const removeMappedLocalClaim = (claimURI: string, claimListToFilter?: Claim[]): Claim[] => {
        const claimsToFilter = claimListToFilter ? claimListToFilter : localClaims;

        return claimsToFilter?.filter((claim: Claim) => {
            return claim.claimURI !== claimURI;
        });
    };

    return (
        !(isLocalClaimsLoading && serverSideClaimsLoading)
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>) => {
                        if (wizard) {
                            onSubmit(values);
                            setClaim("");
                            setReset();
                        } else {
                            setIsSubmitting(true);
                            addExternalClaim(dialectId, {
                                claimURI: values.get("claimURI").toString(),
                                mappedLocalClaimURI: values.get("localClaim").toString()
                            }).then(() => {
                                dispatch(addAlert(
                                    {
                                        description: t("console:manage.features.claims.external.notifications." +
                                            "addExternalAttribute.success.description",
                                        { type: resolveType(attributeType) }),
                                        level: AlertLevels.SUCCESS,
                                        message: t("console:manage.features.claims.external.notifications." +
                                            "addExternalAttribute.success.message",
                                        { type: resolveType(attributeType, true) })
                                    }
                                ));
                                setReset();
                                update();
                                !wizard && cancel && cancel();
                            }).catch(error => {
                                dispatch(addAlert(
                                    {
                                        description: error?.description
                                            || t("console:manage.features.claims.external.notifications." +
                                                "addExternalAttribute.genericError.description",
                                            { type: resolveType(attributeType) }),
                                        level: AlertLevels.ERROR,
                                        message: error?.message
                                            || t("console:manage.features.claims.external.notifications." +
                                                "addExternalAttribute.genericError.message")
                                    }
                                ));
                            }).finally(() => {
                                setIsSubmitting(false);
                            });
                        }
                    } }
                    resetState={ reset }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 8 }>
                                { SCIMConfigs.serverSupportedClaimsAvailable.includes(claimDialectUri)
                                    ?  (
                                        <Field
                                            name="claimURI"
                                            label={
                                                t("console:manage.features.claims.external.forms." +
                                                "attributeURI.label", {
                                                    type: resolveType(attributeType, true)
                                                })
                                            }
                                            required={ true }
                                            requiredErrorMessage={
                                                t("console:manage.features.claims.external." +
                                                "forms.attributeURI.requiredErrorMessage", {
                                                    type: resolveType(attributeType, true)
                                                })
                                            }
                                            placeholder={ t("console:manage.features.claims.external.forms." +
                                                "attributeURI.placeholder",
                                            { type: resolveType(attributeType) }) }
                                            type={ "dropdown" }
                                            data-testid={ `${ testId }-form-claim-uri-input` }
                                            listen={ (values: Map<string, FormValue>) => {
                                                setClaim(values.get("claimURI").toString());
                                            } }
                                            validation={ (value: string, validation: Validation) => {
                                                for (const claim of externalClaims) {
                                                    if (claim.claimURI === value) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t("console:manage." +
                                                            "features.claims.external.forms.attributeURI." +
                                                            "validationErrorMessages.duplicateName",
                                                        { type: resolveType(attributeType) }));

                                                        break;
                                                    }
                                                }

                                                if (attributeType === ClaimManagementConstants.OIDC) {
                                                    if (!value.toString().match(/^[A-za-z0-9#_]+$/)) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t("console:manage.features." +
                                                            "claims.external.forms.attributeURI." +
                                                            "validationErrorMessages.invalidName",
                                                        { type: resolveType(attributeType) }));
                                                    }
                                                }
                                            } }
                                            children={
                                                serverSupportedClaims?.map((claim: string, index) => {
                                                    return {
                                                        key: index,
                                                        text: claim.split(":").pop(),
                                                        value: claim.split(":").pop()
                                                    };
                                                })
                                                ?? []
                                            }
                                        /> 
                                    ) 
                                    : 
                                    (
                                        <Field
                                            name="claimURI"
                                            label={ t("console:manage.features.claims.external.forms." +
                                                "attributeURI.label",
                                            { type: resolveType(attributeType, true) }) }
                                            required={ true }
                                            requiredErrorMessage={ t("console:manage.features.claims.external" +
                                                ".forms.attributeURI.requiredErrorMessage",
                                            { type: resolveType(attributeType, true) }) }
                                            placeholder={ t("console:manage.features.claims.external.forms." +
                                                "attributeURI.placeholder",
                                            { type: resolveType(attributeType) }) }
                                            type="text"
                                            listen={ (values: Map<string, FormValue>) => {
                                                setClaim(values.get("claimURI").toString());
                                            } }
                                            maxLength={ 30 }
                                            data-testid={ `${ testId }-form-claim-uri-input` }
                                            validation={ (value: string, validation: Validation) => {
                                                for (const claim of externalClaims) {
                                                    if (claim.claimURI === value) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t("console:manage." +
                                                            "features.claims.external.forms.attributeURI." +
                                                            "validationErrorMessages.duplicateName",
                                                        { type: resolveType(attributeType) }));

                                                        break;
                                                    }
                                                }

                                                if (attributeType === ClaimManagementConstants.OIDC) {
                                                    if (!value.toString().match(/^[A-za-z0-9#_]+$/)) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t("console:manage." +
                                                            "features.claims.external.forms.attributeURI." +
                                                            "validationErrorMessages.invalidName",
                                                        { type: resolveType(attributeType) }));
                                                    }
                                                }
                                            } }
                                        />
                                    ) 
                                }

                            </Grid.Column>
                            <Grid.Column width={ 8 }>
                                <Field
                                    loading={ isLocalClaimsLoading }
                                    type="dropdown"
                                    name="localClaim"
                                    label={ t("console:manage.features.claims.external.forms.localAttribute.label") }
                                    required={ true }
                                    requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                        "localAttribute.requiredErrorMessage") }
                                    placeholder={ t("console:manage.features.claims.external.forms." +
                                        "localAttribute.placeholder") }
                                    // prevent default search functionality
                                    search = { (items: DropdownItemProps[]) => {
                                        return items;
                                    } }
                                    onSearchChange={ (event: SyntheticEvent, data: DropdownOnSearchChangeData) => {
                                        const query: string = data.searchQuery;
                                        const itemList: Claim[] = filteredLocalClaims.filter((claim: Claim) =>
                                            claim.displayName.toLowerCase().includes(query.toLowerCase()));

                                        setLocalClaimsSearchResults(itemList);
                                    } }
                                    onClose={ () => {
                                        setLocalClaimsSearchResults(filteredLocalClaims);
                                    } }
                                    children={
                                        localClaimsSearchResults?.map((claim: Claim, index) => {
                                            return {
                                                key: index,
                                                text: (
                                                    <div 
                                                        className="multiline">
                                                        { claim?.displayName }
                                                        <Code 
                                                            className="description" 
                                                            compact 
                                                            withBackground={ false }>
                                                            { claim.claimURI }
                                                        </Code>
                                                    </div> ),
                                                value: claim.claimURI
                                            };
                                        })
                                        ?? []
                                    }
                                    data-testid={ `${ testId }-form-local-claim-dropdown` }
                                />
                            </Grid.Column>
                            <Grid.Column width={ 16 }>
                                {
                                    (attributeType !== ClaimManagementConstants.OIDC && 
                                        attributeType !== ClaimManagementConstants.OTHERS) &&
                                    (
                                        <Label className="mb-3 mt-2 ml-0">
                                            <em>Attribute URI</em>:&nbsp;{ claim ? `${claimDialectUri}:
                                                ${ claim ? claim : "" }` : "" }
                                        </Label>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                        {
                            (isEmptyClaims || isEmptyServerSupportedClaims) && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 16 } textAlign="left" verticalAlign="top">
                                        <Message visible warning>
                                            {
                                                !isEmptyServerSupportedClaims
                                                    ? (
                                                        <Hint warning>
                                                            <Trans
                                                                i18nKey={
                                                                    "console:manage.features.claims.external.forms." +
                                                                    "warningMessage"
                                                                }
                                                            >
                                                                There are no local attributes available for mapping.
                                                                Add new local attributes from
                                                            </Trans>
                                                            <Link
                                                                external={ false }
                                                                onClick={ () =>
                                                                    history.push(AppConstants.getPaths()
                                                                        .get("LOCAL_CLAIMS"))
                                                                }
                                                            > here
                                                            </Link>.
                                                        </Hint>
                                                    ) : (
                                                        <Hint warning>
                                                            <Trans
                                                                i18nKey={
                                                                    "console:manage.features.claims.external.forms." +
                                                                    "emptyMessage"
                                                                }
                                                            >
                                                                All the SCIM attributes are mapped to local claims.
                                                            </Trans>
                                                        </Hint>
                                                    )
                                            }
                                        </Message>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            wizard && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 16 } textAlign="right" verticalAlign="top">
                                        <PrimaryButton
                                            type="submit"
                                            data-testid={ `${ testId }-form-submit-button` }
                                            loading={ isSubmitting }
                                            disabled={ isSubmitting || isEmptyClaims || isEmptyServerSupportedClaims }
                                        >
                                            { t("console:manage.features.claims.external.forms.submit") }
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                    </Grid>
                </Forms>
            ) :
            <ContentLoader/>
    );
};

/**
 * Default props for the component.
 */
AddExternalClaims.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    claimDialectUri: ClaimManagementConstants.CUSTOM_MAPPING,
    "data-testid": "add-external-claims"
};
