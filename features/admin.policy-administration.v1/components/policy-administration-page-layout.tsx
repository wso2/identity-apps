/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import Grid from "@oxygen-ui/react/Grid";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";

import { GearIcon } from "@oxygen-ui/react-icons";
import { AppConstants, history } from "@wso2is/admin.core.v1";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { DnDProvider, useDnD  } from "@wso2is/dnd";
import {
    DataTable,
    DocumentationLink,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { PolicyList } from "./policy-list";
import { NewPolicyWizard } from "./wizard/new-policy-wizard";
import EditPolicyAlgorithmModal from "../components/edit-policy-algorithm/edit-policy-algorithm";
import "./policy-administration-page-layout.scss";
import { useGetAlgorithm } from "../api/useGetAlgorithm";
import { useGetPolicies } from "../api/useGetPolicies";
import InfiniteScroll from "react-infinite-scroll-component";
import {PolicyInterface, PolicyListInterface} from "../models/policies";


interface AlgorithmOption {
    value: number;
    label: string;
    description: string;
}


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


    const { data: inactivePolicyArray, isLoading: isLoadingInactivePolicies, error: inactivePolicyError, mutate: mutateInactivePolicy } = useGetPolicies(true, pageInactive, false, "*", "ALL");
    const { data: activePolicyArray, isLoading: isLoadingActivePolicies, error: activePolicyError } = useGetPolicies(true, 0, true, "*", "ALL");

    const { data: algorithm, isLoading } = useGetAlgorithm();


    const algorithmOptions: AlgorithmOption[] = [
        {
            description: "The deny overrides combining algorithm is intended for those cases where a deny decision" +
                " should have priority over a permit decision.",
            label: "deny-overrides",
            value: 1
        },
        {
            description: "The permit overrides combining algorithm is intended for those cases where a permit " +
                "decision should have priority over a deny decision.",
            label: "permit-overrides",
            value: 2
        }
    ];

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

        if (inactivePolicyArray.policySet?.length) {
            setInactivePolicies((prev: PolicyInterface[]) => [
                ...prev,
                ...inactivePolicyArray.policySet.filter((p) => p !== null)
            ]);
        }

        if ((pageInactive + 1) >= (inactivePolicyArray.numberOfPages ?? 1)) {
            setHasMoreInactivePolicies(false);
        }

    }, [ inactivePolicyArray ]);





    const handleListFilter = (query: string): void => {

    };



    const handleDrop = (targetContainerId: string) => {

    };


    const activePolicies = activePolicyArray?.policySet?.filter((policy) => policy !== null) || [];
    // const inactivePoliciess = inactivePolicyArray?.policySet?.filter((policy) => policy !== null) || [];



    if (isLoadingActivePolicies || isLoadingInactivePolicies) {
        return (
            <PageLayout
                pageTitle={t("policyAdministration:title")}
                title={t("policyAdministration:title")}
                description={t("policyAdministration:subtitle")}
                className="policy-administration-page"
            >
                <CircularProgress />
            </PageLayout>
        );
    }

    if (activePolicyError || inactivePolicyError) {
        return (
            <PageLayout
                pageTitle={t("policyAdministration:title")}
                title={t("policyAdministration:title")}
                description={t("policyAdministration:subtitle")}
                className="policy-administration-page"
            >
                <Typography>{t("common:errorLoadingData")}</Typography>
            </PageLayout>
        );
    }

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
                            <CardContent>
                                <PolicyList
                                    containerId="1"
                                    policies={ activePolicies } // Use your active policies array
                                    onDrop={ handleDrop }
                                    isDraggable={ true } // Draggable
                                />
                            </CardContent>
                        </Card>
                    </DnDProvider>
                </Grid>
                <Grid  xs={ 6 }>
                    <Typography variant="h5" className="policy-list-header">In-Active Policies</Typography>
                    <Card id={ "inactive-policy-list-container" } className="policy-list-card">
                        <InfiniteScroll
                            next={ fetchMoreInactivePolicies }
                            hasMore={ hasMoreInactivePolicies }
                            loader={
                                <div style={ { textAlign: "center" } }>
                                    <CircularProgress />
                                </div>
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
                    />
                )
            }
        </PageLayout>
    );
};

export default PolicyAdministrationPageLayout;
