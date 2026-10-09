/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { useEffect, useState } from "react";
import { fetchCDSProfileDetails } from "../api/profiles";
import { ProfileModel } from "../models/profiles";
import { ReviewTaskModel } from "../models/review-tasks";

interface ReviewTaskProfilesInterface {
    /**
     * The fetched profiles, keyed by profile id. A profile that could not be fetched is simply
     * absent, so a single failure costs one cell rather than the whole table.
     */
    profiles: Record<string, ProfileModel>;
    isLoading: boolean;
    /**
     * Ids whose profile could not be fetched. A decision taken against these would be taken
     * without the evidence it is supposed to rest on, so callers refuse rather than proceed.
     */
    failedProfileIds: string[];
}

/**
 * Resolves every profile referenced by a page of review tasks.
 *
 * A task carries two profile ids and the names of the attributes that were compared, but not
 * the values behind them — and a row showing two identifiers and a number is not something
 * anyone can decide on. The profiles supply the values.
 *
 * Ids are deduplicated before fetching: one profile commonly appears in several tasks, since
 * a newly written profile can resemble more than one existing one.
 *
 * @param tasks - The tasks currently being shown.
 * @returns The profiles keyed by id, and whether the fetch is still in flight.
 */
const useReviewTaskProfiles = (tasks: ReviewTaskModel[]): ReviewTaskProfilesInterface => {

    const [ profiles, setProfiles ] = useState<Record<string, ProfileModel>>({});
    const [ failedProfileIds, setFailedProfileIds ] = useState<string[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    // Keyed on the ids rather than the array, so re-fetching follows a change of profiles and
    // not merely a new array instance from SWR revalidating to the same result.
    const profileIds: string[] = Array.from(new Set(
        (tasks ?? []).flatMap((task: ReviewTaskModel) => [ task.incoming_profile_id, task.candidate_profile_id ])
    )).sort();
    const profileIdKey: string = profileIds.join(",");

    useEffect(() => {
        if (profileIds.length === 0) {
            setProfiles({});
            setFailedProfileIds([]);

            return;
        }

        let isCurrent: boolean = true;

        setIsLoading(true);

        Promise.all(profileIds.map((id: string) =>
            fetchCDSProfileDetails(id)
                .then((profile: ProfileModel) => profile)
                .catch(() => null)
        ))
            .then((fetched: ProfileModel[]) => {
                if (!isCurrent) {
                    return;
                }

                const resolved: Record<string, ProfileModel> = {};
                const failed: string[] = [];

                fetched.forEach((profile: ProfileModel, index: number) => {
                    if (profile) {
                        resolved[profileIds[index]] = profile;
                    } else {
                        failed.push(profileIds[index]);
                    }
                });

                setProfiles(resolved);
                setFailedProfileIds(failed);
            })
            .finally(() => {
                if (isCurrent) {
                    setIsLoading(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [ profileIdKey ]);

    return { failedProfileIds, isLoading, profiles };
};

export default useReviewTaskProfiles;
