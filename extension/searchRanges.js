function initData(node) {
	// default set if user has not visited options
	chrome.storage.sync.get({ csr_dayValues: [90, 180] }, obj => {
		let dateVals = obj.csr_dayValues

		let dates = dateVals.map(numDays => {
			let d = new Date()
			d.setDate(d.getDate() - numDays)
			return d
		})

		let dateObjects = dates.map(date => {
			return {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
			}
		})

		populateList(node, dateVals, dateObjects)
	})
}

function populateList(node, dateVals, dateObjects) {
	dateObjects.forEach((curr, index) => {
		let parentElement = node.parentNode

		let newElement = document.createElement('li')

		newElement.setAttribute('class', 'hdtbItm')
		newElement.setAttribute('id', `qdr_custom_${index}`)

		newElement.innerHTML = `<a class="q qs" href="${window.location
			.href}&tbs=cdr%3A1%2Ccd_min%3A${curr.month}%2F${curr.day}%2F${curr.year}%2Ccd_max%3A&tbm=">Past ${dateVals[
			index
		]} days</a>`

		parentElement.insertBefore(newElement, parentElement.firstChild)
	})
}

let Observer = new MutationObserver((mutations, observer) => {
	let hasRun = false
	let index = 0
	mutations.forEach(() => {
		let insertionNode = document.getElementById('qdr_')
		if (insertionNode && !hasRun) {
			observer.disconnect()
			hasRun = true
			initData(insertionNode)
		}
	})
})

Observer.observe(document, { childList: true, subtree: true })
