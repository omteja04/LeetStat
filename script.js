document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetch-btn');
    const usernameInput = document.getElementById('user-input');
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCycle = document.querySelector('#easy-progress');
    const mediumProgressCycle = document.querySelector('#medium-progress');
    const hardProgressCycle = document.querySelector('#hard-progress');
    const easyLabel = document.querySelector('#easy-label');
    const mediumLabel = document.querySelector('#medium-label');
    const hardLabel = document.querySelector('#hard-label');
    const cardStatsContainer = document.querySelector('.stats-container__card');

    // Returns true-or-false based on regex
    function validateUsername(username) {
        if (username.trim() === '') {
            alert('Username should not be empty');
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert('Invalid username');
        }
        return isMatching;
    }

    async function fetchUserStats(username) {
        try {
            fetchButton.textContent = 'Fetching...';
            fetchButton.disabled = true;

            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(url);
            // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            // const targetUrl = 'https://leetcode.com/graphql/';

            // const myHeaders = new Headers();
            // myHeaders.append("Content-Type", "application/json");

            // const graphqlQuery = JSON.stringify({
            //     query: `
            //     query userSessionProgress($username: String!) {
            //         allQuestionsCount {
            //             difficulty
            //             count
            //         }
            //         matchedUser(username: $username) {
            //             submitStats {
            //                 acSubmissionNum {
            //                     difficulty
            //                     count
            //                     submissions
            //                 }
            //                 totalSubmissionNum {
            //                     difficulty
            //                     count
            //                     submissions
            //                 }
            //             }
            //         }
            //     }
            // `,
            //     variables: { username }
            // });

            // const requestOptions = {
            //     method: "POST",
            //     headers: myHeaders,
            //     body: graphqlQuery,
            // };

            // const response = await fetch(proxyUrl + targetUrl, requestOptions);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user details');
            }
            const parsedData = await response.json();
            console.log('Data fetched:', parsedData);
            statsContainer.style.setProperty('display', 'block');
            if (parsedData.status === 'error') {
                throw new Error(`User: ${username} does not exist`);
            }
            displayUserStats(parsedData);
        } catch (err) {
            statsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
            usernameInput.value = '';
            console.error('Error fetching user stats:', err);
        } finally {
            fetchButton.disabled = false;
            fetchButton.textContent = 'Fetch';
        }
    }

    function updateStats(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }
    function displayUserStats(parsedData) {
        const totalEasy = parsedData.totalEasy;
        const totalHard = parsedData.totalHard;
        const totalMedium = parsedData.totalMedium;
        const totalQuestions = parsedData.totalQuestions;
        const easySolved = parsedData.easySolved;
        const mediumSolved = parsedData.mediumSolved;
        const hardSolved = parsedData.hardSolved;
        const totalSolved = parsedData.totalSolved;
        const acceptanceRate = parsedData.acceptanceRate;
        updateStats(easySolved, totalEasy, easyLabel, easyProgressCycle);
        updateStats(mediumSolved, totalMedium, mediumLabel, mediumProgressCycle);
        updateStats(hardSolved, totalHard, hardLabel, hardProgressCycle);

        const cardsData = [
            { label: 'Total Questions', value: totalQuestions },
            { label: 'Solved Questions', value: totalSolved },
            { label: 'Acceptance Rate', value: acceptanceRate },
        ];
        console.log(cardsData);
        cardStatsContainer.innerHTML = cardsData
            .map((data) => {
                return `
                    <div class="card">
                    <h4>${data.label}</h4>
                    <span>${data.value}</span>
                    </div>
                `;
            })
            .join(' ');
    }

    fetchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            console.log('Logging Username: ' + username);
            fetchUserStats(username);
        }
    });
});
