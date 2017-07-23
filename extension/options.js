// Saves options to chrome.storage
function save_options() {
	const dayInput = document.getElementById("dayInput")
	const dayValue = Math.abs(dayInput.value)
	if (isNaN(dayValue) || !Number.isInteger(dayValue)) {
		return
	}

	chrome.storage.sync.get(
		// default here shouldn't be needed
		// but better than not declaring one I guess
		{
			dayValues: [90, 180]
		},
		function(obj) {
			const newValues = [...obj.dayValues, dayValue]

			chrome.storage.sync.set(
				{
					dayValues: newValues
				},
				function() {
					restoreLogic(newValues)
				}
			)
		}
	)
}

// Restores state using the preferences
// stored in chrome.storage.
function restore_options() {
	const defaults = [90, 180]
	chrome.storage.sync.get("dayValues", function(obj) {
		if (!obj.hasOwnProperty("dayValues") || obj.dayValues.length < 1) {
			chrome.storage.sync.set({ dayValues: defaults }, () => {
				restoreLogic(defaults)
			})
		} else {
			restoreLogic(obj.dayValues)
		}
	})
}

function restoreLogic(items) {
	updateRenderedList(items)
	addEventListeners(items)
}

function updateRenderedList(items) {
	const valueList = document.getElementById("values")
	valueList.innerHTML = ""
	items.forEach((value, index) =>
		valueList.insertAdjacentHTML(
			"beforeend",
			`<li><a id="${index}"><i title="Remove Item" class="fa fa-times-circle" aria-hidden="true"></i></a>  ${value} days</li>`
		)
	)
}

function addEventListeners(items) {
	items.forEach((val, index) => {
		const el = document.getElementById(index)
		el.addEventListener("click", () => deleteItem(index))
	})
}

function deleteItem(index) {
	chrome.storage.sync.get("dayValues", function(obj) {
		const newValues = inverseSplice(obj.dayValues, index)
		chrome.storage.sync.set({ dayValues: newValues }, function() {
			restore_options()
		})
	})
}

// returns new array containing all values except value at given index
function inverseSplice(a, index) {
	return [...a.slice(0, index), ...a.slice(index + 1, a.length)]
}

document.addEventListener("DOMContentLoaded", restore_options)
document.getElementById("add").addEventListener("click", save_options)
