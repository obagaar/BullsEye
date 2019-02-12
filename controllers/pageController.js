 //Constants for the site's tite and array for controller methods to be returned
const controller = {};

const siteTitle = "BullsEye Sporting Goods";

//Directs to main landing page
controller.index = (req, res) => {

    res.render('pages/mainIndex.ejs', {
        siteTitle: siteTitle,
        pageTitle: "",
        item: ''
    });
};

controller.main = (req, res) => {

    res.render('pages/mainDash.ejs', {
        siteTitle: siteTitle,
        pageTitle: "",
        item: ''
    });
};

//Directs to main admin page
controller.admin = (req, res) => {

    res.render('pages/adminIndex.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Administrative Access",
        item: ''
    });
}

//Directs to error page for categories
controller.errCat = (req, res) => {

    res.render('pages/err-cat.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Categories - Error",
        item: ''
    });
}

//Directs to error page for employees
controller.errEmp = (req, res) => {

    res.render('pages/err-emp.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Employees - Error",
        item: ''
    });
}

//Directs to error page for inventory
controller.errInvt = (req, res) => {

    res.render('pages/err-invt.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Inventory - Error",
        item: ''
    });
}

//Directs to error page for items
controller.errItem = (req, res) => {

    res.render('pages/err-item.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Itemss - Error",
        item: ''
    });
}

//Directs to error page for sites
controller.errSite = (req, res) => {

    res.render('pages/err-site.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Sites - Error",
        item: ''
    });
}

//Directs to error page for suppliers
controller.errSupp = (req, res) => {

    res.render('pages/err-supp.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Suppliers - Error",
        item: ''
    });
}

//Exports all methods to be used for routing
module.exports = controller;