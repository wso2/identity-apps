/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

import { action } from "@storybook/addon-actions";
import * as React from "react";
import { meta } from "./card.stories.meta";
import { InfoCard, LabeledCard, SelectionCard } from "../../index";

export default {
    parameters: {
        component: SelectionCard,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Card"
};

/**
 * Story to display selection card
 *
 * @return {React.ReactElement}
 */
export const SelectionVariation = (): React.ReactElement => (
    <SelectionCard
        id="1"
        image={
            // eslint-disable-next-line max-len
            "data:image/png;base64,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"
        }
        header="Header"
        description="This is a description."
        onClick={ action("Clicked on the card.") }
    />
);

SelectionVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display labeled card
 *
 * @return {React.ReactElement}
 */
export const LabeledCardVariation = (): React.ReactElement => {

    /* eslint-disable max-len */
    const ReactLogo = (
        <svg className="icon" width="14" height="14" viewBox="0 0 256 230" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet">
            <path d="M.754 114.75c0 19.215 18.763 37.152 48.343 47.263-5.907 29.737-1.058 53.706 15.136 63.045 16.645 9.6 41.443 2.955 64.98-17.62 22.943 19.744 46.13 27.514 62.31 18.148 16.63-9.627 21.687-35.221 15.617-65.887 30.81-10.186 48.044-25.481 48.044-44.949 0-18.769-18.797-35.006-47.979-45.052 6.535-31.933.998-55.32-15.867-65.045-16.259-9.376-39.716-1.204-62.996 19.056C104.122 2.205 80.897-4.36 64.05 5.392 47.806 14.795 43.171 39.2 49.097 69.487 20.515 79.452.754 96.057.754 114.75z" fill="#FFF" />
            <path className="path" d="M201.025 79.674a151.364 151.364 0 0 0-7.274-2.292 137.5 137.5 0 0 0 1.124-4.961c5.506-26.728 1.906-48.26-10.388-55.348-11.787-6.798-31.065.29-50.535 17.233a151.136 151.136 0 0 0-5.626 5.163 137.573 137.573 0 0 0-3.744-3.458c-20.405-18.118-40.858-25.752-53.139-18.643-11.776 6.817-15.264 27.06-10.307 52.39a150.91 150.91 0 0 0 1.67 7.484c-2.894.822-5.689 1.698-8.363 2.63-23.922 8.34-39.2 21.412-39.2 34.97 0 14.004 16.4 28.05 41.318 36.566a128.44 128.44 0 0 0 6.11 1.91 147.813 147.813 0 0 0-1.775 8.067c-4.726 24.89-1.035 44.653 10.71 51.428 12.131 6.995 32.491-.195 52.317-17.525 1.567-1.37 3.14-2.823 4.715-4.346a148.34 148.34 0 0 0 6.108 5.573c19.204 16.525 38.17 23.198 49.905 16.405 12.12-7.016 16.058-28.247 10.944-54.078-.39-1.973-.845-3.988-1.355-6.04 1.43-.422 2.833-.858 4.202-1.312 25.904-8.582 42.757-22.457 42.757-36.648 0-13.607-15.77-26.767-40.174-35.168z" fill="#53C1DE" />
            <path d="M195.406 142.328c-1.235.409-2.503.804-3.795 1.187-2.86-9.053-6.72-18.68-11.442-28.625 4.507-9.71 8.217-19.213 10.997-28.208 2.311.67 4.555 1.375 6.717 2.12 20.91 7.197 33.664 17.84 33.664 26.04 0 8.735-13.775 20.075-36.14 27.486zm-9.28 18.389c2.261 11.422 2.584 21.749 1.086 29.822-1.346 7.254-4.052 12.09-7.398 14.027-7.121 4.122-22.35-1.236-38.772-15.368-1.883-1.62-3.78-3.35-5.682-5.18 6.367-6.964 12.73-15.06 18.94-24.05 10.924-.969 21.244-2.554 30.603-4.717.46 1.86.87 3.683 1.223 5.466zm-93.85 43.137c-6.957 2.457-12.498 2.527-15.847.596-7.128-4.11-10.09-19.98-6.049-41.265a138.507 138.507 0 0 1 1.65-7.502c9.255 2.047 19.5 3.52 30.45 4.408 6.251 8.797 12.798 16.883 19.396 23.964a118.863 118.863 0 0 1-4.305 3.964c-8.767 7.664-17.552 13.1-25.294 15.835zm-32.593-61.58c-11.018-3.766-20.117-8.66-26.354-14-5.604-4.8-8.434-9.565-8.434-13.432 0-8.227 12.267-18.722 32.726-25.855a139.276 139.276 0 0 1 7.777-2.447c2.828 9.197 6.537 18.813 11.013 28.537-4.534 9.869-8.296 19.638-11.15 28.943a118.908 118.908 0 0 1-5.578-1.746zm10.926-74.37c-4.247-21.703-1.427-38.074 5.67-42.182 7.56-4.376 24.275 1.864 41.893 17.507 1.126 1 2.257 2.047 3.39 3.13-6.564 7.049-13.051 15.074-19.248 23.82-10.627.985-20.8 2.567-30.152 4.686a141.525 141.525 0 0 1-1.553-6.962zm97.467 24.067a306.982 306.982 0 0 0-6.871-11.3c7.21.91 14.117 2.12 20.603 3.601-1.947 6.241-4.374 12.767-7.232 19.457a336.42 336.42 0 0 0-6.5-11.758zm-39.747-38.714c4.452 4.823 8.911 10.209 13.297 16.052a284.245 284.245 0 0 0-26.706-.006c4.39-5.789 8.887-11.167 13.409-16.046zm-40.002 38.78a285.24 285.24 0 0 0-6.378 11.685c-2.811-6.667-5.216-13.222-7.18-19.552 6.447-1.443 13.322-2.622 20.485-3.517a283.79 283.79 0 0 0-6.927 11.384zm7.133 57.683c-7.4-.826-14.379-1.945-20.824-3.348 1.995-6.442 4.453-13.138 7.324-19.948a283.494 283.494 0 0 0 6.406 11.692 285.27 285.27 0 0 0 7.094 11.604zm33.136 27.389c-4.575-4.937-9.138-10.397-13.595-16.27 4.326.17 8.737.256 13.22.256 4.606 0 9.159-.103 13.64-.303-4.4 5.98-8.843 11.448-13.265 16.317zm46.072-51.032c3.02 6.884 5.566 13.544 7.588 19.877-6.552 1.495-13.625 2.699-21.078 3.593a337.537 337.537 0 0 0 6.937-11.498 306.632 306.632 0 0 0 6.553-11.972zm-14.915 7.15a316.478 316.478 0 0 1-10.84 17.49c-6.704.479-13.632.726-20.692.726-7.031 0-13.871-.219-20.458-.646A273.798 273.798 0 0 1 96.72 133.28a271.334 271.334 0 0 1-9.64-18.206 273.864 273.864 0 0 1 9.611-18.216v.002a271.252 271.252 0 0 1 10.956-17.442c6.72-.508 13.61-.774 20.575-.774 6.996 0 13.895.268 20.613.78a290.704 290.704 0 0 1 10.887 17.383 316.418 316.418 0 0 1 9.741 18.13 290.806 290.806 0 0 1-9.709 18.29zm19.913-107.792c7.566 4.364 10.509 21.961 5.755 45.038a127.525 127.525 0 0 1-1.016 4.492c-9.374-2.163-19.554-3.773-30.212-4.773-6.209-8.841-12.642-16.88-19.1-23.838a141.92 141.92 0 0 1 5.196-4.766c16.682-14.518 32.273-20.25 39.377-16.153z" fill="#FFF" />
            <path className="path" d="M128.221 94.665c11.144 0 20.177 9.034 20.177 20.177 0 11.144-9.033 20.178-20.177 20.178-11.143 0-20.177-9.034-20.177-20.178 0-11.143 9.034-20.177 20.177-20.177" fill="#53C1DE" />
        </svg>
    );
    /* eslint-enable max-len */

    return (
        <LabeledCard
            label="React"
            image={ ReactLogo }
        />
    );
};

LabeledCardVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display info card
 *
 * @return {React.ReactElement}
 */
export const InfoCardVariation = (): React.ReactElement => {

    /* eslint-disable max-len */
    const CSharpLogo = (
        <svg version="1.1" id="c-sharp-logo" className="icon" width="14" height="14" viewBox="0 0 256 288" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
            <g>
                <path d="M255.569,84.452376 C255.567,79.622376 254.534,75.354376 252.445,71.691376 C250.393,68.089376 247.32,65.070376 243.198,62.683376 C209.173,43.064376 175.115,23.505376 141.101,3.86637605 C131.931,-1.42762395 123.04,-1.23462395 113.938,4.13537605 C100.395,12.122376 32.59,50.969376 12.385,62.672376 C4.064,67.489376 0.015,74.861376 0.013,84.443376 C0,123.898376 0.013,163.352376 0,202.808376 C0,207.532376 0.991,211.717376 2.988,215.325376 C5.041,219.036376 8.157,222.138376 12.374,224.579376 C32.58,236.282376 100.394,275.126376 113.934,283.115376 C123.04,288.488376 131.931,288.680376 141.104,283.384376 C175.119,263.744376 209.179,244.186376 243.209,224.567376 C247.426,222.127376 250.542,219.023376 252.595,215.315376 C254.589,211.707376 255.582,207.522376 255.582,202.797376 C255.582,202.797376 255.582,123.908376 255.569,84.452376" fill="#A179DC" fillRule="nonzero"></path>
                <path d="M128.182,143.241376 L2.988,215.325376 C5.041,219.036376 8.157,222.138376 12.374,224.579376 C32.58,236.282376 100.394,275.126376 113.934,283.115376 C123.04,288.488376 131.931,288.680376 141.104,283.384376 C175.119,263.744376 209.179,244.186376 243.209,224.567376 C247.426,222.127376 250.542,219.023376 252.595,215.315376 L128.182,143.241376" fill="#280068" fillRule="nonzero"></path>
                <path d="M255.569,84.452376 C255.567,79.622376 254.534,75.354376 252.445,71.691376 L128.182,143.241376 L252.595,215.315376 C254.589,211.707376 255.58,207.522376 255.582,202.797376 C255.582,202.797376 255.582,123.908376 255.569,84.452376" fill="#390091" fillRule="nonzero"></path>
                <path d="M201.892326,116.294008 L201.892326,129.767692 L215.36601,129.767692 L215.36601,116.294008 L222.102852,116.294008 L222.102852,129.767692 L235.576537,129.767692 L235.576537,136.504534 L222.102852,136.504534 L222.102852,149.978218 L235.576537,149.978218 L235.576537,156.71506 L222.102852,156.71506 L222.102852,170.188744 L215.36601,170.188744 L215.36601,156.71506 L201.892326,156.71506 L201.892326,170.188744 L195.155484,170.188744 L195.155484,156.71506 L181.6818,156.71506 L181.6818,149.978218 L195.155484,149.978218 L195.155484,136.504534 L181.6818,136.504534 L181.6818,129.767692 L195.155484,129.767692 L195.155484,116.294008 L201.892326,116.294008 Z M215.36601,136.504534 L201.892326,136.504534 L201.892326,149.978218 L215.36601,149.978218 L215.36601,136.504534 Z" fill="#FFFFFF"></path>
                <path d="M128.456752,48.625876 C163.600523,48.625876 194.283885,67.7121741 210.718562,96.0819435 L210.558192,95.808876 L169.209615,119.617159 C161.062959,105.823554 146.128136,96.5150717 128.996383,96.3233722 L128.456752,96.3203544 C102.331178,96.3203544 81.1506705,117.499743 81.1506705,143.625316 C81.1506705,152.168931 83.4284453,160.17752 87.3896469,167.094792 C95.543745,181.330045 110.872554,190.931398 128.456752,190.931398 C146.149522,190.931398 161.565636,181.208041 169.67832,166.820563 L169.481192,167.165876 L210.767678,191.083913 C194.51328,219.21347 164.25027,238.240861 129.514977,238.620102 L128.456752,238.625876 C93.2021701,238.625876 62.4315028,219.422052 46.0382398,190.902296 C38.0352471,176.979327 33.4561922,160.837907 33.4561922,143.625316 C33.4561922,91.1592636 75.9884604,48.625876 128.456752,48.625876 Z" fill="#FFFFFF" fillRule="nonzero"></path>
            </g>
        </svg>
    );
    /* eslint-enable max-len */

    return (
        <InfoCard
            header="WSO2"
            subHeader="is-javascript-sdk"
            description="Official javascript wrapper form WSO2 Identity Server Auth APIs."
            image="https://avatars3.githubusercontent.com/u/533043?v=4"
            tags={ [ "wso2", "wso2is", "samples", "identityserver", "iam" ] }
            githubRepoCard={ true }
            githubRepoMetaInfo={ {
                forks: 6623,
                languageLogo: CSharpLogo,
                stars: 34240,
                watchers: 9985
            } }
        />
    );
};

InfoCardVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display info card
 *
 * @return {React.ReactElement}
 */
export const InfoCardFluidVariation = (): React.ReactElement => {

    /* eslint-disable max-len */
    const JavaScriptLogo = (
        <svg className="icon" id="javascript-logo" width="14" height="14" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet">
            <path d="M0 0h256v256H0V0z" fill="#F7DF1E" />
            <path d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996M152.381 211.354l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247L210.29 147.43c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574" />
        </svg>
    );
    /* eslint-enable max-len */

    return (
        <InfoCard
            fluid
            header="WSO2"
            subHeader="is-javascript-sdk"
            description="Official javascript wrapper form WSO2 Identity Server Auth APIs."
            image="https://avatars3.githubusercontent.com/u/533043?v=4"
            tags={ [ "wso2", "wso2is", "samples", "identityserver", "iam" ] }
            githubRepoCard={ true }
            githubRepoMetaInfo={ {
                forks: 6623,
                languageLogo: JavaScriptLogo,
                stars: 34240,
                watchers: 9985
            } }
        />
    );
};

InfoCardFluidVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};
