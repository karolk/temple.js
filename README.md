Keep your HTML pure!
================

You don't need to use additional markup in html to create a list of things. Some elements are by nature lists!
All you need to do in temple.js is create a stencil element, that will be copied as many times as necessary.

    <div id="basket">
        <ul data-templ="shopping-list">
            <li>
                <span data-templ="product_name"></span>
                <span data-templ="product_price"></span>
            </li>
        </ul>
    </div>

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
    }

Because shopping_list is an array, temple.js will copy the first child node of the element associated with this property (ul) and merge it with data strings for each element of the array.

This is how to invoke merging: 

    $('#basket').temple(stash);

Todo:

    * partial updates (and real life example)
    * consider removing isCollectionNode and use firstChild as a stencil no matter what tag that is
    * start looking for data-templ on the rootNode
    * consider scenarion where stencil is a leaf node, and simplify stash creation
    * convert gist to a project
    * maybe returning augmented stash with references to html nodes
