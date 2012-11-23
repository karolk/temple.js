describe("jquery.temple.js templating", function() {

  it("simple templating - marker on the node and text", function() {

    $('#hello').temple({hello: 'Hello World!'});

    expect($('#hello').html()).toEqual('Hello World!');

  });

  it("passing a jQuery object as a stencil is possible", function() {

    $('#inserted_stencil').temple(
    	{
			links: [
				{link: 'One'},
				{link: 'Two'},
				{link: 'Three'}
			]
    	},
    	$('.templates .stencil')
    );

    expect($('#inserted_stencil li a').length).toEqual(3); //3 plus stencil
    expect($('#inserted_stencil li a').text()).toEqual('OneTwoThree');

  });

});
