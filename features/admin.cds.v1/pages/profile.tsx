import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { PageLayout, ListLayout, EmptyPlaceholder } from "@wso2is/react-components";
import { useDispatch } from "react-redux";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { Dropdown, DropdownItemProps, DropdownProps, PaginationProps } from "semantic-ui-react";
import axios from "axios";
import ProfilesList from "../components/profile-list";
import { ProfileModel, ApplicationDataItem } from "../models/profile";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";

const ProfilesPage: FunctionComponent = (): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ offset, setOffset ] = useState<number>(1);
    const [ limit, setLimit ] = useState<number>(10);
    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [rules, setRules] = useState([]);
    const [originalRules, setOriginalRules] = useState([]);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ profileList, setProfileList ] = useState<ProfileModel[]>([]);
    const [ error, setError ] = useState<any>(null);

    const [ sortBy, setSortBy ] = useState<DropdownItemProps>({ key: 0, text: "Profile ID", value: "profile_id" });
    const [ sortOrder, setSortOrder ] = useState<boolean>(true); // true = ascending

    useEffect(() => {
        fetchProfiles();
    }, []);
    
    const sortProfiles = (list: ProfileModel[], key: string, ascending: boolean): ProfileModel[] => {
        return [...list].sort((a, b) => {
            const aValue = key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], a) : a[key];
            const bValue = key.includes(".") ? key.split(".").reduce((o, k) => o?.[k], b) : b[key];

            if (aValue < bValue) return ascending ? -1 : 1;
            if (aValue > bValue) return ascending ? 1 : -1;
            return 0;
        });
    };

    const handlePaginationChange = (
        event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps
    ) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    const listItemLimit = 10;

    const paginate = (items: any[], limit: number, offset: number): any[] => {
        return items.slice(offset, offset + limit);
    };

    const normalizeApplicationData = (rawAppData: Record<string, any>): ApplicationDataItem[] => {
        return Object.entries(rawAppData || {}).map(([ id, attributes ]) => ({
            application_id: id,
            attributes
        }));
    };

    const fetchProfiles = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await axios.get("http://localhost:8900/api/v1/profiles");

            const normalized = (res.data || []).map((profile: ProfileModel) => ({
                ...profile,
                application_data: normalizeApplicationData(profile.application_data)
            }));

            const sorted = sortProfiles(normalized, sortBy.value as string, sortOrder);
            setProfileList(sorted);
        } catch (err) {
            console.error("Failed to fetch profiles", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const handleFilter = (query: string): void => {
        setSearchQuery(query);
        setOffset(1);
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
        setProfileList(originalRules);
    };


    const handleItemsPerPageChange = (_: any, data: DropdownProps) => {
        setLimit(data.value as number);
    };

    useEffect(() => {
        fetchProfiles();
    }, [ sortBy, sortOrder ]);

    useEffect(() => {
        if (!profileList) return;

        if (profileList.length > limit) {
            setIsNextPageAvailable(true);
            profileList.splice(-1); // Remove extra
        } else {
            setIsNextPageAvailable(false);
        }
    }, [ profileList ]);

    useEffect(() => {
        if (!error) return;

        handleAlerts({
            level: AlertLevels.ERROR,
            message: "Failed to load profiles",
            description: error?.response?.data?.description ?? "An unexpected error occurred."
        });
    }, [ error ]);

    const handleRuleSearch = (query: string): void => {
        const filtered = originalRules.filter(rule =>
            rule.rule_name?.toLowerCase().includes(query.toLowerCase()) ||
            rule.property_name?.toLowerCase().includes(query.toLowerCase()) ||
            rule.property_scope?.toLowerCase().includes(query.toLowerCase())
        );
        setRules(filtered);
        setSearchQuery(query);
    };

    return (
        <PageLayout
            title="Customer Profiles"
            pageTitle="Customer Profiles"
            description="View and manage unified customer profile data."
            data-testid="profiles-page-layout"
        >
            {profileList.length === 0 && !isLoading ? (
                <EmptyPlaceholder
                    image={getEmptyPlaceholderIllustrations().newList}
                    imageSize="tiny"
                    title="No Customer profiles found" subtitle={""}                />
            ) : (
                <ListLayout
                currentListSize={ profileList?.length ?? 0 }
                listItemLimit={ limit }
                onItemsPerPageDropdownChange={ handleItemsPerPageChange }
                onPageChange={ handlePaginationChange }
                // paginationOptions={{
                //     disableNextButton: !isNextPageAvailable,
                //     showItemsPerPageDropdown: true
                // }}
                totalPages={Math.ceil(profileList.length / listItemLimit)}
                totalListSize={ profileList.length }
                showPagination={ true }
                isLoading={ isLoading }
                data-testid="profiles-list-layout"
                advancedSearch={
                    <AdvancedSearchWithBasicFilters
                        onFilter={handleRuleSearch}
                        filterAttributeOptions={[
                            { key: 0, text: "Profile ID", value: "profile_id" },
                            { key: 1, text: "User ID", value: "user_id" },
                        ]}
                        placeholder="Search by Rule Name or Scope"
                        defaultSearchAttribute="rule_name"
                        defaultSearchOperator="co"
                        triggerClearQuery={triggerClearQuery}
                    />
                    }
                >
                    <ProfilesList
                    profiles={ paginate(profileList, listItemLimit, offset) }
                    isLoading={ isLoading }
                    onRefresh={ fetchProfiles }
                    onSearchQueryClear={handleSearchQueryClear}
                    searchQuery={searchQuery}

                />
                    </ListLayout>  
            )}
                    
                
        </PageLayout>
    );
};

export default ProfilesPage;
