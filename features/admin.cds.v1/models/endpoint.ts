export interface CustomerDataServiceEndpointsInterface {
    /**
     * API to get the list of all the profiles and create a new profile.
     */
    profiles: string;
    /**
     * API to get the profile schema. 
     */
    profileSchema: string;
    /**
     * API to get the unification rules.
     */
    unificiationRules: string;
    /**
     * API to get the admin config.
     */
    adminConfig: string;
}