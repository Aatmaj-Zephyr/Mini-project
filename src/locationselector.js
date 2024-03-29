// Get references to the input and list elements
var LocInput = document.getElementById("location")
var LocList = document.getElementById("ddmenu")
console.log(LocInput)
console.log(LocList)
// Load the options from a text file
fetch('locations.txt')
	.then(response => response.text())
	.then(text => {
		// Split the text into an array of options
		const options = text.split('\n');
		
		// Add each option to the list
		options.forEach(option => {
			const li = document.createElement('li');
			li.classList.add('dropdown-item');
			li.textContent = option;
			// Add click event listener to select option
			li.addEventListener('click', () => {
				LocInput.value = option;
				LocList.style.display = 'none';
			});
			LocList.appendChild(li);
		});
	})
	.catch(error => console.error(error));

// Add event listener for input changes
LocInput.addEventListener('input', () => {
    console.log("input changed  ")
	// Get the search term and filter the options
	const term = LocInput.value.toLowerCase();
	const items = LocList.querySelectorAll('.dropdown-item');
	console.log(items);
	items.forEach(item => {
		const text = item.textContent.toLowerCase();
		if (text.indexOf(term) === -1) {
			item.style.display = 'none';
		} else {
			item.style.display = 'block';
		}
	});
});

// Add event listener for click to show the search bar
LocInput.addEventListener('click', () => {
	//If the user clicks on the input element, display the list element
	LocList.style.display = 'block';
	
});
