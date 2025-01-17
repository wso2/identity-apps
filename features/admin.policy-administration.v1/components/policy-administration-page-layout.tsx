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
import { DnDProvider  } from "@oxygen-ui/react/dnd";
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon } from "@oxygen-ui/react-icons";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Icon } from "semantic-ui-react";
import { PolicyList } from "./policy-list";
import { NewPolicyWizard } from "./wizard/new-policy-wizard";
import { useGetAlgorithm } from "../api/use-get-algorithm";
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

    const [ showAlgorithmModal, setShowAlgorithmModal ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isAlgorithmLoading, setIsAlgorithmLoading  ] = useState<boolean>(false);
    const [ selectedAlgorithm, setSelectedAlgorithm ] = useState<AlgorithmOption>();
    const [ pageInactive, setPageInactive ] = useState<number>(0);
    const [ hasMoreInactivePolicies, setHasMoreInactivePolicies ] = useState<boolean>(true);
    const [ inactivePolicies, setInactivePolicies ] = useState<PolicyInterface[]>([]);
    const [ pageActive, setPageActive ] = useState<number>(0);
    const [ hasMoreActivePolicies, setHasMoreActivePolicies ] = useState<boolean>(true);
    const [ activePolicies, setActivePolicies ] = useState<PolicyInterface[]>([]);

    const {
        data: inactivePolicyArray,
        isLoading: isLoadingInactivePolicies,
        error: inactivePolicyError,
        mutate: mutateInactivePolicy
    } = useGetPolicies(true, pageInactive, false, "*", "ALL");

    const {
        data: activePolicyArray,
        isLoading: isLoadingActivePolicies,
        error: activePolicyError,
        mutate: mutateActivePolicy
    } = useGetPolicies(true, pageActive, true, "*", "ALL");

    const {
        data: algorithm,
        isLoading: isLoadingAlgorithm,
        error: getAlgorithmError,
        mutate: mutateAlgorithm
    } = useGetAlgorithm();

    useEffect(() => {
        if (algorithm) {
            const selectedAlgorithm: AlgorithmOption =
                algorithmOptions.find((option: AlgorithmOption) => option.label === algorithm);

            setSelectedAlgorithm(selectedAlgorithm);
            setIsAlgorithmLoading(false);
        } else {
            setIsAlgorithmLoading(true);
        }
    }, [ algorithm ]);

    useEffect(() => {
        if (!inactivePolicyArray) {
            return;
        }

        const activePolicyIds: string[] = activePolicies.map(
            ((activePolicy: PolicyInterface) => activePolicy.policyId)
        );

        const filteredInactivePolicies: PolicyInterface[] = (inactivePolicyArray.policySet ?? [])
            .filter((policy: PolicyInterface) =>
                policy !== null && !activePolicyIds.includes(policy.policyId)
            );

        if (pageInactive === 0) {
            setInactivePolicies(filteredInactivePolicies);
        } else {
            setInactivePolicies(
                (prev: PolicyInterface[]): PolicyInterface[] => [ ...prev, ...filteredInactivePolicies ]
            );
        }

        if ((pageInactive + 1) >= (inactivePolicyArray.numberOfPages ?? 1)) {
            setHasMoreInactivePolicies(false);
        }

    }, [ inactivePolicyArray, activePolicyArray ]);

    useEffect(() => {
        if (!activePolicyArray){
            return;
        }

        const rawActivePolicies: PolicyInterface[] = activePolicyArray.policySet?.filter(
            (policy: PolicyInterface) => policy !== null) || [];

        if (pageActive === 0) {
            setActivePolicies(rawActivePolicies);
        } else {
            setActivePolicies((prev: PolicyInterface[]): PolicyInterface[] => [ ...prev, ...rawActivePolicies ]);
        }

        if ((pageActive + 1) >= (activePolicyArray.numberOfPages ?? 1)) {
            setHasMoreActivePolicies(false);
        }

    }, [ activePolicyArray ]);


    useEffect(() => {
        setPageInactive(0);
        setHasMoreInactivePolicies(true);
        setInactivePolicies([]);

        setPageActive(0);
        setHasMoreActivePolicies(true);
        setActivePolicies([]);
    }, []);

    const handleListFilter = (query: string): void => {
        // TODO: Add search functionality here
    };


    if (isLoadingActivePolicies || isLoadingInactivePolicies) {
        return (
            <PageLayout
                pageTitle={ t("policyAdministration:title") }
                title={ t("policyAdministration:title") }
                description={ t("policyAdministration:subtitle") }
                className="policy-administration-page"
            >
                <CircularProgress />
            </PageLayout>
        );
    }

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
            action={ (
                !(inactivePolicies?.length <= 0)) &&
                (
                    <Grid container spacing={ 3 } alignItems={ "center" }>
                        <Grid xs={ 6 }>
                            <Button
                                variant={ "outlined" }
                                className="policy-algorithm-btn"
                                onClick={ () => setShowAlgorithmModal(true) }
                            >
                                <GearIcon size={ 20 }/>
                                <Stack direction="column" className="algorithm-txt">
                                    <Typography variant="body1" noWrap>
                                        { t("policyAdministration:buttons.policyAlgorithm") }
                                    </Typography>
                                    { !isAlgorithmLoading && selectedAlgorithm?.label && (
                                        <Typography variant="body2">
                                            { selectedAlgorithm.label }
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
                    <AdvancedSearchWithBasicFilters
                        fill="white"
                        onFilter={ handleListFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("tenants:listing.advancedSearch.form.dropdown.filterAttributeOptions.domain"),
                                value: "domainName"
                            }
                        ] }

                        placeholder={ t("policyAdministration:advancedSearch.placeholder") }
                        defaultSearchAttribute={ "policyName" }
                        defaultSearchOperator="co"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={ 2 } marginTop={ 2 } >
                <Grid xs={ 6 }>
                    <DnDProvider>
                        <Typography variant="h5" className="policy-list-header">Active Policies</Typography>
                        <Card id={ "active-policy-list-container" } className="policy-list-card">
                            <InfiniteScroll
                                next={ fetchMoreActivePolicies }
                                hasMore={ hasMoreActivePolicies }
                                loader={
                                    (<div style={ { textAlign: "center" } }>
                                        <CircularProgress />
                                    </div>)
                                }
                                dataLength={ activePolicies.length }
                                scrollableTarget={ "active-policy-list-container" }
                                style={ { overflow: "unset" } }
                            >
                                <CardContent>
                                    <PolicyList
                                        containerId="1"
                                        policies={ activePolicies } // Use your active policies array
                                        isDraggable={ true }
                                        mutateInactivePolicyList={ mutateInactivePolicy }
                                        mutateActivePolicyList={ mutateActivePolicy }
                                    />
                                </CardContent>
                            </InfiniteScroll>
                        </Card>
                    </DnDProvider>
                </Grid>
                <Grid  xs={ 6 }>
                    <Typography variant="h5" className="policy-list-header">Inactive Policies</Typography>
                    <Card id={ "inactive-policy-list-container" } className="policy-list-card">
                        <InfiniteScroll
                            next={ fetchMoreInactivePolicies }
                            hasMore={ hasMoreInactivePolicies }
                            loader={
                                (<div style={ { textAlign: "center" } }>
                                    <CircularProgress />
                                </div>)
                            }
                            dataLength={ inactivePolicies.length }
                            scrollableTarget={ "inactive-policy-list-container" }
                            style={ { overflow: "unset" } }
                        >
                            <CardContent>
                                <PolicyList
                                    containerId="2"
                                    policies={ inactivePolicies } // Use your inactive policies array
                                    isDraggable={ false } // Non-draggable
                                    mutateInactivePolicyList={ mutateInactivePolicy }
                                    setInactivePolicies={ setInactivePolicies }
                                    setPageInactive={ setPageInactive }
                                    setHasMoreInactivePolicies={ setHasMoreInactivePolicies }
                                    mutateActivePolicyList={ mutateActivePolicy }
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
                        mutateInactivityList={ mutateInactivePolicy }
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
