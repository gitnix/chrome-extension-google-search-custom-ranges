setTimeout(initData, 800)

function initData() {
	// default set if user has not visited options
	chrome.storage.sync.get({ csr_dayValues: [90, 180] }, obj => {
		const dateVals = obj.csr_dayValues

		const dates = dateVals.map(numDays => {
			const d = new Date()
			d.setDate(d.getDate() - numDays)
			return d
		})

		const dateObjects = dates.map(date => {
			return {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate()
			}
		})

		populateList(dateVals, dateObjects)
	})
}

function populateList(dateVals, dateObjects) {
	dateObjects.forEach((curr, index) => {
		const firstElement = document.getElementById("qdr_")
		const parentElement = firstElement.parentNode

		const newElement = document.createElement("li")

		newElement.setAttribute("class", "hdtbItm")
		newElement.setAttribute("id", `qdr_custom_${index}`)

		newElement.innerHTML = `<a class="q qs" href="${window.location
			.href}&tbs=cdr%3A1%2Ccd_min%3A${curr.month}%2F${curr.day}%2F${curr.year}%2Ccd_max%3A&tbm=">Past ${dateVals[
			index
		]} days</a>`

		parentElement.insertBefore(newElement, parentElement.firstChild)
	})
}
