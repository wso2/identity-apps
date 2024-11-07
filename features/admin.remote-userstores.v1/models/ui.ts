export interface GeneralDetailsFormValuesInterface {
    name: string;
    description: string;
    connectedUserStoreType: string;
    accessType?: string;
}

export interface ConfigurationsFormValuesInterface {
    usernameMapping: string;
    userIdMapping: string;
    readGroups: boolean,
    groupnameMapping?: string;
    groupIdMapping?: string;
}
