describe("jquery.temple.js templating", function() {

  it("simple templating - marker on the node and text", function() {

    $('#hello').temple({hello: 'Hello World!'});

    expect($('#hello').html()).toEqual('Hello World!');

  });

});