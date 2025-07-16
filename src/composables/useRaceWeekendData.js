import { ref } from 'vue';
import axios from 'axios';
import { makeRequest } from "@/functions/makeRequest";
import getNext from "@/functions/getNext";

// A map to define the display order of the sessions
const sessionOrder = {
    "Race": 1,
    "Qualifying": 2,
    "Sprint": 3,
    "Sprint Shootout": 4,
    "Practice 3": 5,
    "Practice 2": 6,
    "Practice 1": 7,
};

// Helper to get a sort key for a session
const getSessionSortKey = (sessionName) => sessionOrder[sessionName] || 99;

export function useRaceWeekendData(an, meetingName) {
    const sessions = ref([]);
    const isLoading = ref(true);
    const error = ref(null);

    const fetchDataForWeekend = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            // --- All your data fetching logic is now encapsulated here ---

            const meetingNameSpace = meetingName.replaceAll("-", " ");
            const allRacesRes = await axios.get(`https://api.jolpi.ca/ergast/f1/${an}.json?limit=100`);
            const allRaces = allRacesRes.data.MRData.RaceTable.Races;

            const nrCursa = allRaces.findIndex(r => r.raceName.toLowerCase() === meetingNameSpace);
            if (nrCursa === -1) throw new Error("Race meeting not found.");

            const linkBase = `https://api.jolpi.ca/ergast/f1/${an}/${nrCursa + 1}`;
            const terminare = ".json?limit=100";

            let unifiedSessions = [];
            let modernQualiFound = false;

            // 1. Fetch Modern Data Source
            const raceRes = await axios.get(`${import.meta.env.VITE_API_LINK}/mongo/race-data/all`);
            const sessionKey = raceRes.data[nrCursa].fomRaceId;
            const runda = await getNext;
            const meetingYear = runda.meetingContext.season;
            const meetingPath = sessionKey + "_" + meetingName;
            const base_practice_link = `${import.meta.env.VITE_API_LINK}/api-latest-session-f/view/${meetingYear}/${meetingPath}`;

            if (nrCursa > 9) { // Your condition for using modern API
                const base_data = await makeRequest(base_practice_link).catch(() => null);
                if (base_data?.sessions) {
                    for (const key in base_data.sessions) {
                        const sessionData = base_data.sessions[key].data;
                        if (sessionData.raceResultsPractice1) unifiedSessions.push({ type: 'Practice', data: sessionData.raceResultsPractice1 });
                        if (sessionData.raceResultsPractice2) unifiedSessions.push({ type: 'Practice', data: sessionData.raceResultsPractice2 });
                        if (sessionData.raceResultsPractice3) unifiedSessions.push({ type: 'Practice', data: sessionData.raceResultsPractice3 });
                        if (sessionData.raceResultsQualifying) {
                            unifiedSessions.push({ type: 'Qualifying', data: sessionData.raceResultsQualifying });
                            modernQualiFound = true;
                        }
                        if (sessionData.raceResultsSprintShootout) {
                            unifiedSessions.push({ type: 'SprintShootout', data: sessionData.raceResultsSprintShootout });
                            modernQualiFound = true;
                        }
                    }
                }
            }

            // 2. Fetch Ergast data as primary source or fallback
            const raceDataRes = await axios.get(`${linkBase}/results${terminare}`);
            const raceData = raceDataRes.data.MRData.RaceTable.Races[0];
            if (raceData) {
                raceData.Results.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"));
                unifiedSessions.push({ type: 'Race', data: raceData });
            }

            if (allRaces[nrCursa]?.Sprint) {
                const sprintDataRes = await axios.get(`${linkBase}/sprint${terminare}`);
                const sprintData = sprintDataRes.data.MRData.RaceTable.Races[0];
                if (sprintData) {
                    sprintData.SprintResults.forEach(r => (r.FastestLap = r.FastestLap?.Time?.time || "-"));
                    unifiedSessions.push({ type: 'Sprint', data: sprintData });
                }
            }

            if (!modernQualiFound) {
                const qualiDataRes = await axios.get(`${linkBase}/qualifying${terminare}`);
                const qualiData = qualiDataRes.data.MRData.RaceTable.Races[0];
                if (qualiData) {
                    unifiedSessions.push({ type: 'QualifyingErgast', data: qualiData });
                }
            }

            // Sort all fetched sessions into a logical order
            sessions.value = unifiedSessions.sort((a, b) =>
                getSessionSortKey(a.data.description || a.data.raceName) - getSessionSortKey(b.data.description || b.data.raceName)
            );

        } catch (e) {
            console.error("Failed to fetch race weekend data:", e);
            error.value = e;
        } finally {
            isLoading.value = false;
        }
    };

    fetchDataForWeekend();

    return { sessions, isLoading, error };
}
