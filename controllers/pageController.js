const controller = {};


controller.index = (req, res) => {

    res.send("Go away. Not done yet.");
};

controller.admin = (req, res) => {

    res.send("Admin page");
}

controller.crud = (req, res) => {

    res.send("crud page");
}

module.exports = controller;