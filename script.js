let selectedFilters = []; // Store selected filters here

function closeJobEntryModal() {
    $("#jobEntryModal").css("display", "none");
}

function clearSearch() {
    selectedFilters = [];
    displaySelectedTags();
    loadAllJobs();
}

$("#addButton").on("click", function () {
    $("#jobEntryModal").css("display", "flex");
});

$("#jobEntryForm").on("submit", function (e) {
    e.preventDefault();

    const job = {
        company: $("#company").val(),
        position: $("#position").val(),
        postedAt: $("#postedAt").val(),
        contract: $("#contract").val(),
        location: $("#location").val(),
        new: $("#new").is(":checked"),
        featured: $("#featured").is(":checked"),
        logo: "./images/favicon-32x32.png",
        languages: [],  // assuming as a placeholder for now
        tools: []      // assuming as a placeholder for now
    };

    // Add the new job card to the top
    console.log(job);

    //show on the page
    let newLabel = job.new ? '<span class="new">NEW!</span>' : '';
    let featuredLabel = job.featured ? '<span class="featured">FEATURED</span>' : '';

    let jobElement = `
                  <div class="job">
                      <img src="${job.logo}" alt="${job.company}">
                      <div class="job-details">
                          <p><strong>${job.company}</strong> ${newLabel} ${featuredLabel}
                            <img class="trashicon" src="./images/trash.png" style="height:20px; width:20px;border-radius:0;" onclick="removeJobCard(this)">
                            </p>
                         <p id="position" onclick="str(${JSON.stringify(job).split('"').join('&quot;')})"><strong>${job.position}</strong></p>
                          <p>${job.postedAt} ${job.contract} ${job.location} </p>
                      </div>
                      <div class="tags">
                          <span class="tag">${job.role}</span>
                          <span class="tag">${job.level}</span>
                          ${job.languages.map(lang => `<span class="tag">${lang}</span>`).join('')}
                          ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                      </div>
                  </div>
              `;

    $(".job-cards-container").append(jobElement);


    // Clear the form
    $("#jobEntryForm")[0].reset();
    closeJobEntryModal();
});




function loadAllJobs() {
    $.getJSON("data.json", function (data) {
        if (selectedFilters.length === 0) {
            displayResults(data);
        } else {
            let filteredJobs = data.filter(job => {
                let jobTags = [job.role, job.level, ...job.languages, ...job.tools].map(tag => tag.toLowerCase());
                return selectedFilters.every(filter => jobTags.includes(filter));
            });
            displayResults(filteredJobs);
        }
    });
}

function str(job) {
    $("#jobModal").css("display", "flex");
    $("#modalDetails").empty();

    let newLabel = job.new ? '<span class="new">NEW!</span>' : '';
    let featuredLabel = job.featured ? '<span class="featured">FEATURED</span>' : '';

    let jobDetails = `
        <img src="${job.logo}" alt="${job.company}">
        <div class="modal-job-details">
          <button style="position: absolute; right: 20px; top: 20px; cursor:pointer;" onclick="closeModal()" >X</button>
            <p><strong>Company:</strong> ${job.company} ${newLabel} ${featuredLabel}</p>
            <p><strong>Position:</strong> ${job.position}</p>
            <p><strong>Posted at:</strong> ${job.postedAt}</p>
            <p><strong>Contract:</strong> ${job.contract}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <div class="modal-tags">
                <span class="tag">${job.role}</span>
                <span class="tag">${job.level}</span>
                ${job.languages.map(lang => `<span class="tag">${lang}</span>`).join('')}
                ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
            </div>
        </div>
    `;
    $("#modalDetails").append(jobDetails);
}


function closeModal() {
    $("#jobModal").css("display", "none");
}

function displayResults(data) {
    $("#results").empty();
    data.forEach(job => {
        let newLabel = job.new ? '<span class="new">NEW!</span>' : '';
        let featuredLabel = job.featured ? '<span class="featured">FEATURED</span>' : '';

        let jobElement = `
                  <div class="job">
                      <img src="${job.logo}" alt="${job.company}">
                      <div class="job-details">
                          <p><strong>${job.company}</strong> ${newLabel} ${featuredLabel}
                            <img class="trashicon" src="./images/trash.png" style="height:20px; width:20px;border-radius:0;" onclick="removeJobCard(this)">
                            </p>
                         <p id="position" onclick="str(${JSON.stringify(job).split('"').join('&quot;')})"><strong>${job.position}</strong></p>
                          <p>${job.postedAt} ${job.contract} ${job.location} </p>
                      </div>
                      <div class="tags">
                          <span class="tag">${job.role}</span>
                          <span class="tag">${job.level}</span>
                          ${job.languages.map(lang => `<span class="tag">${lang}</span>`).join('')}
                          ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                      </div>
                  </div>
              `;
        $("#results").append(jobElement);
    });
}

function removeJobCard(element) {
    $(element).closest('.job').remove();
}

function displaySelectedTags() {
    $("#search-container .search-tag").remove(); // clear old tags first
    selectedFilters.forEach(filter => {
        let tagHTML = `
                    <div class="search-tag">${filter} <span onclick="removeFilter('${filter}')">&times;</span></div>
                `;
        $("#search-container .searchbox").before(tagHTML);
    });
}

function removeFilter(tag) {
    selectedFilters = selectedFilters.filter(filter => filter !== tag);
    displaySelectedTags();
    loadAllJobs();
}

$(document).ready(function () {
    loadAllJobs();
    $("form").on("submit", function (event) {
        event.preventDefault();
        let query = $(".searchbox").val().toLowerCase();

        if (!selectedFilters.includes(query) && query.trim() !== "") {
            selectedFilters.push(query);
            displaySelectedTags();
        }

        $(".searchbox").val(''); // Clear the search box
        loadAllJobs();
    });
});