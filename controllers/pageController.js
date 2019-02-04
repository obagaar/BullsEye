const controller = {};

const siteTitle = "BullsEye";

controller.index = (req, res) => {

    res.render('pages/mainDash.ejs', {
        siteTitle: siteTitle,
        pageTitle: "BullsEye Inventory Control System",
        item: ''
    });
};

controller.admin = (req, res) => {

    res.render('pages/adminIndex.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Administrative Access",
        item: ''
    });
}

module.exports = controller;