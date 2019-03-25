const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const orderController = require('../controllers/orderController');
const backorderController = require('../controllers/backorderController');
const supplierorderController = require('../controllers/supplierorderController');

router.get('/', authenticationMiddleware(), orderController.read);
router.get('/add', authenticationMiddleware(), orderController.getAdd);
router.post('/nextadd', authenticationMiddleware(), orderController.nextAdd);
router.post('/additems', authenticationMiddleware(), orderController.addItems);
router.get('/submit/:txnID', authenticationMiddleware(), orderController.getSubmit);
router.get('/delete/:txnID', authenticationMiddleware(), orderController.delete);
router.get('/backorder', authenticationMiddleware(), backorderController.read);
router.get('/editWH/:txnID', authenticationMiddleware(), orderController.editWH);
router.get('/update/:txnID', authenticationMiddleware(), orderController.updateInfo);
router.post('/update/:txnID', authenticationMiddleware(), orderController.updateItems);
router.get('/receive/:txnID', authenticationMiddleware(), orderController.receive);
router.get('/add/supp', authenticationMiddleware(), supplierorderController.getInfo);
router.get('/supplier/submit/:txnID', authenticationMiddleware(), supplierorderController.submitInfo);
router.post('/nextAdd/supp', authenticationMiddleware(), supplierorderController.nextAdd);
router.post('/nextAdd2/supp', authenticationMiddleware(), supplierorderController.nextAdd2);
router.get('/fulfill/:txnID', authenticationMiddleware(), orderController.fulfill);
router.post('/fulfill/:txnID', authenticationMiddleware(), orderController.fulfillAdd);
router.get('/backorders/fulfill/:txnID', authenticationMiddleware(), backorderController.fulfill);
router.post('/backorders/fulfill/:txnID', authenticationMiddleware(), backorderController.fulfillAdd);
router.get('/add/backorder/:txnID', authenticationMiddleware(), backorderController.getAdd);
router.post('/add/backorder/:txnID', authenticationMiddleware(), backorderController.add);
router.post('/add2/backorder/:txnID', authenticationMiddleware(), backorderController.nextAdd);
router.get('/submit/backorder/:txnID', authenticationMiddleware(), backorderController.submit);
router.get('/receive/supplier/:txnID', authenticationMiddleware(), supplierorderController.receive);
router.get('/scan/supplier/:txnID/:itemID/:quantity', authenticationMiddleware(), supplierorderController.scan);
router.get('/complete/supplier/:txnID', authenticationMiddleware(), supplierorderController.complete);
router.get('/receiveStore/:txnID', authenticationMiddleware(), orderController.receiveStore);
router.get('/scan/:txnID/:itemID/:quantity', authenticationMiddleware(), orderController.scan);
router.get('/complete/:txnID', authenticationMiddleware(), orderController.complete);

//Function to check if user is authenticated and if not redirect to login
function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;