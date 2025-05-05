<template>
  <div>
    <h2>Documente FIA</h2>
    <ul v-if="documents.length">
      <li v-for="doc in documents" :key="doc.id">
        <a :href="doc.link" target="_blank">{{ doc.title }}</a><br />
        Publicat: {{ doc.date }}
      </li>
    </ul>
    <p v-else>Se încarcă documentele...</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      documents: []
    }
  },
  async mounted() {
    await this.fetchData()
    axios.get('https://cors-anywhere-xafh.onrender.com/https://www.fia.com/decision-document-list/ajax/55041')
        .then(response => {
          // Răspunsul este un JSON care conține documente HTML în 'data'
          const rawHtml = response.data[2].data;

          // Creezi un DOM temporar pentru parsing
          const parser = new DOMParser();
          const doc = parser.parseFromString(rawHtml, 'text/html');
          // Selectezi fiecare bloc de document
          const items = doc.querySelectorAll('.document-row');
          // Extragi datele într-un array simplu
          this.documents = Array.from(items).map(item => {
            const titleEl = item.querySelector('li.document-row > div > a > div.title > div > div > div');
            const dateEl = item.querySelector('.date-display-single');
            const linkEl = item.querySelector('li.document-row > div > a');

            return {
              id: item.getAttribute('data-id') || Math.random(),
              title: titleEl?.textContent.trim() || 'Fără titlu',
              link: "https://www.fia.com" + linkEl?.getAttribute('href') || '#',
              date: dateEl?.textContent.trim() || 'Fără dată'
            }
          });
        })
        .catch(error => {
          console.error('Eroare la preluarea documentelor:', error);
        });
  },
  methods: {
    async fetchData () {
      const date = await axios.get("https://cors-anywhere-xafh.onrender.com/https://f1tv.formula1.com/2.0/R/ENG/WEB_DASH/ALL/PAGE/1724/PRO/2")
      console.log(date.data.resultObj.containers[3].retrieveItems.resultObj.containers)
    }
  },
}
</script>