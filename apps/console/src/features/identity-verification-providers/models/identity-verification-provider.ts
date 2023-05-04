
export interface IDVPListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    identityVerificationProviders?: IdentityVerificationProviderInterface[];
}

/**
 * Interface for representing an identity verification provider.
 */
export interface IdentityVerificationProviderInterface {
    id?: string;
    Name?: string;
    Type?: string;
    description?: string;
    isEnabled?: boolean;
    image?: string;
    templateId?: string;
}

export interface IDVPResourceEndpointsInterface {
    identityVerificationProviders: string;
}
