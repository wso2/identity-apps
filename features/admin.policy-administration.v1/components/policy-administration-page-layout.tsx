/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import { DnDProvider } from "@oxygen-ui/react/dnd";
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Icon } from "semantic-ui-react";
import { PolicyList } from "./policy-list";
import { NewPolicyWizard } from "./wizard/new-policy-wizard";
import { useGetEntitlementPolicyCombiningAlgorithm } from "../api/use-get-entitlement-policy-combining-algorithm";
import { useGetPolicies } from "../api/use-get-policies";
import EditPolicyAlgorithmModal from "../components/edit-policy-algorithm/edit-policy-algorithm";
import "./policy-administration-page-layout.scss";
import { AlgorithmOption, PolicyInterface } from "../models/policies";
import { algorithmOptions } from "../utils/policy-algorithms";

/**
 * Props interface of {@link PolicyAdministrationPageLayout}
 */
type PolicyAdministrationPageLayoutProps = IdentifiableComponentInterface;

/**
 * Component to wrap the page layout of the tenant listing page that can access the tenant context.
 *
 * @param props - Props injected to the component.
 * @returns Tenant page layout.
 */
const PolicyAdministrationPageLayout: FunctionComponent<PolicyAdministrationPageLayoutProps> = ({
    ["data-componentid"]: componentId = "policy-administration-page-layout"
}: PolicyAdministrationPageLayoutProps): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const inactiveScrollRef: MutableRefObject<HTMLDivElement> = useRef(null);
    const activeScrollRef: MutableRefObject<HTMLDivElement> = useRef(null);

    const [ showAlgorithmModal, setShowAlgorithmModal ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedAlgorithm, setSelectedAlgorithm ] = useState<AlgorithmOption>(null);
    const [ pageInactive, setPageInactive ] = useState<number>(0);
    const [ hasMoreInactivePolicies, setHasMoreInactivePolicies ] = useState<boolean>(true);
    const [ inactivePolicies, setInactivePolicies ] = useState<Map<string, PolicyInterface>>(
        new Map<string, PolicyInterface>());
    const [ pageActive, setPageActive ] = useState<number>(0);
    const [ hasMoreActivePolicies, setHasMoreActivePolicies ] = useState<boolean>(true);
    const [ activePolicies, setActivePolicies ] = useState<Map<string, PolicyInterface>>(
        new Map<string, PolicyInterface>());
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ submittedSearchQuery, setSubmittedSearchQuery ] = useState<string>("");
    const activePageRequestHistory: MutableRefObject<Map<number, boolean>> = useRef<Map<number, boolean>>(
        new Map<number, boolean>());
    const inactivePageRequestHistory: MutableRefObject<Map<number, boolean>> = useRef<Map<number, boolean>>(
        new Map<number, boolean>());

    const {
        data: inactivePolicyArray,
        error: inactivePolicyError,
        mutate: mutateInactivePolicies
    } = useGetPolicies(true, pageInactive, false, submittedSearchQuery, "ALL");

    const {
        data: activePolicyArray,
        error: activePolicyError,
        mutate: mutateActivePolicies
    } = useGetPolicies(true, pageActive, true, submittedSearchQuery, "ALL");

    const {
        data: algorithm,
        isLoading: isAlgorithmLoading,
        mutate: mutateAlgorithm
    } = useGetEntitlementPolicyCombiningAlgorithm();

    useEffect(() => {
        if (algorithm) {
            const selectedAlgorithm: AlgorithmOption =
                algorithmOptions.find((option: AlgorithmOption) => option.id === algorithm);

            setSelectedAlgorithm(selectedAlgorithm);
        }
    }, [ algorithm ]);

    useEffect(() => {
        if (!inactivePolicyArray?.policySet || !inactivePageRequestHistory.current.has(pageInactive)) {
            inactivePageRequestHistory.current.set(pageInactive, true);

            return;
        }

        const newInactivePolicies: Map<string, PolicyInterface> = pageInactive === 0
            ? new Map<string, PolicyInterface>() : new Map(inactivePolicies);

        inactivePolicyArray.policySet.forEach((policy: PolicyInterface) =>
            newInactivePolicies.set(policy.policyId, policy));
        setInactivePolicies(newInactivePolicies);

        if ((pageInactive + 1) >= inactivePolicyArray.numberOfPages) {
            setHasMoreInactivePolicies(false);
        } else {
            setHasMoreInactivePolicies(true);
        }
    }, [ inactivePolicyArray ]);

    useEffect(() => {
        if (!activePolicyArray?.policySet || !activePageRequestHistory.current.has(pageActive)){
            activePageRequestHistory.current.set(pageActive, true);

            return;
        }

        const newActivePolicies: Map<string, PolicyInterface> = pageActive === 0
            ? new Map<string, PolicyInterface>() : new Map(activePolicies);

        activePolicyArray.policySet.forEach((policy: PolicyInterface) =>
            newActivePolicies.set(policy.policyId, policy));
        setActivePolicies(newActivePolicies);

        if ((pageActive + 1) >= activePolicyArray.numberOfPages) {
            setHasMoreActivePolicies(false);
        } else {
            setHasMoreActivePolicies(true);
        }
    }, [ activePolicyArray ]);

    if (activePolicyError || inactivePolicyError) {
        return (
            <PageLayout
                pageTitle={ t("policyAdministration:title") }
                title={ t("policyAdministration:title") }
                description={ t("policyAdministration:subtitle") }
                className="policy-administration-page"
            >
                <Typography>{ t("common:errorLoadingData") }</Typography>
            </PageLayout>
        );
    }

    const fetchMoreActivePolicies = (): void => {
        setPageActive((prevPage: number) => prevPage + 1);
    };

    const fetchMoreInactivePolicies = (): void => {
        setPageInactive((prevPage: number) => prevPage + 1);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPageActive(0);
        setPageInactive(0);
        activeScrollRef.current.scrollTo({ behavior: "smooth", top: 0 });
        inactiveScrollRef.current.scrollTo({ behavior: "smooth", top: 0 });
        setSubmittedSearchQuery(searchQuery);
    };

    /**
     * Handle deletion of a policy from the active policy list.
     *
     * @param policyId - The policy ID.
     */
    const handleDeleteActivePolicy = (policyId: string) => {
        const newActivePolicies: Map<string, PolicyInterface> = new Map(activePolicies);

        newActivePolicies.delete(policyId);
        setActivePolicies(newActivePolicies);
        setPageActive(0);
        mutateActivePolicies();
    };

    /**
     * Handle deletion of a policy from the inactive policy list.
     *
     * @param policyId - The policy ID.
     */
    const handleDeleteInactivePolicy = (policyId: string) => {
        const newInactivePolicies: Map<string, PolicyInterface> = new Map(inactivePolicies);

        newInactivePolicies.delete(policyId);
        setInactivePolicies(newInactivePolicies);
        setPageInactive(0);
        mutateInactivePolicies();
    };

    /**
     * Remove a policy from the active policy list and add it to the inactive policy list.
     *
     * @param policyId - The policy ID.
     */
    const handleDeactivatePolicy = (policyId: string) => {
        const newActivePolicies: Map<string, PolicyInterface> = new Map(activePolicies);
        const newInactivePolicies: Map<string, PolicyInterface> = new Map(inactivePolicies);

        newActivePolicies.delete(policyId);
        newInactivePolicies.set(policyId, activePolicies.get(policyId));
        setInactivePolicies(newInactivePolicies);
        setActivePolicies(newActivePolicies);
        setPageActive(0);
        mutateActivePolicies();
    };

    /**
     * Add a policy to the active policy list and remove it from the inactive policy list.
     *
     * @param policyId - The policy ID.
     */
    const handleActivatePolicy = (policyId: string) => {
        const newActivePolicies: Map<string, PolicyInterface> = new Map(activePolicies);
        const newInactivePolicies: Map<string, PolicyInterface> = new Map(inactivePolicies);

        newInactivePolicies.delete(policyId);
        newActivePolicies.set(policyId, inactivePolicies.get(policyId));
        setInactivePolicies(newInactivePolicies);
        setActivePolicies(newActivePolicies);
        setPageInactive(0);
        mutateInactivePolicies();
    };

    const activePoliciesList: PolicyInterface[] = Array.from(activePolicies.values());
    const inactivePoliciesList: PolicyInterface[] = Array.from(inactivePolicies.values());

    return (
        <PageLayout
            pageTitle={ "Policy Administration" }
            title={ t("policyAdministration:title") }
            description={
                (<>
                    { t("policyAdministration:subtitle") }
                    <DocumentationLink link={ getLink("develop.multiTenancy.learnMore") } showEmptyLink={ false }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            action={
                (
                    <Grid container spacing={ 9 } alignItems={ "center" }>
                        <Grid xs={ 6 }>
                            <Button
                                variant={ "outlined" }
                                className="policy-algorithm-btn"
                                onClick={ () => setShowAlgorithmModal(true) }
                            >
                                <GearIcon className="gear-icon" size={ 20 }/>
                                <Stack direction="column" className="algorithm-txt">
                                    <Typography variant="body1" noWrap>
                                        { t("policyAdministration:buttons.policyAlgorithm") }
                                    </Typography>
                                    { !isAlgorithmLoading && (
                                        <Typography variant="body2">
                                            { algorithm }
                                        </Typography>
                                    ) }
                                    { isAlgorithmLoading && <CircularProgress size={ 12 } /> }
                                </Stack>
                            </Button>
                        </Grid>
                        <Grid xs={ 6 }>
                            <PrimaryButton
                                onClick={ () => setShowWizard(true) }
                            >
                                <Icon name="add" />
                                { t("policyAdministration:buttons.newPolicy") }
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                )
            }
            data-componentid={ componentId }
            className="policy-administration-page"
        >
            <Grid container>
                <Grid xs={ 12 } sm={ 12 } md={ 12 } lg={ 12 } xl={ 12 }>
                    <form
                        className="advance-search-form"
                        onSubmit={ handleSubmit }
                    >
                        <div className="search-input-wrapper">
                            <div className="search-box ui left icon input advanced-search">
                                <input
                                    autoComplete="off"
                                    placeholder={ t("policyAdministration:advancedSearch.placeholder") }
                                    maxLength={ 120 }
                                    name="query"
                                    type="text"
                                    className="search-input fluid"
                                    value={ searchQuery }
                                    onChange={ (e: React.FormEvent<HTMLInputElement> ) =>
                                        setSearchQuery((e.target as HTMLInputElement).value)
                                    }
                                    data-componentid={ `${componentId}-search-input` }
                                />
                                <Icon name="search" color="grey"/>
                            </div>
                            <input
                                hidden
                                type="submit"
                                value="Submit"
                                data-componentid={ `${componentId}-search-input-submit` }
                            />
                        </div>
                    </form>

                </Grid>
            </Grid>

            <Grid container spacing={ 2 } marginTop={ 2 }>
                <Grid xs={ 6 }>
                    <DnDProvider>
                        <Typography variant="h5" className="policy-list-header">Active Policies</Typography>
                        <Card
                            ref={ activeScrollRef }
                            id={ "active-policy-list-container" }
                            className="policy-list-card"
                        >
                            <InfiniteScroll
                                next={ fetchMoreActivePolicies }
                                hasMore={ hasMoreActivePolicies }
                                loader={
                                    (<div style={ { textAlign: "center" } }>
                                        <CircularProgress />
                                    </div>)
                                }
                                dataLength={ activePoliciesList.length }
                                scrollableTarget={ "active-policy-list-container" }
                                style={ { overflow: "unset" } }
                            >
                                <CardContent>
                                    <PolicyList
                                        containerId="1"
                                        policies={ activePoliciesList }
                                        isDraggable={ true }
                                        deleteActivePolicy={ handleDeleteActivePolicy }
                                        deactivatePolicy={ handleDeactivatePolicy }
                                    />
                                </CardContent>
                            </InfiniteScroll>
                        </Card>
                    </DnDProvider>
                </Grid>
                <Grid  xs={ 6 }>
                    <Typography variant="h5" className="policy-list-header">Inactive Policies</Typography>
                    <Card
                        ref={ inactiveScrollRef }
                        id={ "inactive-policy-list-container" }
                        className="policy-list-card"
                    >
                        <InfiniteScroll
                            next={ fetchMoreInactivePolicies }
                            hasMore={ hasMoreInactivePolicies }
                            loader={
                                (<div style={ { textAlign: "center" } }>
                                    <CircularProgress />
                                </div>)
                            }
                            dataLength={ inactivePoliciesList?.length }
                            scrollableTarget={ "inactive-policy-list-container" }
                            style={ { overflow: "unset" } }
                        >
                            <CardContent>
                                <PolicyList
                                    containerId="2"
                                    policies={ inactivePoliciesList }
                                    isDraggable={ false }
                                    deleteInactivePolicy={ handleDeleteInactivePolicy }
                                    activatePolicy={ handleActivatePolicy }
                                />
                            </CardContent>
                        </InfiniteScroll>
                    </Card>
                </Grid>
            </Grid>

            {
                showWizard && (
                    <NewPolicyWizard
                        data-componentid="group-mgt-create-group-wizard"
                        open={ showWizard }
                        closeWizard={ () => setShowWizard(false) }
                        mutateInactivityList={ () => {
                            setPageInactive(0);
                            setPageActive(0);
                            setSubmittedSearchQuery("");
                            setSearchQuery("");
                            mutateInactivePolicies();
                            mutateActivePolicies();
                            activeScrollRef.current.scrollTo({ behavior: "smooth", top: 0 });
                            inactiveScrollRef.current.scrollTo({ behavior: "smooth", top: 0 });
                        } }
                    />
                )
            }

            {
                showAlgorithmModal && (
                    <EditPolicyAlgorithmModal
                        data-componentid="edit-policy-algorithm-modal"
                        open={ showAlgorithmModal }
                        closeModal={ () => setShowAlgorithmModal(false) }
                        selectedAlgorithm={ selectedAlgorithm }
                        setSelectedAlgorithm={ setSelectedAlgorithm }
                        algorithmOptions={ algorithmOptions }
                        mutateAlgorithm={ mutateAlgorithm }
                    />
                )
            }
        </PageLayout>
    );
};

export default PolicyAdministrationPageLayout;
