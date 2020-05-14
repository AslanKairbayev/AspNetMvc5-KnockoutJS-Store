function formatCurrency(value) {
    return "$" + value.toFixed(2);
}

function ProductViewModel() {

    var self = this;
    
    self.Product = {
        Id: ko.observable(),
        Name: ko.observable().extend({ required: true }),
        Description: ko.observable().extend({ required: true }),
        Price: ko.observable().extend({ required: true, number: true }),
        Category: ko.observable()
    };  

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        errorClass: 'errorStyle',
        messageTemplate: null
    }, true);

    self.isNewRecord = false;

    self.confirm = false;
    
    self.product = function (product) {
        if (product != null) {
            self.Product.Id(product.Id);
            self.Product.Name(product.Name);
            self.Product.Description(product.Description);
            self.Product.Price(product.Price);
            self.Product.Category(product.Category);
        } else {
            self.Product.Id(0);
            self.Product.Name("");
            self.Product.Description("");
            self.Product.Price("");
            self.Product.Category("");
            self.Errors.showAllMessages(false);
        }  
    }

    self.Products = ko.observableArray();
    self.Categories = ko.observableArray();

    self.ReadOnlyTemplate = ko.observable("readOnlyTemplate");
    self.EditTemplate = ko.observable("editTemplate");

    self.CurrentTemplate = function (tmpl) {
        return self.isNewRecord || tmpl.Id === self.Product.Id() ? self.EditTemplate() :
            self.ReadOnlyTemplate();
    }    

    $.ajax({
        url: "/api/products",
        type: "GET",
        success: function (data) {
            self.Products(data);
        }
    });

    $.ajax({
        type: "GET",
        url: "/admin/getcategories",
        success: function (data) {
            self.Categories(data);
        }
    });

    self.add = function () {
        if (self.Product.Id != null) {
            self.cancel();
        }
        if (!self.isNewRecord) {
            self.isNewRecord = true;
            self.Products.push(self.Product);
        }
    }

    self.edit = function (product) {
        if (self.isNewRecord) {
            self.cancel();
        }
        self.product(product);
    }

    self.save = function () {
        if (self.Errors().length === 0) {
            if (self.isNewRecord) {
                self.Products.pop();
                $.ajax({
                    url: "/api/products",
                    type: "POST",
                    success: function (data) {
                        self.Products.push(data);
                    },
                    data: self.Product
                }); 
                self.isNewRecord = false;                
            } else {
                $.ajax({
                    url: "/api/products",
                    type: "PUT",
                    success: function (data) {
                        for (var i = 0; i < self.Products().length; i++) {
                            if (self.Products()[i].Id == data.Id) {
                                self.Products.replace(self.Products()[i], data);
                                break;
                            }
                        }
                    },
                    data: self.Product
                });
            }
            self.product(null);
        } else {
            self.Errors.showAllMessages();
        }
    }

    self.delete = function (Product) {

        $("#myModal").modal('show');       

        $("#delete").on("click", function () {
            $.ajax({
                url: "/api/products",
                type: "DELETE",
                success: function () {
                    for (var i = 0; i < self.Products().length; i++) {
                        if (self.Products()[i].Id == Product.Id) {
                            self.Products.remove(self.Products()[i]);
                            break;
                        }
                    }
                },
                data: Product
            });
            $("#myModal").modal('hide');
        });

        $("#cancel").on("click", function () {
            $("#myModal").modal('hide');
        });          
    }

    self.cancel = function () {
        if (self.isNewRecord) {
            self.Products.pop();
            self.isNewRecord = false;
        }
        self.product(null);
    }

    self.Errors = ko.validation.group(self.Product);
}

var viewModel = new ProductViewModel();

$(function () {
    ko.applyBindings(viewModel, document.getElementById('AllProducts'));
});

