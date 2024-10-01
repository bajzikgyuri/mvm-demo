let jobList = [];
let selectedJob;

async function fetchJobData() {
    try {
        console.log('Fetching job data...');
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
            throw new Error('Invalid data structure in JSON');
        }
        jobList = data.data;
        console.log('Job list:', jobList);
        populateJobList();
        showJobModal();
    } catch (error) {
        console.error('Error fetching job data:', error);
        showErrorModal('Hiba történt az adatok betöltése közben. Kérjük, próbálja újra később.');
    }
}

function showJobModal() {
    console.log('Showing job modal');
    document.getElementById('job-modal').classList.add('modal-open');
    document.getElementById('main-content').classList.add('hidden');
}

function populateJobList() {
    console.log('Populating job list');
    const jobAutocomplete = document.getElementById('job-autocomplete');
    const jobSuggestions = document.getElementById('job-suggestions');

    function renderSuggestions(filteredJobs) {
        jobSuggestions.innerHTML = '';
        filteredJobs.forEach(job => {
            const li = document.createElement('li');
            li.classList.add('cursor-pointer', 'p-2', 'hover:bg-gray-200');
            li.textContent = `${job.Cégnév} - ${getJobTitle(job)}`;
            li.addEventListener('click', () => {
                jobAutocomplete.value = li.textContent;
                jobSuggestions.classList.add('hidden');
            });
            jobSuggestions.appendChild(li);
        });
        jobSuggestions.classList.toggle('hidden', filteredJobs.length === 0);
    }

    function getJobTitle(job) {
        const urlParts = job.URL.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const titlePart = lastPart.replace(/-\d+$/, '');
        return titlePart.replace(/-/g, ' ');
    }

    renderSuggestions(jobList);

    jobAutocomplete.addEventListener('input', function() {
        const value = this.value.trim().toLowerCase();
        console.log('Autocomplete input:', value);
        const filteredJobs = jobList.filter(job => 
            job.Cégnév.toLowerCase().includes(value) || getJobTitle(job).toLowerCase().includes(value)
        );
        console.log('Filtered jobs:', filteredJobs);
        renderSuggestions(filteredJobs);
    });

    document.getElementById('select-job').addEventListener('click', () => {
        const selectedJobText = jobAutocomplete.value.toLowerCase();
        console.log('Selected job text:', selectedJobText);
        const selectedJob = jobList.find(job => {
            const jobText = `${job.Cégnév} - ${getJobTitle(job)}`.toLowerCase();
            return jobText === selectedJobText;
        });
        if (selectedJob) {
            console.log('Job selected:', selectedJob);
            selectJob(selectedJob);
        } else {
            console.log('Invalid job selection');
            showErrorModal('Kérjük, válasszon egy érvényes munkakört a listából.');
        }
    });
}

function selectJob(job) {
    console.log('Selecting job:', job);
    selectedJob = job;
    document.getElementById('job-modal').classList.remove('modal-open');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('selected-job').textContent = `${job.Cégnév} - ${getJobTitle(job)}`;
    populateJobDetails();
    populateImageGallery();
    populateTextPosts();
    animateContent();
}

function showErrorModal(message) {
    console.log('Showing error modal:', message);
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorModal.classList.add('modal-open');
}

function populateJobDetails() {
    console.log('Populating job details for:', selectedJob);
    try {
        const jobDetailsSection = document.getElementById('job-details');
        jobDetailsSection.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="card bg-secondary shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-primary">${selectedJob.Cégnév || 'N/A'}</h3>
                        <p class="text-gray-600">${getJobTitle(selectedJob)}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Munkavégzés helye</h3>
                        <p>${selectedJob['Munkavégzés helye'] || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Szakterület</h3>
                        <p>${selectedJob.Szakterület || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Foglalkoztatás típusa</h3>
                        <p>${selectedJob['Foglalkoztatás típusa'] || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Szerződés típusa</h3>
                        <p>${selectedJob['Szerződés típusa'] || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Napi munkaidő</h3>
                        <p>${selectedJob['Napi munkaidő'] || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl col-span-full">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Bevezető</h3>
                        <p>${selectedJob.Bevezető || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl col-span-full">
                    <div class="card-body">
                        <h3 class="card-title text-primary mb-2">Feladatok</h3>
                        <ul class="list-disc list-inside">
                            ${parseAndRenderList(selectedJob['Feladatok (tömb)'])}
                        </ul>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl md:col-span-1 lg:col-span-2">
                    <div class="card-body">
                        <h3 class="card-title text-primary mb-2">Elvárások</h3>
                        <ul class="list-disc list-inside">
                            ${parseAndRenderList(selectedJob['Elvárások (tömb)'])}
                        </ul>
                    </div>
                </div>
                
                <div class="card bg-secondary shadow-xl md:col-span-1">
                    <div class="card-body">
                        <h3 class="card-title text-primary">Jelentkezési határidő</h3>
                        <p>${selectedJob['Jelentkezési határidő'] || 'N/A'}</p>
                    </div>
                </div>
            </div>
        `;
        console.log('Job details populated');
        animateJobDetails();
    } catch (error) {
        console.error('Error populating job details:', error);
        showErrorModal('Hiba történt a munkakör részleteinek megjelenítésekor.');
    }
}

function animateJobDetails() {
    anime({
        targets: '#job-details .card',
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.9, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
        duration: 800
    });
}

function parseAndRenderList(data) {
    console.log('Parsing and rendering list:', data);
    try {
        let list = [];
        if (Array.isArray(data)) {
            list = data;
        } else {
            list = JSON.parse(data || '[]');
        }
        console.log('Parsed list:', list);
        return list.map(item => `<li>${item}</li>`).join('');
    } catch (error) {
        console.error('Error parsing list data:', error);
        return '<li>Hiba történt az adatok feldolgozásakor</li>';
    }
}

function getJobTitle(job) {
    const urlParts = job.URL.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const titlePart = lastPart.replace(/-\d+$/, '');
    return titlePart.replace(/-/g, ' ');
}

function populateImageGallery() {
    console.log('Populating image gallery');
    try {
        const imageGallerySection = document.getElementById('image-gallery').querySelector('.grid');
        imageGallerySection.innerHTML = '';
        const imageURLs = selectedJob.imageURLs || [];
        console.log('Image URLs:', imageURLs);
        imageURLs.forEach(url => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'relative group image-container';
            imgContainer.innerHTML = `
                <div class="w-full aspect-square overflow-hidden rounded-lg shadow-md">
                    <img src="${url}" alt="Job related image" class="w-full h-full object-cover" onerror="this.style.display='none'">
                </div>
                <button class="btn bg-primary text-white hover:bg-primary-dark btn-sm absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Letöltés</button>
            `;
            imageGallerySection.appendChild(imgContainer);
        });
        console.log('Image gallery populated');
        animateImageGallery();
    } catch (error) {
        console.error('Error populating image gallery:', error);
        showErrorModal('Hiba történt a képgaléria megjelenítésekor.');
    }
} 

function animateImageGallery() {
    anime({
        targets: '#image-gallery .image-container',
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.8, 1],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 800
    });
}

function populateTextPosts() {
    console.log('Populating text posts');
    try {
        const textPostsSection = document.getElementById('text-posts').querySelector('.grid');
        textPostsSection.innerHTML = '';
        const multilineTexts = selectedJob.multilineTexts || [];
        console.log('Multiline texts:', multilineTexts);
        multilineTexts.forEach(post => {
            const postContainer = document.createElement('div');
            postContainer.className = 'card bg-secondary shadow-xl';
            postContainer.innerHTML = `
                <div class="card-body">
                    <p class="text-gray-800">${post.replace(/\n/g, '<br>')}</p>
                    <div class="card-actions justify-end">
                        <button class="btn bg-primary text-white hover:bg-primary-dark btn-sm copy-btn">Másolás</button>
                    </div>
                </div>
            `;
            textPostsSection.appendChild(postContainer);
        });

        setupCopyButtons();
        console.log('Text posts populated');
        animateTextPosts();
    } catch (error) {
        console.error('Error populating text posts:', error);
        showErrorModal('Hiba történt a szöveges bejegyzések megjelenítésekor.');
    }
}

function animateTextPosts() {
    anime({
        targets: '#text-posts .card',
        opacity: [0, 1],
        translateX: [-50, 0],
        scale: [0.9, 1],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 800
    });
}

function setupCopyButtons() {
    console.log('Setting up copy buttons');
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.closest('.card-body').querySelector('p').innerText;
            console.log('Copying text:', text);
            navigator.clipboard.writeText(text).then(() => {
                this.textContent = 'Másolva!';
                setTimeout(() => {
                    this.textContent = 'Másolás';
                }, 2000);
            }).catch(err => {
                console.error('Error copying text: ', err);
                showErrorModal('Nem sikerült a szöveg másolása. Kérjük, próbálja újra.');
            });
        });
    });
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    const changeJobBtn = document.getElementById('change-job');
    changeJobBtn.addEventListener('click', showJobModal);

    window.addEventListener('scroll', updateScrollIndicator);
}

function animateContent() {
    console.log('Animating content');
    anime({
        targets: ['#job-details', '#image-gallery', '#text-posts'],
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuad',
        delay: anime.stagger(200)
    });
}

function updateScrollIndicator() {
    const sections = ['job-details', 'image-gallery', 'text-posts'];
    const indicators = document.querySelectorAll('#scroll-indicator div');

    sections.forEach((section, index) => {
        const element = document.getElementById(section);
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            indicators[index].classList.add('bg-primary');
            indicators[index].classList.remove('bg-gray-300');
        } else {
            indicators[index].classList.remove('bg-primary');
            indicators[index].classList.add('bg-gray-300');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    fetchJobData();
    setupEventListeners();
});