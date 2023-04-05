// Get references to the input and list elements
const input = document.querySelector('.dropdown-input');
const list = document.querySelector('.dropdown-list');

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
				input.value = option;
				list.style.display = 'none';
			});
			list.appendChild(li);
		});
	})
	.catch(error => console.error(error));

// Add event listener for input changes
input.addEventListener('input', () => {
	// Get the search term and filter the options
	const term = input.value.toLowerCase();
	const items = list.querySelectorAll('.dropdown-item');
	
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
input.addEventListener('click', () => {
	list.style.display = 'block';
	
});
