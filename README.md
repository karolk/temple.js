Keep your HTML pure!
====================

You don't need to use additional markup in html to create a list of things. Some elements are by nature lists!
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

More live examples:

http://dl.dropbox.com/u/362779/temple.js/index.html
    
Todo:

    * ~~consider removing isCollectionNode and use firstChild as a stencil no matter what tag that is~~
    * ~~start looking for data-templ on the rootNode~~
    * ~~consider scenario where stencil is a leaf node, and simplify stash creation~~
    * ~~convert gist to a project~~
    * partial updates (and real life example)
    * maybe returning augmented stash with references to html nodes
        * last 2 points would require creating "ORM for HTML". Still toying with the idea
