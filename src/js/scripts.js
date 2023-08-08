// Função para buscar e exibir os últimos 5 artigos do feed
function fetchAndDisplayRSSFeed() {
    const rssFeedURL =
        "https://cors.iamnd.eu.org/?url=https://www.aprendaecrie.com/feed";
    const numArticles = 5;
    const rssFeedDiv = document.getElementById("rss-feed");

    fetch(rssFeedURL)
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            const entries = xml.querySelectorAll("entry");
            let articlesHTML = "";

            for (let i = 0; i < Math.min(entries.length, numArticles); i++) {
                const entry = entries[i];
                const title = entry.querySelector("title").textContent;
                const category = entry.querySelector("category").getAttribute("term");
                const link = entry
                    .querySelector('link[rel="alternate"]')
                    .getAttribute("href");
                const summary = entry.querySelector("summary").textContent;
                const updated = entry.querySelector("updated").textContent;
                const author = entry.querySelector("author").textContent;
                const image = entry.querySelector("image").getAttribute("href");
                const dataFormatted = adjustDateToFormatDesired(updated);

                const articleHTML = `
                    <div class="card text-bg-light mb-3">
                        <div class="card-header">
                        <h6><span class="badge text-bg-primary">${category}</span></h6>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title title"><a href="${link}" target="_blank">${title}</a></h5>
                                <a href="${link}" class="title"  target="_blank">
                                    <img src="${image}" class="card-img-top pt-2 pb-4" alt="${title}">
                                </a>                
                            <div class="summary">${summary}</div>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary">Publicado em ${dataFormatted} - por: <b>${author}</b></small>
                        </div>
                    </div>
                    `;

                articlesHTML += articleHTML;
            }

            if (rssFeedDiv) {
                rssFeedDiv.innerHTML += articlesHTML;
            }
        });
}

//Método para ajustar data e hora
function adjustDateToFormatDesired(dateISO) {
    const date = new Date(dateISO);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hour}:${minutes}`;
}



// Carrega os artigos do feed ao abrir a extensão
document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayRSSFeed();
});