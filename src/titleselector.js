// Get references to the input and list elements
const TitleInput = document.getElementById("name")
const TitleList = document.getElementById("ttmenu")
console.log(TitleInput)
console.log(TitleList)
// Load the options from a text file
fetch('title.txt')
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
				TitleInput.value = option;
				TitleList.style.display = 'none';
			});
			TitleList.appendChild(li);
		});
	})
	.catch(error => console.error(error));

// Add event listener for input changes
TitleInput.addEventListener('input', () => {
    console.log("input changed  ")
	// Get the search term and filter the options
	const term = TitleInput.value.toLowerCase();
	const items = TitleList.querySelectorAll('.dropdown-item');
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
TitleInput.addEventListener('click', () => {
	//If the user clicks on the input element, display the list element
	TitleList.style.display = 'block';
	
});
