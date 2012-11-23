Keep your HTML pure!
====================

You don't need to use additional markup in html to create a list of things. Some elements are by nature lists.
All you need to do in temple.js is create a stencil element, that will be copied as many times as necessary.

    <ul id="shopping-list" data-templ="shopping_list">
        <li>
            <span data-templ="product_name"></span>
            <span data-templ="product_price"></span>
        </li>
    </ul>

Create JS object (stash) to populate this tree:

    var stash = {
        shopping_list: [
            {
                product_name: 'Alfajores',
                product_price: 15.99
            },
            {
                product_name: 'Medialunas',
                product_price: 2.99
            },
            {
                product_name: 'Bombones',
                product_price: 15.99
            }
        ]
    };

Because shopping_list is an array, temple.js will copy the first child node of the element associated with this property (ul) and merge it with data strings for each element of the array.

This is how to invoke merging: 

    $('#shopping-list').temple(stash);

Temple.js will also allow you to change attributes (and allow multiple template markers):
	
	<a class="my-link" data-templ="href text"></a>
	
	$('.my-link').temple({
		href: {attr: 'href', value: 'http://www.github.com'},
		text: 'go to github'
	});

With temple.js you don't always have to be explicit about how you want to populate elements, for example form elements will just work, without having to specify attributes
	
	<select class="my-select" data-templ="groups">
		<optgroup data-templ="label opts">
			<option></option>
		</opgroup>
	</select>

	$('my-select').temple({
		groups: [
			{
				label: 'Fish',
				opts: ['Cod', 'Salmon', 'Trout']
			}
		]
	});
	

More live examples:

http://dl.dropbox.com/u/362779/temple.js/index.html

Tests:

http://dl.dropbox.com/u/362779/temple.js/tests/index.html
(please write more, this is only the beginning)
    
Todo:

1. Live stash

There is an experimental branch containing code for live templating. The idea is that the stash very often represents the model, which changes only slighly. For example, the collection:

	['A', 'B', 'C', 'D', 'E', 'F']

can be modified to 
	
	['B', 'A', 'C', 'D', 'E', 'G'] //swap B with A, remove F, add G
	
The templating system should not have to re-render the entire dom tree corresponding to this collection but only manipulate the nodes that were affected.






