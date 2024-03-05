// 'npm i' then 'npm run dev' to start server

require('dotenv').config()
const express = require('express')
const app = express()

app.get('/:formId/filteredResponses/:filters?', async (req, res) => {
    const { params: { formId = 'cLZojxk94ous', filters } } = req
	filters = JSON.parse(filters)

    const submissions = await fetch(`https://api.fillout.com/v1/api/forms/${formId}/submissions`, {
        headers: {'Authorization': `Bearer ${process.env.API_KEY}`}
    })
    const data = await submissions.json()
	const { responses } = data;
    const filteredResponses = [];

	responses.forEach( resp => {
		let criteriaMet = 0;
		filters.forEach(filter => {
			const match = resp.questions.find(q => filter.id === q.id)
			if (match) {
				switch (filter.condition) {
					case 'equals':
						if (filter.value === match.value) {
							criteriaMet += 1
						}
						break;
					case 'does_not_equal':
						if (filter.value !== match.value) {
							criteriaMet += 1
						}
						break;
					case 'greater_than':
						if (filter.value > match.value) {
							criteriaMet += 1
						}
						break;
					case 'less_than':
						if (filter.value < match.value) {
							criteriaMet += 1
						}
						break;
					default:
						break;
				}
			
			}
		})
		if (criteriaMet === filters.length) {
			filteredResponses.push(resp)
		}
	})

    res.send(
		{...data, responses: filteredResponses, totalResponses: filteredResponses.length, pageCount: 1 + Math.round(30 / 15)}
	)
})

app.use('*', (req, res) => {
    res.status(404).send('Not found')
})

app.listen(3000)